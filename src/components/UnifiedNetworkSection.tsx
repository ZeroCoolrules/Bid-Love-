import React from 'react';
import { GlobeIcon, HeartIcon, SparklesIcon } from './ui/Icons';

const UnifiedNetworkSection: React.FC = () => {
  const platforms = [
    {
      icon: SparklesIcon,
      title: 'Cupidspoint DatingPro',
      description: 'Smart onboarding, compatibility scoring, and curated discovery tools.',
      tag: 'Match Engine',
    },
    {
      icon: HeartIcon,
      title: 'Bid Love',
      description: 'Dream Coin-powered date marketplace with verified profiles and character creation.',
      tag: 'Marketplace',
    },
    {
      icon: GlobeIcon,
      title: 'ClimaxCoordinator',
      description: 'Guided video sessions, intimacy coaching, and real-time prompts.',
      tag: 'Guided Sessions',
    },
  ];

  return (
    <section className="py-20 bg-[#0d0618]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-white/5 rounded-full text-[#00D9FF] text-sm font-medium mb-4">
            Unified Network
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            One Sign-Up,
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D9FF] to-[#FFB800]"> Three Experiences</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            A single Cupidspoint DatingPro account unlocks Bid Love and ClimaxCoordinator features,
            all powered by Dream Coin.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {platforms.map((platform, index) => {
            const Icon = platform.icon;
            return (
              <div
                key={index}
                className="relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00D9FF]/30 to-[#FFB800]/10 flex items-center justify-center">
                    <Icon className="text-white" size={22} />
                  </div>
                  <span className="text-xs uppercase tracking-wide text-[#FFB800] font-semibold">
                    {platform.tag}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{platform.title}</h3>
                <p className="text-white/60 text-sm">{platform.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-[#00D9FF]/10 to-[#FFB800]/10 rounded-2xl border border-white/10">
            <span className="text-white/80 text-sm">
              Sign up once on Cupidspoint DatingPro and move seamlessly between Bid Love and ClimaxCoordinator.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UnifiedNetworkSection;
