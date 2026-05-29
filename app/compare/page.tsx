"use client";

import { useState } from "react";

const BUSINESS_IDEAS = [
  "Cloud Kitchen", "Digital Marketing Agency", "EV Charging Station",
  "Fitness Studio", "Online Education Platform", "Organic Grocery Store",
  "Co-working Space", "Pet Care Services", "Mobile Repair Shop",
  "Retail Store", "E-commerce Store", "Health Diagnostics Lab",
  "Solar Installation", "Food Delivery Hub", "AI Services Firm",
];

export default function ComparePage() {
  const [location, setLocation]         = useState("");
  const [investment, setInvestment]     = useState("");
  const [experience, setExperience]     = useState("");
  const [riskAppetite, setRiskAppetite] = useState("moderate");
  const [selected, setSelected]         = useState<string[]>([]);
  const [results, setResults]           = useState<any[]>([]);
  const [loading, setLoading]           = useState(false);

  const toggleIdea = (idea: string) => {
    setSelected(prev =>
      prev.includes(idea) ? prev.filter(i => i !== idea) : prev.length < 3 ? [...prev, idea] : prev
    );
  };

  const compare = async () => {
    if (!location || !investment || selected.length < 2) {
      alert("Select 2–3 business ideas and fill required fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location, investment: Number(investment), experience: Number(experience), riskAppetite, ideas: selected }),
      });
      const data = await res.json();
      setResults(data.comparisons || []);
    } catch {
      alert("Could not connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  const riskClass = (r: string) =>
    r === "High" ? "risk-high" : r === "Medium" ? "risk-medium" : "risk-low";

  const rankColors = ["#4f46e5", "#22c55e", "#f59e0b"];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "'DM Sans', sans-serif", padding: "36px 44px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .page-header { display: flex; align-items: center; gap: 14px; margin-bottom: 32px; padding-bottom: 22px; border-bottom: 1px solid var(--border); }
        .page-title  { font-family: 'Playfair Display', serif; font-size: 1.9rem; font-weight: 800; color: var(--text); letter-spacing: -0.5px; }
        .page-tag    { font-family: 'DM Mono', monospace; font-size: 0.6rem; color: #4f46e5; background: var(--accent-bg); border: 1px solid var(--accent-border); padding: 4px 10px; border-radius: 4px; letter-spacing: 2px; text-transform: uppercase; }

        .layout { display: grid; grid-template-columns: 280px 1fr; gap: 22px; }

        .panel { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 24px; box-shadow: var(--shadow); margin-bottom: 16px; }
        .panel-title { font-family: 'DM Mono', monospace; font-size: 0.56rem; letter-spacing: 3px; text-transform: uppercase; color: var(--text-faint); margin-bottom: 18px; }

        .field-group  { margin-bottom: 12px; }
        .field-label  { display: block; font-size: 0.66rem; font-family: 'DM Mono', monospace; color: var(--text-muted); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 6px; }
        .field-input  { width: 100%; background: var(--bg-input); border: 1.5px solid var(--border); border-radius: 10px; color: var(--text); padding: 10px 13px; font-family: 'DM Mono', monospace; font-size: 0.85rem; outline: none; transition: border-color 0.2s; }
        .field-input:focus { border-color: #4f46e5; }
        .field-input::placeholder { color: var(--text-placeholder); }

        .seg { display: flex; border: 1.5px solid var(--border); border-radius: 10px; overflow: hidden; }
        .seg-btn { flex: 1; padding: 8px 4px; background: transparent; border: none; font-family: 'DM Mono', monospace; font-size: 0.63rem; color: var(--text-faint); cursor: pointer; transition: all 0.15s; text-align: center; }
        .seg-btn.active { background: #4f46e5; color: #fff; }
        .seg-btn:not(:last-child) { border-right: 1.5px solid var(--border); }

        /* Idea chips */
        .idea-grid { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 16px; }
        .idea-chip { font-family: 'DM Mono', monospace; font-size: 0.65rem; padding: 6px 12px; border-radius: 8px; border: 1.5px solid var(--border); background: transparent; color: var(--text-faint); cursor: pointer; transition: all 0.15s; }
        .idea-chip:hover { border-color: var(--accent-border); color: #4f46e5; }
        .idea-chip.selected { background: #4f46e5; border-color: #4f46e5; color: #fff; }

        .compare-btn { width: 100%; padding: 13px; background: #4f46e5; border: none; border-radius: 10px; color: #fff; font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 0.88rem; cursor: pointer; transition: all 0.2s; }
        .compare-btn:hover:not(:disabled) { background: #4338ca; transform: translateY(-1px); }
        .compare-btn:disabled { opacity: 0.45; cursor: not-allowed; }

        /* Comparison table */
        .compare-grid { display: grid; gap: 14px; }
        .result-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; box-shadow: var(--shadow); transition: border-color 0.2s; }
        .result-card:hover { border-color: var(--accent-border); }

        .card-top { padding: 18px 22px 16px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-light); }
        .rank-badge { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-family: 'DM Mono', monospace; font-size: 0.7rem; font-weight: 600; color: #fff; flex-shrink: 0; }
        .card-name  { font-family: 'Playfair Display', serif; font-size: 1.05rem; font-weight: 800; color: var(--text); }

        .metrics-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--border-light); }
        .metric-cell { background: var(--bg-card); padding: 14px 16px; }
        .metric-lbl  { font-family: 'DM Mono', monospace; font-size: 0.52rem; letter-spacing: 2px; text-transform: uppercase; color: var(--text-faint); margin-bottom: 4px; }
        .metric-val  { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 800; color: #4f46e5; }

        .sc-section { padding: 14px 22px 18px; }
        .sc-title  { font-family: 'DM Mono', monospace; font-size: 0.52rem; letter-spacing: 2px; text-transform: uppercase; color: var(--text-faint); margin-bottom: 10px; }
        .sc-row    { margin-bottom: 8px; }
        .sc-meta   { display: flex; justify-content: space-between; margin-bottom: 4px; }
        .sc-key    { font-family: 'DM Mono', monospace; font-size: 0.6rem; color: var(--text-muted); text-transform: capitalize; }
        .sc-val    { font-family: 'DM Mono', monospace; font-size: 0.6rem; color: #4f46e5; }
        .sc-track  { background: var(--border); height: 3px; border-radius: 999px; overflow: hidden; }
        .sc-fill   { height: 100%; border-radius: 999px; }

        .risk-badge  { font-family: 'DM Mono', monospace; font-size: 0.62rem; padding: 3px 10px; border-radius: 999px; }
        .risk-high   { background: var(--danger-bg);  color: var(--danger-text);  border: 1px solid var(--danger-border); }
        .risk-medium { background: var(--warning-bg); color: var(--warning-text); border: 1px solid var(--warning-border); }
        .risk-low    { background: var(--success-bg); color: var(--success-text); border: 1px solid var(--success-border); }

        .advice-chip { background: var(--accent-bg); border: 1px solid var(--accent-border); border-left: 3px solid #4f46e5; border-radius: 8px; padding: 10px 14px; margin: 0 22px 16px; }
        .advice-text { font-size: 0.78rem; color: var(--text-muted); line-height: 1.6; }

        .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 320px; gap: 14px; text-align: center; }
        .spinner { width: 28px; height: 28px; border: 2px solid var(--border); border-top-color: #4f46e5; border-radius: 50%; animation: spin 0.75s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="page-header">
        <h1 className="page-title">Business Comparison</h1>
        <span className="page-tag">Scorecard</span>
      </div>

      <div className="layout">
        {/* LEFT */}
        <div>
          <div className="panel">
            <p className="panel-title">Parameters</p>

            <div className="field-group">
              <label className="field-label">City</label>
              <input className="field-input" placeholder="e.g. Pune" value={location} onChange={e => setLocation(e.target.value)} />
            </div>
            <div className="field-group">
              <label className="field-label">Investment (₹)</label>
              <input className="field-input" type="number" placeholder="e.g. 500000" value={investment} onChange={e => setInvestment(e.target.value)} />
            </div>
            <div className="field-group">
              <label className="field-label">Experience (Years)</label>
              <input className="field-input" type="number" placeholder="e.g. 3" value={experience} onChange={e => setExperience(e.target.value)} />
            </div>
            <div className="field-group">
              <label className="field-label">Risk Appetite</label>
              <div className="seg">
                {["conservative","moderate","aggressive"].map(v => (
                  <button key={v} className={`seg-btn ${riskAppetite === v ? "active" : ""}`} onClick={() => setRiskAppetite(v)}>{v.slice(0,4)}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="panel">
            <p className="panel-title">Select 2–3 Business Ideas</p>
            <div className="idea-grid">
              {BUSINESS_IDEAS.map(idea => (
                <button
                  key={idea}
                  className={`idea-chip ${selected.includes(idea) ? "selected" : ""}`}
                  onClick={() => toggleIdea(idea)}
                >
                  {idea}
                </button>
              ))}
            </div>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "var(--text-faint)", letterSpacing: "1px", marginBottom: 12 }}>
              {selected.length}/3 selected
            </p>
            <button className="compare-btn" onClick={compare} disabled={loading || selected.length < 2}>
              {loading ? "Comparing…" : "Compare →"}
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div>
          {loading ? (
            <div className="empty-state">
              <div className="spinner" />
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "3px", textTransform: "uppercase", color: "var(--text-faint)" }}>Running comparison</p>
            </div>
          ) : results.length > 0 ? (
            <div className="compare-grid">
              {results.map((r: any, i: number) => (
                <div key={i} className="result-card">
                  <div className="card-top">
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div className="rank-badge" style={{ background: rankColors[i] }}>#{r.rank}</div>
                      <div>
                        <p className="card-name">{r.idea}</p>
                        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: "var(--text-faint)", marginTop: 2 }}>Tier {r.city_tier} City</p>
                      </div>
                    </div>
                    <span className={`risk-badge ${riskClass(r.risk)}`}>{r.risk} Risk</span>
                  </div>

                  <div className="metrics-row">
                    {[
                      { lbl: "Success", val: `${r.success}%` },
                      { lbl: "Annual Profit", val: `₹${r.profit?.toLocaleString()}` },
                      { lbl: "ROI", val: `${r.roi_percent}%` },
                      { lbl: "Break-even", val: `${r.break_even_months} mo` },
                    ].map(({ lbl, val }) => (
                      <div key={lbl} className="metric-cell">
                        <p className="metric-lbl">{lbl}</p>
                        <p className="metric-val" style={{ fontSize: "1rem" }}>{val}</p>
                      </div>
                    ))}
                  </div>

                  {r.scorecard && (
                    <div className="sc-section">
                      <p className="sc-title">Scorecard</p>
                      {Object.entries(r.scorecard as Record<string, number>).map(([k, v]) => (
                        <div key={k} className="sc-row">
                          <div className="sc-meta">
                            <span className="sc-key">{k.replace(/_/g, " ")}</span>
                            <span className="sc-val">{v}%</span>
                          </div>
                          <div className="sc-track">
                            <div className="sc-fill" style={{ width: `${v}%`, background: v > 70 ? "#22c55e" : v > 50 ? "#f59e0b" : "#ef4444" }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="advice-chip">
                    <p className="advice-text">{r.advice}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div style={{ fontSize: "2rem" }}>⚖️</div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "var(--text-faint)", fontWeight: 700 }}>Nothing to compare yet</p>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "2px", textTransform: "uppercase", color: "var(--text-faint)", maxWidth: 200, lineHeight: 1.6, textAlign: "center" }}>
                Select 2–3 ideas and set your parameters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}