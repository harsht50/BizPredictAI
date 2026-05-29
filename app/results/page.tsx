"use client";

import { useEffect, useState } from "react";

type ResultType = {
  mode: string;
  success?: number;
  profit?: number;
  risk?: string;
  advice?: string;
  recommendations?: string[];
  timestamp?: string;
};

export default function ResultsPage() {
  const [data, setData] = useState<ResultType | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("latestResult");
    if (stored) setData(JSON.parse(stored));
  }, []);

  if (!data) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');`}</style>
        <p style={{ fontFamily: "'DM Mono', monospace", color: "var(--text-faint)", letterSpacing: "3px", fontSize: "0.75rem", textTransform: "uppercase" }}>
          Loading…
        </p>
      </div>
    );
  }

  const getRiskClass = (risk?: string) =>
    risk === "High" ? "risk-high" : risk === "Medium" ? "risk-medium" : "risk-low";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "'DM Sans', sans-serif", padding: "40px 48px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .header { display: flex; align-items: center; gap: 16px; margin-bottom: 40px; border-bottom: 1px solid var(--border); padding-bottom: 24px; }
        .page-title { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 800; color: var(--text); letter-spacing: -0.5px; }
        .page-tag { font-family: 'DM Mono', monospace; font-size: 0.62rem; color: #4f46e5; background: var(--accent-bg); border: 1px solid var(--accent-border); padding: 4px 10px; border-radius: 4px; letter-spacing: 2px; text-transform: uppercase; }

        .eval-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 22px; max-width: 780px; }
        .metric-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 14px; padding: 22px 24px; box-shadow: var(--shadow); }
        .metric-label { font-family: 'DM Mono', monospace; font-size: 0.58rem; letter-spacing: 3px; text-transform: uppercase; color: var(--text-faint); margin-bottom: 10px; }
        .metric-value { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 800; color: #4f46e5; line-height: 1; }

        .risk-badge { font-family: 'DM Mono', monospace; font-size: 0.7rem; padding: 5px 14px; border-radius: 999px; letter-spacing: 1px; display: inline-block; }
        .risk-high { background: var(--danger-bg); color: var(--danger-text); border: 1px solid var(--danger-border); }
        .risk-medium { background: var(--warning-bg); color: var(--warning-text); border: 1px solid var(--warning-border); }
        .risk-low { background: var(--success-bg); color: var(--success-text); border: 1px solid var(--success-border); }

        .progress-track { background: var(--border); height: 5px; border-radius: 999px; margin-top: 12px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #4f46e5, #818cf8); border-radius: 999px; }

        .advice-box { background: var(--accent-bg); border: 1px solid var(--accent-border); border-left: 3px solid #4f46e5; border-radius: 10px; padding: 20px 22px; max-width: 780px; margin-bottom: 18px; }
        .advice-label { font-family: 'DM Mono', monospace; font-size: 0.55rem; letter-spacing: 3px; color: #4f46e5; text-transform: uppercase; margin-bottom: 8px; }
        .advice-text { font-size: 0.88rem; color: var(--text-muted); line-height: 1.7; }

        .timestamp { font-family: 'DM Mono', monospace; font-size: 0.65rem; color: var(--text-faint); letter-spacing: 1px; margin-top: 4px; }

        .suggest-header { margin-bottom: 24px; max-width: 780px; }
        .suggest-title { font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 800; color: var(--text); margin-bottom: 5px; }
        .suggest-sub { font-family: 'DM Mono', monospace; font-size: 0.62rem; letter-spacing: 2px; text-transform: uppercase; color: var(--text-faint); }

        .rec-list { display: flex; flex-direction: column; gap: 10px; max-width: 780px; }
        .rec-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 16px 22px; display: flex; align-items: flex-start; gap: 16px; transition: border-color 0.2s, transform 0.15s, box-shadow 0.2s; cursor: default; box-shadow: var(--shadow); }
        .rec-card:hover { border-color: var(--accent-border); transform: translateX(4px); box-shadow: var(--shadow-md); }
        .rec-index { font-family: 'DM Mono', monospace; font-size: 0.68rem; color: #4f46e5; background: var(--accent-bg); border: 1px solid var(--accent-border); border-radius: 6px; padding: 4px 10px; min-width: 36px; text-align: center; flex-shrink: 0; margin-top: 2px; }
        .rec-text { font-size: 0.9rem; color: var(--text-muted); line-height: 1.6; }
      `}</style>

      <div className="header">
        <h1 className="page-title">Analysis Results</h1>
        <span className="page-tag">{data.mode === "evaluate" ? "Evaluation" : "Suggestions"}</span>
      </div>

      {data.mode === "evaluate" && (
        <>
          <div className="eval-grid">
            <div className="metric-card">
              <p className="metric-label">Success Probability</p>
              <div className="metric-value">{data.success}%</div>
              <div className="progress-track"><div className="progress-fill" style={{ width: `${data.success}%` }} /></div>
            </div>
            <div className="metric-card">
              <p className="metric-label">Expected Profit</p>
              <div className="metric-value" style={{ fontSize: "1.6rem" }}>₹{data.profit}</div>
            </div>
            <div className="metric-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <p className="metric-label">Risk Level</p>
              <span className={`risk-badge ${getRiskClass(data.risk)}`}>{data.risk}</span>
            </div>
          </div>
          {data.advice && (
            <div className="advice-box">
              <p className="advice-label">AI Advice</p>
              <p className="advice-text">{data.advice}</p>
            </div>
          )}
          {data.timestamp && <p className="timestamp">{data.timestamp}</p>}
        </>
      )}

      {data.mode === "suggest" && (
        <>
          <div className="suggest-header">
            <p className="suggest-title">Recommended Business Ideas</p>
            <p className="suggest-sub">{data.recommendations?.length ?? 0} ideas found</p>
          </div>
          <div className="rec-list">
            {data.recommendations?.map((item, index) => (
              <div className="rec-card" key={index}>
                <span className="rec-index">{String(index + 1).padStart(2, "0")}</span>
                <p className="rec-text">{item}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
