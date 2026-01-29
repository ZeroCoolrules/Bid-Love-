import React from 'react';
import { TokenIcon, HeartIcon, GlobeIcon, ChartIcon, SparklesIcon, UserIcon } from './ui/Icons';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: UserIcon,
      title: 'DatingPro Sign-On',
      description: 'Create one profile in Cupidspoint DatingPro to unlock Bid Love and ClimaxCoordinator instantly.',
      color: 'from-[#00D9FF] to-blue-500',
    },
    {
      icon: TokenIcon,
      title: 'Dreamcoin Economy',
      description: 'Dreamcoin powers bids, streams, tips, and coordinated experiences across the platform.',
      color: 'from-[#FFB800] to-orange-500',
    },
    {
      icon: HeartIcon,
      title: 'Bid Love Marketplace',
      description: 'Bid on curated dates and experiences with compatibility insights from DatingPro.',
      color: 'from-pink-500 to-red-500',
    },
    {
      icon: GlobeIcon,
      title: 'ClimaxCoordinator Sync',
      description: 'Consent-first scheduling, aftercare planning, and milestone tracking woven into every date.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: SparklesIcon,
      title: 'Video Lounge',
      description: 'Redesigned streaming with overlays, private chat, and guided moments that feel effortless.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: ChartIcon,
      title: 'Relationship Intelligence',
      description: 'Unified analytics across DatingPro, Bid Love, and live streams to sharpen every connection.',
      color: 'from-indigo-500 to-purple-500',
    },
  ];

  return (
    <section className="py-20 bg-[#0d0618]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-white/5 rounded-full text-[#00D9FF] text-sm font-medium mb-4">
            Platform Features
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Everything You Need to
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D9FF] to-[#FFB800]"> Date Smarter</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            Our platform combines virtual dating with real economic incentives, creating meaningful connections in an immersive environment.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10"
              >
                {/* Icon */}
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="text-white" size={28} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed">{feature.description}</p>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-white/60 mb-6">Ready to revolutionize your dating experience?</p>
          <button className="px-8 py-4 bg-gradient-to-r from-[#00D9FF] to-[#00a8cc] rounded-xl font-semibold text-white shadow-lg shadow-[#00D9FF]/25 hover:shadow-[#00D9FF]/40 transition-all duration-300 hover:scale-105">
            Get Started Free
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
