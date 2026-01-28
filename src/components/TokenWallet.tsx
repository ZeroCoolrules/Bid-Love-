import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { CashoutRequest } from '@/types';
import { 
  TokenIcon, 
  TrendingUpIcon, 
  ArrowRightIcon, 
  WalletIcon, 
  CheckIcon, 
  PlusIcon, 
  CreditCardIcon,
  DollarIcon,
  BankIcon,
  ClockIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  ExternalLinkIcon
} from './ui/Icons';

interface TokenWalletProps {
  balance: number;
  onPurchase: (amount: number) => Promise<boolean>;
  onOpenPurchaseModal: () => void;
  onOpenCashoutModal: () => void;
  userId?: string;
  characterId?: string;
}

const TokenWallet: React.FC<TokenWalletProps> = ({ 
  balance, 
  onPurchase, 
  onOpenPurchaseModal,
  onOpenCashoutModal,
  userId,
  characterId
}) => {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [cashoutHistory, setCashoutHistory] = useState<CashoutRequest[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [activeTab, setActiveTab] = useState<'buy' | 'cashout'>('buy');

  const tokenPackages = [
    { tokens: 100, price: 10, bonus: 0, popular: false },
    { tokens: 500, price: 40, bonus: 50, popular: true },
    { tokens: 1000, price: 70, bonus: 150, popular: false },
    { tokens: 2500, price: 150, bonus: 500, popular: false },
    { tokens: 5000, price: 250, bonus: 1500, popular: false },
  ];

  const recentTransactions = [
    { type: 'purchase', amount: 500, date: '2 hours ago', description: 'Dream Coin Purchase' },
    { type: 'bid', amount: -150, date: '5 hours ago', description: 'Bid on Luna Starr' },
    { type: 'refund', amount: 75, date: '1 day ago', description: 'Date Cancelled Refund' },
    { type: 'earned', amount: 200, date: '2 days ago', description: 'Date Completed' },
    { type: 'bid', amount: -100, date: '3 days ago', description: 'Bid on Marcus Chen' },
  ];

  useEffect(() => {
    if (userId) {
      fetchCashoutHistory();
    }
  }, [userId]);

  const fetchCashoutHistory = async () => {
    if (!userId) return;
    
    setIsLoadingHistory(true);
    try {
      const { data, error } = await supabase.functions.invoke('process-cashout', {
        body: { action: 'get_cashout_history', userId, limit: 10 }
      });

      if (!error && data.cashouts) {
        setCashoutHistory(data.cashouts);
      }
    } catch (err) {
      console.error('Error fetching cashout history:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      completed: 'bg-green-500/20 text-green-400',
      processing: 'bg-yellow-500/20 text-yellow-400',
      pending: 'bg-blue-500/20 text-blue-400',
      failed: 'bg-red-500/20 text-red-400',
      cancelled: 'bg-gray-500/20 text-gray-400'
    };
    return styles[status] || 'bg-white/10 text-white/60';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Calculate total cashed out
  const totalCashedOut = cashoutHistory
    .filter(c => c.status === 'completed')
    .reduce((sum, c) => sum + c.net_amount, 0);

  // Calculate pending cashouts
  const pendingCashouts = cashoutHistory
    .filter(c => c.status === 'pending' || c.status === 'processing')
    .reduce((sum, c) => sum + c.net_amount, 0);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Dream Coin Wallet</h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Manage your Dream Coin balance. Purchase, track transactions, and cash out your earnings.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Balance Card */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-[#FFB800]/20 to-orange-500/10 backdrop-blur-sm rounded-3xl border border-[#FFB800]/30 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FFB800] to-orange-500 rounded-xl flex items-center justify-center">
                  <WalletIcon className="text-black" size={24} />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Current Balance</p>
                  <h3 className="text-3xl font-bold text-white">{balance.toLocaleString()}</h3>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <span className="text-white/60 text-sm">Dream Coin Value</span>
                  <span className="text-white font-medium">$0.07 USD</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <span className="text-white/60 text-sm">Total Value</span>
                  <span className="text-[#FFB800] font-bold">${(balance * 0.07).toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button 
                  onClick={onOpenCashoutModal}
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white font-bold hover:shadow-lg hover:shadow-green-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <DollarIcon size={18} />
                  Cash Out
                </button>
                <button 
                  onClick={onOpenPurchaseModal}
                  className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                >
                  <PlusIcon size={18} />
                  Buy More
                </button>
              </div>
            </div>

            {/* Cashout Stats */}
            <div className="mt-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                <BankIcon className="text-green-400" size={20} />
                Cashout Stats
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/60 text-sm">Total Cashed Out</span>
                  <span className="text-green-400 font-medium">${totalCashedOut.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60 text-sm">Pending Payouts</span>
                  <span className="text-yellow-400 font-medium">${pendingCashouts.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60 text-sm">Cashout Rate</span>
                  <span className="text-white">$0.07/Dream Coin (5% fee)</span>
                </div>
              </div>
            </div>

            {/* Market Stats */}
            <div className="mt-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                <TrendingUpIcon className="text-green-400" size={20} />
                Market Stats
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/60 text-sm">24h Volume</span>
                    <span className="text-white">1.2M Dream Coin</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60 text-sm">Price Change</span>
                  <span className="text-green-400">+2.4%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60 text-sm">Active Users</span>
                  <span className="text-white">12,847</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {/* Tab Switcher */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveTab('buy')}
                className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'buy'
                    ? 'bg-gradient-to-r from-[#00D9FF] to-[#00a8cc] text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                <CreditCardIcon size={18} />
                Buy Dream Coin
              </button>
              <button
                onClick={() => setActiveTab('cashout')}
                className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'cashout'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                <DollarIcon size={18} />
                Cashout History
              </button>
            </div>

            {activeTab === 'buy' ? (
              /* Dream Coin Packages */
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Purchase Dream Coin</h3>
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <CreditCardIcon size={16} />
                    <span>Secure payments via Stripe</span>
                  </div>
                </div>
                
                {purchaseSuccess ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <CheckIcon className="text-white" size={40} />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-2">Purchase Complete!</h4>
                    <p className="text-white/60">Dream Coin has been added to your wallet</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                      {tokenPackages.map((pkg) => (
                        <button
                          key={pkg.tokens}
                          onClick={() => setSelectedPackage(pkg.tokens)}
                          className={`relative p-4 rounded-2xl border transition-all ${
                            selectedPackage === pkg.tokens
                              ? 'bg-gradient-to-br from-[#00D9FF]/20 to-[#00a8cc]/10 border-[#00D9FF]/50'
                              : 'bg-white/5 border-white/10 hover:border-white/20'
                          }`}
                        >
                          {pkg.popular && (
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gradient-to-r from-[#FFB800] to-orange-500 rounded-full text-xs font-bold text-black whitespace-nowrap">
                              POPULAR
                            </div>
                          )}
                          <div className="flex items-center justify-center gap-1 mb-2">
                            <TokenIcon className="text-[#FFB800]" size={20} />
                            <span className="text-xl font-bold text-white">{pkg.tokens}</span>
                          </div>
                          {pkg.bonus > 0 && (
                            <div className="text-green-400 text-xs font-medium mb-2">
                              +{pkg.bonus} bonus
                            </div>
                          )}
                          <div className="text-white/60 text-sm">${pkg.price}</div>
                        </button>
                      ))}
                    </div>

                    {/* Buy with Stripe Button */}
                    <button
                      onClick={onOpenPurchaseModal}
                      className="w-full py-4 rounded-xl font-bold text-lg transition-all bg-gradient-to-r from-[#00D9FF] to-[#00a8cc] text-white hover:shadow-lg hover:shadow-[#00D9FF]/25 flex items-center justify-center gap-3"
                    >
                      <CreditCardIcon size={24} />
                      Buy Dream Coin with Card
                    </button>

                    <p className="text-center text-white/40 text-sm mt-4">
                      Secure payment processing. Dream Coin is added instantly after purchase.
                    </p>
                  </>
                )}
              </div>
            ) : (
              /* Cashout History */
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Withdrawal History</h3>
                  <button
                    onClick={onOpenCashoutModal}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg text-white text-sm font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all flex items-center gap-2"
                  >
                    <DollarIcon size={16} />
                    New Cashout
                  </button>
                </div>

                {isLoadingHistory ? (
                  <div className="text-center py-12">
                    <div className="w-8 h-8 border-2 border-[#00D9FF] border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-white/60 mt-4">Loading history...</p>
                  </div>
                ) : cashoutHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4">
                      <BankIcon className="text-white/40" size={32} />
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">No Withdrawals Yet</h4>
                    <p className="text-white/60 mb-6">
                      Cash out your earned Dream Coin to receive real money in your bank account.
                    </p>
                    <button
                      onClick={onOpenCashoutModal}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all"
                    >
                      Make Your First Cashout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cashoutHistory.map((cashout) => (
                      <div
                        key={cashout.id}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            cashout.status === 'completed' 
                              ? 'bg-green-500/20' 
                              : cashout.status === 'failed'
                              ? 'bg-red-500/20'
                              : 'bg-yellow-500/20'
                          }`}>
                            {cashout.status === 'completed' ? (
                              <ArrowUpIcon className="text-green-400" size={20} />
                            ) : cashout.status === 'failed' ? (
                              <ArrowDownIcon className="text-red-400" size={20} />
                            ) : (
                              <ClockIcon className="text-yellow-400" size={20} />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-white font-medium">
                                {cashout.token_amount.toLocaleString()} Dream Coin
                              </p>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadge(cashout.status)}`}>
                                {cashout.status}
                              </span>
                            </div>
                            <p className="text-white/50 text-sm">{formatDate(cashout.created_at)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-green-400 font-bold">${cashout.net_amount.toFixed(2)}</p>
                          <p className="text-white/40 text-xs">
                            Fee: ${cashout.fee_amount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Recent Transactions */}
            <div className="mt-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Recent Transactions</h4>
              <div className="space-y-3">
                {recentTransactions.map((tx, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        tx.amount > 0 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        <TokenIcon size={20} />
                      </div>
                      <div>
                        <p className="text-white font-medium">{tx.description}</p>
                        <p className="text-white/50 text-sm">{tx.date}</p>
                      </div>
                    </div>
                    <span className={`font-bold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount}
                    </span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-3 text-white/60 hover:text-white transition-colors flex items-center justify-center gap-2">
                View All Transactions
                <ArrowRightIcon size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TokenWallet;
