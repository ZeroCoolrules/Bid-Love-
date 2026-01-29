import React from 'react';
import { DateListing, Character } from '@/types';
import { TokenIcon, StarIcon, MapPinIcon, HeartIcon, FireIcon, CrownIcon } from './ui/Icons';

interface DateListingCardProps {
  listing: DateListing;
  datee: Character | undefined;
  onBid: (listing: DateListing) => void;
  onViewProfile: (character: Character) => void;
}

const tierColors = {
  hookup: { bg: 'from-pink-500/20 to-red-500/20', border: 'border-pink-500/30', text: 'text-pink-400', icon: FireIcon },
  casual: { bg: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/30', text: 'text-blue-400', icon: HeartIcon },
  relationship: { bg: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/30', text: 'text-purple-400', icon: CrownIcon },
};

const DateListingCard: React.FC<DateListingCardProps> = ({ listing, datee, onBid, onViewProfile }) => {
  // Early return if datee is undefined
  if (!datee) {
    return null;
  }

  const tierStyle = tierColors[listing.dating_tier] || tierColors.casual;
  const TierIcon = tierStyle.icon;

  return (
    <div className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={datee.avatar_url || '/placeholder.svg'}
          alt={datee.name || 'Profile'}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Tier Badge */}
        <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r ${tierStyle.bg} backdrop-blur-sm rounded-full border ${tierStyle.border}`}>
          <TierIcon className={tierStyle.text} size={14} />
          <span className={`text-xs font-semibold capitalize ${tierStyle.text}`}>{listing.dating_tier}</span>
        </div>

        {/* Token Ask */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#FFB800]/20 to-orange-500/20 backdrop-blur-sm rounded-full border border-[#FFB800]/30">
          <TokenIcon className="text-[#FFB800]" size={14} />
          <span className="text-sm font-bold text-[#FFB800]">{listing.token_ask}</span>
        </div>

        {/* Character Info Overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-white font-bold text-lg">{datee.name}</h3>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <MapPinIcon size={14} />
                <span>{datee.location || 'Unknown'}</span>
                <span className="text-white/40">•</span>
                <span>{datee.age || '?'} yrs</span>
              </div>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-black/40 backdrop-blur-sm rounded-lg">
              <StarIcon className="text-[#FFB800]" size={14} />
              <span className="text-white font-semibold text-sm">{datee.reputation_score || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <h4 className="text-white font-semibold mb-2 line-clamp-1">{listing.title}</h4>
        <p className="text-white/60 text-sm mb-4 line-clamp-2">{listing.description}</p>

        {/* Interests */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(listing.preferred_activities || []).slice(0, 3).map((activity, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-white/5 rounded-lg text-xs text-white/70 border border-white/10"
            >
              {activity}
            </span>
          ))}
          {(listing.preferred_activities || []).length > 3 && (
            <span className="px-2 py-1 bg-white/5 rounded-lg text-xs text-white/50">
              +{listing.preferred_activities.length - 3}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onViewProfile(datee)}
            className="flex-1 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white/80 text-sm font-medium hover:bg-white/10 transition-colors"
          >
            View Profile
          </button>
          <button
            onClick={() => onBid(listing)}
            className="flex-1 py-2.5 bg-gradient-to-r from-[#00D9FF] to-[#00a8cc] rounded-xl text-white text-sm font-bold hover:shadow-lg hover:shadow-[#00D9FF]/25 transition-all"
          >
            Place Bid
          </button>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00D9FF]/5 to-[#FFB800]/5" />
      </div>
    </div>
  );
};

export default DateListingCard;
