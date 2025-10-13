
import React from 'react';

const AuctionPage: React.FC = () => {
  return (
    <div className="animate-fade-in-up">
      <h1 className="text-4xl font-bold text-slate-100">Live Auction</h1>
      <p className="mt-2 text-slate-400">Welcome to the main event. The live auction for the grand prize will take place here. Get ready for a fast-paced, high-stakes showdown.</p>
      <div className="mt-10 p-8 bg-slate-800/50 border border-slate-700 rounded-lg text-center">
        <h2 className="text-2xl text-cyan-400">Auction Has Not Started Yet</h2>
        <p className="text-slate-400 mt-2">Stay tuned. The auction will commence at the scheduled time.</p>
      </div>
    </div>
  );
};

export default AuctionPage;
