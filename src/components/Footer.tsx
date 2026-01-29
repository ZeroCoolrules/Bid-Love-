import React from 'react';
import { HeartIcon, TokenIcon, GlobeIcon, MessageIcon } from './ui/Icons';

const Footer: React.FC = () => {
  const footerLinks = {
    Platform: [
      { label: 'How It Works', href: '#' },
      { label: 'Token Economy', href: '#' },
      { label: 'Virtual World', href: '#' },
      { label: 'Date Modes', href: '#' },
      { label: 'Safety Guidelines', href: '#' },
    ],
    Community: [
      { label: 'Success Stories', href: '#' },
      { label: 'Dating Tips', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Events', href: '#' },
      { label: 'Leaderboard', href: '#' },
    ],
    Support: [
      { label: 'Help Center', href: '#' },
      { label: 'Contact Us', href: '#' },
      { label: 'Report Issue', href: '#' },
      { label: 'FAQ', href: '#' },
      { label: 'Feedback', href: '#' },
    ],
    Legal: [
      { label: 'Terms of Service', href: '#' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Cookie Policy', href: '#' },
      { label: 'Community Guidelines', href: '#' },
      { label: 'Token Terms', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: '𝕏', href: '#', label: 'Twitter' },
    { icon: 'in', href: '#', label: 'LinkedIn' },
    { icon: 'ig', href: '#', label: 'Instagram' },
    { icon: 'dc', href: '#', label: 'Discord' },
  ];

  return (
    <footer className="bg-[#0d0618] border-t border-white/10">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00D9FF] to-[#FFB800] rounded-xl flex items-center justify-center">
                <HeartIcon className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold text-white">
                Date<span className="text-[#00D9FF]">Bid</span>
              </span>
            </div>
            <p className="text-white/60 mb-6 max-w-xs">
              The future of virtual dating. Create your character, bid on dates, and find meaningful connections in our immersive world.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center text-white/60 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <span className="text-sm font-bold">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-white/50 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00D9FF]/20 to-blue-500/10 rounded-xl flex items-center justify-center">
                <HeartIcon className="text-[#00D9FF]" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">50K+</div>
                <div className="text-white/50 text-sm">Active Users</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FFB800]/20 to-orange-500/10 rounded-xl flex items-center justify-center">
                <TokenIcon className="text-[#FFB800]" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">2.5M</div>
                <div className="text-white/50 text-sm">Dreamcoin Traded</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/10 rounded-xl flex items-center justify-center">
                <GlobeIcon className="text-green-400" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">120+</div>
                <div className="text-white/50 text-sm">Virtual Venues</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500/20 to-red-500/10 rounded-xl flex items-center justify-center">
                <MessageIcon className="text-pink-400" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">89%</div>
                <div className="text-white/50 text-sm">Match Success</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm">
              © 2025 Bid Love. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-white/40 hover:text-white text-sm transition-colors">
                Terms
              </a>
              <a href="#" className="text-white/40 hover:text-white text-sm transition-colors">
                Privacy
              </a>
              <a href="#" className="text-white/40 hover:text-white text-sm transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
