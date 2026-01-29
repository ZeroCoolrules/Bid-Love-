import React from 'react';
import { SparklesIcon, ArrowRightIcon, TokenIcon, HeartIcon } from './ui/Icons';

interface HeroSectionProps {
  onGetStarted: () => void;
  onExploreMarketplace: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted, onExploreMarketplace }) => {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://d64gsuwffb70l.cloudfront.net/693e8a400a804c87e7c5fefc_1765729582569_b07ee87d.png')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#2D1B4E]/95 via-[#1a0f2e]/90 to-[#0d0618]/95" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#00D9FF]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FFB800]/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl" />
        
        {/* Floating Hearts */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + i}s`
            }}
          >
            <HeartIcon className="text-pink-500/20" size={20 + i * 5} />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-200px)]">
          {/* Left Side - Text Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 mb-6">
              <SparklesIcon className="text-[#FFB800]" size={16} />
              <span className="text-sm text-white/80">Cupidspoint DatingPro • Bid Love • ClimaxCoordinator</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-white">Date.</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D9FF] to-[#FFB800]"> Bid.</span>
              <span className="text-white"> Connect.</span>
            </h1>

            <p className="text-xl text-white/70 mb-8 max-w-xl mx-auto lg:mx-0">
              Sign in once with DatingPro to unlock Bid Love, coordinate experiences with ClimaxCoordinator, and power every connection with Dreamcoin.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={onGetStarted}
                className="group px-8 py-4 bg-gradient-to-r from-[#00D9FF] to-[#00a8cc] rounded-xl font-semibold text-white shadow-lg shadow-[#00D9FF]/25 hover:shadow-[#00D9FF]/40 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                Create Your Character
                <ArrowRightIcon className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>
              <button
                onClick={onExploreMarketplace}
                className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl font-semibold text-white hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <TokenIcon className="text-[#FFB800]" size={20} />
                Explore Marketplace
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10">
              <div>
                <div className="text-3xl font-bold text-white">50K+</div>
                <div className="text-sm text-white/50">Active Characters</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#00D9FF]">1.2M</div>
                <div className="text-sm text-white/50">Dreamcoin Traded</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#FFB800]">89%</div>
                <div className="text-sm text-white/50">Match Success</div>
              </div>
            </div>
          </div>

          {/* Right Side - Visual Preview */}
          <div className="relative hidden lg:block">
            {/* Main Card Stack */}
            <div className="relative w-full max-w-md mx-auto">
              {/* Background Cards */}
              <div className="absolute top-8 left-8 w-full h-[400px] bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-3xl transform rotate-6 backdrop-blur-sm border border-white/10" />
              <div className="absolute top-4 left-4 w-full h-[400px] bg-gradient-to-br from-[#00D9FF]/20 to-blue-600/20 rounded-3xl transform rotate-3 backdrop-blur-sm border border-white/10" />
              
              {/* Main Profile Card */}
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
                <div className="relative">
                  <img
                    src="https://d64gsuwffb70l.cloudfront.net/693e8a400a804c87e7c5fefc_1765729603911_0678113e.png"
                    alt="Featured Character"
                    className="w-full h-64 object-cover rounded-2xl"
                  />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-[#FFB800] to-orange-500 rounded-full text-sm font-semibold text-black">
                    150 Dreamcoin
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/60 backdrop-blur-sm rounded-xl p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-semibold">Luna Starr</h3>
                          <p className="text-white/60 text-sm">Art Gallery & Wine Night</p>
                        </div>
                        <div className="flex items-center gap-1 text-[#FFB800]">
                          <span className="text-lg font-bold">4.8</span>
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Bid Animation */}
                <div className="mt-4 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-green-400 text-sm font-medium">Live Bidding</span>
                    </div>
                    <div className="text-white font-bold">
                      <span className="text-[#FFB800]">175</span> Dreamcoin
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-[#1a0f2e]" />
                      ))}
                    </div>
                    <span className="text-white/50 text-xs">3 bidders competing</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Token Animation */}
            <div className="absolute -top-4 -right-4 animate-bounce">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FFB800] to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-[#FFB800]/30">
                <TokenIcon className="text-black" size={32} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#0d0618"/>
        </svg>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
