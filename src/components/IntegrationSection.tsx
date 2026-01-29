import React from 'react';
import { SparklesIcon, GlobeIcon, CheckCircleIcon, ArrowRightIcon } from './ui/Icons';

const IntegrationSection: React.FC = () => {
  const integrations = [
    {
      title: 'Cupidspoint DatingPro',
      description: 'Primary sign-up hub with shared identity, preferences, and match history synced across the ecosystem.',
      badge: 'Single sign-on',
      gradient: 'from-[#00D9FF]/20 to-blue-500/10',
    },
    {
      title: 'Bid Love Marketplace',
      description: 'Seamless access to bids, dates, and virtual venues the moment a DatingPro account is verified.',
      badge: 'Instant access',
      gradient: 'from-[#FFB800]/20 to-orange-500/10',
    },
    {
      title: 'ClimaxCoordinator',
      description: 'Consent-first scheduling, aftercare planning, and experience tracking baked into every date flow.',
      badge: 'Coordinated experiences',
      gradient: 'from-purple-500/20 to-pink-500/10',
    },
  ];

  return (
    <section className="py-20 bg-[#0d0618]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-[#00D9FF] text-sm font-medium mb-4">
            <GlobeIcon className="text-[#00D9FF]" size={16} />
            Unified Network
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            One Account, Three Experiences
          </h2>
          <p className="text-white/60 max-w-3xl mx-auto text-lg">
            DatingPro sign-ups unlock Bid Love, Dreamcoin, and ClimaxCoordinator workflows in a single, seamless journey.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {integrations.map((item) => (
            <div
              key={item.title}
              className="relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-60`} />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                    {item.badge}
                  </span>
                  <CheckCircleIcon className="text-[#00D9FF]" size={18} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-white/60 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 bg-white/5 border border-white/10 rounded-3xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#00D9FF] to-[#FFB800] rounded-2xl flex items-center justify-center">
              <SparklesIcon className="text-white" size={22} />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">Dreamcoin is the shared economy</h3>
              <p className="text-white/60 text-sm">Use the same token balance for dates, streams, and coordinated experiences.</p>
            </div>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-[#00D9FF] to-[#00a8cc] rounded-xl text-white font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-[#00D9FF]/30 transition-all">
            See the unified roadmap
            <ArrowRightIcon size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default IntegrationSection;
