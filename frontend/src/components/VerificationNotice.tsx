'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AuthService } from '../services';

interface VerificationNoticeProps {
  email: string;
  showDismiss?: boolean;
  onDismiss?: () => void;
}

const VerificationNotice: React.FC<VerificationNoticeProps> = ({
  email,
  showDismiss = false,
  onDismiss
}) => {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  const handleResend = async () => {
    try {
      setSending(true);
      setError(null);
      await AuthService.resendVerificationEmail();
      setSent(true);
    } catch (err) {
      setError('Failed to resend verification email. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-grow">
          <div className="flex justify-between">
            <p className="text-sm text-yellow-700">
              Your email address ({email}) has not been verified. Please check your email for a verification link.
            </p>
            {showDismiss && (
              <button
                onClick={handleDismiss}
                className="ml-3 flex-shrink-0 text-yellow-500 hover:text-yellow-700"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
          {sent ? (
            <p className="mt-2 text-sm text-green-600">
              A new verification link has been sent to your email address.
            </p>
          ) : (
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                onClick={handleResend}
                disabled={sending}
                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
              >
                {sending ? 'Sending...' : 'Resend Verification Email'}
              </button>
              <Link
                href="/profile"
                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Go to My Account
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationNotice;
