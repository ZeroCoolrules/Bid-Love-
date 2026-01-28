import React from 'react';
import { UserIcon, SearchIcon, TokenIcon, PlayIcon, ChartIcon } from './ui/Icons';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      icon: UserIcon,
      title: 'Create Your DatingPro Account',
      description: 'Sign up once with Cupidspoint DatingPro to access Bid Love and ClimaxCoordinator experiences.',
    },
    {
      number: '02',
      icon: SearchIcon,
      title: 'Browse the Bid Love Marketplace',
      description: 'Explore date listings from other characters. Filter by dating tier, location, and Dream Coin range to find your perfect match.',
    },
    {
      number: '03',
      icon: TokenIcon,
      title: 'Place Your Bid',
      description: 'Use Dream Coin to bid on dates. Higher bids increase your chances. Tokens are held in escrow until the date is confirmed.',
    },
    {
      number: '04',
      icon: PlayIcon,
      title: 'Experience the Date',
      description: 'Stream immersive video dates with ClimaxCoordinator guidance or run manual sessions that shape compatibility.',
    },
    {
      number: '05',
      icon: ChartIcon,
      title: 'Learn & Improve',
      description: 'Review your dating analytics, get personalized tips, and improve your connection skills for future dates.',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-[#0d0618] to-[#1a0f2e]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-white/5 rounded-full text-[#FFB800] text-sm font-medium mb-4">
            Getting Started
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How Bid Love Works
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            From onboarding to meaningful connections - here is your journey across the unified network
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#00D9FF] via-[#FFB800] to-[#00D9FF] hidden lg:block" />

          <div className="space-y-12 lg:space-y-0">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;
              
              return (
                <div
                  key={index}
                  className={`relative flex flex-col lg:flex-row items-center gap-8 ${
                    isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Content */}
                  <div className={`flex-1 ${isEven ? 'lg:text-right' : 'lg:text-left'}`}>
                    <div className={`bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 ${
                      isEven ? 'lg:mr-12' : 'lg:ml-12'
                    }`}>
                      <span className="text-[#00D9FF] text-sm font-bold">Step {step.number}</span>
                      <h3 className="text-xl font-bold text-white mt-2 mb-3">{step.title}</h3>
                      <p className="text-white/60">{step.description}</p>
                    </div>
                  </div>

                  {/* Icon Circle */}
                  <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-[#00D9FF] to-[#FFB800] rounded-full flex items-center justify-center shadow-lg shadow-[#00D9FF]/30">
                    <Icon className="text-white" size={28} />
                  </div>

                  {/* Spacer for alignment */}
                  <div className="flex-1 hidden lg:block" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 px-6 py-4 bg-gradient-to-r from-[#00D9FF]/10 to-[#FFB800]/10 rounded-2xl border border-white/10">
            <div className="text-left">
              <p className="text-white font-semibold">Ready to start your journey?</p>
              <p className="text-white/60 text-sm">Create your character and get 500 free Dream Coin</p>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-[#FFB800] to-orange-500 rounded-xl font-bold text-black hover:shadow-lg hover:shadow-[#FFB800]/25 transition-all">
              Start Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
