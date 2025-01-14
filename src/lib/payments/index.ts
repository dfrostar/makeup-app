import { PaymentMethod, CryptoType } from '@prisma/client';
import Stripe from 'stripe';
import { CoinbaseCommerce } from 'coinbase-commerce-node';
import { NOWPayments } from 'nowpayments-api-js';
import { BitPayClient } from 'bitpay-sdk';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const coinbaseCommerce = new CoinbaseCommerce({
  apiKey: process.env.COINBASE_COMMERCE_API_KEY!,
});

const nowPayments = new NOWPayments({
  apiKey: process.env.NOWPAYMENTS_API_KEY!,
});

const bitpay = new BitPayClient({
  apiKey: process.env.BITPAY_API_KEY!,
});

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: PaymentMethod;
  metadata?: Record<string, any>;
}

export interface CryptoPaymentDetails {
  address: string;
  amount: number;
  currency: CryptoType;
  exchangeRate: number;
  expiresAt: Date;
}

export async function createPaymentIntent(
  amount: number,
  currency: string,
  paymentMethod: PaymentMethod,
  metadata?: Record<string, any>
): Promise<PaymentIntent> {
  switch (paymentMethod) {
    case 'STRIPE':
      const stripeIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        metadata,
      });
      return {
        id: stripeIntent.id,
        amount,
        currency,
        status: stripeIntent.status,
        paymentMethod,
        metadata,
      };

    case 'CRYPTO':
      const charge = await coinbaseCommerce.charges.create({
        name: 'Order Payment',
        description: 'Payment for order',
        pricing_type: 'fixed_price',
        local_price: {
          amount: amount.toString(),
          currency: currency,
        },
        metadata,
      });
      return {
        id: charge.id,
        amount,
        currency,
        status: charge.status,
        paymentMethod,
        metadata,
      };

    case 'CASH_APP':
      // Implement Cash App payment creation
      break;

    case 'VENMO':
      // Implement Venmo payment creation
      break;

    case 'PAYPAL':
      // Implement PayPal payment creation
      break;

    default:
      throw new Error(`Unsupported payment method: ${paymentMethod}`);
  }
}

export async function createCryptoPayment(
  amount: number,
  currency: string,
  cryptoCurrency: CryptoType
): Promise<CryptoPaymentDetails> {
  // Get real-time exchange rate
  const exchangeRate = await getExchangeRate(currency, cryptoCurrency);
  
  // Create payment with selected provider
  const payment = await nowPayments.createPayment({
    priceAmount: amount,
    priceCurrency: currency,
    payCurrency: cryptoCurrency,
    ipnCallbackUrl: `${process.env.NEXTAUTH_URL}/api/payments/crypto/webhook`,
  });

  return {
    address: payment.payAddress,
    amount: payment.payAmount,
    currency: cryptoCurrency,
    exchangeRate: exchangeRate,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes expiry
  };
}

export async function processPayoutBatch(payouts: Array<{
  userId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  details: Record<string, any>;
}>) {
  for (const payout of payouts) {
    try {
      switch (payout.method) {
        case 'STRIPE':
          await stripe.transfers.create({
            amount: Math.round(payout.amount * 100),
            currency: payout.currency.toLowerCase(),
            destination: payout.details.stripeAccountId,
          });
          break;

        case 'CRYPTO':
          await processCryptoPayout(payout);
          break;

        case 'PAYPAL':
          await processPayPalPayout(payout);
          break;

        // Add other payout methods
      }
    } catch (error) {
      console.error(`Failed to process payout for user ${payout.userId}:`, error);
      // Handle error (retry logic, notifications, etc.)
    }
  }
}

async function getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
  const response = await fetch(
    `https://api.exchangerate-api.com/v4/latest/${fromCurrency}?api_key=${process.env.EXCHANGE_RATES_API_KEY}`
  );
  const data = await response.json();
  return data.rates[toCurrency];
}

async function processCryptoPayout(payout: any) {
  return await nowPayments.createPayout({
    address: payout.details.walletAddress,
    currency: payout.details.cryptoCurrency,
    amount: payout.amount,
  });
}

async function processPayPalPayout(payout: any) {
  // Implement PayPal payout logic
}
