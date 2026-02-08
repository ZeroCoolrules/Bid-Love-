import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { HeartIcon, TokenIcon, WalletIcon, UserIcon, MenuIcon, CloseIcon, GlobeIcon, ChartIcon, LogOutIcon, SettingsIcon, ChevronDownIcon, CalendarIcon, PlayIcon } from './ui/Icons';

interface NavbarProps {
  tokenBalance: number;
  onNavigate: (view: string) => void;
  activeView: string;
  onCreateCharacter: () => void;
  hasCharacter: boolean;
  onOpenAuth: () => void;
  characterAvatar?: string;
  characterName?: string;
}

const Navbar: React.FC<NavbarProps> = ({ 
  tokenBalance, 
  onNavigate, 
  activeView, 
  onCreateCharacter,
  hasCharacter,
  onOpenAuth,
  characterAvatar,
  characterName
}) => {
  const { user, signOut, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'marketplace', label: 'Marketplace', icon: HeartIcon },
    { id: 'rooms', label: 'Virtual Rooms', icon: PlayIcon },
    { id: 'mydates', label: 'My Dates', icon: CalendarIcon },
    { id: 'world', label: 'Virtual World', icon: GlobeIcon },
    { id: 'wallet', label: 'Wallet', icon: WalletIcon },
    { id: 'analytics', label: 'Analytics', icon: ChartIcon },
  ];

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    onNavigate('home');
  };

  const getUserDisplayName = () => {
    if (characterName) return characterName;
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0d0618]/80 backdrop-blur-xl border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[#00D9FF] to-[#FFB800] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <HeartIcon className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold text-white hidden sm:block">
              Bid<span className="text-[#00D9FF]">Love</span>
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeView === item.id
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Token Balance */}
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FFB800]/20 to-orange-500/20 rounded-xl border border-[#FFB800]/30">
              <TokenIcon className="text-[#FFB800]" size={18} />
              <span className="text-white font-semibold">{tokenBalance.toLocaleString()}</span>
            </div>

            {/* User Section */}
            {loading ? (
              <div className="w-10 h-10 bg-white/10 rounded-xl animate-pulse" />
            ) : user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/5 transition-colors"
                >
                  {/* Avatar */}
                  {characterAvatar ? (
                    <img
                      src={characterAvatar}
                      alt={getUserDisplayName()}
                      className="w-9 h-9 rounded-lg object-cover border-2 border-[#00D9FF]/50"
                    />
                  ) : (
                    <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                      {getUserInitials()}
                    </div>
                  )}
                  <div className="hidden sm:block text-left">
                    <p className="text-white text-sm font-medium truncate max-w-[100px]">
                      {getUserDisplayName()}
                    </p>
                    <p className="text-white/40 text-xs">
                      {hasCharacter ? 'Character Active' : 'No Character'}
                    </p>
                  </div>
                  <ChevronDownIcon 
                    className={`text-white/60 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} 
                    size={16} 
                  />
                </button>

                {/* User Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-[#1a0a2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                    {/* User Info Header */}
                    <div className="p-4 border-b border-white/10 bg-gradient-to-r from-[#00D9FF]/10 to-[#FFB800]/10">
                      <div className="flex items-center gap-3">
                        {characterAvatar ? (
                          <img
                            src={characterAvatar}
                            alt={getUserDisplayName()}
                            className="w-12 h-12 rounded-xl object-cover border-2 border-[#00D9FF]/50"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold">
                            {getUserInitials()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold truncate">
                            {getUserDisplayName()}
                          </p>
                          <p className="text-white/50 text-sm truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      {hasCharacter ? (
                        <button
                          onClick={() => {
                            onNavigate('profile');
                            setUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <UserIcon size={18} />
                          <span>My Character</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            onCreateCharacter();
                            setUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#00D9FF] hover:bg-[#00D9FF]/10 transition-colors"
                        >
                          <UserIcon size={18} />
                          <span>Create Character</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          onNavigate('wallet');
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <WalletIcon size={18} />
                        <span>My Wallet</span>
                      </button>

                      <button
                        onClick={() => {
                          onNavigate('analytics');
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <ChartIcon size={18} />
                        <span>Dating Analytics</span>
                      </button>

                      <button
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <SettingsIcon size={18} />
                        <span>Settings</span>
                      </button>

                      <div className="my-2 border-t border-white/10" />

                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOutIcon size={18} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 bg-gradient-to-r from-[#00D9FF] to-[#00a8cc] rounded-xl font-semibold text-white text-sm hover:scale-105 transition-transform"
              >
                Sign In
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center text-white"
            >
              {mobileMenuOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeView === item.id
                        ? 'bg-white/10 text-white'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}

              {/* Mobile Auth/Profile */}
              <div className="mt-2 pt-2 border-t border-white/10">
                {user ? (
                  <>
                    {hasCharacter ? (
                      <button
                        onClick={() => {
                          onNavigate('profile');
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors w-full"
                      >
                        <UserIcon size={20} />
                        <span className="font-medium">My Character</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          onCreateCharacter();
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#00D9FF] hover:bg-[#00D9FF]/10 transition-colors w-full"
                      >
                        <UserIcon size={20} />
                        <span className="font-medium">Create Character</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        handleSignOut();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors w-full"
                    >
                      <LogOutIcon size={20} />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      onOpenAuth();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-[#00D9FF] to-[#00a8cc] text-white font-medium w-full justify-center"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
