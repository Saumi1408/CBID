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
    avatarUrl: string;
    lastActiveTime: string;
    points: number;
    wins: number;
    bidsPlaced: number;
    winRate: number; // percentage
    streak: number;
}

export interface Question {
    id: string;
    title: string;
    description: string;
    difficulty: 'medium' | 'hard' | 'easy';
    startingBid: number;
    status: 'Active for bidding';
    endDate: string;
    bids: number;
}