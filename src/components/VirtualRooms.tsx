import React, { useMemo, useState } from 'react';
import { Character } from '@/types';
import { CalendarIcon, MessageIcon, PlayIcon, SparklesIcon, UserIcon } from './ui/Icons';

interface VirtualRoomsProps {
  characters: Character[];
  onOpenProfile: (character: Character) => void;
}

type RoomMode = '1:1' | 'Group';

interface VirtualRoom {
  id: string;
  name: string;
  mode: RoomMode;
  host: Character;
  participants: Character[];
  topic: string;
  status: 'Live' | 'Starting Soon' | 'Scheduled';
  scheduledTime: string;
}

const VirtualRooms: React.FC<VirtualRoomsProps> = ({ characters, onOpenProfile }) => {
  const [activeMode, setActiveMode] = useState<RoomMode | 'All'>('All');

  const rooms = useMemo<VirtualRoom[]>(() => {
    if (characters.length === 0) return [];
    const [first, second, third, fourth, fifth, sixth] = characters;

    return [
      {
        id: 'room-1',
        name: 'Neon Skyline One-on-One',
        mode: '1:1',
        host: first,
        participants: [first, second].filter(Boolean) as Character[],
        topic: 'Rapid-fire questions + shared playlist',
        status: 'Live',
        scheduledTime: 'Now',
      },
      {
        id: 'room-2',
        name: 'Midnight Lounge Panel',
        mode: 'Group',
        host: third || first,
        participants: [third, fourth, fifth].filter(Boolean) as Character[],
        topic: 'Group mingle with icebreaker rounds',
        status: 'Starting Soon',
        scheduledTime: 'In 12 minutes',
      },
      {
        id: 'room-3',
        name: 'Coffeehouse Co-Op',
        mode: 'Group',
        host: second || first,
        participants: [second, first, sixth].filter(Boolean) as Character[],
        topic: 'Casual check-ins + shared journaling prompts',
        status: 'Scheduled',
        scheduledTime: 'Tonight 8:30 PM',
      },
      {
        id: 'room-4',
        name: 'Private Rooftop Date',
        mode: '1:1',
        host: fifth || first,
        participants: [fifth, sixth].filter(Boolean) as Character[],
        topic: 'One-on-one with mood lighting + token tips',
        status: 'Scheduled',
        scheduledTime: 'Tomorrow 6:00 PM',
      },
    ];
  }, [characters]);

  const filteredRooms = rooms.filter((room) => activeMode === 'All' || room.mode === activeMode);

  return (
    <section className="py-16 bg-gradient-to-b from-[#0d0618] to-[#120827]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-12">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-pink-400 text-sm font-medium mb-4">
              <SparklesIcon size={16} />
              Virtual Rooms Live
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Video streaming rooms for one-on-one and group dates
            </h2>
            <p className="text-white/60 max-w-2xl">
              Launch private rooms, invite a match, or join a curated group session. Every room includes HD video,
              chat reactions, and shared prompts to keep the conversation moving.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {(['All', '1:1', 'Group'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setActiveMode(mode)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all border ${
                  activeMode === mode
                    ? 'bg-gradient-to-r from-[#00D9FF] to-[#00a8cc] text-white border-transparent'
                    : 'bg-white/5 text-white/60 border-white/10 hover:text-white hover:bg-white/10'
                }`}
              >
                {mode === '1:1' ? 'One-on-One' : mode}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-10">
          <div className="space-y-6">
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FFB800]/20 text-[#FFB800]">
                      {room.mode === '1:1' ? 'One-on-One' : 'Group Room'}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/70">
                      {room.status}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-white/50">
                      <CalendarIcon size={14} />
                      {room.scheduledTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{room.name}</h3>
                  <p className="text-white/60 text-sm mb-4">{room.topic}</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex -space-x-2">
                      {room.participants.map((member) => (
                        <button
                          key={member.id}
                          onClick={() => onOpenProfile(member)}
                          className="relative"
                        >
                          <img
                            src={member.avatar_url}
                            alt={member.name}
                            className="w-9 h-9 rounded-full border-2 border-[#0d0618] object-cover"
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-white/50 text-sm">
                      Hosted by <span className="text-white/80">{room.host?.name || 'Bid Love'}</span>
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-3 min-w-[180px]">
                  <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00D9FF] to-[#00a8cc] text-white font-semibold">
                    <PlayIcon size={16} />
                    Join Room
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10">
                    <MessageIcon size={16} />
                    Send Intro
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Start a virtual room</h3>
              <p className="text-white/60 text-sm mb-5">
                Open a private stream in seconds or schedule a group room to meet multiple members at once.
              </p>
              <div className="space-y-3">
                {[
                  { label: 'Start 1:1 Room', description: 'Invite one person to a private video date.' },
                  { label: 'Create Group Room', description: 'Host up to 8 members with structured prompts.' },
                ].map((action) => (
                  <button
                    key={action.label}
                    className="w-full text-left px-4 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#00D9FF]/20 rounded-xl flex items-center justify-center">
                        <UserIcon className="text-[#00D9FF]" size={20} />
                      </div>
                      <div>
                        <p className="text-white font-semibold">{action.label}</p>
                        <p className="text-white/50 text-sm">{action.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1a0f2e] to-[#0d0618] border border-white/10 rounded-3xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Room experience tools</h3>
              <ul className="space-y-3 text-sm text-white/60">
                <li className="flex items-center gap-2">
                  <PlayIcon size={14} className="text-[#FFB800]" />
                  HD video streaming with adaptive lighting presets.
                </li>
                <li className="flex items-center gap-2">
                  <MessageIcon size={14} className="text-[#FFB800]" />
                  Shared prompts, polls, and private side chat.
                </li>
                <li className="flex items-center gap-2">
                  <UserIcon size={14} className="text-[#FFB800]" />
                  Spotlight guests to keep the conversation balanced.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VirtualRooms;
