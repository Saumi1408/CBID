import React from 'react';
import { User } from '../types';
import HexagonAvatar from './HexagonAvatar';
import CrownIcon from './icons/CrownIcon';
import BiddingIcon from './icons/BiddingIcon';
import PercentageIcon from './icons/PercentageIcon';

interface LeaderboardCardProps {
  user: User;
  index: number;
}

const getRankStyles = (rank: number) => {
    switch(rank) {
        case 1: return {
            border: 'border-yellow-400/80',
            shadow: 'shadow-[0_0_20px_rgba(250,204,21,0.4)]',
            text: 'text-yellow-400',
            tag: 'bg-yellow-400/10 text-yellow-300',
        };
        case 2: return {
            border: 'border-slate-400/80',
            shadow: 'shadow-[0_0_20px_rgba(156,163,175,0.4)]',
            text: 'text-slate-300',
            tag: 'bg-slate-400/10 text-slate-300',
        };
        case 3: return {
            border: 'border-orange-500/80',
            shadow: 'shadow-[0_0_20px_rgba(249,115,22,0.4)]',
            text: 'text-orange-400',
            tag: 'bg-orange-500/10 text-orange-400',
        };
        default: return {
            border: 'border-slate-700/80',
            shadow: 'hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]',
            text: 'text-cyan-400',
            tag: 'bg-slate-700 text-slate-300',
        };
    }
}

const StatItem: React.FC<{ icon: React.ReactNode; label: string; value: string | number; }> = ({ icon, label, value }) => (
    <div className="flex items-center space-x-2 text-sm text-slate-300">
        <div className="w-4 h-4 text-slate-400">{icon}</div>
        <span>{label}:</span>
        <span className="font-bold font-roboto-mono text-slate-100">{value}</span>
    </div>
);


const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ user, index }) => {
  const animationDelay = `${index * 100}ms`;
  const styles = getRankStyles(user.rank);

  return (
    <div
      className={`relative grid grid-cols-12 items-center p-4 rounded-xl transition-all duration-300 animate-fade-in-up bg-slate-900/70 backdrop-blur-sm border ${styles.border} ${styles.shadow} hover:border-cyan-400/60`}
      style={{ animationDelay }}
    >
      {/* Rank */}
      <div className="col-span-1 flex items-center justify-center">
          <span className={`text-2xl font-bold font-roboto-mono ${styles.text}`} style={{ textShadow: '0 0 10px currentColor' }}>#{user.rank}</span>
      </div>
      
      {/* User Info */}
      <div className="col-span-11 md:col-span-5 flex items-center space-x-4">
        <HexagonAvatar avatarUrl={user.avatarUrl} rank={user.rank} />
        <div className="relative">
          {user.rank === 1 && (
            <div className="absolute -top-5 -left-1 w-5 h-5 text-yellow-400" style={{ filter: 'drop-shadow(0 0 5px rgba(250, 204, 21, 0.7))' }}>
              <CrownIcon />
            </div>
          )}
          <span className="text-lg font-bold text-slate-100 tracking-wide" style={{ textShadow: '0 0 8px rgba(255,255,255,0.2)' }}>
            {user.username}
          </span>
          <p className="text-xs text-slate-500 font-roboto-mono">
            @{user.username.toLowerCase()} &bull; {user.lastActiveTime}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="col-span-12 md:col-span-6 mt-4 md:mt-0 grid grid-cols-2 gap-x-4 gap-y-2 pl-4 md:pl-0 border-l-2 md:border-l-0 border-slate-800">
        <StatItem icon={<BiddingIcon />} label="Bids" value={user.bidsPlaced} />
        <StatItem icon={<PercentageIcon />} label="Win Rate" value={`${user.winRate}%`} />
      </div>
      
       {/* Points */}
       <div className="absolute top-3 right-4 text-right">
        <span className={`text-2xl font-bold font-roboto-mono ${styles.text}`} style={{ textShadow: '0 0 10px currentColor' }}>
            ₹{user.points.toLocaleString('en-IN')}
        </span>
        <p className="text-xs text-slate-500">points</p>
      </div>

    </div>
  );
};

export default LeaderboardCard;