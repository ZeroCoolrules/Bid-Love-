import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { CashoutRequest } from '@/types';
import {
  CloseIcon,
  TokenIcon,
  BankIcon,
  DollarIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  LoaderIcon,
  ExternalLinkIcon,
  ShieldIcon,
  ClockIcon,
  InfoIcon,
  ArrowRightIcon
} from './ui/Icons';

interface CashoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
  characterId?: string;
  userId?: string;
  userEmail?: string;
  onCashoutComplete: (tokensDeducted: number, newBalance: number) => void;
}

interface ConnectAccountStatus {
  hasAccount: boolean;
  account?: {
    id: string;
    status: string;
    chargesEnabled: boolean;
    payoutsEnabled: boolean;
    detailsSubmitted: boolean;
    email: string;
  };
}

const CASHOUT_RATE = 0.07; // $0.07 per token
const PLATFORM_FEE_PERCENT = 0.05; // 5% platform fee
const MIN_CASHOUT_TOKENS = 100;

const CashoutModal: React.FC<CashoutModalProps> = ({
  isOpen,
  onClose,
  currentBalance,
  characterId,
  userId,
  userEmail,
  onCashoutComplete
}) => {
  const [step, setStep] = useState<'connect' | 'amount' | 'confirm' | 'processing' | 'success' | 'error'>('connect');
  const [tokenAmount, setTokenAmount] = useState<number>(MIN_CASHOUT_TOKENS);
  const [connectStatus, setConnectStatus] = useState<ConnectAccountStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAccount, setIsCheckingAccount] = useState(true);
  const [cashoutHistory, setCashoutHistory] = useState<CashoutRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    tokenAmount: number;
    netAmount: number;
    transferId: string;
  } | null>(null);

  // Calculate amounts
  const grossAmount = tokenAmount * CASHOUT_RATE;
  const feeAmount = grossAmount * PLATFORM_FEE_PERCENT;
  const netAmount = grossAmount - feeAmount;

  // Check account status on mount
  useEffect(() => {
    if (isOpen && userId) {
      checkConnectAccount();
      fetchCashoutHistory();
    }
  }, [isOpen, userId]);

  const checkConnectAccount = async () => {
    if (!userId) return;
    
    setIsCheckingAccount(true);
    try {
      const { data, error } = await supabase.functions.invoke('process-cashout', {
        body: { action: 'check_account_status', userId }
      });

      if (error) throw error;

      setConnectStatus(data);
      
      // If account is ready, go to amount step
      if (data.hasAccount && data.account?.payoutsEnabled) {
        setStep('amount');
      } else {
        setStep('connect');
      }
    } catch (err: any) {
      console.error('Error checking account:', err);
      setStep('connect');
    } finally {
      setIsCheckingAccount(false);
    }
  };

  const fetchCashoutHistory = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase.functions.invoke('process-cashout', {
        body: { action: 'get_cashout_history', userId, limit: 5 }
      });

      if (!error && data.cashouts) {
        setCashoutHistory(data.cashouts);
      }
    } catch (err) {
      console.error('Error fetching cashout history:', err);
    }
  };

  const handleConnectBank = async () => {
    if (!userId || !userEmail) {
      setError('Please sign in to connect your bank account');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('process-cashout', {
        body: {
          action: 'create_connect_account',
          userId,
          characterId,
          email: userEmail,
          country: 'US'
        }
      });

      if (error) throw error;

      if (data.onboardingUrl) {
        // Open Stripe Connect onboarding in a new tab
        window.open(data.onboardingUrl, '_blank');
        
        // Show message to user
        setError('Complete the setup in the new tab, then return here and click "Check Status"');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to start bank connection');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestCashout = async () => {
    if (!userId || !characterId) {
      setError('Please sign in and create a character first');
      return;
    }

    if (tokenAmount < MIN_CASHOUT_TOKENS) {
      setError(`Minimum cashout is ${MIN_CASHOUT_TOKENS} Dreamcoin`);
      return;
    }

    if (tokenAmount > currentBalance) {
      setError('Insufficient token balance');
      return;
    }

    setStep('processing');
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('process-cashout', {
        body: {
          action: 'request_cashout',
          userId,
          characterId,
          tokenAmount
        }
      });

      if (error) throw error;

      setSuccessData({
        tokenAmount: data.tokenAmount,
        netAmount: data.netAmount,
        transferId: data.transferId
      });
      
      onCashoutComplete(data.tokenAmount, data.newBalance);
      setStep('success');
      
      // Refresh history
      fetchCashoutHistory();
    } catch (err: any) {
      setError(err.message || 'Failed to process cashout');
      setStep('error');
    }
  };

  const handleOpenDashboard = async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('process-cashout', {
        body: { action: 'get_dashboard_link', userId }
      });

      if (error) throw error;

      if (data.dashboardUrl) {
        window.open(data.dashboardUrl, '_blank');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to open dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'processing': return 'text-yellow-400';
      case 'pending': return 'text-blue-400';
      case 'failed': return 'text-red-400';
      case 'cancelled': return 'text-gray-400';
      default: return 'text-white/60';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
      <div className="relative w-full max-w-lg bg-gradient-to-br from-[#1a1025] to-[#0d0618] rounded-3xl border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-br from-[#1a1025] to-[#1a1025] p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <DollarIcon className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Cash Out Dreamcoin</h2>
                <p className="text-white/60 text-sm">Convert Dreamcoin to real money</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <CloseIcon className="text-white/60" size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isCheckingAccount ? (
            <div className="text-center py-12">
              <LoaderIcon className="mx-auto text-[#00D9FF]" size={48} />
              <p className="text-white/60 mt-4">Checking account status...</p>
            </div>
          ) : step === 'connect' ? (
            <div className="space-y-6">
              {/* Bank Connection Status */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                    <BankIcon className="text-blue-400" size={28} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Connect Your Bank</h3>
                    <p className="text-white/60 text-sm">
                      {connectStatus?.hasAccount 
                        ? 'Complete your account setup to receive payouts'
                        : 'Link your bank account to receive payouts'}
                    </p>
                  </div>
                </div>

                {connectStatus?.hasAccount && !connectStatus.account?.payoutsEnabled && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <AlertCircleIcon className="text-yellow-400 flex-shrink-0 mt-0.5" size={20} />
                      <div>
                        <p className="text-yellow-400 font-medium">Setup Incomplete</p>
                        <p className="text-white/60 text-sm mt-1">
                          Please complete the Stripe onboarding to enable payouts.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    onClick={handleConnectBank}
                    disabled={isLoading}
                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-bold hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <LoaderIcon size={20} />
                    ) : (
                      <>
                        <BankIcon size={20} />
                        {connectStatus?.hasAccount ? 'Complete Setup' : 'Connect Bank Account'}
                      </>
                    )}
                  </button>

                  {connectStatus?.hasAccount && (
                    <button
                      onClick={checkConnectAccount}
                      className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 transition-colors"
                    >
                      Check Status
                    </button>
                  )}
                </div>
              </div>

              {/* How it works */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <InfoIcon className="text-[#00D9FF]" size={20} />
                  How Cashouts Work
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#00D9FF]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#00D9FF] text-xs font-bold">1</span>
                    </div>
                    <p className="text-white/70 text-sm">Connect your bank account via Stripe (one-time setup)</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#00D9FF]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#00D9FF] text-xs font-bold">2</span>
                    </div>
                    <p className="text-white/70 text-sm">Choose how many Dreamcoin to cash out (min. 100 Dreamcoin)</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#00D9FF]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#00D9FF] text-xs font-bold">3</span>
                    </div>
                    <p className="text-white/70 text-sm">Receive funds directly to your bank (1-3 business days)</p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-white/5 rounded-xl">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Token Rate</span>
                    <span className="text-white font-medium">$0.07 per token</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-white/60">Platform Fee</span>
                    <span className="text-white font-medium">5%</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
            </div>
          ) : step === 'amount' ? (
            <div className="space-y-6">
              {/* Balance Display */}
              <div className="bg-gradient-to-br from-[#FFB800]/20 to-orange-500/10 rounded-2xl p-6 border border-[#FFB800]/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">Available Balance</p>
                    <div className="flex items-center gap-2 mt-1">
                      <TokenIcon className="text-[#FFB800]" size={24} />
                      <span className="text-3xl font-bold text-white">{currentBalance.toLocaleString()}</span>
                    </div>
                    <p className="text-white/50 text-sm mt-1">≈ ${(currentBalance * CASHOUT_RATE).toFixed(2)} USD</p>
                  </div>
                  <button
                    onClick={handleOpenDashboard}
                    className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                    title="View Stripe Dashboard"
                  >
                    <ExternalLinkIcon className="text-white/60" size={20} />
                  </button>
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Dreamcoin to Cash Out
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={tokenAmount}
                    onChange={(e) => setTokenAmount(Math.max(0, parseInt(e.target.value) || 0))}
                    min={MIN_CASHOUT_TOKENS}
                    max={currentBalance}
                    className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white text-xl font-bold focus:outline-none focus:border-[#00D9FF]/50 focus:ring-2 focus:ring-[#00D9FF]/20"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <TokenIcon className="text-[#FFB800]" size={20} />
                    <span className="text-white/60">Dreamcoin</span>
                  </div>
                </div>

                {/* Quick select buttons */}
                <div className="flex gap-2 mt-3">
                  {[100, 500, 1000, currentBalance].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setTokenAmount(Math.min(amount, currentBalance))}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                        tokenAmount === amount
                          ? 'bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/50'
                          : 'bg-white/5 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {amount === currentBalance ? 'Max' : amount.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calculation Breakdown */}
              <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/60">Gross Amount</span>
                  <span className="text-white font-medium">${grossAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Platform Fee (5%)</span>
                  <span className="text-red-400">-${feeAmount.toFixed(2)}</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between">
                  <span className="text-white font-semibold">You'll Receive</span>
                  <span className="text-green-400 font-bold text-xl">${netAmount.toFixed(2)}</span>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => setStep('confirm')}
                  disabled={tokenAmount < MIN_CASHOUT_TOKENS || tokenAmount > currentBalance}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white font-bold hover:shadow-lg hover:shadow-green-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Continue to Confirm
                  <ArrowRightIcon size={20} />
                </button>
              </div>

              {/* Cashout History */}
              {cashoutHistory.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <ClockIcon className="text-white/60" size={18} />
                    Recent Withdrawals
                  </h4>
                  <div className="space-y-2">
                    {cashoutHistory.map((cashout) => (
                      <div
                        key={cashout.id}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
                      >
                        <div>
                          <p className="text-white font-medium">
                            {cashout.token_amount.toLocaleString()} Dreamcoin
                          </p>
                          <p className="text-white/50 text-xs">{formatDate(cashout.created_at)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-green-400 font-medium">${cashout.net_amount.toFixed(2)}</p>
                          <p className={`text-xs capitalize ${getStatusColor(cashout.status)}`}>
                            {cashout.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : step === 'confirm' ? (
            <div className="space-y-6">
              <div className="text-center py-4">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                  <DollarIcon className="text-green-400" size={40} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Confirm Cashout</h3>
                <p className="text-white/60">Please review your withdrawal details</p>
              </div>

              <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Dreamcoin to Withdraw</span>
                  <div className="flex items-center gap-2">
                    <TokenIcon className="text-[#FFB800]" size={18} />
                    <span className="text-white font-bold">{tokenAmount.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Gross Amount</span>
                  <span className="text-white">${grossAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Platform Fee</span>
                  <span className="text-red-400">-${feeAmount.toFixed(2)}</span>
                </div>
                <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                  <span className="text-white font-semibold">You'll Receive</span>
                  <span className="text-green-400 font-bold text-2xl">${netAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <ShieldIcon className="text-blue-400 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="text-blue-400 font-medium">Secure Transfer</p>
                    <p className="text-white/60 text-sm mt-1">
                      Funds will be transferred to your connected bank account within 1-3 business days.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('amount')}
                  className="flex-1 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleRequestCashout}
                  className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white font-bold hover:shadow-lg hover:shadow-green-500/25 transition-all"
                >
                  Confirm Cashout
                </button>
              </div>
            </div>
          ) : step === 'processing' ? (
            <div className="text-center py-12">
              <LoaderIcon className="mx-auto text-[#00D9FF]" size={64} />
              <h3 className="text-xl font-bold text-white mt-6">Processing Your Cashout</h3>
              <p className="text-white/60 mt-2">Please wait while we transfer your funds...</p>
            </div>
          ) : step === 'success' ? (
            <div className="text-center py-8">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <CheckCircleIcon className="text-white" size={48} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Cashout Successful!</h3>
              <p className="text-white/60 mb-6">
                Your withdrawal has been processed successfully.
              </p>

              {successData && (
                <div className="bg-white/5 rounded-2xl p-5 border border-white/10 mb-6 text-left">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/60">Dreamcoin Withdrawn</span>
                      <span className="text-white font-medium">{successData.tokenAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Amount Transferred</span>
                      <span className="text-green-400 font-bold">${successData.netAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Transfer ID</span>
                      <span className="text-white/50 text-sm font-mono">{successData.transferId.slice(0, 16)}...</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
                <p className="text-blue-400 text-sm">
                  Funds will arrive in your bank account within 1-3 business days.
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full py-4 bg-gradient-to-r from-[#00D9FF] to-[#00a8cc] rounded-xl text-white font-bold hover:shadow-lg hover:shadow-[#00D9FF]/25 transition-all"
              >
                Done
              </button>
            </div>
          ) : step === 'error' ? (
            <div className="text-center py-8">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-full flex items-center justify-center mb-6">
                <AlertCircleIcon className="text-red-400" size={48} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Cashout Failed</h3>
              <p className="text-white/60 mb-4">
                {error || 'An error occurred while processing your cashout.'}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setError(null);
                    setStep('amount');
                  }}
                  className="flex-1 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-4 bg-gradient-to-r from-[#00D9FF] to-[#00a8cc] rounded-xl text-white font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-white/5">
          <div className="flex items-center justify-center gap-2 text-white/40 text-xs">
            <ShieldIcon size={14} />
            <span>Secure payments powered by Stripe Connect</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashoutModal;
