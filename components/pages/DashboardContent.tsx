import React from 'react';
import TrophyIcon from '../icons/TrophyIcon';
import BiddingIcon from '../icons/BiddingIcon';
import { DashboardView } from '../../types';
import UsersIcon from '../icons/UsersIcon';

interface DashboardContentProps {
  setCurrentView: (view: DashboardView) => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ setCurrentView }) => {
  return (
    <div className="animate-fade-in-up">
       <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

        {/* Main Cards */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div 
              onClick={() => setCurrentView(DashboardView.Leaderboard)}
              className="bg-slate-900/70 backdrop-blur-sm border border-slate-700/80 p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 cursor-pointer group hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.25)]">
                <div className="mb-8">
                    <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110">
                        <TrophyIcon />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-100">Leaderboard</h2>
                    <p className="mt-2 text-slate-400">View player rankings and stats.</p>
                </div>
                <span className="font-semibold text-cyan-400 transition-transform duration-300 group-hover:translate-x-1">
                    View Leaderboard &rarr;
                </span>
            </div>
             <div
              onClick={() => setCurrentView(DashboardView.Bidding)} 
              className="bg-slate-900/70 backdrop-blur-sm border border-slate-700/80 p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 cursor-pointer group hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.25)]">
                <div className="mb-8">
                    <div className="w-12 h-12 bg-cyan-500/20 text-cyan-400 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110">
                        <BiddingIcon />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-100">Bidding</h2>
                    <p className="mt-2 text-slate-400">Bid on exclusive coding questions.</p>
                </div>
                <span className="font-semibold text-cyan-400 transition-transform duration-300 group-hover:translate-x-1">
                    Start Bidding &rarr;
                </span>
            </div>
        </div>

        {/* Side Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8">
            <div className="bg-slate-900/70 backdrop-blur-sm border border-slate-700/80 p-6 rounded-2xl">
                <h3 className="text-slate-400 font-medium">Active Questions</h3>
                <p className="text-5xl font-bold text-cyan-400 mt-2 font-roboto-mono">3</p>
                <p className="text-slate-500 mt-1">Ready for bidding</p>
            </div>
             <div className="bg-slate-900/70 backdrop-blur-sm border border-slate-700/80 p-6 rounded-2xl">
                <h3 className="text-slate-400 font-medium">Total Players</h3>
                <p className="text-5xl font-bold text-cyan-400 mt-2 font-roboto-mono">12</p>
                <p className="text-slate-500 mt-1">Currently competing</p>
            </div>
        </div>

        {/* Bottom Card */}
         <div className="lg:col-span-5 bg-slate-900/70 backdrop-blur-sm border border-slate-700/80 p-6 rounded-2xl flex items-center justify-between">
            <div>
              <h3 className="text-slate-400 font-medium">Your Rank</h3>
              <p className="text-4xl font-bold text-slate-100 mt-2 font-roboto-mono">-</p>
              <p className="text-slate-500 mt-1">Compete to see your rank</p>
            </div>
            <div className="w-16 h-16 text-slate-600">
              <UsersIcon />
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;