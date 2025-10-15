import React from 'react';
import { DashboardView } from '../../types';
import UserCircleIcon from '../icons/UserCircleIcon';
import CodebidLogo from '../CodebidLogo';

interface HeaderProps {
  currentView: DashboardView;
  setCurrentView: (view: DashboardView) => void;
}

const NavItem: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 relative ${
        isActive
          ? 'text-white'
          : 'text-slate-400 hover:text-white'
      }`}
    >
      {label}
      {isActive && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-cyan-400 rounded-full"></span>}
    </button>
  );
};

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
    const navItems = [
        { label: 'Dashboard', view: DashboardView.Dashboard },
        { label: 'Leaderboard', view: DashboardView.Leaderboard },
        { label: 'Bidding', view: DashboardView.Bidding },
        { label: 'Auction', view: DashboardView.Auction },
    ]
  return (
    <header className="bg-slate-900/50 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
                 <div onClick={() => setCurrentView(DashboardView.Dashboard)} className="cursor-pointer">
                    <CodebidLogo isHeader={true} />
                 </div>
                 <nav className="hidden md:flex items-center space-x-2">
                   {navItems.map(item => (
                        <NavItem 
                            key={item.label}
                            label={item.label}
                            isActive={currentView === item.view}
                            onClick={() => setCurrentView(item.view)}
                        />
                   ))}
                </nav>
            </div>
            <div className="flex items-center">
                 <button className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors">
                    <span className="w-8 h-8">
                        <UserCircleIcon />
                    </span>
                    <span className="text-sm font-medium hidden sm:block">User</span>
                 </button>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
