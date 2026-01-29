import React from 'react';
import { PlayIcon, MessageIcon, TokenIcon, HeartIcon, SparklesIcon } from './ui/Icons';

const StreamingSection: React.FC = () => {
  const highlights = [
    {
      title: 'ClimaxCoordinator overlays',
      description: 'Consent check-ins, schedules, and aftercare prompts sync live during every session.',
      icon: SparklesIcon,
    },
    {
      title: 'Dreamcoin tipping',
      description: 'Reward standout moments instantly with Dreamcoin tips and milestone boosters.',
      icon: TokenIcon,
    },
    {
      title: 'Private chat + reactions',
      description: 'Real-time whispers, emoji bursts, and curated icebreakers keep the vibe flowing.',
      icon: MessageIcon,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-[#1a0f2e] to-[#0d0618]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-pink-300 text-sm font-medium mb-4">
            <PlayIcon className="text-pink-300" size={16} />
            Live Streaming Experience
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            A Redesigned Video Lounge
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            Premium streaming built for romantic storytelling, synchronized with DatingPro profiles and ClimaxCoordinator workflows.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-pink-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[#00D9FF]/20 rounded-full blur-3xl" />

            <div className="relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
              <div className="relative h-80">
                <img
                  src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80"
                  alt="Streaming preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0618] via-transparent to-transparent" />
                <div className="absolute top-5 left-5 flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-white text-xs font-semibold">LIVE</span>
                </div>
                <div className="absolute top-5 right-5 flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full">
                  <HeartIcon className="text-pink-400" size={14} />
                  <span className="text-white text-xs">1.8k reactions</span>
                </div>
                <button className="absolute inset-0 flex items-center justify-center">
                  <span className="w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm flex items-center justify-center">
                    <PlayIcon className="text-white" size={28} />
                  </span>
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white text-xl font-semibold">Rooftop Stars & Stories</h3>
                    <p className="text-white/60 text-sm">Hosted by Luna & Marcus • Downtown Lounge</p>
                  </div>
                  <div className="px-3 py-1 bg-[#FFB800]/20 text-[#FFB800] text-xs font-semibold rounded-full">
                    Dreamcoin perks enabled
                  </div>
                </div>
                <div className="flex items-center justify-between text-white/60 text-sm">
                  <span>Next moment: 02:14</span>
                  <span>Exclusive for DatingPro members</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex gap-4 bg-white/5 border border-white/10 rounded-2xl p-5"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#00D9FF] to-[#FFB800] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="text-white" size={22} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                    <p className="text-white/60 text-sm">{item.description}</p>
                  </div>
                </div>
              );
            })}

            <div className="bg-gradient-to-r from-[#00D9FF]/10 to-[#FFB800]/10 border border-white/10 rounded-2xl p-6">
              <h3 className="text-white text-lg font-semibold mb-2">Streaming with purpose</h3>
              <p className="text-white/60 text-sm mb-4">
                Every stream feeds the Bid Love journey with curated highlights, compatibility insights, and post-date notes.
              </p>
              <button className="px-6 py-3 bg-gradient-to-r from-[#FFB800] to-orange-500 rounded-xl text-black font-bold hover:shadow-lg hover:shadow-[#FFB800]/25 transition-all">
                Launch streaming dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StreamingSection;
