import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Character } from '@/types';
import {
  CalendarIcon,
  ClockIcon,
  HeartFilledIcon,
  TokenIcon,
  PlayIcon,
  CheckCircleIcon,
  XIcon,
  MapPinIcon,
  SparklesIcon,
  ArrowRightIcon,
  RefreshIcon
} from './ui/Icons';

interface DateSessionSummary {
  id: string;
  datee_id: string;
  dater_id: string;
  datee?: Character;
  dater?: Character;
  token_amount: number;
  current_step: number;
  total_steps: number;
  compatibility_score: number;
  status: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
}

interface MyDatesProps {
  currentCharacter: Character;
  onStartDate: (sessionId: string) => void;
}

const MyDates: React.FC<MyDatesProps> = ({ currentCharacter, onStartDate }) => {
  const [sessions, setSessions] = useState<DateSessionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  useEffect(() => {
    fetchSessions();
  }, [currentCharacter.id]);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-date-session', {
        body: { action: 'get_user_sessions', character_id: currentCharacter.id }
      });

      if (error) throw error;
      if (data.sessions) {
        setSessions(data.sessions);
      }
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeSessions = sessions.filter(s => ['scheduled', 'in_progress'].includes(s.status));
  const completedSessions = sessions.filter(s => ['completed', 'cancelled', 'refunded'].includes(s.status));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return (
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium flex items-center gap-1">
            <CalendarIcon size={12} />
            Scheduled
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium flex items-center gap-1">
            <PlayIcon size={12} />
            In Progress
          </span>
        );
      case 'completed':
        return (
          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-medium flex items-center gap-1">
            <CheckCircleIcon size={12} />
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium flex items-center gap-1">
            <XIcon size={12} />
            Cancelled
          </span>
        );
      case 'refunded':
        return (
          <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium flex items-center gap-1">
            <TokenIcon size={12} />
            Refunded
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderSessionCard = (session: DateSessionSummary) => {
    const isDatee = currentCharacter.id === session.datee_id;
    const partner = isDatee ? session.dater : session.datee;
    const canStart = session.status === 'scheduled' || session.status === 'in_progress';

    return (
      <div
        key={session.id}
        className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/10 overflow-hidden hover:border-pink-500/30 transition-all"
      >
        <div className="p-5">
          <div className="flex items-start gap-4">
            {/* Partner Avatar */}
            <div className="relative">
              <img
                src={partner?.avatar_url || '/placeholder.svg'}
                alt={partner?.name || 'Partner'}
                className="w-16 h-16 rounded-xl object-cover"
              />
              {session.status === 'in_progress' && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0d0618] animate-pulse" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-bold text-white truncate">{partner?.name || 'Unknown'}</h3>
                {getStatusBadge(session.status)}
              </div>
              
              <div className="flex items-center gap-3 text-white/50 text-sm mb-3">
                {partner?.location && (
                  <span className="flex items-center gap-1">
                    <MapPinIcon size={12} />
                    {partner.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <CalendarIcon size={12} />
                  {formatDate(session.created_at)}
                </span>
              </div>

              {/* Progress */}
              {session.status !== 'scheduled' && (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-white/50">Progress</span>
                    <span className="text-white/70">{session.current_step}/{session.total_steps} steps</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all"
                      style={{ width: `${(session.current_step / session.total_steps) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Stats Row */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <HeartFilledIcon className="text-pink-500" size={16} />
                  <span className="text-white font-medium">{session.compatibility_score}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <TokenIcon className="text-[#FFB800]" size={16} />
                  <span className="text-white/70">{session.token_amount}</span>
                </div>
                <span className="text-white/40 text-xs">
                  {isDatee ? 'You\'re the datee' : 'You\'re the dater'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {canStart && (
          <div className="px-5 pb-5">
            <button
              onClick={() => onStartDate(session.id)}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-pink-500/25 transition-all"
            >
              {session.status === 'in_progress' ? (
                <>
                  <PlayIcon size={18} />
                  Continue Date
                </>
              ) : (
                <>
                  <SparklesIcon size={18} />
                  Start Date
                </>
              )}
              <ArrowRightIcon size={18} />
            </button>
          </div>
        )}

        {/* Completed Stats */}
        {session.status === 'completed' && (
          <div className="px-5 pb-5">
            <div className="p-3 bg-white/5 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Final Compatibility</span>
                <span className={`font-bold ${session.compatibility_score >= 60 ? 'text-green-400' : 'text-white/70'}`}>
                  {session.compatibility_score}%
                </span>
              </div>
              {isDatee && (
                <div className="flex items-center justify-between mt-2">
                  <span className="text-white/60 text-sm">Dreamcoin Earned</span>
                  <span className="text-[#FFB800] font-bold flex items-center gap-1">
                    <TokenIcon size={14} />
                    +{session.token_amount}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Dates</h1>
            <p className="text-white/60">Manage your virtual dating experiences</p>
          </div>
          <button
            onClick={fetchSessions}
            className="p-3 bg-white/10 rounded-xl text-white/60 hover:text-white hover:bg-white/20 transition-colors"
          >
            <RefreshIcon size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'active'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            Active ({activeSessions.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'completed'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            Completed ({completedSessions.length})
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/60">Loading your dates...</p>
          </div>
        ) : (
          <>
            {/* Active Sessions */}
            {activeTab === 'active' && (
              <>
                {activeSessions.length === 0 ? (
                  <div className="text-center py-16 bg-white/5 rounded-3xl border border-white/10">
                    <CalendarIcon className="mx-auto mb-4 text-white/30" size={48} />
                    <h3 className="text-xl font-bold text-white mb-2">No Active Dates</h3>
                    <p className="text-white/60 max-w-md mx-auto">
                      You don't have any scheduled or in-progress dates. Browse the marketplace to find your next date!
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {activeSessions.map(renderSessionCard)}
                  </div>
                )}
              </>
            )}

            {/* Completed Sessions */}
            {activeTab === 'completed' && (
              <>
                {completedSessions.length === 0 ? (
                  <div className="text-center py-16 bg-white/5 rounded-3xl border border-white/10">
                    <HeartFilledIcon className="mx-auto mb-4 text-white/30" size={48} />
                    <h3 className="text-xl font-bold text-white mb-2">No Completed Dates Yet</h3>
                    <p className="text-white/60 max-w-md mx-auto">
                      Once you complete a date, it will appear here with your compatibility scores and memories.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {completedSessions.map(renderSessionCard)}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Stats Summary */}
        {!loading && sessions.length > 0 && (
          <div className="mt-12 p-6 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">Your Dating Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">{sessions.length}</div>
                <div className="text-white/50 text-sm">Total Dates</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-1">
                  {completedSessions.filter(s => s.compatibility_score >= 60).length}
                </div>
                <div className="text-white/50 text-sm">Successful</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-400 mb-1">
                  {completedSessions.length > 0 
                    ? Math.round(completedSessions.reduce((acc, s) => acc + s.compatibility_score, 0) / completedSessions.length)
                    : 0}%
                </div>
                <div className="text-white/50 text-sm">Avg Compatibility</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#FFB800] mb-1">
                  {completedSessions
                    .filter(s => s.datee_id === currentCharacter.id)
                    .reduce((acc, s) => acc + s.token_amount, 0)}
                </div>
                <div className="text-white/50 text-sm">Dreamcoin Earned</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDates;
