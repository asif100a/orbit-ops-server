import Stripe from 'stripe';
import { envConfig } from './env';

const stripeSecretKey = envConfig.STRIPE_SECRET_KEY;

if(!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not defined in the environment variables.');
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2026-08-26.dahlia',
});

export default stripe;