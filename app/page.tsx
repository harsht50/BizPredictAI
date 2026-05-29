"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const CARDS = [
  {
    href: "/evaluate",
    label: "Evaluate My Business Idea",
    sub: "Get AI-powered feasibility analysis, profit projections & risk assessment",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
      </svg>
    ),
  },
  {
    href: "/suggest",
    label: "Suggest a Business For Me",
    sub: "Discover tailored business ideas based on your location, budget & interests",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    ),
  },
  {
    href: "/history",
    label: "View Prediction History",
    sub: "Browse all your past evaluations and track trends over time",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    href: "/heatmap",
    label: "Startup Opportunity Heatmap",
    sub: "Visualise city-level opportunity scores across India on an interactive map",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="10" r="3" /><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      </svg>
    ),
  },
];

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<{ first: string; last: string; email: string } | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("vv_session");
    if (!stored) {
      router.push("/login");
    } else {
      setUser(JSON.parse(stored));
      setChecked(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("vv_session");
    router.push("/login");
  };

  if (!checked) return null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8fafc",
      color: "#0f172a",
      fontFamily: "'DM Sans', sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "60px 40px",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;600&family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        /* Subtle dot grid background */
        .bg-dots {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
          background-size: 28px 28px;
          opacity: 0.45;
        }
        /* Soft indigo glow top-center */
        .bg-glow {
          position: fixed; top: -200px; left: 50%; transform: translateX(-50%);
          width: 700px; height: 500px; pointer-events: none; z-index: 0;
          background: radial-gradient(ellipse, rgba(79,70,229,0.07) 0%, transparent 70%);
        }

        /* ── TOP BAR ── */
        .topbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 32px;
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #e2e8f0;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
        .topbar-logo {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;
        }
        .topbar-logo span { color: #4f46e5; }
        .topbar-right { display: flex; align-items: center; gap: 14px; }

        .user-pill {
          display: flex; align-items: center; gap: 8px;
          background: #f1f5f9; border: 1px solid #e2e8f0;
          border-radius: 999px; padding: 5px 14px 5px 6px;
        }
        .user-avatar {
          width: 26px; height: 26px; border-radius: 50%;
          background: #4f46e5; color: #fff;
          font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 0.68rem;
          display: flex; align-items: center; justify-content: center;
          letter-spacing: 0.5px;
        }
        .user-name {
          font-family: 'DM Mono', monospace; font-size: 0.72rem; color: #64748b;
        }

        .logout-btn {
          display: flex; align-items: center; gap: 6px;
          background: transparent; border: 1px solid #fecaca;
          border-radius: 8px; padding: 7px 14px;
          color: #ef4444; font-family: 'DM Mono', monospace;
          font-size: 0.72rem; letter-spacing: 1px; cursor: pointer; transition: all 0.2s;
        }
        .logout-btn:hover { background: #fef2f2; border-color: #fca5a5; }

        /* ── HERO ── */
        .eyebrow {
          font-family: 'DM Mono', monospace; font-size: 0.62rem; letter-spacing: 4px;
          text-transform: uppercase; color: #4f46e5; background: #eef2ff;
          border: 1px solid #c7d2fe; padding: 5px 14px; border-radius: 4px;
          margin-bottom: 28px; display: inline-block;
        }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.6rem, 5vw, 4rem); font-weight: 800;
          color: #0f172a; letter-spacing: -2px; line-height: 1.05;
          text-align: center; margin-bottom: 20px;
        }
        .hero-title span { color: #4f46e5; }

        .hero-sub {
          font-size: 0.95rem; color: #64748b; text-align: center;
          max-width: 500px; line-height: 1.75; margin-bottom: 52px;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── CARDS ── */
        .cards-grid {
          display: grid; grid-template-columns: repeat(2, 1fr);
          gap: 14px; width: 100%; max-width: 740px; position: relative; z-index: 1;
        }

        .nav-card {
          background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px;
          padding: 24px 26px; cursor: pointer;
          transition: border-color 0.2s, transform 0.18s, box-shadow 0.2s;
          text-align: left; display: flex; flex-direction: column; gap: 14px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
        .nav-card:hover {
          border-color: #c7d2fe;
          box-shadow: 0 8px 32px rgba(79,70,229,0.1);
          transform: translateY(-3px);
        }

        .card-icon {
          width: 42px; height: 42px; background: #eef2ff;
          border: 1px solid #c7d2fe; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          color: #4f46e5; flex-shrink: 0;
        }
        .card-label {
          font-family: 'Playfair Display', serif; font-size: 1rem; font-weight: 800;
          color: #0f172a; line-height: 1.25; margin-bottom: 6px;
        }
        .card-sub {
          font-family: 'DM Sans', sans-serif; font-size: 0.78rem;
          color: #94a3b8; line-height: 1.55;
        }

        .card-arrow {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: auto; padding-top: 4px;
        }
        .arrow-label {
          font-family: 'DM Mono', monospace; font-size: 0.6rem;
          letter-spacing: 2px; text-transform: uppercase;
          color: #cbd5e1; transition: color 0.2s;
        }
        .nav-card:hover .arrow-label { color: #4f46e5; }
        .arrow-icon { color: #cbd5e1; transition: color 0.2s, transform 0.2s; }
        .nav-card:hover .arrow-icon { color: #4f46e5; transform: translateX(3px); }

        /* ── FOOTER ── */
        .footer-note {
          margin-top: 52px;
          font-family: 'DM Mono', monospace; font-size: 0.6rem;
          letter-spacing: 2px; text-transform: uppercase;
          color: #cbd5e1; position: relative; z-index: 1;
        }
      `}</style>

      {/* Backgrounds */}
      <div className="bg-dots" />
      <div className="bg-glow" />

      {/* Top bar */}
      <div className="topbar">
        <div className="topbar-logo">Biz<span>Predict</span>AI</div>
        <div className="topbar-right">
          <div className="user-pill">
            <div className="user-avatar">{user?.first?.[0]}{user?.last?.[0]}</div>
            <span className="user-name">{user?.first} {user?.last}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Hero */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", marginTop: "60px" }}>
        <span className="eyebrow">AI — Powered Platform</span>
        <h1 className="hero-title">Biz<span>Predict</span>AI</h1>
        <p className="hero-sub">
          AI-powered startup feasibility analysis and business recommendation system — built for India&apos;s next generation of entrepreneurs.
        </p>

        <div className="cards-grid">
          {CARDS.map(({ href, label, sub, icon }) => (
            <div className="nav-card" key={href} onClick={() => router.push(href)}>
              <div className="card-icon">{icon}</div>
              <div>
                <p className="card-label">{label}</p>
                <p className="card-sub">{sub}</p>
              </div>
              <div className="card-arrow">
                <span className="arrow-label">Open</span>
                <span className="arrow-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>

        <p className="footer-note">BizPredictAI · Powered by AI</p>
      </div>
    </div>
  );
}
