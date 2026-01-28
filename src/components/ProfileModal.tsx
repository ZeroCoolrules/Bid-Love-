import React from 'react';
import { Character } from '@/types';
import { CloseIcon, StarIcon, MapPinIcon, HeartIcon, CalendarIcon, TokenIcon, FireIcon, CrownIcon } from './ui/Icons';

interface ProfileModalProps {
  character: Character | undefined | null;
  onClose: () => void;
  onBid?: () => void;
}

const tierConfig = {
  hookup: { icon: FireIcon, color: 'text-pink-400', bg: 'from-pink-500/20 to-red-500/20', border: 'border-pink-500/30' },
  casual: { icon: HeartIcon, color: 'text-blue-400', bg: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/30' },
  relationship: { icon: CrownIcon, color: 'text-purple-400', bg: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/30' },
};

const ProfileModal: React.FC<ProfileModalProps> = ({ character, onClose, onBid }) => {
  // Early return if character is undefined or null
  if (!character) {
    return null;
  }

  const tier = tierConfig[character.dating_tier] || tierConfig.casual;
  const TierIcon = tier.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-[#1a0f2e] to-[#0d0618] rounded-3xl max-w-lg w-full border border-white/10 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header Image */}
        <div className="relative h-64">
          <img
            src={character.avatar_url || '/placeholder.svg'}
            alt={character.name || 'Profile'}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f2e] via-transparent to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors"
          >
            <CloseIcon size={20} />
          </button>

          {/* Rating Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-1 px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full">
            <StarIcon className="text-[#FFB800]" size={16} />
            <span className="text-white font-semibold">{character.reputation_score || 0}</span>
          </div>

          {/* Name & Location */}
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-2xl font-bold text-white mb-1">{character.name}, {character.age || '?'}</h2>
            <div className="flex items-center gap-2 text-white/70">
              <MapPinIcon size={16} />
              <span>{character.location || 'Unknown'}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Dating Tier */}
          <div className={`flex items-center gap-2 px-4 py-3 bg-gradient-to-r ${tier.bg} rounded-xl border ${tier.border} mb-6`}>
            <TierIcon className={tier.color} size={20} />
            <span className={`font-semibold capitalize ${tier.color}`}>
              Looking for {character.dating_tier || 'casual'}
            </span>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <h3 className="text-white/60 text-sm font-medium mb-2">About</h3>
            <p className="text-white leading-relaxed">{character.bio || 'No bio available'}</p>
          </div>

          {/* Personality Traits */}
          <div className="mb-6">
            <h3 className="text-white/60 text-sm font-medium mb-3">Personality</h3>
            <div className="flex flex-wrap gap-2">
              {(character.personality_traits || []).map((trait, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-gradient-to-r from-[#00D9FF]/20 to-blue-500/10 rounded-full text-[#00D9FF] text-sm border border-[#00D9FF]/30"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="mb-6">
            <h3 className="text-white/60 text-sm font-medium mb-3">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {(character.interests || []).map((interest, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-white/5 rounded-full text-white/70 text-sm border border-white/10"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-white/5 rounded-xl">
              <div className="text-xl font-bold text-white">{character.total_dates || 0}</div>
              <div className="text-white/50 text-xs">Total Dates</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-xl">
              <div className="text-xl font-bold text-green-400">{character.successful_dates || 0}</div>
              <div className="text-white/50 text-xs">Successful</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-xl">
              <div className="text-xl font-bold text-[#FFB800]">{character.token_ask || 0}</div>
              <div className="text-white/50 text-xs">Token Ask</div>
            </div>
          </div>

          {/* Action Buttons */}
          {character.is_datee && onBid && (
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 transition-colors"
              >
                Close
              </button>
              <button
                onClick={onBid}
                className="flex-1 py-3 bg-gradient-to-r from-[#00D9FF] to-[#00a8cc] rounded-xl text-white font-bold hover:shadow-lg hover:shadow-[#00D9FF]/25 transition-all flex items-center justify-center gap-2"
              >
                <TokenIcon size={18} />
                Place Bid
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
