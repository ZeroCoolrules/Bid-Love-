import React, { useState, useMemo } from 'react';
import { DateListing, Character } from '@/types';
import DateListingCard from './DateListingCard';
import { SearchIcon, FilterIcon, FireIcon, HeartIcon, CrownIcon, TrendingUpIcon } from './ui/Icons';

interface MarketplaceProps {
  listings: DateListing[];
  onBid: (listing: DateListing) => void;
  onViewProfile: (character: Character) => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ listings, onBid, onViewProfile }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);

  const tiers = [
    { id: 'all', label: 'All Types', icon: null },
    { id: 'hookup', label: 'Hookup', icon: FireIcon, color: 'text-pink-400' },
    { id: 'casual', label: 'Casual', icon: HeartIcon, color: 'text-blue-400' },
    { id: 'relationship', label: 'Relationship', icon: CrownIcon, color: 'text-purple-400' },
  ];

  const filteredListings = useMemo(() => {
    // First filter out listings without valid datee
    let filtered = listings.filter(listing => listing.datee && listing.datee.avatar_url);

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(listing => 
        listing.title?.toLowerCase().includes(query) ||
        listing.description?.toLowerCase().includes(query) ||
        listing.datee?.name?.toLowerCase().includes(query) ||
        listing.datee?.location?.toLowerCase().includes(query)
      );
    }

    // Tier filter
    if (selectedTier !== 'all') {
      filtered = filtered.filter(listing => listing.dating_tier === selectedTier);
    }

    // Price filter
    filtered = filtered.filter(listing => 
      listing.token_ask >= priceRange[0] && listing.token_ask <= priceRange[1]
    );

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.token_ask - b.token_ask);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.token_ask - a.token_ask);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.datee?.reputation_score || 0) - (a.datee?.reputation_score || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      default:
        // Popular - by reputation
        filtered.sort((a, b) => (b.datee?.reputation_score || 0) - (a.datee?.reputation_score || 0));
    }

    return filtered;
  }, [listings, searchQuery, selectedTier, sortBy, priceRange]);

  // Count only valid listings
  const validListingsCount = listings.filter(l => l.datee && l.datee.avatar_url).length;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Dating Marketplace</h2>
            <p className="text-white/60">Browse available dates and place your bids</p>
          </div>
          <div className="flex items-center gap-2 text-white/60">
            <TrendingUpIcon className="text-green-400" size={20} />
            <span className="text-sm">{validListingsCount} active listings</span>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
              <input
                type="text"
                placeholder="Search by name, location, or interests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#00D9FF]/50 transition-colors"
              />
            </div>

            {/* Tier Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
              {tiers.map((tier) => {
                const Icon = tier.icon;
                return (
                  <button
                    key={tier.id}
                    onClick={() => setSelectedTier(tier.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
                      selectedTier === tier.id
                        ? 'bg-white/10 border-white/20 text-white'
                        : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                    } border`}
                  >
                    {Icon && <Icon size={16} className={tier.color} />}
                    <span className="text-sm font-medium">{tier.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none w-full lg:w-auto px-4 py-3 pr-10 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00D9FF]/50 cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
              <FilterIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" size={18} />
            </div>
          </div>

          {/* Price Range */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/60">Dream Coin Range</span>
              <span className="text-sm text-white font-medium">
                {priceRange[0]} - {priceRange[1]} Dream Coin
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="500"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00D9FF]"
            />
          </div>
        </div>

        {/* Results */}
        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map((listing) => (
              <DateListingCard
                key={listing.id}
                listing={listing}
                datee={listing.datee}
                onBid={onBid}
                onViewProfile={onViewProfile}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
              <SearchIcon className="text-white/30" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No listings found</h3>
            <p className="text-white/60">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Marketplace;
