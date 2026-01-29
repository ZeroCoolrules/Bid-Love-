import React from 'react';
import { ChartIcon, TrendingUpIcon, HeartIcon, StarIcon, CheckIcon, ArrowRightIcon } from './ui/Icons';

interface AnalyticsProps {
  totalDates: number;
  successfulDates: number;
  averageCompatibility: number;
}

const Analytics: React.FC<AnalyticsProps> = ({ totalDates, successfulDates, averageCompatibility }) => {
  const successRate = totalDates > 0 ? Math.round((successfulDates / totalDates) * 100) : 0;

  const recentDates = [
    { name: 'Luna Starr', score: 85, status: 'success', date: '2 days ago' },
    { name: 'Marcus Chen', score: 62, status: 'success', date: '5 days ago' },
    { name: 'Aria Rose', score: 45, status: 'ended', date: '1 week ago' },
    { name: 'James Wright', score: 78, status: 'success', date: '2 weeks ago' },
  ];

  const improvementTips = [
    { category: 'Communication', tip: 'Ask more open-ended questions to show genuine interest', score: 72 },
    { category: 'Body Language', tip: 'Maintain eye contact during meaningful moments', score: 85 },
    { category: 'Timing', tip: 'Give your date space to share their thoughts', score: 68 },
    { category: 'Authenticity', tip: 'Share personal stories to build deeper connections', score: 90 },
  ];

  const personalityInsights = [
    { trait: 'Romantic', percentage: 78 },
    { trait: 'Adventurous', percentage: 65 },
    { trait: 'Intellectual', percentage: 82 },
    { trait: 'Spontaneous', percentage: 55 },
    { trait: 'Empathetic', percentage: 91 },
  ];

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Dating Analytics</h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Track your dating performance, learn from your experiences, and improve your connection skills.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-[#00D9FF]/20 to-blue-500/10 backdrop-blur-sm rounded-2xl border border-[#00D9FF]/30 p-6 text-center">
            <div className="text-4xl font-bold text-white mb-2">{totalDates}</div>
            <div className="text-white/60 text-sm">Total Dates</div>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 backdrop-blur-sm rounded-2xl border border-green-500/30 p-6 text-center">
            <div className="text-4xl font-bold text-green-400 mb-2">{successfulDates}</div>
            <div className="text-white/60 text-sm">Successful</div>
          </div>
          <div className="bg-gradient-to-br from-[#FFB800]/20 to-orange-500/10 backdrop-blur-sm rounded-2xl border border-[#FFB800]/30 p-6 text-center">
            <div className="text-4xl font-bold text-[#FFB800] mb-2">{successRate}%</div>
            <div className="text-white/60 text-sm">Success Rate</div>
          </div>
          <div className="bg-gradient-to-br from-pink-500/20 to-red-500/10 backdrop-blur-sm rounded-2xl border border-pink-500/30 p-6 text-center">
            <div className="text-4xl font-bold text-pink-400 mb-2">{averageCompatibility}%</div>
            <div className="text-white/60 text-sm">Avg Compatibility</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Dates */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <HeartIcon className="text-pink-500" size={24} />
              Recent Dates
            </h3>
            <div className="space-y-4">
              {recentDates.map((date, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    {date.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-medium">{date.name}</span>
                      <span className={`text-sm font-medium ${
                        date.status === 'success' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {date.score}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/50 text-sm">{date.date}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        date.status === 'success' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {date.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Personality Insights */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <StarIcon className="text-[#FFB800]" size={24} />
              Your Dating Personality
            </h3>
            <div className="space-y-4">
              {personalityInsights.map((insight, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/80">{insight.trait}</span>
                    <span className="text-white font-medium">{insight.percentage}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#00D9FF] to-[#FFB800] transition-all duration-1000"
                      style={{ width: `${insight.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Improvement Tips */}
          <div className="lg:col-span-2 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-3xl border border-purple-500/20 p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUpIcon className="text-green-400" size={24} />
              Personalized Improvement Tips
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {improvementTips.map((tip, index) => (
                <div key={index} className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#00D9FF] font-medium">{tip.category}</span>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${
                        tip.score >= 80 ? 'bg-green-500' : tip.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <span className="text-white/60 text-sm">{tip.score}%</span>
                    </div>
                  </div>
                  <p className="text-white/70 text-sm">{tip.tip}</p>
                </div>
              ))}
            </div>
            
            <button className="mt-6 w-full py-3 bg-white/5 border border-white/10 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
              Get Detailed Analysis
              <ArrowRightIcon size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Analytics;
