import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  useEffect(()=>{
    // if admin is already logged in, go to dashboard
    const e = sessionStorage.getItem('adminEmail')
    if(e) navigate('/dashboard')
  }, [navigate])

  function handleSubmit(e){
    e.preventDefault()
    // simple email-only login: store admin email in session and go to dashboard
    sessionStorage.setItem('adminEmail', email)
    navigate('/dashboard')
  }

  return (
    <div className="page login-page">
  <div className="money-bg" />
  <div className="bg-overlay dim light" />
      <div className="login-card">
        <h1 className="title">ADMIN LOGIN</h1>
        <p className="subtitle">Enter your admin email to access the live bidding overview</p>

        <form onSubmit={handleSubmit} className="login-form">
          <label className="label">Email Address</label>
          <div className="input-wrap">
            <span className="input-icon" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6.5C3 5.67157 3.67157 5 4.5 5H19.5C20.3284 5 21 5.67157 21 6.5V17.5C21 18.3284 20.3284 19 19.5 19H4.5C3.67157 19 3 18.3284 3 17.5V6.5Z" stroke="rgba(255,255,255,0.9)" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 6L12 12.5L3 6" stroke="rgba(255,255,255,0.9)" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            <input
              className="input"
              type="email"
              placeholder="name@admin.com"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoFocus
              aria-label="Admin email address"
            />
          </div>

          <button className="btn primary">LOG IN</button>
        </form>
      </div>
    </div>
  )
}
