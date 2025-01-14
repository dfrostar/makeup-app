import { authenticator } from 'otplib';
import { Twilio } from 'twilio';
import nodemailer from 'nodemailer';
import prisma from '../prisma';
import crypto from 'crypto';

const twilio = new Twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

const emailTransporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT!),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function setupTwoFactor(userId: string, method: '2FA' | 'SMS' | 'EMAIL') {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  switch (method) {
    case '2FA':
      const secret = authenticator.generateSecret();
      const otpauthUrl = authenticator.keyuri(
        user.email!,
        'Makeup Directory',
        secret
      );

      // Generate backup codes
      const backupCodes = Array.from({ length: 10 }, () =>
        crypto.randomBytes(4).toString('hex')
      );

      await prisma.user.update({
        where: { id: userId },
        data: {
          twoFactorEnabled: true,
          twoFactorMethod: 'AUTHENTICATOR',
          twoFactorSecret: secret,
          recoveryBackupCodes: backupCodes,
        },
      });

      return {
        secret,
        otpauthUrl,
        backupCodes,
      };

    case 'SMS':
      if (!user.phone) throw new Error('Phone number required for SMS 2FA');

      await prisma.user.update({
        where: { id: userId },
        data: {
          twoFactorEnabled: true,
          twoFactorMethod: 'SMS',
        },
      });

      return { success: true };

    case 'EMAIL':
      if (!user.email) throw new Error('Email required for Email 2FA');

      await prisma.user.update({
        where: { id: userId },
        data: {
          twoFactorEnabled: true,
          twoFactorMethod: 'EMAIL',
        },
      });

      return { success: true };

    default:
      throw new Error('Invalid 2FA method');
  }
}

export async function verifyTwoFactor(
  userId: string,
  token: string,
  isBackupCode = false
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.twoFactorEnabled) throw new Error('2FA not enabled');

  if (isBackupCode) {
    const isValidBackupCode = user.recoveryBackupCodes.includes(token);
    if (!isValidBackupCode) throw new Error('Invalid backup code');

    // Remove used backup code
    await prisma.user.update({
      where: { id: userId },
      data: {
        recoveryBackupCodes: user.recoveryBackupCodes.filter(
          (code) => code !== token
        ),
      },
    });

    return true;
  }

  switch (user.twoFactorMethod) {
    case 'AUTHENTICATOR':
      if (!user.twoFactorSecret) throw new Error('2FA secret not found');
      return authenticator.verify({
        token,
        secret: user.twoFactorSecret,
      });

    case 'SMS':
      const verification = await twilio.verify
        .services(process.env.TWILIO_VERIFY_SERVICE_ID!)
        .verificationChecks.create({
          to: user.phone!,
          code: token,
        });
      return verification.status === 'approved';

    case 'EMAIL':
      // Implement email verification logic
      // This would typically involve checking a time-based token stored in Redis/DB
      break;

    default:
      throw new Error('Invalid 2FA method');
  }
}

export async function sendTwoFactorCode(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.twoFactorEnabled) throw new Error('2FA not enabled');

  switch (user.twoFactorMethod) {
    case 'SMS':
      if (!user.phone) throw new Error('Phone number required for SMS 2FA');

      await twilio.verify
        .services(process.env.TWILIO_VERIFY_SERVICE_ID!)
        .verifications.create({
          to: user.phone,
          channel: 'sms',
        });
      break;

    case 'EMAIL':
      if (!user.email) throw new Error('Email required for Email 2FA');

      const code = crypto.randomInt(100000, 999999).toString();
      // Store code in Redis with expiration
      
      await emailTransporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: 'Your Two-Factor Authentication Code',
        text: `Your verification code is: ${code}`,
        html: `<h1>Two-Factor Authentication</h1>
               <p>Your verification code is: <strong>${code}</strong></p>
               <p>This code will expire in 5 minutes.</p>`,
      });
      break;

    default:
      throw new Error('Invalid 2FA method');
  }

  return { success: true };
}
