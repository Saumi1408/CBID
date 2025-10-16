import React, { useState, useEffect } from 'react';
import { Question } from '../../types';
import WarningIcon from '../icons/WarningIcon';
import { collection, onSnapshot } from 'firebase/firestore';
import { storeBidData } from '../../App';
import { database } from '../firebaseconfig';

const dummyQuestions: Question[] = [
  { id: 'q1', title: 'Two Sum', description: 'Find indices of the two numbers that add up to a specific target.', difficulty: 'easy', startingBid: 500, status: 'Active for bidding', endDate: '10/16/2025', bids: 0 },
  { id: 'q2', title: 'Spiral Matrix', description: 'Print the elements of a matrix in spiral order.', difficulty: 'medium', startingBid: 1000, status: 'Active for bidding', endDate: '10/16/2025', bids: 0 },
  { id: 'q3', title: 'Insertion Sort', description: 'Implement insertion sort algorithm to sort an array of numbers.', difficulty: 'easy', startingBid: 400, status: 'Active for bidding', endDate: '10/16/2025', bids: 0 },
  { id: 'q4', title: 'Palindrome Number', description: 'Determine whether an integer is a palindrome.', difficulty: 'easy', startingBid: 300, status: 'Active for bidding', endDate: '10/16/2025', bids: 0 },
  { id: 'q5', title: 'Linked List Odd Even', description: 'Rearrange a linked list such that all odd nodes come before even nodes.', difficulty: 'medium', startingBid: 800, status: 'Active for bidding', endDate: '10/16/2025', bids: 0 },
  { id: 'q6', title: 'Maximum Product Subarray', description: 'Find the contiguous subarray within an array which has the largest product.', difficulty: 'medium', startingBid: 1200, status: 'Active for bidding', endDate: '10/16/2025', bids: 0 },
  { id: 'q7', title: 'Best Time to Sell and Buy Stocks', description: 'Find the maximum profit from buying and selling stocks once.', difficulty: 'easy', startingBid: 500, status: 'Active for bidding', endDate: '10/16/2025', bids: 0 },
  { id: 'q8', title: 'Palindrome in Linked List', description: 'Check whether a linked list forms a palindrome.', difficulty: 'medium', startingBid: 1000, status: 'Active for bidding', endDate: '10/16/2025', bids: 0 },
  { id: 'q9', title: 'Binary Search', description: 'Implement an efficient binary search algorithm on a sorted array.', difficulty: 'easy', startingBid: 600, status: 'Active for bidding', endDate: '10/16/2025', bids: 0 },
  { id: 'q10', title: 'Median of Two Sorted Arrays', description: 'Find the median of two sorted arrays efficiently.', difficulty: 'hard', startingBid: 2000, status: 'Active for bidding', endDate: '10/16/2025', bids: 0 },
  { id: 'q11', title: 'Find Peak Element', description: 'Find a peak element in an array where neighbors are smaller.', difficulty: 'easy', startingBid: 500, status: 'Active for bidding', endDate: '10/16/2025', bids: 0 },
  { id: 'q12', title: 'Happy Number', description: 'Determine if a number is a happy number.', difficulty: 'easy', startingBid: 400, status: 'Active for bidding', endDate: '10/16/2025', bids: 0 },
  { id: 'q13', title: 'Reverse Words in a String', description: 'Reverse the order of words in a string.', difficulty: 'medium', startingBid: 900, status: 'Active for bidding', endDate: '10/16/2025', bids: 0 },
  { id: 'q14', title: 'Reverse Integer', description: 'Reverse digits of an integer and handle overflow.', difficulty: 'medium', startingBid: 800, status: 'Active for bidding', endDate: '10/16/2025', bids: 0 },
  { id: 'q15', title: 'Pascal Triangle / Some Pattern', description: 'Print Pascal Triangle or a specific numeric pattern.', difficulty: 'easy', startingBid: 500, status: 'Active for bidding', endDate: '10/16/2025', bids: 0 },
  { id: 'q16', title: 'Largest Rectangle in Histogram', description: 'Find the largest rectangle in a histogram.', difficulty: 'hard', startingBid: 1800, status: 'Active for bidding', endDate: '10/16/2025', bids: 0 },
  { id: 'q17', title: 'Climbing Stairs', description: 'Count the number of ways to climb stairs taking 1 or 2 steps.', difficulty: 'easy', startingBid: 400, status: 'Active for bidding', endDate: '10/16/2025', bids: 0 },
  { id: 'q18', title: 'Merge Sorted Array', description: 'Merge two sorted arrays into one sorted array.', difficulty: 'easy', startingBid: 500, status: 'Active for bidding', endDate: '10/16/2025', bids: 0 },
  { id: 'q19', title: 'Bubble Sort', description: 'Implement bubble sort algorithm.', difficulty: 'easy', startingBid: 400, status: 'Active for bidding', endDate: '10/16/2025', bids: 0 },
  { id: 'q20', title: 'Pre Order Traversal of Array', description: 'Perform pre-order traversal on a tree represented as an array.', difficulty: 'easy', startingBid: 600, status: 'Active for bidding', endDate: '10/16/2025', bids: 0 },
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
    console.log("🔥 Snapshot update detected: ", snapshot.docs.length);
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
          status = 'biddingclosed:🎉 You have won the bid!';
          //alert('biddingclosed:🎉 You have won the bid!');
        } else {
          status = 'Bidding Closed-you have lost the bid';
          //alert('Bidding Closed-you have lost the bid');
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
