import React, { useState } from 'react';
import { DashboardView } from '../../types';
import LeaderboardPage from '../pages/LeaderboardPage';
import BiddingPage from '../pages/BiddingPage';
import AuctionPage from '../pages/AuctionPage';
import DashboardContent from '../pages/DashboardContent';
import Header from './Header';

interface MainLayoutProps {
    teamName: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ teamName }) => {
    const [currentView, setCurrentView] = useState<DashboardView>(DashboardView.Dashboard);

    const renderContent = () => {
        switch (currentView) {
            case DashboardView.Dashboard:
                return <DashboardContent setCurrentView={setCurrentView} />;
            case DashboardView.Leaderboard:
                return <LeaderboardPage teamName={teamName} />;
            case DashboardView.Bidding:
                return <BiddingPage teamName={teamName} />;
            // case DashboardView.Auction:
            //     return <AuctionPage />;
            default:
                return <DashboardContent setCurrentView={setCurrentView} />;
        }
    };

    return (
        <div className="flex flex-col w-screen h-screen animate-fade-in-fast">
            <Header currentView={currentView} setCurrentView={setCurrentView} />
            <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
