import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Character } from '@/types';
import {
  CloseIcon,
  HeartFilledIcon,
  MapPinIcon,
  ClockIcon,
  SendIcon,
  TokenIcon,
  SparklesIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  TrophyIcon,
  ZapIcon,
  MessageIcon
} from './ui/Icons';

interface DateScenarioStep {
  id: string;
  title: string;
  location: string;
  description: string;
  activity: string;
  duration_minutes: number;
  choices: {
    id: string;
    text: string;
    compatibility_impact: number;
    response: string;
  }[];
}

interface ChatMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  message: string;
  timestamp: string;
}

interface DateSessionData {
  id: string;
  datee_id: string;
  dater_id: string;
  datee?: Character;
  dater?: Character;
  token_amount: number;
  current_step: number;
  total_steps: number;
  compatibility_score: number;
  communication_score: number;
  engagement_score: number;
  status: string;
  scenario_data: { steps: DateScenarioStep[] };
  choices_made: any[];
  chat_messages: ChatMessage[];
  started_at?: string;
  completed_at?: string;
}

interface DateSessionProps {
  sessionId: string;
  currentCharacter: Character;
  onClose: () => void;
  onComplete: (finalScore: number, tokensEarned: number) => void;
}

const DateSession: React.FC<DateSessionProps> = ({
  sessionId,
  currentCharacter,
  onClose,
  onComplete
}) => {
  const [session, setSession] = useState<DateSessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [choiceResponse, setChoiceResponse] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [finalResults, setFinalResults] = useState<{ score: number; tokens: number } | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const isDatee = currentCharacter.id === session?.datee_id;
  const partner = isDatee ? session?.dater : session?.datee;

  useEffect(() => {
    fetchSession();
  }, [sessionId]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [session?.chat_messages]);

  const fetchSession = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('manage-date-session', {
        body: { action: 'get_session', session_id: sessionId }
      });

      if (error) throw error;
      if (data.session) {
        setSession(data.session);
        
        // Auto-start if scheduled
        if (data.session.status === 'scheduled') {
          await startSession();
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load date session');
    } finally {
      setLoading(false);
    }
  };

  const startSession = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('manage-date-session', {
        body: { action: 'start', session_id: sessionId }
      });

      if (error) throw error;
      if (data.session) {
        setSession(data.session);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to start date');
    }
  };

  const handleMakeChoice = async (choice: { id: string; text: string; compatibility_impact: number; response: string }) => {
    if (isProcessing || !session) return;
    
    setIsProcessing(true);
    setSelectedChoice(choice.id);
    setChoiceResponse(choice.response);

    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const currentStep = session.scenario_data.steps[session.current_step];
      
      const { data, error } = await supabase.functions.invoke('manage-date-session', {
        body: {
          action: 'make_choice',
          session_id: sessionId,
          step_id: currentStep.id,
          choice_id: choice.id,
          choice_text: choice.text,
          compatibility_impact: choice.compatibility_impact,
          response: choice.response
        }
      });

      if (error) throw error;

      if (data.isComplete) {
        setFinalResults({
          score: data.finalCompatibility,
          tokens: isDatee ? session.token_amount : 0
        });
        setShowCompletion(true);
        setTimeout(() => {
          onComplete(data.finalCompatibility, isDatee ? session.token_amount : 0);
        }, 5000);
      } else if (data.session) {
        setSession(data.session);
        setSelectedChoice(null);
        setChoiceResponse(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process choice');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || isSendingMessage || !session) return;

    setIsSendingMessage(true);
    const messageToSend = chatMessage;
    setChatMessage('');

    try {
      // Send user message
      const { data: msgData, error: msgError } = await supabase.functions.invoke('manage-date-session', {
        body: {
          action: 'send_message',
          session_id: sessionId,
          sender_id: currentCharacter.id,
          sender_name: currentCharacter.name,
          message: messageToSend
        }
      });

      if (msgError) throw msgError;
      if (msgData.session) {
        setSession(msgData.session);
      }

      // Get AI response from partner
      if (partner) {
        const { data: aiData, error: aiError } = await supabase.functions.invoke('manage-date-session', {
          body: {
            action: 'generate_ai_response',
            session_id: sessionId,
            datee_name: partner.name,
            datee_personality: partner.personality_traits || [],
            user_message: messageToSend,
            current_step: session.current_step
          }
        });

        if (!aiError && aiData.response) {
          // Send AI response as partner
          const { data: aiMsgData } = await supabase.functions.invoke('manage-date-session', {
            body: {
              action: 'send_message',
              session_id: sessionId,
              sender_id: partner.id,
              sender_name: partner.name,
              message: aiData.response
            }
          });

          if (aiMsgData?.session) {
            setSession(aiMsgData.session);
          }
        }
      }
    } catch (err: any) {
      console.error('Failed to send message:', err);
    } finally {
      setIsSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading your date...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
        <div className="bg-gradient-to-br from-[#1a0f2e] to-[#0d0618] rounded-3xl p-8 max-w-md w-full border border-red-500/30 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CloseIcon className="text-red-500" size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Oops!</h3>
          <p className="text-white/60 mb-6">{error}</p>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const currentStep = session.scenario_data.steps[session.current_step];
  const progress = ((session.current_step) / session.total_steps) * 100;

  // Completion Screen
  if (showCompletion && finalResults) {
    const isSuccess = finalResults.score >= 60;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
        <div className="bg-gradient-to-br from-[#1a0f2e] to-[#0d0618] rounded-3xl p-8 max-w-lg w-full border border-white/10 text-center overflow-hidden relative">
          {/* Confetti effect for success */}
          {isSuccess && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full animate-bounce"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    backgroundColor: ['#FF6B9D', '#00D9FF', '#FFB800', '#9D4EDD'][i % 4],
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${1 + Math.random()}s`
                  }}
                />
              ))}
            </div>
          )}

          <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
            isSuccess 
              ? 'bg-gradient-to-br from-pink-500 to-purple-500' 
              : 'bg-gradient-to-br from-gray-500 to-gray-600'
          }`}>
            {isSuccess ? (
              <TrophyIcon className="text-white" size={48} />
            ) : (
              <HeartFilledIcon className="text-white/60" size={48} />
            )}
          </div>

          <h2 className="text-3xl font-bold text-white mb-2">
            {isSuccess ? 'Amazing Date!' : 'Date Complete'}
          </h2>
          <p className="text-white/60 mb-8">
            {isSuccess 
              ? `You and ${partner?.name} really hit it off!` 
              : `Thanks for spending time with ${partner?.name}.`}
          </p>

          {/* Compatibility Score */}
          <div className="bg-white/5 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              <img
                src={currentCharacter.avatar_url}
                alt={currentCharacter.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-pink-500"
              />
              <div className="relative">
                <HeartFilledIcon 
                  className={isSuccess ? 'text-pink-500 animate-pulse' : 'text-gray-500'} 
                  size={32} 
                />
              </div>
              <img
                src={partner?.avatar_url}
                alt={partner?.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#00D9FF]"
              />
            </div>
            
            <div className="text-5xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
              {finalResults.score}%
            </div>
            <p className="text-white/60 text-sm">Compatibility Score</p>
          </div>

          {/* Token Earnings */}
          {isDatee && finalResults.tokens > 0 && (
            <div className="bg-gradient-to-r from-[#FFB800]/20 to-[#FF6B00]/20 rounded-xl p-4 mb-6 border border-[#FFB800]/30">
              <div className="flex items-center justify-center gap-2">
                <TokenIcon className="text-[#FFB800]" size={24} />
                <span className="text-2xl font-bold text-[#FFB800]">+{finalResults.tokens}</span>
                <span className="text-white/60">Dreamcoin earned!</span>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white/5 rounded-xl p-3">
              <div className="text-lg font-bold text-white">{session.choices_made.length}</div>
              <div className="text-xs text-white/50">Choices Made</div>
            </div>
            <div className="bg-white/5 rounded-xl p-3">
              <div className="text-lg font-bold text-white">{session.chat_messages.length}</div>
              <div className="text-xs text-white/50">Messages Sent</div>
            </div>
            <div className="bg-white/5 rounded-xl p-3">
              <div className="text-lg font-bold text-white">{session.total_steps}</div>
              <div className="text-xs text-white/50">Steps Completed</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-white font-bold hover:shadow-lg hover:shadow-pink-500/25 transition-all"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0d0618] overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-[#0d0618] to-transparent p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full text-white/60 hover:text-white hover:bg-white/20 transition-colors"
          >
            <CloseIcon size={20} />
          </button>

          {/* Progress */}
          <div className="flex-1 mx-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-white/60 text-sm">Step {session.current_step + 1} of {session.total_steps}</span>
              <span className="text-white/40">•</span>
              <span className="text-pink-400 text-sm font-medium">{currentStep?.title}</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Compatibility Score */}
          <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
            <HeartFilledIcon className="text-pink-500" size={18} />
            <span className="text-white font-bold">{session.compatibility_score}%</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="h-full pt-24 pb-4 px-4 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Partner Info */}
          <div className="flex items-center gap-4 mb-6">
            <img
              src={partner?.avatar_url}
              alt={partner?.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-pink-500/50"
            />
            <div>
              <h2 className="text-xl font-bold text-white">{partner?.name}</h2>
              <p className="text-white/60 text-sm">{partner?.location}</p>
            </div>
          </div>

          {/* Scene Card */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-3xl border border-white/10 overflow-hidden mb-6">
            {/* Scene Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <MapPinIcon className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{currentStep?.location}</h3>
                  <div className="flex items-center gap-2 text-white/50 text-sm">
                    <ClockIcon size={14} />
                    <span>{currentStep?.duration_minutes} minutes</span>
                  </div>
                </div>
              </div>
              <p className="text-white/80 leading-relaxed">{currentStep?.description}</p>
            </div>

            {/* Choice Response */}
            {choiceResponse && (
              <div className="p-6 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border-b border-white/10">
                <div className="flex items-start gap-3">
                  <img
                    src={partner?.avatar_url}
                    alt={partner?.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-white/60 text-sm mb-1">{partner?.name}'s reaction:</p>
                    <p className="text-white italic">"{choiceResponse}"</p>
                  </div>
                </div>
              </div>
            )}

            {/* Choices */}
            {!choiceResponse && currentStep?.choices && (
              <div className="p-6">
                <p className="text-white/60 text-sm mb-4 flex items-center gap-2">
                  <SparklesIcon className="text-[#00D9FF]" size={16} />
                  What do you do?
                </p>
                <div className="space-y-3">
                  {currentStep.choices.map((choice) => (
                    <button
                      key={choice.id}
                      onClick={() => handleMakeChoice(choice)}
                      disabled={isProcessing}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        selectedChoice === choice.id
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                          : 'bg-white/5 text-white/80 hover:bg-white/10 border border-white/10'
                      } ${isProcessing && selectedChoice !== choice.id ? 'opacity-50' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{choice.text}</span>
                        {selectedChoice === choice.id && (
                          <CheckCircleIcon className="text-white" size={20} />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Continue Button */}
            {choiceResponse && !isProcessing && (
              <div className="p-6">
                <button
                  onClick={() => {
                    setSelectedChoice(null);
                    setChoiceResponse(null);
                  }}
                  className="w-full py-4 bg-gradient-to-r from-[#00D9FF] to-[#00a8cc] rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#00D9FF]/25 transition-all"
                >
                  Continue to Next Step
                  <ArrowRightIcon size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Chat Toggle */}
          <button
            onClick={() => setShowChat(!showChat)}
            className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-white/80 hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
          >
            <MessageIcon size={20} />
            {showChat ? 'Hide Chat' : 'Open Chat'} 
            {session.chat_messages.length > 0 && (
              <span className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
                {session.chat_messages.length}
              </span>
            )}
          </button>

          {/* Chat Panel */}
          {showChat && (
            <div className="mt-4 bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
              {/* Chat Messages */}
              <div className="h-64 overflow-y-auto p-4 space-y-3">
                {session.chat_messages.length === 0 ? (
                  <div className="text-center text-white/40 py-8">
                    <MessageIcon className="mx-auto mb-2" size={32} />
                    <p>Start a conversation with {partner?.name}!</p>
                  </div>
                ) : (
                  session.chat_messages.map((msg) => {
                    const isMe = msg.sender_id === currentCharacter.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] ${isMe ? 'order-2' : 'order-1'}`}>
                          {!isMe && (
                            <p className="text-xs text-white/40 mb-1 ml-1">{msg.sender_name}</p>
                          )}
                          <div
                            className={`px-4 py-2 rounded-2xl ${
                              isMe
                                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-br-md'
                                : 'bg-white/10 text-white rounded-bl-md'
                            }`}
                          >
                            {msg.message}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-white/10">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={`Message ${partner?.name}...`}
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-pink-500/50"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!chatMessage.trim() || isSendingMessage}
                    className="px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-pink-500/25 transition-all"
                  >
                    {isSendingMessage ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <SendIcon size={20} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Token Info */}
          <div className="mt-6 p-4 bg-gradient-to-r from-[#FFB800]/10 to-[#FF6B00]/10 rounded-xl border border-[#FFB800]/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TokenIcon className="text-[#FFB800]" size={20} />
                <span className="text-white/80">Date Value</span>
              </div>
              <span className="text-[#FFB800] font-bold">{session.token_amount} Dreamcoin</span>
            </div>
            <p className="text-white/50 text-xs mt-2">
              {isDatee 
                ? 'You\'ll receive these Dreamcoin when the date completes!' 
                : 'Dreamcoin will be transferred to your date upon completion.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateSession;
