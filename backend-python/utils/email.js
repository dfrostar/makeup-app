const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Email templates
const templates = {
    verification: (token) => ({
        subject: 'Verify Your MakeupHub Account',
        html: `
            <h1>Welcome to MakeupHub!</h1>
            <p>Thank you for joining our community. Please verify your email address by clicking the link below:</p>
            <a href="${process.env.FRONTEND_URL}/verify-email/${token}">Verify Email</a>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't create an account, you can safely ignore this email.</p>
        `
    }),
    
    passwordReset: (token) => ({
        subject: 'Reset Your MakeupHub Password',
        html: `
            <h1>Password Reset Request</h1>
            <p>You requested to reset your password. Click the link below to create a new password:</p>
            <a href="${process.env.FRONTEND_URL}/reset-password/${token}">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request a password reset, you can safely ignore this email.</p>
        `
    }),

    welcomeNewsletter: {
        subject: 'Welcome to MakeupHub Newsletter',
        html: `
            <h1>Welcome to MakeupHub Newsletter!</h1>
            <p>Thank you for subscribing to our newsletter. Get ready for:</p>
            <ul>
                <li>Latest makeup trends and tutorials</li>
                <li>Product recommendations</li>
                <li>Beauty tips from experts</li>
                <li>Exclusive offers and updates</li>
            </ul>
            <p>Stay beautiful!</p>
        `
    }
};

// Send verification email
exports.sendVerificationEmail = async (email, token) => {
    try {
        const template = templates.verification(token);
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            ...template
        });
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw error;
    }
};

// Send password reset email
exports.sendPasswordResetEmail = async (email, token) => {
    try {
        const template = templates.passwordReset(token);
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            ...template
        });
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw error;
    }
};

// Send welcome newsletter
exports.sendWelcomeNewsletter = async (email) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            ...templates.welcomeNewsletter
        });
    } catch (error) {
        console.error('Error sending welcome newsletter:', error);
        throw error;
    }
};

// Verify email setup
exports.verifyEmailSetup = async () => {
    try {
        await transporter.verify();
        console.log('Email service is ready');
        return true;
    } catch (error) {
        console.error('Email service error:', error);
        return false;
    }
};
