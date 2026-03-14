import React from 'react';
import { PlayIcon, SparklesIcon, HeartIcon, TokenIcon, MessageIcon } from './ui/Icons';

const StreamingSection: React.FC = () => {
  const highlights = [
    {
      icon: SparklesIcon,
      title: 'Cinematic Date Streams',
      description: 'Launch HD video dates with synchronized ambiance, scene prompts, and dynamic overlays.',
    },
    {
      icon: PlayIcon,
      title: '1:1 Virtual Rooms',
      description: 'Open private video rooms for focused one-on-one dates with guided prompts.',
    },
    {
      icon: HeartIcon,
      title: 'Group Lounge Rooms',
      description: 'Invite multiple members into a shared room with moderated turns and spotlight controls.',
    },
    {
      icon: MessageIcon,
      title: 'Interactive Reactions',
      description: 'Drop live reactions, send curated prompts, and share private notes in real time.',
    },
    {
      icon: TokenIcon,
      title: 'Dream Coin Rewards',
      description: 'Earn Dream Coin for completed streams and redeem perks across the whole network.',
    },
    {
      icon: SparklesIcon,
      title: 'Profile Spotlights',
      description: 'Showcase saved profiles with traits, interests, and compatibility cues during the stream.',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-[#0d0618] to-[#1a0f2e]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-white/5 rounded-full text-pink-400 text-sm font-medium mb-4">
            Streaming Redesign
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Immersive Video Dates,
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D9FF] to-[#FFB800]"> Reimagined</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            Host cinematic streams with 1:1 and group virtual rooms, plus saved profile highlights for every attendee.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Video Preview */}
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-40 h-40 bg-[#00D9FF]/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-[#FFB800]/20 rounded-full blur-3xl" />
            <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden">
              <div className="relative aspect-video bg-gradient-to-br from-[#1a0f2e] to-[#0d0618]">
                <img
                  src="https://d64gsuwffb70l.cloudfront.net/693e8a400a804c87e7c5fefc_1765730925050_862efd2b.png"
                  alt="Live date stream preview"
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0618] via-[#0d0618]/40 to-transparent" />
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white/80">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  Live Date Stream
                </div>
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white/80">
                  Dream Coin Tips Enabled
                </div>
                <button className="absolute inset-0 m-auto w-16 h-16 bg-white/20 hover:bg-white/30 transition-colors rounded-full flex items-center justify-center">
                  <PlayIcon className="text-white" size={28} />
                </button>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white/80 text-sm">
                  <span>Serenity Rooftop • 24 min</span>
                  <span>12 reactions</span>
                </div>
              </div>

              <div className="p-6 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-semibold">Dual-Host Stream Studio</h3>
                    <p className="text-white/50 text-sm">Shared overlays, synced ambiance, and Dream Coin cues.</p>
                  </div>
                  <span className="px-3 py-1 bg-[#00D9FF]/20 text-[#00D9FF] text-xs font-semibold rounded-full">
                    Beta
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature List */}
          <div>
            <div className="space-y-6">
              {highlights.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                      <Icon className="text-[#FFB800]" size={22} />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                      <p className="text-white/60 text-sm">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <button className="px-6 py-3 bg-gradient-to-r from-[#00D9FF] to-[#00a8cc] rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-[#00D9FF]/25 transition-all">
                Explore Streaming
              </button>
              <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white/80 hover:bg-white/10 transition-colors">
                Book a Guided Session
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StreamingSection;
