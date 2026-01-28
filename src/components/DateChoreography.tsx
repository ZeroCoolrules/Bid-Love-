import React, { useState } from 'react';
import { Venue, Character } from '@/types';
import { CloseIcon, MapPinIcon, TokenIcon, PlayIcon, SparklesIcon, CheckIcon } from './ui/Icons';

interface DateChoreographyProps {
  datee: Character;
  venues: Venue[];
  tokenAmount: number;
  onClose: () => void;
  onStartDate: (venue: Venue, mode: 'sim' | 'manual') => void;
}

interface DateStep {
  venue: Venue | null;
  activity: string;
  duration: number;
}

const DateChoreography: React.FC<DateChoreographyProps> = ({
  datee,
  venues,
  tokenAmount,
  onClose,
  onStartDate
}) => {
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [dateMode, setDateMode] = useState<'sim' | 'manual'>('sim');
  const [step, setStep] = useState(1);

  const handleStartDate = () => {
    if (selectedVenue) {
      onStartDate(selectedVenue, dateMode);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-[#1a0f2e] to-[#0d0618] rounded-3xl max-w-2xl w-full border border-white/10 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative p-6 border-b border-white/10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            <CloseIcon size={24} />
          </button>
          <h2 className="text-2xl font-bold text-white">Plan Your Date</h2>
          <p className="text-white/60 mt-1">with {datee.name}</p>
          
          {/* Progress */}
          <div className="flex gap-2 mt-4">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={`flex-1 h-1 rounded-full ${
                  s <= step ? 'bg-[#00D9FF]' : 'bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Choose a Venue</h3>
              <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
                {venues.map((venue) => (
                  <button
                    key={venue.id}
                    onClick={() => setSelectedVenue(venue)}
                    className={`relative rounded-xl overflow-hidden transition-all ${
                      selectedVenue?.id === venue.id
                        ? 'ring-2 ring-[#00D9FF] ring-offset-2 ring-offset-[#1a0f2e]'
                        : 'hover:opacity-80'
                    }`}
                  >
                    <img
                      src={venue.image_url}
                      alt={venue.name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white font-medium text-sm">{venue.name}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-white/60 text-xs capitalize">{venue.venue_type}</span>
                        {venue.token_cost > 0 && (
                          <span className="flex items-center gap-1 text-[#FFB800] text-xs">
                            <TokenIcon size={12} />
                            {venue.token_cost}
                          </span>
                        )}
                      </div>
                    </div>
                    {selectedVenue?.id === venue.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-[#00D9FF] rounded-full flex items-center justify-center">
                        <CheckIcon className="text-white" size={14} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Choose Date Mode</h3>
              
              <div className="space-y-4">
                <button
                  onClick={() => setDateMode('sim')}
                  className={`w-full p-4 rounded-xl border transition-all text-left ${
                    dateMode === 'sim'
                      ? 'bg-gradient-to-r from-[#00D9FF]/20 to-blue-500/10 border-[#00D9FF]/50'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      dateMode === 'sim' ? 'bg-[#00D9FF]' : 'bg-white/10'
                    }`}>
                      <SparklesIcon className="text-white" size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold">SIM Mode</h4>
                      <p className="text-white/60 text-sm mt-1">
                        AI-guided date experience. The scenario unfolds automatically with choices that affect your compatibility score.
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">Recommended</span>
                        <span className="px-2 py-0.5 bg-white/10 text-white/60 text-xs rounded-full">Beginner Friendly</span>
                      </div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setDateMode('manual')}
                  className={`w-full p-4 rounded-xl border transition-all text-left ${
                    dateMode === 'manual'
                      ? 'bg-gradient-to-r from-[#FFB800]/20 to-orange-500/10 border-[#FFB800]/50'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      dateMode === 'manual' ? 'bg-[#FFB800]' : 'bg-white/10'
                    }`}>
                      <PlayIcon className="text-black" size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold">Manual Mode</h4>
                      <p className="text-white/60 text-sm mt-1">
                        Take full control of the date. You and your date take turns deciding what happens next.
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">Advanced</span>
                        <span className="px-2 py-0.5 bg-white/10 text-white/60 text-xs rounded-full">More Creative</span>
                      </div>
                    </div>
                  </div>
                </button>
              </div>

              {/* Date Summary */}
              {selectedVenue && (
                <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                  <h4 className="text-white/60 text-sm mb-3">Date Summary</h4>
                  <div className="flex items-center gap-4">
                    <img
                      src={selectedVenue.image_url}
                      alt={selectedVenue.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-white font-medium">{selectedVenue.name}</p>
                      <div className="flex items-center gap-2 text-white/60 text-sm">
                        <MapPinIcon size={14} />
                        <span>{selectedVenue.location_area}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-[#FFB800]">
                        <TokenIcon size={16} />
                        <span className="font-bold">{tokenAmount + (selectedVenue.token_cost || 0)}</span>
                      </div>
                      <span className="text-white/40 text-xs">Total Cost</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
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
          {step < 2 ? (
            <button
              onClick={() => setStep(2)}
              disabled={!selectedVenue}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                selectedVenue
                  ? 'bg-gradient-to-r from-[#00D9FF] to-[#00a8cc] text-white hover:shadow-lg hover:shadow-[#00D9FF]/25'
                  : 'bg-white/10 text-white/40 cursor-not-allowed'
              }`}
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleStartDate}
              className="flex-1 py-3 bg-gradient-to-r from-[#FFB800] to-orange-500 rounded-xl text-black font-bold hover:shadow-lg hover:shadow-[#FFB800]/25 transition-all flex items-center justify-center gap-2"
            >
              <PlayIcon size={20} />
              Start Date
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DateChoreography;
