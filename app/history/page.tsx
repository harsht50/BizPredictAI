"use client";

import { useEffect, useState } from "react";

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("all"); // all / Low / Medium / High

  useEffect(() => {
    fetch("/api/history")
      .then(res => (res.ok ? res.json() : { history: [] }))
      .then(data => setHistory(Array.isArray(data.history) ? data.history : []))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? history : history.filter(h => h.risk === filter);

  const riskClass = (r: string) =>
    r === "High" ? "risk-high" : r === "Medium" ? "risk-medium" : "risk-low";

  const tierBadge = (t: number) =>
    t === 1 ? "tier-1" : t === 2 ? "tier-2" : "tier-3";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "'DM Sans', sans-serif", padding: "36px 44px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .page-header { display: flex; align-items: center; gap: 14px; margin-bottom: 32px; padding-bottom: 22px; border-bottom: 1px solid var(--border); }
        .page-title  { font-family: 'Playfair Display', serif; font-size: 1.9rem; font-weight: 800; color: var(--text); letter-spacing: -0.5px; }
        .page-tag    { font-family: 'DM Mono', monospace; font-size: 0.6rem; color: #4f46e5; background: var(--accent-bg); border: 1px solid var(--accent-border); padding: 4px 10px; border-radius: 4px; letter-spacing: 2px; text-transform: uppercase; }
        .count-badge { font-family: 'DM Mono', monospace; font-size: 0.68rem; color: var(--text-muted); background: var(--bg-card); border: 1px solid var(--border); padding: 4px 12px; border-radius: 999px; margin-left: auto; }

        /* Filter row */
        .filter-row { display: flex; gap: 7px; margin-bottom: 18px; }
        .f-btn { font-family: 'DM Mono', monospace; font-size: 0.62rem; letter-spacing: 1px; text-transform: uppercase; padding: 6px 14px; border-radius: 8px; border: 1.5px solid var(--border); background: transparent; color: var(--text-faint); cursor: pointer; transition: all 0.15s; }
        .f-btn.active   { border-color: #4f46e5; background: var(--accent-bg); color: #4f46e5; }
        .f-btn.f-low    { border-color: var(--success-border); color: var(--success-text); }
        .f-btn.f-medium { border-color: var(--warning-border); color: var(--warning-text); }
        .f-btn.f-high   { border-color: var(--danger-border);  color: var(--danger-text);  }

        /* Table */
        .table-wrap   { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; box-shadow: var(--shadow); }
        .table-header { display: grid; grid-template-columns: 1.1fr 1.3fr 0.9fr 0.7fr 0.9fr 0.7fr 0.7fr 0.8fr 0.7fr; padding: 12px 22px; background: var(--bg); border-bottom: 1px solid var(--border); }
        .th           { font-family: 'DM Mono', monospace; font-size: 0.55rem; letter-spacing: 2px; text-transform: uppercase; color: var(--text-faint); }

        .table-row { display: grid; grid-template-columns: 1.1fr 1.3fr 0.9fr 0.7fr 0.9fr 0.7fr 0.7fr 0.8fr 0.7fr; padding: 13px 22px; border-bottom: 1px solid var(--border-light); transition: background 0.12s; align-items: center; }
        .table-row:last-child { border-bottom: none; }
        .table-row:hover { background: var(--bg); }

        .td         { font-family: 'DM Mono', monospace; font-size: 0.78rem; color: var(--text-muted); }
        .td-city    { color: var(--text); font-weight: 600; font-family: 'DM Sans', sans-serif; }
        .td-accent  { color: #4f46e5; font-weight: 600; }

        .risk-badge  { font-family: 'DM Mono', monospace; font-size: 0.6rem; padding: 2px 8px; border-radius: 999px; display: inline-block; }
        .risk-high   { background: var(--danger-bg);  color: var(--danger-text);  border: 1px solid var(--danger-border); }
        .risk-medium { background: var(--warning-bg); color: var(--warning-text); border: 1px solid var(--warning-border); }
        .risk-low    { background: var(--success-bg); color: var(--success-text); border: 1px solid var(--success-border); }

        .tier-badge { font-family: 'DM Mono', monospace; font-size: 0.58rem; padding: 2px 7px; border-radius: 5px; display: inline-block; }
        .tier-1 { background: var(--accent-bg); color: #4f46e5; border: 1px solid var(--accent-border); }
        .tier-2 { background: var(--warning-bg); color: var(--warning-text); border: 1px solid var(--warning-border); }
        .tier-3 { background: var(--border); color: var(--text-faint); border: 1px solid var(--border); }

        .empty-state { padding: 60px 24px; text-align: center; }
        .empty-icon  { font-size: 2rem; margin-bottom: 14px; opacity: 0.2; }
        .empty-text  { font-family: 'DM Mono', monospace; font-size: 0.7rem; letter-spacing: 2px; color: var(--text-faint); text-transform: uppercase; }
        .empty-hint  { font-family: 'DM Sans', sans-serif; font-size: 0.78rem; color: var(--text-faint); margin-top: 8px; }

        .loading-state { padding: 60px 24px; text-align: center; }
        .spinner { width: 26px; height: 26px; border: 2px solid var(--border); border-top-color: #4f46e5; border-radius: 50%; animation: spin 0.75s linear infinite; margin: 0 auto 14px; }
        .loading-text { font-family: 'DM Mono', monospace; font-size: 0.62rem; letter-spacing: 3px; text-transform: uppercase; color: var(--text-faint); }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="page-header">
        <h1 className="page-title">Prediction History</h1>
        <span className="page-tag">Log</span>
        {!loading && history.length > 0 && (
          <span className="count-badge">{history.length} entries</span>
        )}
      </div>

      <div className="filter-row">
        {[
          { val: "all",    label: "All" },
          { val: "Low",    label: "Low Risk",    cls: "f-low" },
          { val: "Medium", label: "Medium Risk",  cls: "f-medium" },
          { val: "High",   label: "High Risk",    cls: "f-high" },
        ].map(({ val, label, cls }) => (
          <button key={val} className={`f-btn ${filter === val ? "active" : ""} ${cls || ""}`} onClick={() => setFilter(val)}>
            {label}
          </button>
        ))}
      </div>

      <div className="table-wrap">
        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p className="loading-text">Loading history…</p>
          </div>
        ) : (
          <>
            <div className="table-header">
              {["City","Industry","Investment","Success","Profit","ROI","Break-even","Risk","Tier"].map(h => (
                <span className="th" key={h}>{h}</span>
              ))}
            </div>
            {filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">⊘</div>
                <p className="empty-text">No records found</p>
                <p className="empty-hint">Run a prediction first to see results here</p>
              </div>
            ) : (
              filtered.map((h: any, i: number) => (
                <div className="table-row" key={i}>
                  <span className="td td-city">{h.location}</span>
                  <span className="td">{h.industry}</span>
                  <span className="td">₹{Number(h.investment).toLocaleString()}</span>
                  <span className="td td-accent">{h.success}%</span>
                  <span className="td td-accent">₹{Number(h.profit).toLocaleString()}</span>
                  <span className="td">{h.roi_percent ?? "—"}%</span>
                  <span className="td">{h.break_even_months ?? "—"}mo</span>
                  <span className={`risk-badge ${riskClass(h.risk)}`}>{h.risk}</span>
                  <span className={`tier-badge ${tierBadge(h.city_tier)}`}>T{h.city_tier ?? "?"}</span>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}