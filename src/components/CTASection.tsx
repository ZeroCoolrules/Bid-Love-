import React from 'react';
import { TokenIcon, HeartIcon, ArrowRightIcon } from './ui/Icons';

interface CTASectionProps {
  onGetStarted: () => void;
}

const CTASection: React.FC<CTASectionProps> = ({ onGetStarted }) => {
  return (
    <section className="py-20 bg-gradient-to-b from-[#0d0618] to-[#1a0f2e] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-[#00D9FF]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#FFB800]/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00D9FF]/20 to-[#FFB800]/20 rounded-full border border-white/10 mb-8">
            <HeartIcon className="text-pink-500" size={18} />
            <span className="text-white/80 text-sm">Join 50,000+ users finding love</span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to Transform Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D9FF] to-[#FFB800]"> Dating Life?</span>
          </h2>

          {/* Description */}
          <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto">
            Create your character, earn Dream Coin, and discover meaningful connections in our unified dating world.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={onGetStarted}
              className="group px-8 py-4 bg-gradient-to-r from-[#00D9FF] to-[#00a8cc] rounded-xl font-bold text-white text-lg shadow-lg shadow-[#00D9FF]/25 hover:shadow-[#00D9FF]/40 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            >
              Get Started Free
              <ArrowRightIcon className="group-hover:translate-x-1 transition-transform" size={20} />
            </button>
            <button className="px-8 py-4 bg-white/5 border border-white/20 rounded-xl font-semibold text-white text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              <TokenIcon className="text-[#FFB800]" size={20} />
              Get 500 Free Dream Coin
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-8 text-white/40 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span>4.9 Star Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <span>50K+ Active Users</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
