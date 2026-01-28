import React from 'react';
import { StarIcon, HeartIcon } from './ui/Icons';

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Sarah M.',
      avatar: 'https://d64gsuwffb70l.cloudfront.net/693e8a400a804c87e7c5fefc_1765729603911_0678113e.png',
      role: 'Premium Member',
      text: 'Bid Love completely changed how I approach dating. The virtual dates helped me build confidence, and I actually met my partner through the platform!',
      rating: 5,
      tokensEarned: 2500,
    },
    {
      name: 'Michael R.',
      avatar: 'https://d64gsuwffb70l.cloudfront.net/693e8a400a804c87e7c5fefc_1765729605919_12bdb977.png',
      role: 'Top Dater',
      text: 'The token economy is genius. I love that my dating skills translate to real value. Plus the analytics helped me understand what I was doing wrong.',
      rating: 5,
      tokensEarned: 4200,
    },
    {
      name: 'Emily K.',
      avatar: 'https://d64gsuwffb70l.cloudfront.net/693e8a400a804c87e7c5fefc_1765729604733_1677ffe6.png',
      role: 'Verified Datee',
      text: 'As a datee, I feel valued and respected. The bidding system ensures only serious people reach out, and the virtual dates are actually fun!',
      rating: 5,
      tokensEarned: 3800,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-[#1a0f2e] to-[#0d0618]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-white/5 rounded-full text-green-400 text-sm font-medium mb-4">
            Success Stories
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Real People, Real Connections
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            Join thousands of users who have found meaningful connections through Bid Love
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} className="text-[#FFB800]" size={18} />
                ))}
              </div>

              {/* Quote */}
              <p className="text-white/80 leading-relaxed mb-6">"{testimonial.text}"</p>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-white/50 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[#FFB800] font-bold">{testimonial.tokensEarned.toLocaleString()}</p>
                  <p className="text-white/40 text-xs">Dream Coin earned</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
            <div className="text-4xl font-bold text-white mb-2">50K+</div>
            <div className="text-white/60">Active Users</div>
          </div>
          <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
            <div className="text-4xl font-bold text-[#00D9FF] mb-2">89%</div>
            <div className="text-white/60">Match Success</div>
          </div>
          <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
            <div className="text-4xl font-bold text-[#FFB800] mb-2">2.5M</div>
            <div className="text-white/60">Tokens Traded</div>
          </div>
          <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
            <div className="text-4xl font-bold text-pink-400 mb-2">15K+</div>
            <div className="text-white/60">Dates Completed</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
