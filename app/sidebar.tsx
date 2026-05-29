"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  {
    href: "/evaluate",
    label: "Evaluate",
    sub: "Analyse a business",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
      </svg>
    ),
  },
  {
    href: "/suggest",
    label: "Suggest",
    sub: "Generate ideas",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    ),
  },
  {
    href: "/compare",
    label: "Compare",
    sub: "Side-by-side scorecard",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="18" rx="1" /><rect x="14" y="3" width="7" height="18" rx="1" />
      </svg>
    ),
  },
  {
    href: "/heatmap",
    label: "Heatmap",
    sub: "City opportunities",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="10" r="3" /><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      </svg>
    ),
  },
  {
    href: "/history",
    label: "History",
    sub: "Past predictions",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    href: "/results",
    label: "Results",
    sub: "Latest analysis",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 9h6M9 13h6M9 17h4" />
      </svg>
    ),
  },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [dark, setDark]       = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname              = usePathname();

  useEffect(() => {
    const saved = localStorage.getItem("biz_theme");
    const isDark = saved === "dark";
    setDark(isDark);
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setDark(prev => {
      const next = !prev;
      localStorage.setItem("biz_theme", next ? "dark" : "light");
      document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
      return next;
    });
  };

  if (!mounted) return null;

  const d = {
    sidebar:         dark ? "#0d0d24"                : "#ffffff",
    sidebarBorder:   dark ? "rgba(255,255,255,0.06)" : "#e2e8f0",
    logoBorder:      dark ? "rgba(255,255,255,0.05)" : "#f1f5f9",
    logoText:        dark ? "#ffffff"                : "#0f172a",
    logoSub:         dark ? "#4a5568"                : "#94a3b8",
    sectionLabel:    dark ? "#2d3748"                : "#cbd5e1",
    navDefault:      dark ? "#718096"                : "#94a3b8",
    navHoverBg:      dark ? "rgba(255,255,255,0.04)" : "#f8fafc",
    navHoverText:    dark ? "#a0aec0"                : "#475569",
    navActiveBg:     dark ? "rgba(79,70,229,0.12)"   : "#eef2ff",
    navActiveBorder: dark ? "rgba(79,70,229,0.3)"    : "#c7d2fe",
    navSubActive:    "#a5b4fc",
    navSubDefault:   dark ? "#4a5568"                : "#cbd5e1",
    footerBorder:    dark ? "rgba(255,255,255,0.05)" : "#f1f5f9",
    footerText:      dark ? "#2d3748"                : "#cbd5e1",
    toggleBg:        dark ? "#1e1e3f"                : "#f1f5f9",
    toggleBorder:    dark ? "rgba(255,255,255,0.08)" : "#e2e8f0",
    toggleText:      dark ? "#718096"                : "#64748b",
  };

  return (
    <>
      <style>{`
        .nav-link {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 12px; border-radius: 10px;
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
          border: 1px solid transparent;
        }
        .nav-item-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem; font-weight: 600;
          display: block; line-height: 1; margin-bottom: 3px;
          color: inherit;
        }
        .nav-item-sub {
          font-family: 'DM Mono', monospace;
          font-size: 0.56rem; display: block; letter-spacing: 0.5px;
        }
        .toggle-track {
          width: 36px; height: 20px; border-radius: 999px;
          position: relative; transition: background 0.25s; flex-shrink: 0;
        }
        .toggle-thumb {
          position: absolute; top: 3px; width: 14px; height: 14px;
          border-radius: 50%; background: #fff;
          transition: left 0.25s cubic-bezier(.4,0,.2,1);
          box-shadow: 0 1px 4px rgba(0,0,0,0.2);
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; } 50% { opacity: 0.25; }
        }
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)", transition: "background 0.3s" }}>

        {/* SIDEBAR */}
        <aside style={{
          width: "220px", minHeight: "100vh",
          background: d.sidebar,
          borderRight: `1px solid ${d.sidebarBorder}`,
          display: "flex", flexDirection: "column", flexShrink: 0,
          position: "sticky", top: 0, height: "100vh",
          transition: "background 0.3s, border-color 0.3s",
        }}>
          {/* Logo */}
          <div style={{ padding: "24px 22px 20px", borderBottom: `1px solid ${d.logoBorder}` }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 800, color: d.logoText, letterSpacing: "-0.5px", lineHeight: 1 }}>
              Biz<span style={{ color: "#4f46e5" }}>Predict</span>AI
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.52rem", letterSpacing: "2.5px", textTransform: "uppercase", color: d.logoSub, marginTop: "5px" }}>
              Business Intelligence
            </div>
          </div>

          {/* Nav */}
          <nav style={{ padding: "18px 12px", flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.52rem", letterSpacing: "3px", textTransform: "uppercase", color: d.sectionLabel, padding: "0 10px", marginBottom: "10px" }}>
              Navigation
            </p>
            {NAV.map(({ href, label, sub, icon }) => {
              const isActive = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className="nav-link"
                  style={{
                    color: isActive ? "#4f46e5" : d.navDefault,
                    background: isActive ? d.navActiveBg : "transparent",
                    borderColor: isActive ? d.navActiveBorder : "transparent",
                  }}
                  onMouseEnter={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.background = d.navHoverBg; (e.currentTarget as HTMLElement).style.color = d.navHoverText; } }}
                  onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = d.navDefault; } }}
                >
                  <span style={{ flexShrink: 0 }}>{icon}</span>
                  <span>
                    <span className="nav-item-label">{label}</span>
                    <span className="nav-item-sub" style={{ color: isActive ? d.navSubActive : d.navSubDefault }}>{sub}</span>
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div style={{ padding: "14px 12px", borderTop: `1px solid ${d.footerBorder}`, display: "flex", flexDirection: "column", gap: "10px" }}>
            <button onClick={toggleTheme} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderRadius: "10px", padding: "10px 14px", cursor: "pointer", background: d.toggleBg, border: `1px solid ${d.toggleBorder}`, width: "100%" }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "2px", textTransform: "uppercase", color: d.toggleText }}>
                {dark ? "☾  Dark" : "☀  Light"}
              </span>
              <div className="toggle-track" style={{ background: dark ? "#4f46e5" : "#e2e8f0" }}>
                <div className="toggle-thumb" style={{ left: dark ? "19px" : "3px" }} />
              </div>
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "0 2px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4f46e5", flexShrink: 0, animation: "pulse-dot 2s ease-in-out infinite" }} />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", letterSpacing: "2px", textTransform: "uppercase", color: d.footerText }}>
                AI Engine Active
              </span>
            </div>
          </div>
        </aside>

        <main style={{ flex: 1, overflowY: "auto", background: "var(--bg)", transition: "background 0.3s" }}>
          {children}
        </main>
      </div>
    </>
  );
}