import React, { useState } from 'react';
import { Character, Venue } from '@/types';
import { MapPinIcon, TokenIcon, UserIcon, PlayIcon, MessageIcon, HeartIcon } from './ui/Icons';

interface VirtualWorldProps {
  venues: Venue[];
  onSelectVenue: (venue: Venue) => void;
  members: Character[];
  onViewProfile: (character: Character) => void;
}

const VirtualWorld: React.FC<VirtualWorldProps> = ({ venues, onSelectVenue, members, onViewProfile }) => {
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [hoveredVenue, setHoveredVenue] = useState<string | null>(null);
  const [savedProfiles, setSavedProfiles] = useState<Set<string>>(() => new Set());

  const areas = ['all', '1:1', 'Group', 'Spotlight', 'After-hours'];

  const getRoomType = (venue: Venue) => {
    const ambiance = venue.ambiance?.toLowerCase() || '';
    if (ambiance.includes('intimate') || ambiance.includes('romantic')) {
      return '1:1';
    }
    if (ambiance.includes('energetic') || ambiance.includes('party')) {
      return 'Group';
    }
    if (venue.token_cost >= 100) {
      return 'Spotlight';
    }
    return 'After-hours';
  };

  const filteredVenues = selectedArea === 'all' 
    ? venues 
    : venues.filter(v => getRoomType(v) === selectedArea);

  const getRoomStats = (venue: Venue) => {
    const roomType = getRoomType(venue);
    const capacity = roomType === '1:1' ? 2 : roomType === 'Group' ? 10 : 6;
    const liveCount = roomType === 'Spotlight' ? 120 : roomType === 'Group' ? 48 : 12;
    return {
      roomType,
      capacity,
      liveCount,
      reactions: Math.floor(venue.token_cost / 5) + 18
    };
  };

  const venueTypeIcons: Record<string, string> = {
    club: '🎵',
    restaurant: '🍽️',
    cafe: '☕',
    park: '🌳',
    rooftop: '🌃',
    home: '🏠',
  };

  const handleSaveProfile = (characterId: string) => {
    setSavedProfiles(prev => {
      const next = new Set(prev);
      if (next.has(characterId)) {
        next.delete(characterId);
      } else {
        next.add(characterId);
      }
      return next;
    });
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Virtual Rooms: Live Video Streaming</h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Step into real-time video rooms designed for one-on-one dates or group hangouts. Host, join, and co-watch streams while keeping profiles visible.
          </p>
        </div>

        {/* Area Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {areas.map(area => (
            <button
              key={area}
              onClick={() => setSelectedArea(area)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedArea === area
                  ? 'bg-gradient-to-r from-[#00D9FF] to-[#00a8cc] text-white'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              {area === 'all' ? 'All Rooms' : area}
            </button>
          ))}
        </div>

        {/* Map Visualization */}
        <div className="relative bg-gradient-to-br from-[#1a0f2e] to-[#0d0618] rounded-3xl border border-white/10 p-8 min-h-[500px] overflow-hidden">
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: `
                linear-gradient(rgba(0, 217, 255, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 217, 255, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }} />
          </div>

          {/* Room Cards Grid */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVenues.map((venue) => {
              const roomStats = getRoomStats(venue);
              return (
                <div
                  key={venue.id}
                  onMouseEnter={() => setHoveredVenue(venue.id)}
                  onMouseLeave={() => setHoveredVenue(null)}
                  onClick={() => onSelectVenue(venue)}
                  className={`group relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden cursor-pointer transition-all duration-300 ${
                    hoveredVenue === venue.id ? 'scale-105 border-[#00D9FF]/50 shadow-xl shadow-[#00D9FF]/20' : ''
                  }`}
                >
                  {/* Room Image */}
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={venue.image_url}
                      alt={venue.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    
                    {/* Room Type Badge */}
                    <div className="absolute top-3 left-3 px-3 py-1 bg-black/40 backdrop-blur-sm rounded-full text-sm">
                      <span className="mr-1">{venueTypeIcons[venue.venue_type] || '🎥'}</span>
                      <span className="text-white/80 capitalize">{roomStats.roomType} room</span>
                    </div>

                    {/* Token Cost */}
                    {venue.token_cost > 0 && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-[#FFB800]/20 backdrop-blur-sm rounded-full">
                        <TokenIcon className="text-[#FFB800]" size={14} />
                        <span className="text-[#FFB800] text-sm font-bold">{venue.token_cost}</span>
                      </div>
                    )}

                    <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs text-white/70 bg-black/40 px-2 py-1 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      Live now • {roomStats.liveCount} viewers
                    </div>
                  </div>

                  {/* Room Info */}
                  <div className="p-4">
                    <h3 className="text-white font-semibold text-lg mb-1">{venue.name}</h3>
                    <div className="flex items-center gap-2 text-white/50 text-sm mb-2">
                      <MapPinIcon size={14} />
                      <span>{venue.location_area}</span>
                    </div>
                    <p className="text-white/60 text-sm line-clamp-2">{venue.description}</p>

                    {/* Room Details */}
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/50">
                      <span className="px-3 py-1 bg-white/5 rounded-full text-white/60 capitalize">
                        {venue.ambiance} vibe
                      </span>
                      <span className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full">
                        <UserIcon size={12} />
                        {roomStats.capacity} seats
                      </span>
                      <span className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full">
                        <MessageIcon size={12} />
                        {roomStats.reactions} chats
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <button className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#00D9FF] to-[#00a8cc] rounded-lg text-white text-sm font-semibold">
                        <PlayIcon size={14} />
                        Open Room
                      </button>
                      <div className="flex items-center gap-1 text-white/40 text-xs">
                        <HeartIcon size={12} />
                        {roomStats.reactions + 7} reactions
                      </div>
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-[#00D9FF]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredVenues.length === 0 && (
            <div className="text-center py-16">
              <MapPinIcon className="mx-auto text-white/20 mb-4" size={48} />
              <h3 className="text-xl font-semibold text-white mb-2">No rooms in this category</h3>
              <p className="text-white/60">Try selecting a different room type</p>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap justify-center gap-6">
          {Object.entries(venueTypeIcons).map(([type, icon]) => (
            <div key={type} className="flex items-center gap-2 text-white/60 text-sm">
              <span>{icon}</span>
              <span className="capitalize">{type}</span>
            </div>
          ))}
        </div>

        {/* Member Profiles */}
        <div className="mt-14">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-white mb-3">Member Profiles & Characteristics</h3>
            <p className="text-white/60 max-w-2xl mx-auto">
              Save profiles you want to reconnect with. Each profile highlights key characteristics so other members can review them at a glance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.slice(0, 6).map((member) => {
              const isSaved = savedProfiles.has(member.id);
              return (
                <div key={member.id} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
                  <div className="relative h-40">
                    <img
                      src={member.avatar_url || '/placeholder.svg'}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0618] to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <h4 className="text-white text-lg font-semibold">{member.name}</h4>
                      <p className="text-white/60 text-sm">{member.location} • {member.age} yrs</p>
                    </div>
                  </div>

                  <div className="p-4">
                    <p className="text-white/60 text-sm mb-4 line-clamp-2">{member.bio}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {member.personality_traits.slice(0, 3).map((trait) => (
                        <span
                          key={trait}
                          className="px-3 py-1 bg-[#00D9FF]/15 text-[#00D9FF] rounded-full text-xs border border-[#00D9FF]/30"
                        >
                          {trait}
                        </span>
                      ))}
                      {member.personality_traits.length > 3 && (
                        <span className="px-3 py-1 bg-white/5 text-white/50 rounded-full text-xs border border-white/10">
                          +{member.personality_traits.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {member.interests.slice(0, 3).map((interest) => (
                        <span key={interest} className="px-3 py-1 bg-white/5 text-white/60 rounded-full text-xs border border-white/10">
                          {interest}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => onViewProfile(member)}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/80 text-sm hover:bg-white/10 transition-colors"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => handleSaveProfile(member.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                          isSaved
                            ? 'bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/40'
                            : 'bg-gradient-to-r from-[#00D9FF] to-[#00a8cc] text-white'
                        }`}
                      >
                        {isSaved ? 'Saved' : 'Save Profile'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VirtualWorld;
