import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51RPMtI2LG4ckcbPFWzTKshhLh9J7PhDyJLTd7msI8zt2DYQllIZapYimPQciaMpOpVsMH1zXoNujyP8EJlMDLFTY00T67YmkEy');

interface StripeWrapperProps {
  children: React.ReactNode;
  clientSecret?: string;
}

const StripeWrapper: React.FC<StripeWrapperProps> = ({ children, clientSecret }) => {
  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
    },
  };

  return (
    <Elements stripe={stripePromise} options={clientSecret ? options : undefined}>
      {children}
    </Elements>
  );
};

export default StripeWrapper;
