import React, { useState } from 'react';
import { DateListing, Character } from '@/types';
import { CloseIcon, TokenIcon, StarIcon, MapPinIcon, CheckIcon } from './ui/Icons';

interface BidModalProps {
  listing: DateListing;
  datee: Character | undefined;
  currentBalance: number;
  onClose: () => void;
  onSubmitBid: (amount: number, message: string) => Promise<boolean>;
}

const BidModal: React.FC<BidModalProps> = ({ listing, datee, currentBalance, onClose, onSubmitBid }) => {
  const [bidAmount, setBidAmount] = useState(listing.token_ask);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Early return if datee is undefined
  if (!datee) {
    return null;
  }

  const quickBids = [
    { label: 'Minimum', amount: listing.token_ask },
    { label: '+10%', amount: Math.ceil(listing.token_ask * 1.1) },
    { label: '+25%', amount: Math.ceil(listing.token_ask * 1.25) },
    { label: '+50%', amount: Math.ceil(listing.token_ask * 1.5) },
  ];

  const handleSubmit = async () => {
    if (bidAmount < listing.token_ask) {
      setError(`Minimum bid is ${listing.token_ask} Dreamcoin`);
      return;
    }
    if (bidAmount > currentBalance) {
      setError('Insufficient token balance');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const result = await onSubmitBid(bidAmount, message);
    
    if (result) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      setError('Failed to place bid. Please try again.');
    }
    
    setIsSubmitting(false);
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="bg-gradient-to-br from-[#1a0f2e] to-[#0d0618] rounded-3xl p-8 max-w-md w-full border border-white/10 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
            <CheckIcon className="text-white" size={40} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Bid Placed!</h3>
          <p className="text-white/60 mb-4">
            Your bid of <span className="text-[#FFB800] font-bold">{bidAmount} Dreamcoin</span> has been submitted to {datee.name}.
          </p>
          <p className="text-white/40 text-sm">You'll be notified when they respond.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-[#1a0f2e] to-[#0d0618] rounded-3xl max-w-lg w-full border border-white/10 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative p-6 border-b border-white/10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            <CloseIcon size={24} />
          </button>
          <h2 className="text-2xl font-bold text-white">Place Your Bid</h2>
          <p className="text-white/60 mt-1">Compete for a date with {datee.name}</p>
        </div>

        {/* Datee Info */}
        <div className="p-6 border-b border-white/10">
          <div className="flex gap-4">
            <img
              src={datee.avatar_url || '/placeholder.svg'}
              alt={datee.name || 'Profile'}
              className="w-20 h-20 rounded-2xl object-cover"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">{datee.name}</h3>
              <div className="flex items-center gap-3 text-white/60 text-sm mt-1">
                <div className="flex items-center gap-1">
                  <MapPinIcon size={14} />
                  <span>{datee.location || 'Unknown'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <StarIcon className="text-[#FFB800]" size={14} />
                  <span>{datee.reputation_score || 0}</span>
                </div>
              </div>
              <p className="text-white/50 text-sm mt-2 line-clamp-2">{listing.title}</p>
            </div>
          </div>
        </div>

        {/* Bid Amount */}
        <div className="p-6">
          <label className="block text-white/80 text-sm font-medium mb-3">Bid Amount</label>
          
          {/* Quick Bid Buttons */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {quickBids.map((bid) => (
              <button
                key={bid.label}
                onClick={() => setBidAmount(bid.amount)}
                className={`py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                  bidAmount === bid.amount
                    ? 'bg-gradient-to-r from-[#00D9FF] to-[#00a8cc] text-white'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                }`}
              >
                {bid.label}
              </button>
            ))}
          </div>

          {/* Custom Amount Input */}
          <div className="relative">
            <TokenIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FFB800]" size={20} />
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(parseInt(e.target.value) || 0)}
              min={listing.token_ask}
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white text-lg font-bold focus:outline-none focus:border-[#00D9FF]/50 transition-colors"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40">Dreamcoin</span>
          </div>

          <div className="flex justify-between mt-2 text-sm">
            <span className="text-white/50">Minimum: {listing.token_ask} Dreamcoin</span>
            <span className="text-white/50">Your balance: <span className="text-[#FFB800]">{currentBalance}</span></span>
          </div>

          {/* Message */}
          <div className="mt-6">
            <label className="block text-white/80 text-sm font-medium mb-3">Message (Optional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Introduce yourself and why you'd be a great date..."
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#00D9FF]/50 transition-colors resize-none"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || bidAmount > currentBalance}
            className={`w-full mt-6 py-4 rounded-xl font-bold text-lg transition-all ${
              isSubmitting || bidAmount > currentBalance
                ? 'bg-white/10 text-white/40 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#00D9FF] to-[#00a8cc] text-white hover:shadow-lg hover:shadow-[#00D9FF]/25'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Placing Bid...
              </span>
            ) : (
              `Place Bid - ${bidAmount} Dreamcoin`
            )}
          </button>

          <p className="text-center text-white/40 text-xs mt-4">
            Dreamcoin will be held in escrow until the bid is accepted or rejected
          </p>
        </div>
      </div>
    </div>
  );
};

export default BidModal;
