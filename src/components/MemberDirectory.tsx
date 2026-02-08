import React from 'react';
import { Character } from '@/types';
import { HeartFilledIcon, HeartIcon, MapPinIcon, StarIcon, TokenIcon } from './ui/Icons';

interface MemberDirectoryProps {
  characters: Character[];
  savedProfileIds: string[];
  onToggleSave: (characterId: string) => void;
  onViewProfile: (character: Character) => void;
}

const MemberDirectory: React.FC<MemberDirectoryProps> = ({
  characters,
  savedProfileIds,
  onToggleSave,
  onViewProfile,
}) => {
  return (
    <section className="py-16 bg-[#0d0618]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <span className="inline-block px-4 py-2 bg-white/5 rounded-full text-pink-400 text-sm font-medium mb-3">
              Member Profiles
            </span>
            <h2 className="text-3xl font-bold text-white mb-2">Save profiles and highlight member characteristics</h2>
            <p className="text-white/60 max-w-2xl">
              Browse member profiles, review their personality traits and interests, and save the ones you want to
              connect with later.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((character) => {
            const isSaved = savedProfileIds.includes(character.id);
            return (
              <div
                key={character.id}
                className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden flex flex-col"
              >
                <div className="relative h-44">
                  <img
                    src={character.avatar_url}
                    alt={character.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0618] via-transparent to-transparent" />
                  <button
                    onClick={() => onToggleSave(character.id)}
                    className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center"
                  >
                    {isSaved ? (
                      <HeartFilledIcon className="text-pink-400" size={18} />
                    ) : (
                      <HeartIcon className="text-white" size={18} />
                    )}
                  </button>
                  <div className="absolute bottom-3 left-4">
                    <p className="text-xl font-semibold text-white">{character.name}</p>
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <MapPinIcon size={14} />
                      {character.location}
                    </div>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col gap-4">
                  <p className="text-white/70 text-sm line-clamp-2">{character.bio}</p>

                  <div>
                    <p className="text-xs uppercase text-white/40 mb-2">Personality traits</p>
                    <div className="flex flex-wrap gap-2">
                      {character.personality_traits.slice(0, 4).map((trait) => (
                        <span
                          key={trait}
                          className="px-3 py-1 rounded-full text-xs text-[#00D9FF] bg-[#00D9FF]/15 border border-[#00D9FF]/30"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs uppercase text-white/40 mb-2">Interests</p>
                    <div className="flex flex-wrap gap-2">
                      {character.interests.slice(0, 4).map((interest) => (
                        <span
                          key={interest}
                          className="px-3 py-1 rounded-full text-xs text-white/70 bg-white/5 border border-white/10"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-white/60">
                    <span className="flex items-center gap-2">
                      <StarIcon className="text-[#FFB800]" size={14} />
                      {character.reputation_score.toFixed(1)} rating
                    </span>
                    <span className="flex items-center gap-2">
                      <TokenIcon className="text-[#FFB800]" size={14} />
                      {character.token_ask} min
                    </span>
                  </div>

                  <button
                    onClick={() => onViewProfile(character)}
                    className="mt-auto w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition-colors"
                  >
                    View Full Profile
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MemberDirectory;
