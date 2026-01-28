import React, { useState } from 'react';
import { DateStep, Character, Venue } from '@/types';
import { PlayIcon, PauseIcon, ArrowRightIcon, TokenIcon, HeartIcon, CloseIcon, MessageIcon } from './ui/Icons';

interface DateSimulatorProps {
  datee: Character | undefined | null;
  dater: Character | undefined | null;
  venue: Venue | undefined | null;
  tokenAmount: number;
  onComplete: (success: boolean, refundAmount: number) => void;
  onClose: () => void;
}

const sampleScenario: DateStep[] = [
  {
    id: '1',
    location: 'Meeting Point',
    activity: 'First Impression',
    description: 'You arrive at the venue and spot your date waiting near the entrance. They look even better than their profile picture.',
    duration_minutes: 5,
    choices: [
      { id: 'a', text: 'Greet them with a warm smile and compliment', compatibility_impact: 10 },
      { id: 'b', text: 'Play it cool with a casual wave', compatibility_impact: 5 },
      { id: 'c', text: 'Check your phone first, then approach', compatibility_impact: -5 },
    ]
  },
  {
    id: '2',
    location: 'Main Venue',
    activity: 'Getting Settled',
    description: 'You both find a cozy spot at the venue. The ambiance is perfect for conversation.',
    duration_minutes: 10,
    choices: [
      { id: 'a', text: 'Ask about their interests and hobbies', compatibility_impact: 10 },
      { id: 'b', text: 'Talk about yourself and your achievements', compatibility_impact: 0 },
      { id: 'c', text: 'Comment on the venue and surroundings', compatibility_impact: 5 },
    ]
  },
  {
    id: '3',
    location: 'Main Venue',
    activity: 'Deep Conversation',
    description: 'The conversation flows naturally. Your date shares something personal about their dreams and aspirations.',
    duration_minutes: 15,
    choices: [
      { id: 'a', text: 'Listen attentively and share your own dreams', compatibility_impact: 15 },
      { id: 'b', text: 'Offer advice on how to achieve their goals', compatibility_impact: 5 },
      { id: 'c', text: 'Change the topic to something lighter', compatibility_impact: -5 },
    ]
  },
  {
    id: '4',
    location: 'Main Venue',
    activity: 'The Moment',
    description: 'There\'s a moment of comfortable silence. Your eyes meet and there\'s undeniable chemistry.',
    duration_minutes: 5,
    choices: [
      { id: 'a', text: 'Hold their gaze and smile genuinely', compatibility_impact: 15 },
      { id: 'b', text: 'Reach out and gently touch their hand', compatibility_impact: 10 },
      { id: 'c', text: 'Look away nervously', compatibility_impact: -10 },
    ]
  },
  {
    id: '5',
    location: 'Outside Venue',
    activity: 'End of Date',
    description: 'The date is coming to an end. You both step outside into the cool evening air.',
    duration_minutes: 5,
    choices: [
      { id: 'a', text: 'Express how much you enjoyed the evening', compatibility_impact: 10 },
      { id: 'b', text: 'Suggest continuing the date elsewhere', compatibility_impact: 5, token_cost: 25 },
      { id: 'c', text: 'Thank them and say goodbye', compatibility_impact: 0 },
    ]
  },
];

const DateSimulator: React.FC<DateSimulatorProps> = ({
  datee,
  dater,
  venue,
  tokenAmount,
  onComplete,
  onClose
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [compatibilityScore, setCompatibilityScore] = useState(50);
  const [choices, setChoices] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [dateEnded, setDateEnded] = useState(false);

  // Early return if required props are missing
  if (!datee || !venue) {
    return null;
  }

  const step = sampleScenario[currentStep];

  const handleChoice = (choice: { id: string; compatibility_impact: number; token_cost?: number }) => {
    const newScore = Math.max(0, Math.min(100, compatibilityScore + choice.compatibility_impact));
    setCompatibilityScore(newScore);
    setChoices([...choices, choice.id]);

    if (currentStep < sampleScenario.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowEndScreen(true);
    }
  };

  const handleEndDate = () => {
    setDateEnded(true);
    const refundPercentage = Math.max(0, 50 - (currentStep * 10));
    const refundAmount = Math.floor(tokenAmount * (refundPercentage / 100));
    onComplete(false, refundAmount);
  };

  const handleCompleteDate = () => {
    const success = compatibilityScore >= 60;
    onComplete(success, 0);
  };

  if (showEndScreen) {
    const success = compatibilityScore >= 60;
    return (
      <div className="fixed inset-0 z-50 bg-[#0d0618] flex items-center justify-center p-4">
        <div className="max-w-lg w-full text-center">
          <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
            success 
              ? 'bg-gradient-to-br from-green-500 to-emerald-500' 
              : 'bg-gradient-to-br from-red-500 to-pink-500'
          }`}>
            <HeartIcon className="text-white" size={48} />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4">
            {success ? 'Date Successful!' : 'Date Ended'}
          </h2>
          
          <p className="text-white/60 mb-8">
            {success 
              ? `You and ${datee.name} had an amazing connection!`
              : `The chemistry wasn't quite there this time.`
            }
          </p>

          {/* Compatibility Score */}
          <div className="bg-white/5 rounded-2xl p-6 mb-8">
            <p className="text-white/60 text-sm mb-2">Final Compatibility Score</p>
            <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00D9FF] to-[#FFB800]">
              {compatibilityScore}%
            </div>
            <div className="mt-4 h-3 bg-white/10 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${
                  success ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-pink-500'
                }`}
                style={{ width: `${compatibilityScore}%` }}
              />
            </div>
          </div>

          {/* Rewards */}
          {success && (
            <div className="bg-gradient-to-r from-[#FFB800]/20 to-orange-500/10 rounded-2xl p-6 mb-8 border border-[#FFB800]/30">
              <p className="text-white/60 text-sm mb-2">Tokens Earned</p>
              <div className="flex items-center justify-center gap-2">
                <TokenIcon className="text-[#FFB800]" size={32} />
                <span className="text-3xl font-bold text-[#FFB800]">+{Math.floor(tokenAmount * 0.1)}</span>
              </div>
            </div>
          )}

          <button
            onClick={handleCompleteDate}
            className="w-full py-4 bg-gradient-to-r from-[#00D9FF] to-[#00a8cc] rounded-xl text-white font-bold text-lg hover:shadow-lg hover:shadow-[#00D9FF]/25 transition-all"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0d0618]">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent z-10">
        <div className="flex items-center gap-4">
          <img
            src={datee.avatar_url || '/placeholder.svg'}
            alt={datee.name || 'Date'}
            className="w-12 h-12 rounded-full border-2 border-[#00D9FF]"
          />
          <div>
            <h3 className="text-white font-semibold">{datee.name || 'Your Date'}</h3>
            <p className="text-white/60 text-sm">{venue.name || 'Venue'}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Compatibility Meter */}
          <div className="flex items-center gap-2">
            <HeartIcon className={`${compatibilityScore >= 50 ? 'text-pink-500' : 'text-white/30'}`} size={20} />
            <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-pink-500 to-red-500 transition-all duration-500"
                style={{ width: `${compatibilityScore}%` }}
              />
            </div>
            <span className="text-white text-sm font-medium">{compatibilityScore}%</span>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white"
          >
            <CloseIcon size={24} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="h-full flex flex-col justify-end">
        {/* Scene Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${venue.image_url || '/placeholder.svg'})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0618] via-[#0d0618]/50 to-transparent" />
        </div>

        {/* Progress */}
        <div className="relative z-10 px-4 mb-4">
          <div className="flex gap-1">
            {sampleScenario.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-1 rounded-full ${
                  index < currentStep 
                    ? 'bg-[#00D9FF]' 
                    : index === currentStep 
                      ? 'bg-[#00D9FF]/50' 
                      : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Dialogue Box */}
        <div className="relative z-10 p-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6">
            {/* Step Info */}
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-[#00D9FF]/20 rounded-full text-[#00D9FF] text-sm font-medium">
                {step.location}
              </span>
              <span className="text-white/40">•</span>
              <span className="text-white/60 text-sm">{step.activity}</span>
            </div>

            {/* Description */}
            <p className="text-white text-lg mb-6 leading-relaxed">
              {step.description}
            </p>

            {/* Choices */}
            <div className="space-y-3">
              {step.choices?.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice)}
                  className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00D9FF]/50 rounded-xl text-left transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white group-hover:text-[#00D9FF] transition-colors">
                      {choice.text}
                    </span>
                    {choice.token_cost && (
                      <span className="flex items-center gap-1 text-[#FFB800] text-sm">
                        <TokenIcon size={14} />
                        {choice.token_cost}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* End Date Button */}
            <button
              onClick={handleEndDate}
              className="w-full mt-4 py-3 text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
            >
              End Date Early (Partial Refund)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateSimulator;
