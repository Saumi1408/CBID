import React, { useState, useEffect } from 'react';
import { Question } from '../../types';
import WarningIcon from '../icons/WarningIcon';
import { collection, onSnapshot } from 'firebase/firestore';
import { storeBidData } from '../../App';
import { database } from '../../firebaseconfig';

const dummyQuestions: Question[] = [
  { id: 'q1', title: 'Binary Search Algorithm', description: 'Implement an efficient binary search algorithm that finds the target element in a sorted array', difficulty: 'medium', startingBid: 1000, status: 'Active for bidding', endDate: '10/8/2025', bids: 0 },
  { id: 'q2', title: 'Graph Traversal', description: 'Implement a function to traverse a graph using Breadth-First Search (BFS) starting from a given node.', difficulty: 'hard', startingBid: 1500, status: 'Active for bidding', endDate: '10/9/2025', bids: 3 },
  { id: 'q3', title: 'API Rate Limiter', description: 'Design and implement a middleware for an API that limits the number of requests a user can make in a given time frame.', difficulty: 'hard', startingBid: 2000, status: 'Active for bidding', endDate: '10/10/2025', bids: 1 },
];

interface FirestoreBid {
  id: string;
  problemId: string;
  teamName: string;
  biddingClosed?: boolean;
  message?: string;
  finalBidAmount?: number;
}

interface BiddingPageProps {
  teamName: string;
}

const BiddingPage: React.FC<BiddingPageProps> = ({ teamName }) => {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(dummyQuestions[0]);
  const [questions, setQuestions] = useState<Question[]>(dummyQuestions);
  const [bidAmount, setBidAmount] = useState<string>('');
useEffect(() => {
  const bidsRef = collection(database, 'bids');
  const unsubscribe = onSnapshot(bidsRef, (snapshot) => {
    const allBids = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FirestoreBid[];

    const updatedQuestions = dummyQuestions.map(q => {
      const relevantBids = allBids.filter(bid => bid.problemId === q.id);

      // Find the last closed bid (based on admin action)
      const closedBid = relevantBids.find(bid => bid.biddingClosed === true);
      const latestMessageBid = relevantBids.find(bid => bid.message);

      let status = q.status;

      if (closedBid) {
        // 🧠 Only the team that actually won sees the "You have won" message
        if (closedBid.teamName === teamName) {
          status = 'bidding🎉 You have won the bid!';
        } else {
          status = 'Bidding Closed-you have lost the bid';
        }
      } else if (latestMessageBid) {
        status = latestMessageBid.message || q.status;
      }

      return { ...q, status };
    });

    setQuestions(updatedQuestions);

    if (selectedQuestion) {
      const updatedSelected = updatedQuestions.find(q => q.id === selectedQuestion.id) || null;
      setSelectedQuestion(updatedSelected);
    }
  });

  return () => unsubscribe();
}, [teamName, selectedQuestion]);

  const getDifficultyColor = (difficulty: Question['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'hard': return 'bg-red-500/20 text-red-400';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuestion || !teamName || !bidAmount) {
      alert("Please fill in all fields.");
      return;
    }
    if (selectedQuestion.status !== 'Active for bidding') {
      alert("Bidding for this question is closed!");
      return;
    }
    if (Number(bidAmount) < selectedQuestion.startingBid) {
      alert(`Your bid must be at least ₹${selectedQuestion.startingBid}`);
      return;
    }

    const result = await storeBidData(teamName, selectedQuestion.title, selectedQuestion.id, Number(bidAmount));
    if (result.success) {
      alert("Bid placed successfully!");
      setBidAmount('');
    } else {
      alert("Failed to place bid.");
    }
  };

  return (
    <div className="animate-fade-in-up">
      <h1 className="text-3xl font-bold text-slate-100">Bidding Module</h1>
      <p className="mt-1 text-slate-400 mb-8">Bid on coding questions to compete</p>

      <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 p-4 rounded-lg flex items-center mb-8">
        <div className="w-6 h-6 mr-3">
          <WarningIcon />
        </div>
        <div>
          <h3 className="font-semibold">No Team Membership</h3>
          <p className="text-sm text-yellow-400/80">You need to be a member of a team to place bids. Contact your team leader or create a new team.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Questions List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-slate-200">Available Questions</h2>
          {questions.map(q => (
            <div
              key={q.id}
              onClick={() => setSelectedQuestion(q)}
              className={`p-6 rounded-lg cursor-pointer transition-all duration-300 ${selectedQuestion?.id === q.id
                ? 'bg-slate-700/80 ring-2 ring-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.2)]'
                : 'bg-slate-800/60 hover:bg-slate-700/50'
                }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-slate-100">{q.title}</h3>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full mt-2 inline-block ${getDifficultyColor(q.difficulty)}`}>{q.difficulty}</span>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-sm">Starting Bid</p>
                  <p className="text-xl font-bold text-cyan-400">₹{q.startingBid}</p>
                </div>
              </div>
              <p className="mt-4 text-slate-400 text-sm">{q.description}</p>
              <div className="mt-4 pt-4 border-t border-slate-700/50 flex justify-between items-center text-xs text-slate-500">
                <span>Ends: {q.endDate}</span>
                <span>{q.bids > 0 ? `${q.bids} bids` : 'No bids yet'}</span>
              </div>

              {/* ✅ Real-time status */}
              <div className={`mt-2 text-xs font-semibold ${q.status.includes('won') ? 'text-green-400' : 'text-yellow-400'}`}>
                {q.status}
              </div>
            </div>
          ))}
        </div>

        {/* Bidding Form */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800/60 p-6 rounded-lg sticky top-8">
            <h2 className="text-xl font-semibold text-slate-200 mb-4">Place Your Bid</h2>
            {selectedQuestion ? (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="text-sm text-slate-400 block mb-1">Selected Question</label>
                  <div className="p-3 bg-slate-900/50 rounded-md">
                    <p className="font-semibold text-slate-100">{selectedQuestion.title}</p>
                    <p className="text-xs text-slate-400 capitalize">{selectedQuestion.difficulty}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-400 block mb-1">Team Name</label>
                  <div className="p-3 bg-slate-900/50 rounded-md border border-slate-700 text-slate-100">
                    {teamName}
                  </div>
                </div>
                <div>
                  <label htmlFor="bid-amount" className="text-sm text-slate-400 block mb-1">Bid Amount (₹)</label>
                  <input
                    type="number"
                    id="bid-amount"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Enter your bid"
                    className="w-full p-3 bg-slate-900/50 rounded-md border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:ring-cyan-500 focus:border-cyan-500"
                    disabled={selectedQuestion.status !== 'Active for bidding'}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded transition-all duration-200"
                  disabled={selectedQuestion.status !== 'Active for bidding'}
                >
                  Place Bid
                </button>
              </form>
            ) : (
              <div className="text-slate-400">Select a question to place a bid.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiddingPage;
