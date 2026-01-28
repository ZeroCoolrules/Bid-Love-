import React, { useState } from 'react';
import { Character } from '@/types';
import { CloseIcon, CheckIcon, UserIcon, HeartIcon, FireIcon, CrownIcon } from './ui/Icons';

interface CharacterBuilderProps {
  onClose: () => void;
  onCreateCharacter: (character: Partial<Character>) => Promise<Character | null>;
}

const avatarOptions = [
  'https://d64gsuwffb70l.cloudfront.net/693e8a400a804c87e7c5fefc_1765729603911_0678113e.png',
  'https://d64gsuwffb70l.cloudfront.net/693e8a400a804c87e7c5fefc_1765729605919_12bdb977.png',
  'https://d64gsuwffb70l.cloudfront.net/693e8a400a804c87e7c5fefc_1765729604733_1677ffe6.png',
  'https://d64gsuwffb70l.cloudfront.net/693e8a400a804c87e7c5fefc_1765729602055_41c03ce7.jpg',
  'https://d64gsuwffb70l.cloudfront.net/693e8a400a804c87e7c5fefc_1765729605172_56d28657.png',
  'https://d64gsuwffb70l.cloudfront.net/693e8a400a804c87e7c5fefc_1765729609916_dbe11e1a.png',
  'https://d64gsuwffb70l.cloudfront.net/693e8a400a804c87e7c5fefc_1765729608649_b698c46d.png',
  'https://d64gsuwffb70l.cloudfront.net/693e8a400a804c87e7c5fefc_1765729608947_b2d3339e.jpg',
];

const personalityTraits = [
  'Adventurous', 'Ambitious', 'Artistic', 'Athletic', 'Caring',
  'Charismatic', 'Confident', 'Creative', 'Empathetic', 'Energetic',
  'Funny', 'Intellectual', 'Mysterious', 'Outgoing', 'Romantic',
  'Sophisticated', 'Spontaneous', 'Stable', 'Witty', 'Zen'
];

const interestOptions = [
  'Art', 'Cooking', 'Dancing', 'Fashion', 'Fitness',
  'Gaming', 'Hiking', 'Movies', 'Music', 'Nightlife',
  'Photography', 'Reading', 'Sports', 'Technology', 'Travel',
  'Wine', 'Yoga', 'Food', 'Nature', 'Writing'
];

const locations = ['Downtown', 'Uptown', 'Midtown', 'Eastside', 'Westside', 'Suburbs'];

const CharacterBuilder: React.FC<CharacterBuilderProps> = ({ onClose, onCreateCharacter }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [character, setCharacter] = useState<Partial<Character>>({
    name: '',
    avatar_url: avatarOptions[0],
    bio: '',
    age: 25,
    location: 'Downtown',
    dating_tier: 'casual',
    personality_traits: [],
    interests: [],
    token_ask: 100,
    is_datee: false,
  });

  const updateCharacter = (updates: Partial<Character>) => {
    setCharacter(prev => ({ ...prev, ...updates }));
  };

  const toggleTrait = (trait: string) => {
    const traits = character.personality_traits || [];
    if (traits.includes(trait)) {
      updateCharacter({ personality_traits: traits.filter(t => t !== trait) });
    } else if (traits.length < 5) {
      updateCharacter({ personality_traits: [...traits, trait] });
    }
  };

  const toggleInterest = (interest: string) => {
    const interests = character.interests || [];
    if (interests.includes(interest)) {
      updateCharacter({ interests: interests.filter(i => i !== interest) });
    } else if (interests.length < 6) {
      updateCharacter({ interests: [...interests, interest] });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const result = await onCreateCharacter(character);
    setIsSubmitting(false);
    if (result) {
      onClose();
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return character.name && character.name.length >= 2;
      case 2: return (character.personality_traits?.length || 0) >= 2;
      case 3: return (character.interests?.length || 0) >= 2;
      case 4: return character.bio && character.bio.length >= 10;
      default: return true;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-3">Choose Your Avatar</label>
              <div className="grid grid-cols-4 gap-3">
                {avatarOptions.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => updateCharacter({ avatar_url: url })}
                    className={`relative rounded-xl overflow-hidden aspect-square transition-all ${
                      character.avatar_url === url
                        ? 'ring-2 ring-[#00D9FF] ring-offset-2 ring-offset-[#1a0f2e]'
                        : 'hover:opacity-80'
                    }`}
                  >
                    <img src={url} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover" />
                    {character.avatar_url === url && (
                      <div className="absolute inset-0 bg-[#00D9FF]/20 flex items-center justify-center">
                        <CheckIcon className="text-[#00D9FF]" size={24} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-3">Character Name</label>
              <input
                type="text"
                value={character.name}
                onChange={(e) => updateCharacter({ name: e.target.value })}
                placeholder="Enter your character's name"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#00D9FF]/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-3">Age</label>
                <input
                  type="number"
                  value={character.age}
                  onChange={(e) => updateCharacter({ age: parseInt(e.target.value) || 18 })}
                  min={18}
                  max={99}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00D9FF]/50"
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-3">Location</label>
                <select
                  value={character.location}
                  onChange={(e) => updateCharacter({ location: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00D9FF]/50"
                >
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Select Personality Traits</label>
            <p className="text-white/50 text-sm mb-4">Choose 2-5 traits that define your character</p>
            <div className="flex flex-wrap gap-2">
              {personalityTraits.map(trait => (
                <button
                  key={trait}
                  onClick={() => toggleTrait(trait)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    character.personality_traits?.includes(trait)
                      ? 'bg-gradient-to-r from-[#00D9FF] to-[#00a8cc] text-white'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {trait}
                </button>
              ))}
            </div>
            <p className="text-white/40 text-sm mt-4">
              Selected: {character.personality_traits?.length || 0}/5
            </p>
          </div>
        );

      case 3:
        return (
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Select Your Interests</label>
            <p className="text-white/50 text-sm mb-4">Choose 2-6 interests to help find compatible matches</p>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map(interest => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    character.interests?.includes(interest)
                      ? 'bg-gradient-to-r from-[#FFB800] to-orange-500 text-black'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
            <p className="text-white/40 text-sm mt-4">
              Selected: {character.interests?.length || 0}/6
            </p>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-3">Dating Goal</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'hookup', label: 'Hookup', icon: FireIcon, color: 'from-pink-500 to-red-500' },
                  { id: 'casual', label: 'Casual', icon: HeartIcon, color: 'from-blue-500 to-cyan-500' },
                  { id: 'relationship', label: 'Relationship', icon: CrownIcon, color: 'from-purple-500 to-pink-500' },
                ].map(tier => {
                  const Icon = tier.icon;
                  return (
                    <button
                      key={tier.id}
                      onClick={() => updateCharacter({ dating_tier: tier.id as any })}
                      className={`p-4 rounded-xl border transition-all ${
                        character.dating_tier === tier.id
                          ? `bg-gradient-to-r ${tier.color} border-transparent text-white`
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      <Icon size={24} className="mx-auto mb-2" />
                      <span className="text-sm font-medium">{tier.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-3">Bio</label>
              <textarea
                value={character.bio}
                onChange={(e) => updateCharacter({ bio: e.target.value })}
                placeholder="Tell potential dates about yourself..."
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#00D9FF]/50 resize-none"
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-3">
                Become a Datee? (Receive bids from others)
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => updateCharacter({ is_datee: false })}
                  className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                    !character.is_datee
                      ? 'bg-gradient-to-r from-[#00D9FF] to-[#00a8cc] text-white'
                      : 'bg-white/5 text-white/70 border border-white/10'
                  }`}
                >
                  Dater Only
                </button>
                <button
                  onClick={() => updateCharacter({ is_datee: true })}
                  className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                    character.is_datee
                      ? 'bg-gradient-to-r from-[#FFB800] to-orange-500 text-black'
                      : 'bg-white/5 text-white/70 border border-white/10'
                  }`}
                >
                  Also a Datee
                </button>
              </div>
            </div>

            {character.is_datee && (
              <div>
                <label className="block text-white/80 text-sm font-medium mb-3">
                  Minimum Token Ask: {character.token_ask}
                </label>
                <input
                  type="range"
                  min={50}
                  max={500}
                  value={character.token_ask}
                  onChange={(e) => updateCharacter({ token_ask: parseInt(e.target.value) })}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#FFB800]"
                />
                <div className="flex justify-between text-white/40 text-sm mt-1">
                  <span>50</span>
                  <span>500</span>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-[#1a0f2e] to-[#0d0618] rounded-3xl max-w-xl w-full border border-white/10 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative p-6 border-b border-white/10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            <CloseIcon size={24} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#00D9FF] to-[#00a8cc] rounded-xl flex items-center justify-center">
              <UserIcon className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Create Your Character</h2>
              <p className="text-white/60 text-sm">Step {step} of 4</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#00D9FF] to-[#FFB800] transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {renderStep()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 transition-colors"
            >
              Back
            </button>
          )}
          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                canProceed()
                  ? 'bg-gradient-to-r from-[#00D9FF] to-[#00a8cc] text-white hover:shadow-lg hover:shadow-[#00D9FF]/25'
                  : 'bg-white/10 text-white/40 cursor-not-allowed'
              }`}
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                canProceed() && !isSubmitting
                  ? 'bg-gradient-to-r from-[#FFB800] to-orange-500 text-black hover:shadow-lg hover:shadow-[#FFB800]/25'
                  : 'bg-white/10 text-white/40 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Creating...
                </span>
              ) : (
                'Create Character'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterBuilder;
