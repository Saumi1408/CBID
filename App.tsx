import React, { useState, useEffect } from 'react';
import LoginPage from './asserts/pages/LoginPage';
import OnboardingPage from './asserts/pages/OnboardingPage';
import MainLayout from './asserts/layout/MainLayout';
import { Page } from './types';
import SparkleBackground from './asserts/SparkleBackground';
import MoneyFlowBackground from './asserts/MoneyFlowBackground';
// Import the database from your firebaseconfig file
import { database } from './firebaseconfig';

import {collection,addDoc} from 'firebase/firestore';

//const [bidAmount, setBidAmount] = useState({});

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Login);

  const [loggedInTeam, setLoggedInTeam] = useState<string | null>(null);
  const handleLogin = (teamName: string) => {
    setLoggedInTeam(teamName);
    setCurrentPage(Page.Onboarding);
  };

  useEffect(() => {
    if (currentPage === Page.Onboarding) {
      const timer = setTimeout(() => {
        setCurrentPage(Page.Dashboard);
      }, 3000); // Redirect after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case Page.Login:
      case Page.Onboarding:
        return (
          <div className="relative z-10 flex items-center justify-center min-h-screen">
            {currentPage === Page.Login ? (
              <LoginPage onLogin={handleLogin} />
            ) : (
              <OnboardingPage teamName={loggedInTeam} />
            )}
          </div>
        );
      case Page.Dashboard:
        return <MainLayout teamName={loggedInTeam ?? ''} />;
      default:
        return (
          <div className="relative z-10 flex items-center justify-center min-h-screen">
            <LoginPage onLogin={handleLogin} />
          </div>
        );
    }
  };
  
  const renderBackground = () => {
    if (currentPage === Page.Login) {
      return <MoneyFlowBackground />;
    }
    return <SparkleBackground />;
  }

  return (
    <div className="relative min-h-screen w-full bg-[#0A0720] text-slate-100 overflow-hidden" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(45, 20, 110, 0.4), transparent 70%), radial-gradient(ellipse at 50% 100%, rgba(34, 211, 238, 0.1), transparent 70%), #0A0720' }}>
      {renderBackground()}
      <div className="relative z-10">{renderPage()}</div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-slate-500 font-roboto-mono text-sm opacity-50">
        Code Auction
      </div>
    </div>
  );
};

//this the function for sending the data to the firestore database

export async function storeBidData(teamName: string, problemName: string, problemId: string, finalBidAmount: number) {
  try {
    await addDoc(collection(database, "bids"), {
      teamName,
      problemName,
      problemId,
      finalBidAmount,
      timestamp: new Date(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error storing bid data:", error);
    return { success: false, error };
  }
}

export default App;
