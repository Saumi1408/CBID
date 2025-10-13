# CodeBid Admin (Front-end)

This is a small React + Vite front-end that implements a glossy navy-themed admin login and live bidding overview similar to the provided designs.

Features
- Email-only admin login (stores email in sessionStorage)
- Dashboard displaying participants, their team, bid amount and the question
- Rows cycle/highlight one-by-one to mimic a live feed

Quick start (Windows cmd.exe)

1. Install dependencies

   npm install

2. Run dev server

   npm run dev

Open http://localhost:5173 (or the address shown by vite)

Notes
- This is front-end only. Replace sample data in `src/pages/Dashboard.jsx` with your backend/websocket integration as needed.
