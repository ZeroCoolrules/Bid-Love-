import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { supabase } from '@/lib/supabase';
import { XIcon, TokenIcon, CheckIcon, ShieldIcon, CreditCardIcon, SparklesIcon } from './ui/Icons';

// Initialize Stripe with the publishable key and connected account
const stripePromise = loadStripe('pk_live_51OJhJBHdGQpsHqInIzu7c6PzGPSH0yImD4xfpofvxvFZs0VFhPRXZCyEgYkkhOtBOXFWvssYASs851mflwQvjnrl00T6DbUwWZ', {
  stripeAccount: 'acct_1SeHMmHYapf1mOWD'
});

interface TokenPackage {
  id: string;
  tokens: number;
  bonus: number;
  price: number;
  popular?: boolean;
  bestValue?: boolean;
}

const TOKEN_PACKAGES: TokenPackage[] = [
  { id: 'starter', tokens: 100, bonus: 0, price: 10 },
  { id: 'popular', tokens: 500, bonus: 50, price: 40, popular: true },
  { id: 'value', tokens: 1000, bonus: 150, price: 70, bestValue: true },
  { id: 'premium', tokens: 2500, bonus: 500, price: 150 },
  { id: 'ultimate', tokens: 5000, bonus: 1500, price: 250 },
];

interface TokenPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
  characterId?: string;
  userId?: string;
  onPurchaseComplete: (tokensAdded: number, newBalance: number) => void;
}

interface CheckoutFormProps {
  clientSecret: string;
  selectedPackage: TokenPackage;
  characterId?: string;
  onSuccess: (tokensAdded: number, newBalance: number) => void;
  onCancel: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ 
  clientSecret, 
  selectedPackage, 
  characterId,
  onSuccess, 
  onCancel 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      const { error: submitError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/payment-success',
        },
        redirect: 'if_required',
      });

      if (submitError) {
        setError(submitError.message || 'Payment failed. Please try again.');
        setLoading(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Confirm the purchase and update token balance
        const { data, error: confirmError } = await supabase.functions.invoke('confirm-token-purchase', {
          body: { 
            paymentIntentId: paymentIntent.id,
            characterId: characterId || 'none'
          }
        });

        if (confirmError) {
          console.error('Confirmation error:', confirmError);
          setError('Payment successful but failed to add Dreamcoin. Please contact support.');
        } else {
          setPaymentComplete(true);
          setTimeout(() => {
            onSuccess(data.tokensAdded, data.newBalance || 0);
          }, 2000);
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    }

    setLoading(false);
  };

  if (paymentComplete) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center animate-pulse">
          <CheckIcon className="text-white" size={40} />
        </div>
        <h4 className="text-2xl font-bold text-white mb-2">Payment Successful!</h4>
        <p className="text-white/60 mb-4">
          {selectedPackage.tokens + selectedPackage.bonus} Dreamcoin have been added to your wallet
        </p>
        <div className="flex items-center justify-center gap-2 text-[#FFB800]">
          <TokenIcon size={24} />
          <span className="text-2xl font-bold">+{selectedPackage.tokens + selectedPackage.bonus}</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Order Summary */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
        <h4 className="text-white font-semibold mb-3">Order Summary</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-white/70">
            <span>{selectedPackage.tokens} Dreamcoin</span>
            <span>${selectedPackage.price.toFixed(2)}</span>
          </div>
          {selectedPackage.bonus > 0 && (
            <div className="flex justify-between text-green-400">
              <span>Bonus Dreamcoin</span>
              <span>+{selectedPackage.bonus}</span>
            </div>
          )}
          <div className="border-t border-white/10 pt-2 mt-2">
            <div className="flex justify-between text-white font-bold">
              <span>Total Dreamcoin</span>
              <span className="text-[#FFB800]">{selectedPackage.tokens + selectedPackage.bonus}</span>
            </div>
            <div className="flex justify-between text-white font-bold mt-1">
              <span>Total</span>
              <span>${selectedPackage.price.toFixed(2)} USD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Element */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
        <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
          <CreditCardIcon size={20} className="text-[#00D9FF]" />
          Payment Details
        </h4>
        <PaymentElement 
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 text-white/50 text-sm">
        <ShieldIcon size={16} />
        <span>Secured by Stripe. Your payment info is never stored.</span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
            !stripe || loading
              ? 'bg-white/10 text-white/40 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#00D9FF] to-[#00a8cc] text-white hover:shadow-lg hover:shadow-[#00D9FF]/25'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </span>
          ) : (
            `Pay $${selectedPackage.price.toFixed(2)}`
          )}
        </button>
      </div>
    </form>
  );
};

const TokenPurchaseModal: React.FC<TokenPurchaseModalProps> = ({
  isOpen,
  onClose,
  currentBalance,
  characterId,
  userId,
  onPurchaseComplete
}) => {
  const [selectedPackage, setSelectedPackage] = useState<TokenPackage | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setSelectedPackage(null);
      setClientSecret(null);
      setError(null);
    }
  }, [isOpen]);

  const handleSelectPackage = async (pkg: TokenPackage) => {
    setSelectedPackage(pkg);
    setLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('create-payment-intent', {
        body: { 
          packageId: pkg.id,
          userId: userId || 'anonymous',
          characterId: characterId || 'none'
        }
      });

      if (fnError) {
        throw new Error(fnError.message || 'Failed to initialize payment');
      }

      if (data?.clientSecret) {
        setClientSecret(data.clientSecret);
      } else {
        throw new Error('No client secret received');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to initialize payment. Please try again.');
      setSelectedPackage(null);
    }

    setLoading(false);
  };

  const handleSuccess = (tokensAdded: number, newBalance: number) => {
    onPurchaseComplete(tokensAdded, newBalance);
    onClose();
  };

  const handleCancel = () => {
    setSelectedPackage(null);
    setClientSecret(null);
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-[#1a0a2e] to-[#0d0618] rounded-3xl border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-br from-[#1a0a2e] to-[#1a0a2e] p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FFB800] to-orange-500 rounded-xl flex items-center justify-center">
                <TokenIcon className="text-black" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Buy Dreamcoin</h2>
                <p className="text-white/60 text-sm">Current Balance: {currentBalance.toLocaleString()} Dreamcoin</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <XIcon className="text-white/60" size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
              {error}
            </div>
          )}

          {!clientSecret ? (
            <>
              {/* Package Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Select a Dreamcoin Package</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {TOKEN_PACKAGES.map((pkg) => (
                    <button
                      key={pkg.id}
                      onClick={() => handleSelectPackage(pkg)}
                      disabled={loading}
                      className={`relative p-5 rounded-2xl border transition-all text-left ${
                        loading
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:border-[#00D9FF]/50 hover:bg-[#00D9FF]/5'
                      } ${
                        pkg.popular
                          ? 'border-[#FFB800]/50 bg-[#FFB800]/5'
                          : pkg.bestValue
                          ? 'border-green-500/50 bg-green-500/5'
                          : 'border-white/10 bg-white/5'
                      }`}
                    >
                      {pkg.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-[#FFB800] to-orange-500 rounded-full text-xs font-bold text-black">
                          MOST POPULAR
                        </div>
                      )}
                      {pkg.bestValue && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-xs font-bold text-white">
                          BEST VALUE
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 mb-3">
                        <TokenIcon className="text-[#FFB800]" size={28} />
                        <span className="text-3xl font-bold text-white">{pkg.tokens}</span>
                      </div>
                      
                      {pkg.bonus > 0 && (
                        <div className="flex items-center gap-1 text-green-400 text-sm font-medium mb-2">
                          <SparklesIcon size={14} />
                          +{pkg.bonus} bonus Dreamcoin
                        </div>
                      )}
                      
                      <div className="text-2xl font-bold text-white">
                        ${pkg.price}
                        <span className="text-sm text-white/50 font-normal ml-1">USD</span>
                      </div>
                      
                      <div className="text-white/50 text-sm mt-1">
                        ${(pkg.price / (pkg.tokens + pkg.bonus) * 100).toFixed(1)}¢ per Dreamcoin
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {loading && (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-2 border-[#00D9FF]/30 border-t-[#00D9FF] rounded-full animate-spin" />
                  <span className="ml-3 text-white/60">Initializing payment...</span>
                </div>
              )}

              {/* Benefits */}
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <h4 className="text-white font-semibold mb-3">Why Buy Dreamcoin?</h4>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckIcon size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Place bids on exclusive date opportunities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckIcon size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Unlock premium venues and experiences</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckIcon size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Earn Dreamcoin back from successful dates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckIcon size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Cash out unused Dreamcoin anytime</span>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            /* Stripe Payment Form */
            <Elements 
              stripe={stripePromise} 
              options={{ 
                clientSecret,
                appearance: {
                  theme: 'night',
                  variables: {
                    colorPrimary: '#00D9FF',
                    colorBackground: '#1a0a2e',
                    colorText: '#ffffff',
                    colorDanger: '#ef4444',
                    fontFamily: 'system-ui, sans-serif',
                    borderRadius: '12px',
                  },
                  rules: {
                    '.Input': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    },
                    '.Input:focus': {
                      border: '1px solid #00D9FF',
                      boxShadow: '0 0 0 1px #00D9FF',
                    },
                    '.Label': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                  },
                }
              }}
            >
              <CheckoutForm
                clientSecret={clientSecret}
                selectedPackage={selectedPackage!}
                characterId={characterId}
                onSuccess={handleSuccess}
                onCancel={handleCancel}
              />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenPurchaseModal;
