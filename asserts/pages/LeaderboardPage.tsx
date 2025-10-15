import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import LeaderboardCard from '../LeaderboardCard';
import { collection, onSnapshot } from 'firebase/firestore';
import { database } from '../../firebaseconfig';

interface FirestoreBid {
  id: string;
  teamName: string;
  finalBidAmount?: number;
  biddingClosed?: boolean;
  completed?: boolean;
  message?: string;
  timestamp?: string; // Firestore timestamp as string or Date
}

interface LeaderboardPageProps {
  teamName: string;
}

const dummyUsersData: User[] = [
  { rank: 1, username: 'IMPULSE', lastActiveTime: '22:15', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 2, username: 'Dubai', lastActiveTime: '22:12', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  // ... rest of dummy users
];

const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ teamName }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bidsRef = collection(database, 'bids');
    const unsubscribe = onSnapshot(bidsRef, (snapshot) => {
      const allBids = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as FirestoreBid[];

      const teamStats: Record<string, { points: number; wins: number; bidsPlaced: number; lastActiveTime: string }> = {};

      allBids.forEach((bid) => {
        if (!bid.teamName) return;
        const team = bid.teamName.trim();

        if (!teamStats[team]) {
          teamStats[team] = { points: 0, wins: 0, bidsPlaced: 0, lastActiveTime: '' };
        }

        teamStats[team].bidsPlaced += 1;

        // Award points if bid completed and closed with success message
        const msg = (bid.message || '').toLowerCase();
        if (( bid.completed) ) {
          const pointsToAdd = (bid.finalBidAmount || 0) * 2;
          teamStats[team].points += pointsToAdd;
          teamStats[team].wins += 1;
        }

        // Update last active time
        //const bidTime = bid.timestamp || '';
        //if (bidTime && bidTime > teamStats[team].lastActiveTime) {
          teamStats[team].lastActiveTime = "";
        //}
      });

      // Merge dummy data + Firestore stats
      const mergedUsers = dummyUsersData.map((user) => {
        const stats = teamStats[user.username] || { points: 0, wins: 0, bidsPlaced: 0, lastActiveTime: user.lastActiveTime };
        const winRate = stats.bidsPlaced > 0 ? stats.wins : 0;

        return {
          ...user,
          points: stats.points,
          wins: stats.wins,
          bidsPlaced: stats.bidsPlaced,
          winRate,
          lastActiveTime: stats.lastActiveTime,
          rank: 0,
        };
      });

      // Add Firestore teams not in dummy
      Object.keys(teamStats).forEach((team) => {
        if (!mergedUsers.some(u => u.username.toLowerCase() === team.toLowerCase())) {
          const stats = teamStats[team];
          const winRate = stats.bidsPlaced > 0 ? stats.wins : 0;
          mergedUsers.push({
            rank: 0,
            username: team,
            lastActiveTime: stats.lastActiveTime,
            points: stats.points,
            wins: stats.wins,
            bidsPlaced: stats.bidsPlaced,
            winRate,
            streak: 0,
          });
        }
      });

      // Ensure logged-in team exists
      if (teamName && !mergedUsers.some(u => u.username.toLowerCase() === teamName.toLowerCase())) {
        mergedUsers.push({
          rank: 0,
          username: teamName,
          lastActiveTime: '',
          points: 0,
          wins: 0,
          bidsPlaced: 0,
          winRate: 0,
          streak: 0,
        });
      }

      // Sort by points desc, then wins
      mergedUsers.sort((a, b) => b.points - a.points || b.wins - a.wins);

      // Assign rank
      const rankedUsers = mergedUsers.map((user, index) => ({ ...user, rank: index + 1 }));

      setUsers(rankedUsers);
      setLoading(false);
    });

    return () => unsubscribe();
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
        {users.map((user) => {
          const isTeam = user.username.toLowerCase() === teamName.toLowerCase();
          return (
            <div
              key={user.username}
              className={isTeam ? 'ring-2 ring-cyan-500 rounded-lg' : ''}
            >
              <LeaderboardCard user={user} index={user.rank - 1} />
              {isTeam && (
                <div className="text-cyan-400 text-xs font-bold text-center">
                  Your Team
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeaderboardPage;
