import React from 'react';
import { TokenIcon, TrendingUpIcon, WalletIcon, ArrowRightIcon } from './ui/Icons';

const TokenExplainer: React.FC = () => {
  const tokenFeatures = [
    {
      icon: WalletIcon,
      title: 'Purchase Dreamcoin',
      description: 'Buy Dreamcoin with real currency. Prices start at $0.07 per Dreamcoin with bulk discounts available.',
    },
    {
      icon: TokenIcon,
      title: 'Bid on Dates',
      description: 'Use Dreamcoin to bid on date listings. Higher bids increase your chances of being selected.',
    },
    {
      icon: TrendingUpIcon,
      title: 'Earn & Cash Out',
      description: 'Earn Dreamcoin from successful dates. Cash out anytime at market rate or reinvest in more dates.',
    },
  ];

  return (
    <section className="py-20 bg-[#0d0618]">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Token Visual */}
          <div className="relative">
            <div className="relative w-full max-w-md mx-auto">
              {/* Main Token */}
              <div className="relative z-10 w-64 h-64 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFB800] to-orange-500 rounded-full animate-pulse opacity-20 blur-xl" />
                <div className="relative w-full h-full bg-gradient-to-br from-[#FFB800] to-orange-500 rounded-full flex items-center justify-center shadow-2xl shadow-[#FFB800]/30">
                  <div className="text-center">
                    <TokenIcon className="text-black mx-auto mb-2" size={64} />
                    <span className="text-black font-bold text-3xl">DREAM</span>
                    <p className="text-black/60 text-sm">Dreamcoin</p>
                  </div>
                </div>
              </div>

              {/* Floating Stats */}
              <div className="absolute top-0 right-0 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <p className="text-white/60 text-xs">Current Value</p>
                <p className="text-white font-bold">$0.07 USD</p>
              </div>

              <div className="absolute bottom-0 left-0 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <p className="text-white/60 text-xs">24h Volume</p>
                <p className="text-[#00D9FF] font-bold">1.2M Dreamcoin</p>
              </div>

              <div className="absolute top-1/2 -right-4 bg-green-500/20 backdrop-blur-sm rounded-xl p-3 border border-green-500/30">
                <p className="text-green-400 font-bold text-sm">+2.4%</p>
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div>
            <span className="inline-block px-4 py-2 bg-[#FFB800]/20 rounded-full text-[#FFB800] text-sm font-medium mb-4">
              Dreamcoin Economy
            </span>
            <h2 className="text-4xl font-bold text-white mb-6">
              The Currency of
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] to-orange-500"> Virtual Romance</span>
            </h2>
            <p className="text-white/60 text-lg mb-8">
              Dreamcoin powers the entire ecosystem. Purchase Dreamcoin to bid on dates, earn it from successful connections, and cash out whenever you want.
            </p>

            {/* Features */}
            <div className="space-y-6">
              {tokenFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex gap-4">
                    <div className="w-12 h-12 bg-[#FFB800]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="text-[#FFB800]" size={24} />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                      <p className="text-white/60 text-sm">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <button className="mt-8 px-6 py-3 bg-gradient-to-r from-[#FFB800] to-orange-500 rounded-xl font-bold text-black hover:shadow-lg hover:shadow-[#FFB800]/25 transition-all flex items-center gap-2">
              Learn More About Dreamcoin
              <ArrowRightIcon size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TokenExplainer;
