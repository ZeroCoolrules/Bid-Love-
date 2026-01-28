import React from 'react';
import { FireIcon, HeartIcon, CrownIcon } from './ui/Icons';

interface TierBadgeProps {
  tier: 'hookup' | 'casual' | 'relationship';
  size?: 'sm' | 'md' | 'lg';
}

const tierConfig = {
  hookup: {
    icon: FireIcon,
    label: 'Hookup',
    gradient: 'from-pink-500 to-red-500',
    bgGradient: 'from-pink-500/20 to-red-500/20',
    border: 'border-pink-500/30',
    text: 'text-pink-400',
  },
  casual: {
    icon: HeartIcon,
    label: 'Casual',
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-500/20 to-cyan-500/20',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
  },
  relationship: {
    icon: CrownIcon,
    label: 'Relationship',
    gradient: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-500/20 to-pink-500/20',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
  },
};

const sizeConfig = {
  sm: {
    padding: 'px-2 py-1',
    iconSize: 12,
    textSize: 'text-xs',
  },
  md: {
    padding: 'px-3 py-1.5',
    iconSize: 14,
    textSize: 'text-sm',
  },
  lg: {
    padding: 'px-4 py-2',
    iconSize: 18,
    textSize: 'text-base',
  },
};

const TierBadge: React.FC<TierBadgeProps> = ({ tier, size = 'md' }) => {
  const config = tierConfig[tier];
  const sizes = sizeConfig[size];
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-1.5 ${sizes.padding} bg-gradient-to-r ${config.bgGradient} rounded-full border ${config.border}`}
    >
      <Icon className={config.text} size={sizes.iconSize} />
      <span className={`${sizes.textSize} font-semibold ${config.text}`}>
        {config.label}
      </span>
    </div>
  );
};

export default TierBadge;
