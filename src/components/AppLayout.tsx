import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Character, DateListing, Venue } from '@/types';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import HowItWorks from './HowItWorks';
import UnifiedNetworkSection from './UnifiedNetworkSection';
import StreamingSection from './StreamingSection';
import TestimonialsSection from './TestimonialsSection';
import TokenExplainer from './TokenExplainer';
import CTASection from './CTASection';
import Marketplace from './Marketplace';
import VirtualWorld from './VirtualWorld';
import TokenWallet from './TokenWallet';
import Analytics from './Analytics';
import CharacterBuilder from './CharacterBuilder';
import BidModal from './BidModal';
import ProfileModal from './ProfileModal';
import AuthModal from './AuthModal';
import TokenPurchaseModal from './TokenPurchaseModal';
import CashoutModal from './CashoutModal';
import DateSession from './DateSession';
import MyDates from './MyDates';
import Footer from './Footer';

// Mock data for when database is empty
const mockCharacters: Character[] = [
  {
    id: '1',
    name: 'Sophia Chen',
    avatar_url: 'https://d64gsuwffb70l.cloudfront.net/693e8a400a804c87e7c5fefc_1765730923193_eb94756c.png',
    bio: 'Adventure seeker and coffee enthusiast. Looking for someone to explore the city with!',
    age: 26,
    location: 'San Francisco, CA',
    dating_tier: 'relationship',
    personality_traits: ['Adventurous', 'Creative', 'Empathetic'],
    interests: ['Travel', 'Photography', 'Hiking', 'Coffee'],
    token_ask: 150,
    token_balance: 500,
    reputation_score: 4.8,
    total_dates: 12,
    successful_dates: 10,
    is_datee: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Emma Williams',
    avatar_url: 'https://d64gsuwffb70l.cloudfront.net/693e8a400a804c87e7c5fefc_1765730925050_862efd2b.png',
    bio: 'Yoga instructor by day, foodie by night. Let\'s find the best tacos in town!',
    age: 24,
    location: 'Los Angeles, CA',
    dating_tier: 'casual',
    personality_traits: ['Calm', 'Friendly', 'Health-conscious'],
    interests: ['Yoga', 'Food', 'Wellness', 'Music'],
    token_ask: 100,
    token_balance: 350,
    reputation_score: 4.6,
    total_dates: 8,
    successful_dates: 7,
    is_datee: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Olivia Martinez',
    avatar_url: 'https://d64gsuwffb70l.cloudfront.net/693e8a400a804c87e7c5fefc_1765730935261_f57947dc.png',
    bio: 'Art lover and museum hopper. Looking for intellectual conversations and good vibes.',
    age: 28,
    location: 'New York, NY',
    dating_tier: 'relationship',
    personality_traits: ['Intellectual', 'Artistic', 'Passionate'],
    interests: ['Art', 'Museums', 'Wine', 'Books'],
    token_ask: 200,
    token_balance: 600,
    reputation_score: 4.9,
    total_dates: 15,
    successful_dates: 14,
    is_datee: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Ava Johnson',
    avatar_url: 'https://d64gsuwffb70l.cloudfront.net/693e8a400a804c87e7c5fefc_1765730920586_c2a95697.jpg',
    bio: 'Tech startup founder who loves dancing. Let\'s hit the club and talk about AI!',
    age: 27,
    location: 'Austin, TX',
    dating_tier: 'hookup',
    personality_traits: ['Ambitious', 'Fun', 'Tech-savvy'],
    interests: ['Dancing', 'Tech', 'Startups', 'Nightlife'],
    token_ask: 120,
    token_balance: 800,
    reputation_score: 4.5,
    total_dates: 20,
    successful_dates: 16,
    is_datee: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    name: 'James Anderson',
    avatar_url: 'https://d64gsuwffb70l.cloudfront.net/693e8a400a804c87e7c5fefc_1765730954606_aec0fc6c.jpg',
    bio: 'Fitness coach and outdoor enthusiast. Looking for someone to share adventures with.',
    age: 29,
    location: 'Denver, CO',
    dating_tier: 'relationship',
    personality_traits: ['Athletic', 'Motivated', 'Caring'],
    interests: ['Fitness', 'Hiking', 'Skiing', 'Cooking'],
    token_ask: 180,
    token_balance: 450,
    reputation_score: 4.7,
    total_dates: 10,
    successful_dates: 8,
    is_datee: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Michael Chen',
    avatar_url: 'https://d64gsuwffb70l.cloudfront.net/693e8a400a804c87e7c5fefc_1765730959361_e308c73b.png',
    bio: 'Software engineer who loves gaming and anime. Looking for my player 2!',
    age: 25,
    location: 'Seattle, WA',
    dating_tier: 'casual',
    personality_traits: ['Geeky', 'Loyal', 'Funny'],
    interests: ['Gaming', 'Anime', 'Coding', 'Board Games'],
    token_ask: 90,
    token_balance: 700,
    reputation_score: 4.4,
    total_dates: 6,
    successful_dates: 5,
    is_datee: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '7',
    name: 'David Thompson',
    avatar_url: 'https://d64gsuwffb70l.cloudfront.net/693e8a400a804c87e7c5fefc_1765730962726_19145821.png',
    bio: 'Chef and wine connoisseur. Let me cook you dinner and sweep you off your feet.',
    age: 31,
    location: 'Chicago, IL',
    dating_tier: 'relationship',
    personality_traits: ['Romantic', 'Cultured', 'Generous'],
    interests: ['Cooking', 'Wine', 'Fine Dining', 'Travel'],
    token_ask: 250,
    token_balance: 550,
    reputation_score: 4.9,
    total_dates: 18,
    successful_dates: 17,
    is_datee: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '8',
    name: 'Alex Rivera',
    avatar_url: 'https://d64gsuwffb70l.cloudfront.net/693e8a400a804c87e7c5fefc_1765730957028_a41462ee.jpg',
    bio: 'DJ and music producer. Let\'s vibe to some beats and see where the night takes us.',
    age: 26,
    location: 'Miami, FL',
    dating_tier: 'hookup',
    personality_traits: ['Creative', 'Energetic', 'Spontaneous'],
    interests: ['Music', 'DJing', 'Beach', 'Parties'],
    token_ask: 110,
    token_balance: 400,
    reputation_score: 4.3,
    total_dates: 25,
    successful_dates: 19,
    is_datee: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const mockDateListings: DateListing[] = mockCharacters.map((char, index) => ({
  id: `listing-${index + 1}`,
  datee_id: char.id,
  datee: char,
  title: index % 3 === 0 ? 'Looking for a Fun Night Out' : index % 3 === 1 ? 'Seeking Meaningful Connection' : 'Adventure Partner Wanted',
  description: `${char.bio} Ready to meet someone special who shares my interests.`,
  dating_tier: char.dating_tier,
  token_ask: char.token_ask,
  preferred_activities: char.interests.slice(0, 3),
  date_scenario: {
    steps: [],
    current_step: 0
  },
  venue_preference: index % 2 === 0 ? 'Restaurant' : 'Bar',
  status: 'active',
  created_at: new Date().toISOString()
}));

const mockVenues: Venue[] = [
  {
    id: 'v1',
    name: 'The Rooftop Lounge',
    venue_type: 'Bar',
    description: 'Upscale rooftop bar with stunning city views',
    image_url: '/placeholder.svg',
    ambiance: 'Romantic',
    token_cost: 50,
    location_area: 'Downtown',
    created_at: new Date().toISOString()
  },
  {
    id: 'v2',
    name: 'Bella Italia',
    venue_type: 'Restaurant',
    description: 'Authentic Italian cuisine in a cozy setting',
    image_url: '/placeholder.svg',
    ambiance: 'Intimate',
    token_cost: 75,
    location_area: 'Little Italy',
    created_at: new Date().toISOString()
  },
  {
    id: 'v3',
    name: 'Club Neon',
    venue_type: 'Club',
    description: 'High-energy nightclub with top DJs',
    image_url: '/placeholder.svg',
    ambiance: 'Energetic',
    token_cost: 100,
    location_area: 'Entertainment District',
    created_at: new Date().toISOString()
  }
];

const AppLayout: React.FC = () => {
  const { user } = useAuth();
  
  // State
  const [activeView, setActiveView] = useState<string>('home');
  const [currentCharacter, setCurrentCharacter] = useState<Character | null>(null);
  const [tokenBalance, setTokenBalance] = useState(500);
  const [characters, setCharacters] = useState<Character[]>(mockCharacters);
  const [dateListings, setDateListings] = useState<DateListing[]>(mockDateListings);
  const [venues, setVenues] = useState<Venue[]>(mockVenues);
  
  // Modal states
  const [showCharacterBuilder, setShowCharacterBuilder] = useState(false);
  const [selectedListing, setSelectedListing] = useState<DateListing | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<Character | null>(null);
  const [showBidModal, setShowBidModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showTokenPurchaseModal, setShowTokenPurchaseModal] = useState(false);
  const [showCashoutModal, setShowCashoutModal] = useState(false);
  
  // Date session states
  const [activeDateSessionId, setActiveDateSessionId] = useState<string | null>(null);

  // Fetch data on mount and when user changes
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch user's character when authenticated
  useEffect(() => {
    if (user) {
      fetchUserCharacter();
    } else {
      setCurrentCharacter(null);
    }
  }, [user]);

  const fetchUserCharacter = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (data && !error) {
        setCurrentCharacter(data);
        setTokenBalance(data.token_balance || 500);
      }
    } catch (error) {
      console.error('Error fetching user character:', error);
    }
  };

  const fetchData = async () => {
    try {
      // Fetch characters
      const { data: charactersData } = await supabase
        .from('characters')
        .select('*')
        .eq('is_datee', true);
      if (charactersData && charactersData.length > 0) {
        setCharacters(charactersData);
      }

      // Fetch date listings with datee info
      const { data: listingsData } = await supabase
        .from('date_listings')
        .select('*, datee:characters(*)')
        .eq('status', 'active');
      if (listingsData && listingsData.length > 0) {
        // Filter out listings without valid datee
        const validListings = listingsData.filter(l => l.datee && l.datee.avatar_url);
        if (validListings.length > 0) {
          setDateListings(validListings);
        }
      }

      // Fetch venues
      const { data: venuesData } = await supabase
        .from('venues')
        .select('*');
      if (venuesData && venuesData.length > 0) {
        setVenues(venuesData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Keep using mock data on error
    }
  };


  // Handlers
  const handleNavigate = (view: string) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateCharacter = async (characterData: Partial<Character>): Promise<Character | null> => {
    try {
      const insertData = {
        ...characterData,
        user_id: user?.id || null,
        token_balance: 500,
        reputation_score: 5.0,
        total_dates: 0,
        successful_dates: 0
      };

      const { data, error } = await supabase
        .from('characters')
        .insert(insertData)
        .select()
        .single();
      
      if (error) throw error;
      if (data) {
        setCurrentCharacter(data);
        setTokenBalance(data.token_balance);
        return data;
      }
      return null;
    } catch (error) {
      console.error('Error creating character:', error);
      return null;
    }
  };

  const handleOpenCharacterBuilder = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setShowCharacterBuilder(true);
  };

  const handleBid = (listing: DateListing) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    if (!currentCharacter) {
      setShowCharacterBuilder(true);
      return;
    }
    setSelectedListing(listing);
    setShowBidModal(true);
  };

  const handleSubmitBid = async (amount: number, message: string): Promise<boolean> => {
    if (!currentCharacter || !selectedListing) return false;
    
    try {
      // Create the bid
      const { data: bidData, error: bidError } = await supabase
        .from('date_bids')
        .insert({
          listing_id: selectedListing.id,
          dater_id: currentCharacter.id,
          token_amount: amount,
          message,
          status: 'pending'
        })
        .select()
        .single();
      
      if (bidError) throw bidError;
      
      // For demo purposes, auto-accept the bid and create a date session
      // In a real app, the datee would accept/reject bids
      if (bidData && selectedListing.datee) {
        const { data: sessionData, error: sessionError } = await supabase.functions.invoke('manage-date-session', {
          body: {
            action: 'create',
            bid_id: bidData.id,
            listing_id: selectedListing.id,
            datee_id: selectedListing.datee_id,
            dater_id: currentCharacter.id,
            token_amount: amount,
            dating_tier: selectedListing.dating_tier,
            activities: selectedListing.preferred_activities
          }
        });

        if (sessionError) {
          console.error('Error creating date session:', sessionError);
        }
      }
      
      // Deduct tokens from balance
      setTokenBalance(prev => prev - amount);
      
      // Update character's token balance in database
      await supabase
        .from('characters')
        .update({ token_balance: tokenBalance - amount })
        .eq('id', currentCharacter.id);
      
      return true;
    } catch (error) {
      console.error('Error placing bid:', error);
      return false;
    }
  };

  const handleViewProfile = (character: Character) => {
    setSelectedProfile(character);
  };

  const handlePurchaseTokens = async (amount: number): Promise<boolean> => {
    setTokenBalance(prev => prev + amount);
    return true;
  };

  const handleOpenTokenPurchaseModal = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setShowTokenPurchaseModal(true);
  };

  const handleOpenCashoutModal = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setShowCashoutModal(true);
  };

  const handleTokenPurchaseComplete = (tokensAdded: number, newBalance: number) => {
    if (newBalance > 0) {
      setTokenBalance(newBalance);
    } else {
      setTokenBalance(prev => prev + tokensAdded);
    }
    
    // Update character's token balance in the database if they have one
    if (currentCharacter) {
      const updatedBalance = newBalance > 0 ? newBalance : tokenBalance + tokensAdded;
      setCurrentCharacter({
        ...currentCharacter,
        token_balance: updatedBalance
      });
    }
  };

  const handleCashoutComplete = (tokensDeducted: number, newBalance: number) => {
    setTokenBalance(newBalance);
    
    // Update character's token balance
    if (currentCharacter) {
      setCurrentCharacter({
        ...currentCharacter,
        token_balance: newBalance
      });
    }
  };

  const handleSelectVenue = (venue: Venue) => {
    // Could open a venue detail modal or start date planning
    console.log('Selected venue:', venue);
  };

  const handleStartDate = (sessionId: string) => {
    setActiveDateSessionId(sessionId);
  };

  const handleDateComplete = (finalScore: number, tokensEarned: number) => {
    setActiveDateSessionId(null);
    
    // Update token balance if tokens were earned
    if (tokensEarned > 0) {
      setTokenBalance(prev => prev + tokensEarned);
      if (currentCharacter) {
        setCurrentCharacter({
          ...currentCharacter,
          token_balance: currentCharacter.token_balance + tokensEarned,
          total_dates: currentCharacter.total_dates + 1,
          successful_dates: finalScore >= 60 ? currentCharacter.successful_dates + 1 : currentCharacter.successful_dates
        });
      }
    }
    
    // Navigate to My Dates to see the completed date
    handleNavigate('mydates');
  };

  // Render content based on active view
  const renderContent = () => {
    switch (activeView) {
      case 'home':
        return (
          <>
            <HeroSection
              onGetStarted={handleOpenCharacterBuilder}
              onExploreMarketplace={() => handleNavigate('marketplace')}
            />
            <FeaturesSection />
            <UnifiedNetworkSection />
            <HowItWorks />
            <StreamingSection />
            
            {/* Featured Listings Preview */}
            <section className="py-20 bg-[#0d0618]">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <span className="inline-block px-4 py-2 bg-white/5 rounded-full text-pink-400 text-sm font-medium mb-4">
                    Hot Right Now
                  </span>
                  <h2 className="text-4xl font-bold text-white mb-4">Featured Date Listings</h2>
                  <p className="text-white/60 max-w-2xl mx-auto">
                    Check out some of the most popular date opportunities in the marketplace
                  </p>
                </div>
                <Marketplace
                  listings={dateListings.slice(0, 4)}
                  onBid={handleBid}
                  onViewProfile={handleViewProfile}
                />
                <div className="text-center mt-8">
                  <button
                    onClick={() => handleNavigate('marketplace')}
                    className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 transition-colors"
                  >
                    View All Listings
                  </button>
                </div>
              </div>
            </section>
            
            <TokenExplainer />
            <TestimonialsSection />
            <CTASection onGetStarted={handleOpenCharacterBuilder} />
          </>
        );

      case 'marketplace':
        return (
          <div className="pt-20 min-h-screen bg-[#0d0618]">
            <Marketplace
              listings={dateListings}
              onBid={handleBid}
              onViewProfile={handleViewProfile}
            />
          </div>
        );

      case 'mydates':
        return (
          <div className="pt-20 min-h-screen bg-[#0d0618]">
            {currentCharacter ? (
              <MyDates
                currentCharacter={currentCharacter}
                onStartDate={handleStartDate}
              />
            ) : (
              <div className="container mx-auto px-4 py-12 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">Create Your Character First</h2>
                <p className="text-white/60 mb-6">You need a character to view and manage your dates.</p>
                <button
                  onClick={handleOpenCharacterBuilder}
                  className="px-8 py-4 bg-gradient-to-r from-[#00D9FF] to-[#00a8cc] rounded-xl text-white font-bold"
                >
                  Create Character
                </button>
              </div>
            )}
          </div>
        );

      case 'world':
        return (
          <div className="pt-20 min-h-screen bg-[#0d0618]">
            <VirtualWorld
              venues={venues}
              onSelectVenue={handleSelectVenue}
            />
          </div>
        );

      case 'wallet':
        return (
          <div className="pt-20 min-h-screen bg-[#0d0618]">
            <TokenWallet
              balance={tokenBalance}
              onPurchase={handlePurchaseTokens}
              onOpenPurchaseModal={handleOpenTokenPurchaseModal}
              onOpenCashoutModal={handleOpenCashoutModal}
              userId={user?.id}
              characterId={currentCharacter?.id}
            />
          </div>
        );

      case 'analytics':
        return (
          <div className="pt-20 min-h-screen bg-[#0d0618]">
            <Analytics
              totalDates={currentCharacter?.total_dates || 12}
              successfulDates={currentCharacter?.successful_dates || 9}
              averageCompatibility={72}
            />
          </div>
        );

      case 'profile':
        return (
          <div className="pt-20 min-h-screen bg-[#0d0618]">
            {currentCharacter ? (
              <div className="container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto">
                  <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden">
                    <div className="relative h-64">
                      <img
                        src={currentCharacter.avatar_url}
                        alt={currentCharacter.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0618] to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <h2 className="text-3xl font-bold text-white">{currentCharacter.name}</h2>
                        <p className="text-white/60">{currentCharacter.location} • {currentCharacter.age} years old</p>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-white/80 mb-6">{currentCharacter.bio}</p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {currentCharacter.personality_traits.map((trait, i) => (
                          <span key={i} className="px-3 py-1 bg-[#00D9FF]/20 rounded-full text-[#00D9FF] text-sm">
                            {trait}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {currentCharacter.interests.map((interest, i) => (
                          <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-white/70 text-sm">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="container mx-auto px-4 py-12 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">No Character Yet</h2>
                <p className="text-white/60 mb-6">Create your character to start dating!</p>
                <button
                  onClick={handleOpenCharacterBuilder}
                  className="px-8 py-4 bg-gradient-to-r from-[#00D9FF] to-[#00a8cc] rounded-xl text-white font-bold"
                >
                  Create Character
                </button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0618]">
      {/* Navigation */}
      <Navbar
        tokenBalance={tokenBalance}
        onNavigate={handleNavigate}
        activeView={activeView}
        onCreateCharacter={handleOpenCharacterBuilder}
        hasCharacter={!!currentCharacter}
        onOpenAuth={() => setShowAuthModal(true)}
        characterAvatar={currentCharacter?.avatar_url}
        characterName={currentCharacter?.name}
      />

      {/* Main Content */}
      <main>
        {renderContent()}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <TokenPurchaseModal
        isOpen={showTokenPurchaseModal}
        onClose={() => setShowTokenPurchaseModal(false)}
        currentBalance={tokenBalance}
        characterId={currentCharacter?.id}
        userId={user?.id}
        onPurchaseComplete={handleTokenPurchaseComplete}
      />

      <CashoutModal
        isOpen={showCashoutModal}
        onClose={() => setShowCashoutModal(false)}
        currentBalance={tokenBalance}
        characterId={currentCharacter?.id}
        userId={user?.id}
        userEmail={user?.email}
        onCashoutComplete={handleCashoutComplete}
      />

      {showCharacterBuilder && (
        <CharacterBuilder
          onClose={() => setShowCharacterBuilder(false)}
          onCreateCharacter={handleCreateCharacter}
        />
      )}

      {showBidModal && selectedListing && selectedListing.datee && (
        <BidModal
          listing={selectedListing}
          datee={selectedListing.datee as Character}
          currentBalance={tokenBalance}
          onClose={() => {
            setShowBidModal(false);
            setSelectedListing(null);
          }}
          onSubmitBid={handleSubmitBid}
        />
      )}

      {selectedProfile && (
        <ProfileModal
          character={selectedProfile}
          onClose={() => setSelectedProfile(null)}
          onBid={() => {
            const listing = dateListings.find(l => l.datee_id === selectedProfile.id);
            if (listing) {
              setSelectedProfile(null);
              handleBid(listing);
            }
          }}
        />
      )}

      {/* Date Session Overlay */}
      {activeDateSessionId && currentCharacter && (
        <DateSession
          sessionId={activeDateSessionId}
          currentCharacter={currentCharacter}
          onClose={() => setActiveDateSessionId(null)}
          onComplete={handleDateComplete}
        />
      )}
    </div>
  );
};

export default AppLayout;
