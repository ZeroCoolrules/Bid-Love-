import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CloseIcon, MailIcon, LockIcon, UserIcon, EyeIcon, EyeOffIcon, CheckCircleIcon, AlertCircleIcon } from './ui/Icons';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup' | 'reset';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'signin' }) => {
  const { signIn, signUp, resetPassword } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setError(null);
    setSuccess(null);
  };

  const handleModeChange = (newMode: 'signin' | 'signup' | 'reset') => {
    resetForm();
    setMode(newMode);
  };

  const validateForm = (): boolean => {
    setError(null);
    
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (mode !== 'reset') {
      if (!password) {
        setError('Password is required');
        return false;
      }
      
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }
    }

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setError('Full name is required');
        return false;
      }
      
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message || 'Failed to sign in');
        } else {
          onClose();
        }
      } else if (mode === 'signup') {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          setError(error.message || 'Failed to sign up');
        } else {
          setSuccess('Account created! Please check your email to verify your account.');
        }
      } else if (mode === 'reset') {
        const { error } = await resetPassword(email);
        if (error) {
          setError(error.message || 'Failed to send reset email');
        } else {
          setSuccess('Password reset email sent! Check your inbox.');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'signin': return 'Welcome Back';
      case 'signup': return 'Create Account';
      case 'reset': return 'Reset Password';
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'signin': return 'Sign in to continue your dating journey';
      case 'signup': return 'Join Bid Love and connect through DatingPro';
      case 'reset': return 'Enter your email to receive a reset link';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#1a0a2e] to-[#0d0618] rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors z-10"
        >
          <CloseIcon className="text-white/60" size={20} />
        </button>

        {/* Header */}
        <div className="relative px-8 pt-10 pb-6">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-gradient-to-r from-[#00D9FF] to-[#FFB800] rounded-full blur-[80px] opacity-30" />
          <div className="relative text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#00D9FF] to-[#FFB800] rounded-2xl flex items-center justify-center">
              {mode === 'reset' ? (
                <MailIcon className="text-white" size={32} />
              ) : (
                <UserIcon className="text-white" size={32} />
              )}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{getTitle()}</h2>
            <p className="text-white/60 text-sm">{getSubtitle()}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 pb-8">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3">
              <AlertCircleIcon className="text-red-400 flex-shrink-0" size={20} />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-3">
              <CheckCircleIcon className="text-green-400 flex-shrink-0" size={20} />
              <p className="text-green-400 text-sm">{success}</p>
            </div>
          )}

          {/* Full Name (Sign Up only) */}
          {mode === 'signup' && (
            <div className="mb-4">
              <label className="block text-white/60 text-sm mb-2">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#00D9FF]/50 focus:ring-2 focus:ring-[#00D9FF]/20 transition-all"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <label className="block text-white/60 text-sm mb-2">Email Address</label>
            <div className="relative">
              <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#00D9FF]/50 focus:ring-2 focus:ring-[#00D9FF]/20 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          {mode !== 'reset' && (
            <div className="mb-4">
              <label className="block text-white/60 text-sm mb-2">Password</label>
              <div className="relative">
                <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#00D9FF]/50 focus:ring-2 focus:ring-[#00D9FF]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
            </div>
          )}

          {/* Confirm Password (Sign Up only) */}
          {mode === 'signup' && (
            <div className="mb-4">
              <label className="block text-white/60 text-sm mb-2">Confirm Password</label>
              <div className="relative">
                <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#00D9FF]/50 focus:ring-2 focus:ring-[#00D9FF]/20 transition-all"
                />
              </div>
            </div>
          )}

          {/* Forgot Password Link */}
          {mode === 'signin' && (
            <div className="mb-6 text-right">
              <button
                type="button"
                onClick={() => handleModeChange('reset')}
                className="text-[#00D9FF] text-sm hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-[#00D9FF] to-[#00a8cc] rounded-xl font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Please wait...</span>
              </>
            ) : (
              <span>
                {mode === 'signin' && 'Sign In'}
                {mode === 'signup' && 'Create Account'}
                {mode === 'reset' && 'Send Reset Link'}
              </span>
            )}
          </button>

          {/* Mode Toggle */}
          <div className="mt-6 text-center">
            {mode === 'signin' && (
              <p className="text-white/60 text-sm">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleModeChange('signup')}
                  className="text-[#FFB800] font-medium hover:underline"
                >
                  Sign up
                </button>
              </p>
            )}
            {mode === 'signup' && (
              <p className="text-white/60 text-sm">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleModeChange('signin')}
                  className="text-[#FFB800] font-medium hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
            {mode === 'reset' && (
              <p className="text-white/60 text-sm">
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={() => handleModeChange('signin')}
                  className="text-[#FFB800] font-medium hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </form>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#00D9FF]/10 rounded-full blur-[40px]" />
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#FFB800]/10 rounded-full blur-[40px]" />
      </div>
    </div>
  );
};

export default AuthModal;
