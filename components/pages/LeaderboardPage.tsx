import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import LeaderboardCard from '../LeaderboardCard';

const dummyUsersData: User[] = [
  { rank: 1, username: 'Cypher', avatarUrl: 'https://i.pravatar.cc/150?u=cypher', lastActiveTime: '22:15', points: 258000, wins: 25, bidsPlaced: 50, winRate: 50, streak: 8 },
  { rank: 2, username: 'Glitch', avatarUrl: 'https://i.pravatar.cc/150?u=glitch', lastActiveTime: '22:12', points: 245000, wins: 22, bidsPlaced: 52, winRate: 42, streak: 5 },
  { rank: 3, username: 'Vector', avatarUrl: 'https://i.pravatar.cc/150?u=vector', lastActiveTime: '21:58', points: 230000, wins: 20, bidsPlaced: 48, winRate: 41, streak: 0 },
  { rank: 4, username: 'Byte', avatarUrl: 'https://i.pravatar.cc/150?u=byte', lastActiveTime: '22:05', points: 210000, wins: 18, bidsPlaced: 45, winRate: 40, streak: 2 },
  { rank: 5, username: 'Syntax', avatarUrl: 'https://i.pravatar.cc/150?u=syntax', lastActiveTime: '20:45', points: 195000, wins: 15, bidsPlaced: 40, winRate: 38, streak: 0 },
  { rank: 6, username: 'Kernel', avatarUrl: 'https://i.pravatar.cc/150?u=kernel', lastActiveTime: '19:30', points: 180000, wins: 14, bidsPlaced: 35, winRate: 40, streak: 1 },
];

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};


interface LeaderboardPageProps {
  teamName: string;
}

const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ teamName }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    const timer = setTimeout(() => {
      let updatedUsers = shuffleArray(dummyUsersData);
      // Check if logged-in team is present
      const teamExists = updatedUsers.some(user => user.username.toLowerCase() === teamName.trim().toLowerCase());
      if (!teamExists && teamName) {
        updatedUsers = [
          {
            rank: updatedUsers.length + 1,
            username: teamName,
            avatarUrl: '',
            lastActiveTime: '',
            points: 0,
            wins: 0,
            bidsPlaced: 0,
            winRate: 0,
            streak: 0
          },
          ...updatedUsers
        ];
      }
      setUsers(updatedUsers);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [teamName]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
  <h1 className="text-3xl font-bold text-slate-100 mb-2">Leaderboard</h1>
  <p className="text-slate-400 mb-2">Top players in the ultimate bidding arena.</p>
  <div className="mb-6 text-cyan-400 font-bold text-lg">Your Team: {teamName}</div>
      <div className="space-y-4">
        {users.map((user, index) => {
          const isTeam = user.username.toLowerCase() === teamName.trim().toLowerCase();
          return (
            <div key={user.rank} className={isTeam ? 'ring-2 ring-cyan-500 rounded-lg' : ''}>
              <LeaderboardCard user={user} index={index}/>
              {isTeam && (
                <div className="text-cyan-400 text-xs font-bold text-center">Your Team</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeaderboardPage;