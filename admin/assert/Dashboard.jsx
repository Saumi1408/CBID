import React, { useEffect, useState, useRef } from 'react';
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { database } from "../firebaseconfig";

//  get highest bid per question
function getWinners(participants) {
  const winnersMap = {};
  participants.forEach(p => {
    const currentMax = winnersMap[p.problemName];
    const bidAmount = p.finalBidAmount || 0;
    if (!currentMax || bidAmount > currentMax.finalBidAmount) {
      winnersMap[p.problemName] = p;
    }
  });
  return Object.values(winnersMap);
}

export default function Dashboard({ sendMessage }) {
  const [participants, setParticipants] = useState([]);
  const [index, setIndex] = useState(0);
  const [updatedId, setUpdatedId] = useState(null);
  const [wonTeams, setWonTeams] = useState({}); // ✅ to mark “Bid Won”
  const intervalRef = useRef(null);

  // Real-time Firestore listener
  useEffect(() => {
    const bidsRef = collection(database, "bids");
    const unsubscribe = onSnapshot(bidsRef, (snapshot) => {
      console.log("🔥 Snapshot update detected: ", snapshot.docs.length);
      const allBids = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setParticipants(allBids);
    });

    return () => unsubscribe();
  }, []);

  // Auto-scroll between participants
  useEffect(() => {
    if (participants.length === 0) return;
    intervalRef.current = setInterval(() => {
      setIndex(i => (i + 1) % participants.length);
    }, 3000);
    return () => clearInterval(intervalRef.current);
  }, [participants.length]);

  // Logout
  function logout() {
    sessionStorage.removeItem('adminEmail');
    window.location.href = '/login';
  }

  // Simulate bid update
  function simulateBid() {
    setParticipants(prev => {
      const copy = [...prev];
      const idx = Math.floor(Math.random() * copy.length);
      copy[idx] = {
        ...copy[idx],
        finalBidAmount: (copy[idx].finalBidAmount || 0) + Math.floor(Math.random() * 500) + 50
      };
      setUpdatedId(copy[idx].id);
      setTimeout(() => setUpdatedId(null), 1200);
      return copy;
    });
  }

  // Mark problem as completed
  async function markProblemCompleted(participantId) {
    try {
      const participantRef = doc(database, "bids", participantId);
      await updateDoc(participantRef, { completed: true });
      alert("successfully Problem marked as completed!");
    } catch (error) {
      console.error("Error updating completion:", error);
      alert("Failed to mark completed.");
    }
  }
async function notifyTeam(participant) {
  try {
    const winners = getWinners(participants); // get current winning bids
    const winnerForQuestion = winners.find(w => w.problemName === participant.problemName);

    const participantRef = doc(database, "bids", participant.id);
    await updateDoc(participantRef, {
      biddingClosed: true,
      message: winnerForQuestion?.teamName === participant.teamName
        ? "bidding closed:🎉 You have won the bid!"
        : "Bidding Closed:sorry you have lost the bid!! ",
    });

    // Update local wonTeams state
    setWonTeams(prev => ({ ...prev, [participant.id]: true }));

    alert(`Message sent to team ${participant.teamName}`);
  } catch (error) {
    console.error("Error sending message:", error);
    alert("Failed to notify team.");
  }
}

  const winners = getWinners(participants);

  return (
    <div className="page dashboard-page">
      <div className="money-bg" />
      <header className="topbar">
        <div className="logo">CODEBID <span className="accent">ADMIN</span></div>
        <nav className="nav">
          <button className="logout-btn" onClick={logout}>Logout</button>
        </nav>
      </header>

      <main className="container">
        <h2 className="section-title">LIVE BIDDING OVERVIEW</h2>

        <div className="card table-card">
          <div className="table">
            <div className="thead">
              <div>Team</div>
              <div>Bidding Amount</div>
              <div>Question</div>
              <div>Status</div>
              <div>Actions</div>
            </div>

            {winners.map(p => (
              <div key={p.id} className={"row " + (updatedId === p.id ? ' updated' : '')}>
                <div className="cell team">{p.teamName}</div>
                <div className="cell bid">₹{p.finalBidAmount}</div>
                <div className="cell question">{p.problemName}</div>

                {/* ✅ Status Column */}
                <div className="cell status">
                  {p.completed
                    ? "✅ Completed"
                    : wonTeams[p.id]
                    ? "🏆 Bid Won"
                    : "❌ In Progress"}
                </div>

                <div className="cell actions">
                  <button className="btn small" onClick={() => notifyTeam(p)}>
                    Send win
                  </button>
                  <button className="btn small" onClick={() => markProblemCompleted(p.id)}>
                    Mark Completed
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="stats-row">
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button
              className="btn small"
              onClick={() => {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
              }}
            >
              Pause
            </button>
            <button
              className="btn small"
              onClick={() => {
                if (!intervalRef.current)
                  intervalRef.current = setInterval(
                    () => setIndex(i => (i + 1) % participants.length),
                    3000
                  );
              }}
            >
              Resume
            </button>
            <button className="btn small" onClick={simulateBid}>
              Simulate Bid
            </button>
          </div>
          <div className="stat">
            Total Questions:<div className="stat-val">{winners.length}</div>
          </div>
          <div className="stat">
            Total Bidding Volume:
            <div className="stat-val">
              ₹{participants.reduce((s, p) => s + (p.finalBidAmount || 0), 0)}
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">Admin dashboard — for admin use only</footer>
    </div>
  );
}
