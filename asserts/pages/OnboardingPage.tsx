import React from 'react';
import CheckIcon from '../icons/CheckIcon';
import CodebidLogo from '../CodebidLogo';

interface OnboardingPageProps {
  teamName?: string | null;
}

const OnboardingPage: React.FC<OnboardingPageProps> = ({ teamName }) => {
  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-black/20 backdrop-blur-lg rounded-2xl shadow-2xl border border-slate-700/50 animate-fade-in-up flex flex-col items-center text-center">
      <div className="w-20 h-20 text-green-400 p-2 border-2 border-green-400/50 rounded-full flex items-center justify-center" style={{ boxShadow: '0 0 20px rgba(52, 211, 153, 0.4)'}}>
          <CheckIcon />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-100">Welcome{teamName ? `, ${teamName}` : ''} to</h1>
        <CodebidLogo />
      </div>
      <p className="text-slate-400">Your account is ready for the ultimate bidding arena.</p>
      <p className="text-slate-500 mt-2 font-roboto-mono animate-pulse">Redirecting to dashboard...</p>
    </div>
  );
};

export default OnboardingPage;