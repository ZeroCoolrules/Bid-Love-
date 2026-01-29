import React, { useState } from 'react';
import { Venue } from '@/types';
import { MapPinIcon, TokenIcon, StarIcon, CalendarIcon, UserIcon } from './ui/Icons';

interface VirtualWorldProps {
  venues: Venue[];
  onSelectVenue: (venue: Venue) => void;
}

const VirtualWorld: React.FC<VirtualWorldProps> = ({ venues, onSelectVenue }) => {
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [hoveredVenue, setHoveredVenue] = useState<string | null>(null);

  const areas = ['all', 'Downtown', 'Uptown', 'Midtown', 'Eastside', 'Residential'];

  const filteredVenues = selectedArea === 'all' 
    ? venues 
    : venues.filter(v => v.location_area === selectedArea);

  const venueTypeIcons: Record<string, string> = {
    club: '🎵',
    restaurant: '🍽️',
    cafe: '☕',
    park: '🌳',
    rooftop: '🌃',
    home: '🏠',
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Virtual World Map</h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Explore venues in your virtual city. Each location offers unique date experiences and ambiance settings.
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
              {area === 'all' ? 'All Areas' : area}
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

          {/* Venue Cards Grid */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVenues.map((venue) => (
              <div
                key={venue.id}
                onMouseEnter={() => setHoveredVenue(venue.id)}
                onMouseLeave={() => setHoveredVenue(null)}
                onClick={() => onSelectVenue(venue)}
                className={`group relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden cursor-pointer transition-all duration-300 ${
                  hoveredVenue === venue.id ? 'scale-105 border-[#00D9FF]/50 shadow-xl shadow-[#00D9FF]/20' : ''
                }`}
              >
                {/* Venue Image */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={venue.image_url}
                    alt={venue.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  
                  {/* Venue Type Badge */}
                  <div className="absolute top-3 left-3 px-3 py-1 bg-black/40 backdrop-blur-sm rounded-full text-sm">
                    <span className="mr-1">{venueTypeIcons[venue.venue_type] || '📍'}</span>
                    <span className="text-white/80 capitalize">{venue.venue_type}</span>
                  </div>

                  {/* Token Cost */}
                  {venue.token_cost > 0 && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-[#FFB800]/20 backdrop-blur-sm rounded-full">
                      <TokenIcon className="text-[#FFB800]" size={14} />
                      <span className="text-[#FFB800] text-sm font-bold">{venue.token_cost}</span>
                    </div>
                  )}
                </div>

                {/* Venue Info */}
                <div className="p-4">
                  <h3 className="text-white font-semibold text-lg mb-1">{venue.name}</h3>
                  <div className="flex items-center gap-2 text-white/50 text-sm mb-2">
                    <MapPinIcon size={14} />
                    <span>{venue.location_area}</span>
                  </div>
                  <p className="text-white/60 text-sm line-clamp-2">{venue.description}</p>

                  {/* Ambiance */}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-white/60 capitalize">
                      {venue.ambiance} vibe
                    </span>
                    <div className="flex items-center gap-1 text-white/40 text-xs">
                      <UserIcon size={12} />
                      <span>{Math.floor(Math.random() * 50) + 10} active</span>
                    </div>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-[#00D9FF]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredVenues.length === 0 && (
            <div className="text-center py-16">
              <MapPinIcon className="mx-auto text-white/20 mb-4" size={48} />
              <h3 className="text-xl font-semibold text-white mb-2">No venues in this area</h3>
              <p className="text-white/60">Try selecting a different area</p>
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
      </div>
    </section>
  );
};

export default VirtualWorld;
