export enum Page {
  Login,
  Onboarding,
  Dashboard,
}

export enum DashboardView {
    Dashboard,
    Leaderboard,
    Bidding,
    Auction,
}

export interface User {
  rank: number;
  username: string;
  lastActiveTime: string;
  points: number;
  wins: number;
  bidsPlaced: number;
  winRate: number;
  streak: number;
  
}
export interface Question {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  startingBid: number;
  status: string;
  endDate: string;
  bids: number;
}
