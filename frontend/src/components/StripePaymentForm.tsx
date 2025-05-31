import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { StripeCardElementOptions } from "@stripe/stripe-js";

interface StripePaymentFormProps {
  onSuccess: (paymentMethodId: string) => void;
  onError: (error: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const cardElementOptions: StripeCardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#424770",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#9e2146",
    },
  },
};

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  onSuccess,
  onError,
  loading,
  setLoading,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      return;
    }

    setLoading(true);
    setCardError(null);

    try {
      // Create payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        setCardError(error.message || "An error occurred during payment");
        onError(error.message || "An error occurred during payment");
      } else if (paymentMethod) {
        onSuccess(paymentMethod.id);
      }
    } catch {
      setCardError("Payment failed. Please try again.");
      onError("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCardChange = (event: { error?: { message: string } }) => {
    if (event.error) {
      setCardError(event.error.message);
    } else {
      setCardError(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Information
        </label>
        <div className="border border-gray-300 rounded-md p-3 bg-white">
          <CardElement
            options={cardElementOptions}
            onChange={handleCardChange}
          />
        </div>
        {cardError && <p className="mt-1 text-sm text-red-600">{cardError}</p>}
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              This is a test environment. Use test card number 4242 4242 4242
              4242 with any future expiry date and any 3-digit CVC.
            </p>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white ${
          !stripe || loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
        }`}
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
            Processing Payment...
          </>
        ) : (
          "Pay Now"
        )}
      </button>
    </form>
  );
};

export default StripePaymentForm;
