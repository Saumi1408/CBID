import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import LeaderboardCard from '../LeaderboardCard';
import { collection, onSnapshot } from 'firebase/firestore';
import { database } from '../firebaseconfig';

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
  { rank: 3, username: 'Code Bidders', lastActiveTime: '22:10', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 4, username: 'Bits to Bytes', lastActiveTime: '22:08', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 5, username: 'Horcrux Hackers', lastActiveTime: '22:05', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 6, username: 'Synchro Minds', lastActiveTime: '22:03', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 7, username: 'Maniacs', lastActiveTime: '22:00', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 8, username: 'Codix', lastActiveTime: '21:58', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 9, username: 'The Alphas', lastActiveTime: '21:55', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 10, username: 'FSOCIETY', lastActiveTime: '21:53', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 11, username: 'Ls', lastActiveTime: '21:50', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 12, username: 'Bid by bit', lastActiveTime: '21:48', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 13, username: 'Zero_Latency', lastActiveTime: '21:45', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 14, username: 'Code bytes', lastActiveTime: '21:43', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 15, username: 'Game changers', lastActiveTime: '21:40', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 16, username: 'The Game Changers', lastActiveTime: '21:38', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 17, username: 'CodePulse', lastActiveTime: '21:35', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 18, username: 'C0DEX', lastActiveTime: '21:33', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 19, username: 'Nevermore Demise', lastActiveTime: '21:30', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 20, username: 'Code-hunt', lastActiveTime: '21:28', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 21, username: 'Lions', lastActiveTime: '21:25', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 22, username: 'Code hunt', lastActiveTime: '21:23', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 23, username: 'Brain buds', lastActiveTime: '21:20', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 24, username: 'Code Crushers', lastActiveTime: '21:18', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 25, username: 'ConquerX', lastActiveTime: '21:15', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 26, username: 'Code Crashers', lastActiveTime: '21:12', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 27, username: 'Codepticons', lastActiveTime: '21:10', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 28, username: 'Whatever', lastActiveTime: '21:08', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 29, username: 'Domain seekers', lastActiveTime: '21:05', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 30, username: 'Code Crackers', lastActiveTime: '21:03', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 31, username: 'Code Alpha', lastActiveTime: '21:00', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 32, username: 'Team tech', lastActiveTime: '20:58', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 33, username: 'Scriptara', lastActiveTime: '20:55', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 34, username: 'Noob programmers', lastActiveTime: '20:53', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 35, username: 'Binary boys', lastActiveTime: '20:50', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 36, username: '(Santhosh)²', lastActiveTime: '20:48', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 37, username: 'Aurevia', lastActiveTime: '20:45', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 38, username: 'Idk', lastActiveTime: '20:43', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 39, username: 'Run time error', lastActiveTime: '20:40', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 40, username: 'Yara', lastActiveTime: '20:38', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 41, username: 'ShaDee', lastActiveTime: '20:35', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 42, username: 'Code brokers', lastActiveTime: '20:33', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 43, username: 'The Mavericks', lastActiveTime: '20:30', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 44, username: 'Bitbidders', lastActiveTime: '20:28', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 45, username: 'Legend Killers', lastActiveTime: '20:25', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 46, username: 'Wookiee Defenders', lastActiveTime: '20:23', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 47, username: 'Vada kovai', lastActiveTime: '20:20', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 48, username: 'Bots', lastActiveTime: '20:18', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 49, username: 'Nemesis Force', lastActiveTime: '20:15', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 50, username: 'Tech resolutes', lastActiveTime: '20:12', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 51, username: 'Brain Bot', lastActiveTime: '20:10', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 52, username: 'Code Gambler', lastActiveTime: '20:08', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 53, username: 'Techies', lastActiveTime: '20:05', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 54, username: 'CrypticCoders', lastActiveTime: '20:03', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 55, username: 'Vikings', lastActiveTime: '20:00', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 56, username: 'Born2Bid', lastActiveTime: '19:58', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 57, username: 'Zenith', lastActiveTime: '19:55', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 58, username: 'Pixel Drift', lastActiveTime: '19:53', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 59, username: 'Team Pheonix', lastActiveTime: '19:50', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 60, username: 'OG', lastActiveTime: '19:48', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 61, username: 'HACKER.APK', lastActiveTime: '19:45', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 62, username: 'Byteme', lastActiveTime: '19:43', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 63, username: 'EtherX', lastActiveTime: '19:40', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 64, username: 'CodeX', lastActiveTime: '19:38', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 65, username: 'Infinity', lastActiveTime: '19:35', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 66, username: 'HackerX', lastActiveTime: '19:33', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 67, username: 'MicroCoder', lastActiveTime: '19:33', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
  { rank: 68, username: '', lastActiveTime: '19:33', points: 0, wins: 0, bidsPlaced: 0, winRate: 0, streak: 0 },
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
        const team = bid.teamName.trim().toUpperCase();

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
        const stats = teamStats[user.username.toUpperCase()] || { points: 0, wins: 0, bidsPlaced: 0, lastActiveTime: user.lastActiveTime };
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
