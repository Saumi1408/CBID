

import React from 'react';
import { DashboardView } from '../../types';
import DashboardIcon from '../icons/DashboardIcon';
import LeaderboardIcon from '../icons/LeaderboardIcon';
import BiddingIcon from '../icons/BiddingIcon';
import AuctionIcon from '../icons/AuctionIcon';

interface SidebarProps {
  currentView: DashboardView;
  setCurrentView: (view: DashboardView) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-cyan-500/20 text-cyan-400'
          : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
      }`}
    >
      <div className="w-6 h-6 mr-4">{icon}</div>
      <span className="font-medium">{label}</span>
    </button>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  return (
    <aside className="w-64 bg-slate-800/60 p-4 border-r border-slate-700 flex flex-col">
      <div className="text-3xl font-bold text-cyan-400 font-roboto-mono mb-10 px-2">
        CodeBid
      </div>
      <nav className="flex flex-col space-y-2">
        <NavItem
            icon={<DashboardIcon />}
            label="Dashboard"
            // FIX: Property 'Home' does not exist on type 'typeof DashboardView'. Corrected to use 'Dashboard'.
            isActive={currentView === DashboardView.Dashboard}
            onClick={() => setCurrentView(DashboardView.Dashboard)}
        />
        <NavItem
            icon={<LeaderboardIcon />}
            label="Leaderboard"
            isActive={currentView === DashboardView.Leaderboard}
            onClick={() => setCurrentView(DashboardView.Leaderboard)}
        />
        <NavItem
            icon={<BiddingIcon />}
            label="Bidding"
            isActive={currentView === DashboardView.Bidding}
            onClick={() => setCurrentView(DashboardView.Bidding)}
        />
        <NavItem
            icon={<AuctionIcon />}
            label="Auction"
            isActive={currentView === DashboardView.Auction}
            onClick={() => setCurrentView(DashboardView.Auction)}
        />
      </nav>
      <div className="mt-auto p-4 text-center text-slate-500 text-xs">
          <p>&copy; 2025 CodeBid Event. All rights reserved.</p>
      </div>
    </aside>
  );
};

export default Sidebar;
