import React, { useEffect, useState, useRef } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { database } from "../../../firebaseconfig";

let SAMPLE_PARTICIPANTS = [];

export async function getAllBids() {
  try {
    const bidsRef = collection(database, "bids");
    const querySnapshot = await getDocs(bidsRef);

    // Map docs to normal objects, include doc.id as id field
    SAMPLE_PARTICIPANTS = querySnapshot.docs.map(doc => {
      return { id: doc.id, ...doc.data() };
    });

    return { success: true, SAMPLE_PARTICIPANTS };
  } catch (error) {
    console.error("Error fetching all bids:", error);
    return { success: false, error };
  }
}


export default function Dashboard(){
  const [participants, setParticipants] = useState([]);
  const [index, setIndex] = useState(0);
  const [updatedId, setUpdatedId] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Load bids on mount
    getAllBids().then(({ success, SAMPLE_PARTICIPANTS }) => {
      if (success) {
        setParticipants(SAMPLE_PARTICIPANTS);
      } else {
        alert('Failed to load bids');
      }
    });
  }, []);

  useEffect(() => {
    if (participants.length === 0) return;
    intervalRef.current = setInterval(() => {
      setIndex(i => (i + 1) % participants.length);
    }, 3000);
    return () => clearInterval(intervalRef.current);
  }, [participants.length]);


  function logout() {
    sessionStorage.removeItem('adminEmail');
    window.location.href = '/login';
  }


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
            </div>
            {participants.map((p, i) => (
              <div key={p.id} className={"row " + (i === index ? 'active' : '') + (updatedId === p.id ? ' updated' : '')}>
                <div className="cell team">{p.teamName}</div>
                <div className="cell bid">₹{p.finalBidAmount}</div>
                <div className="cell question">{p.problemName}</div>
              </div>
            ))}
          </div>
        </div>


        <div className="stats-row">
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button className="btn small" onClick={() => { clearInterval(intervalRef.current); intervalRef.current = null }}>Pause</button>
            <button className="btn small" onClick={() => { if (!intervalRef.current) { intervalRef.current = setInterval(() => setIndex(i => (i + 1) % participants.length), 3000) } }}>Resume</button>
            <button className="btn small" onClick={() => {
              // simulate a random bid update and highlight row
              setParticipants(prev => {
                const copy = [...prev];
                const idx = Math.floor(Math.random() * copy.length);
                copy[idx] = { ...copy[idx], bid: copy[idx].bid + Math.floor(Math.random() * 500) + 50 };
                setUpdatedId(copy[idx].id);
                // clear highlight after animation
                setTimeout(() => setUpdatedId(null), 1200);
                return copy;
              });
            }}>Simulate Bid</button>
          </div>
          <div className="stat">Total Participants:<div className="stat-val">{participants.length}</div></div>
          <div className="stat">Active Bids:<div className="stat-val">{participants.length - 1}</div></div>
          <div className="stat">Total Bidding Volume:<div className="stat-val">₹{participants.reduce((s, p) => s + p.finalBidAmount, 0)}</div></div>
        </div>
      </main>


      <footer className="footer">Admin dashboard — for admin use only</footer>
    </div>
  )
}
