import React, { useState } from 'react';
import Papa from 'papaparse';
import CodebidLogo from '../CodebidLogo';

interface LoginPageProps {
  onLogin: (teamName: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [teamName, setTeamName] = useState('');

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName) return;
    setLoading(true);
    setError(null);

    // Fetch and parse the CSV
    try {
      const response = await fetch('/respones.csv');
      const csvText = await response.text();
      Papa.parse(csvText, {
        header: true,
  complete: (results: any) => {
          const teams = results.data.map((row: any) => (row["Team Name"] || '').trim().toLowerCase());
          if (teams.includes(teamName.trim().toLowerCase())) {
            onLogin(teamName);
          } else {
            setError('Team name not found. Please check your entry.');
          }
          setLoading(false);
        },
        error: () => {
          setError('Failed to read CSV.');
          setLoading(false);
        }
      });
    } catch {
      setError('Failed to fetch CSV.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-black/20 backdrop-blur-lg rounded-2xl shadow-2xl border border-slate-700/50 animate-fade-in-up">
      <div className="text-center space-y-2">
        <CodebidLogo />
        <p className="text-slate-400">The Ultimate Bidding Arena</p>
      </div>
      <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <div className="space-y-2">
            <label htmlFor="team-name" className="block text-sm font-medium text-slate-400">
              Team Name
            </label>
            <input
              id="team-name"
              name="teamName"
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
              className="appearance-none rounded-md relative block w-full px-4 py-3 border border-slate-600 bg-slate-900/50 placeholder-slate-500 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition-all"
              placeholder="Enter your team name"
            />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading || !teamName}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-md text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-slate-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-cyan-500/40"
          >
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
