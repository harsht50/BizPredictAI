"use client";

import { useState } from "react";

const INDUSTRIES = [
  "Technology", "Food & Beverage", "Retail", "Healthcare", "Finance",
  "Education", "Manufacturing", "Logistics", "Agriculture", "Tourism",
  "Real Estate", "Cloud Kitchen", "Digital Marketing", "Fitness Studio",
];

export default function SuggestPage() {
  const [location, setLocation]           = useState("");
  const [investment, setInvestment]       = useState("");
  const [industry, setIndustry]           = useState("");
  const [experience, setExperience]       = useState("");
  const [riskAppetite, setRiskAppetite]   = useState("moderate");
  const [businessType, setBusinessType]   = useState("service");
  const [onlineOffline, setOnlineOffline] = useState("offline");
  const [ideas, setIdeas]                 = useState<any[]>([]);
  const [loading, setLoading]             = useState(false);
  const [expanded, setExpanded]           = useState<number | null>(null);

  const generate = async () => {
    if (!location || !investment || !industry) { alert("Fill required fields"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location, investment: Number(investment), industry,
          experience: Number(experience), riskAppetite, businessType, onlineOffline,
        }),
      });
      const data = await res.json();
      setIdeas(data.recommendations || []);
      setExpanded(null);
    } catch (err) {
      alert("Could not connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  const riskClass = (r: string) =>
    r === "High" ? "risk-high" : r === "Medium" ? "risk-medium" : "risk-low";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "'DM Sans', sans-serif", padding: "36px 44px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .page-header { display: flex; align-items: center; gap: 14px; margin-bottom: 32px; padding-bottom: 22px; border-bottom: 1px solid var(--border); }
        .page-title  { font-family: 'Playfair Display', serif; font-size: 1.9rem; font-weight: 800; color: var(--text); letter-spacing: -0.5px; }
        .page-tag    { font-family: 'DM Mono', monospace; font-size: 0.6rem; color: #4f46e5; background: var(--accent-bg); border: 1px solid var(--accent-border); padding: 4px 10px; border-radius: 4px; letter-spacing: 2px; text-transform: uppercase; }

        .layout { display: grid; grid-template-columns: 300px 1fr; gap: 22px; }

        .panel { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 24px; box-shadow: var(--shadow); }
        .panel-title { font-family: 'DM Mono', monospace; font-size: 0.56rem; letter-spacing: 3px; text-transform: uppercase; color: var(--text-faint); margin-bottom: 18px; }

        .field-group  { margin-bottom: 12px; }
        .field-label  { display: block; font-size: 0.66rem; font-family: 'DM Mono', monospace; color: var(--text-muted); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 6px; }
        .field-input  { width: 100%; background: var(--bg-input); border: 1.5px solid var(--border); border-radius: 10px; color: var(--text); padding: 10px 13px; font-family: 'DM Mono', monospace; font-size: 0.85rem; outline: none; transition: border-color 0.2s; }
        .field-input:focus { border-color: #4f46e5; }
        .field-input::placeholder { color: var(--text-placeholder); }
        .field-select { width: 100%; background: var(--bg-input); border: 1.5px solid var(--border); border-radius: 10px; color: var(--text); padding: 10px 13px; font-family: 'DM Mono', monospace; font-size: 0.85rem; outline: none; cursor: pointer; }
        .field-select:focus { border-color: #4f46e5; }

        .seg { display: flex; border: 1.5px solid var(--border); border-radius: 10px; overflow: hidden; }
        .seg-btn { flex: 1; padding: 8px 4px; background: transparent; border: none; font-family: 'DM Mono', monospace; font-size: 0.63rem; color: var(--text-faint); cursor: pointer; transition: all 0.15s; text-align: center; }
        .seg-btn.active { background: #4f46e5; color: #fff; }
        .seg-btn:not(:last-child) { border-right: 1.5px solid var(--border); }

        .gen-btn { width: 100%; padding: 13px; background: #4f46e5; border: none; border-radius: 10px; color: #fff; font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 0.88rem; cursor: pointer; transition: all 0.2s; margin-top: 8px; }
        .gen-btn:hover:not(:disabled) { background: #4338ca; transform: translateY(-1px); box-shadow: 0 4px 18px rgba(79,70,229,0.28); }
        .gen-btn:disabled { opacity: 0.45; cursor: not-allowed; }

        /* Idea card */
        .idea-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 14px; margin-bottom: 12px; overflow: hidden; box-shadow: var(--shadow); transition: border-color 0.2s; }
        .idea-card:hover { border-color: var(--accent-border); }
        .idea-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 22px; cursor: pointer; }
        .idea-left   { display: flex; align-items: center; gap: 14px; }
        .idea-rank   { font-family: 'DM Mono', monospace; font-size: 0.68rem; color: #4f46e5; background: var(--accent-bg); border: 1px solid var(--accent-border); border-radius: 6px; padding: 4px 10px; flex-shrink: 0; }
        .idea-name   { font-family: 'Playfair Display', serif; font-size: 1rem; font-weight: 800; color: var(--text); }
        .idea-meta   { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin-top: 4px; }
        .idea-pill   { font-family: 'DM Mono', monospace; font-size: 0.6rem; color: var(--text-faint); background: var(--bg); border: 1px solid var(--border); padding: 2px 8px; border-radius: 999px; }
        .idea-success { font-family: 'DM Mono', monospace; font-size: 0.75rem; color: #4f46e5; font-weight: 600; white-space: nowrap; }

        .risk-badge  { font-family: 'DM Mono', monospace; font-size: 0.6rem; padding: 2px 8px; border-radius: 999px; }
        .risk-high   { background: var(--danger-bg);  color: var(--danger-text);  border: 1px solid var(--danger-border); }
        .risk-medium { background: var(--warning-bg); color: var(--warning-text); border: 1px solid var(--warning-border); }
        .risk-low    { background: var(--success-bg); color: var(--success-text); border: 1px solid var(--success-border); }

        /* Expand panel */
        .idea-body { padding: 0 22px 20px; border-top: 1px solid var(--border-light); }
        .metrics-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 16px 0; }
        .metric-box  { background: var(--bg); border: 1px solid var(--border); border-radius: 10px; padding: 12px 14px; }
        .metric-lbl  { font-family: 'DM Mono', monospace; font-size: 0.55rem; letter-spacing: 2px; text-transform: uppercase; color: var(--text-faint); margin-bottom: 4px; }
        .metric-val  { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 800; color: #4f46e5; }

        .sc-row   { margin-bottom: 10px; }
        .sc-meta  { display: flex; justify-content: space-between; margin-bottom: 4px; }
        .sc-key   { font-family: 'DM Mono', monospace; font-size: 0.62rem; color: var(--text-muted); text-transform: capitalize; }
        .sc-val   { font-family: 'DM Mono', monospace; font-size: 0.62rem; color: #4f46e5; }
        .sc-track { background: var(--border); height: 4px; border-radius: 999px; overflow: hidden; }
        .sc-fill  { height: 100%; border-radius: 999px; }

        .advice-box  { background: var(--accent-bg); border: 1px solid var(--accent-border); border-left: 3px solid #4f46e5; border-radius: 10px; padding: 13px 16px; margin-top: 14px; }
        .advice-lbl  { font-family: 'DM Mono', monospace; font-size: 0.5rem; letter-spacing: 3px; color: #4f46e5; text-transform: uppercase; margin-bottom: 6px; }
        .advice-text { font-size: 0.8rem; color: var(--text-muted); line-height: 1.65; }

        .scheme-row  { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid var(--border-light); }
        .scheme-row:last-child { border-bottom: none; }
        .scheme-badge { font-family: 'DM Mono', monospace; font-size: 0.58rem; background: var(--accent-bg); border: 1px solid var(--accent-border); color: #4f46e5; padding: 2px 8px; border-radius: 5px; white-space: nowrap; }
        .scheme-name { font-family: 'DM Sans', sans-serif; font-size: 0.78rem; color: var(--text-muted); }

        .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 320px; gap: 14px; text-align: center; }
        .empty-icon  { width: 56px; height: 56px; border-radius: 50%; background: var(--accent-bg); border: 1.5px solid var(--accent-border); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; }
        .empty-title { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 700; color: var(--text-faint); }
        .empty-sub   { font-family: 'DM Mono', monospace; font-size: 0.6rem; letter-spacing: 2px; text-transform: uppercase; color: var(--text-faint); max-width: 200px; line-height: 1.6; }

        .spinner { width: 28px; height: 28px; border: 2px solid var(--border); border-top-color: #4f46e5; border-radius: 50%; animation: spin 0.75s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="page-header">
        <h1 className="page-title">Business Idea Generator</h1>
        <span className="page-tag">AI Powered</span>
      </div>

      <div className="layout">
        {/* LEFT */}
        <div className="panel" style={{ height: "fit-content" }}>
          <p className="panel-title">Your Parameters</p>

          <div className="field-group">
            <label className="field-label">City / Location</label>
            <input className="field-input" placeholder="e.g. Pune" value={location} onChange={e => setLocation(e.target.value)} />
          </div>

          <div className="field-group">
            <label className="field-label">Industry Interest</label>
            <select className="field-select" value={industry} onChange={e => setIndustry(e.target.value)}>
              <option value="">Select…</option>
              {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>

          <div className="field-group">
            <label className="field-label">Budget (₹)</label>
            <input className="field-input" type="number" placeholder="e.g. 300000" value={investment} onChange={e => setInvestment(e.target.value)} />
          </div>

          <div className="field-group">
            <label className="field-label">Experience (Years)</label>
            <input className="field-input" type="number" placeholder="e.g. 2" value={experience} onChange={e => setExperience(e.target.value)} />
          </div>

          <div className="field-group">
            <label className="field-label">Risk Appetite</label>
            <div className="seg">
              {["conservative","moderate","aggressive"].map(v => (
                <button key={v} className={`seg-btn ${riskAppetite === v ? "active" : ""}`} onClick={() => setRiskAppetite(v)}>{v.slice(0,4)}</button>
              ))}
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Business Type</label>
            <div className="seg">
              {["service","product","franchise"].map(v => (
                <button key={v} className={`seg-btn ${businessType === v ? "active" : ""}`} onClick={() => setBusinessType(v)}>{v}</button>
              ))}
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Online / Offline</label>
            <div className="seg">
              {["offline","online","hybrid"].map(v => (
                <button key={v} className={`seg-btn ${onlineOffline === v ? "active" : ""}`} onClick={() => setOnlineOffline(v)}>{v}</button>
              ))}
            </div>
          </div>

          <button className="gen-btn" onClick={generate} disabled={loading}>
            {loading ? "Generating…" : "Generate Business Ideas →"}
          </button>
        </div>

        {/* RIGHT */}
        <div>
          {loading ? (
            <div className="empty-state">
              <div className="spinner" />
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "3px", textTransform: "uppercase", color: "var(--text-faint)" }}>
                Generating AI recommendations
              </p>
            </div>
          ) : ideas.length > 0 ? (
            <>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "3px", textTransform: "uppercase", color: "var(--text-faint)", marginBottom: 16 }}>
                {ideas.length} ideas ranked by success potential — click to expand
              </p>
              {ideas.map((idea: any, i: number) => (
                <div key={i} className="idea-card">
                  <div className="idea-header" onClick={() => setExpanded(expanded === i ? null : i)}>
                    <div className="idea-left">
                      <span className="idea-rank">#{String(i + 1).padStart(2, "0")}</span>
                      <div>
                        <p className="idea-name">{idea.idea}</p>
                        <div className="idea-meta">
                          <span className="idea-pill">ROI {idea.roi_percent}%</span>
                          <span className="idea-pill">Break-even {idea.break_even_months}mo</span>
                          <span className={`risk-badge ${riskClass(idea.risk)}`}>{idea.risk} Risk</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
                      <span className="idea-success">{idea.success}% success</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-faint)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        style={{ transform: expanded === i ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </div>
                  </div>

                  {expanded === i && (
                    <div className="idea-body">
                      <div className="metrics-row">
                        <div className="metric-box">
                          <p className="metric-lbl">Annual Profit</p>
                          <p className="metric-val">₹{idea.annual_profit?.toLocaleString()}</p>
                        </div>
                        <div className="metric-box">
                          <p className="metric-lbl">Working Capital</p>
                          <p className="metric-val" style={{ fontSize: "0.95rem" }}>₹{idea.working_capital?.toLocaleString()}<span style={{ fontSize: "0.55rem", fontFamily: "'DM Mono', monospace", color: "var(--text-faint)" }}>/mo</span></p>
                        </div>
                        <div className="metric-box">
                          <p className="metric-lbl">ROI</p>
                          <p className="metric-val">{idea.roi_percent}%</p>
                        </div>
                      </div>

                      {/* Scorecard */}
                      {idea.scorecard && (
                        <div style={{ marginBottom: 14 }}>
                          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.54px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--text-faint)", marginBottom: 10, fontSize: "0.54rem" }}>Scorecard</p>
                          {Object.entries(idea.scorecard as Record<string, number>).map(([k, v]) => (
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

                      {/* Eligible schemes */}
                      {idea.eligible_schemes?.length > 0 && (
                        <div style={{ marginBottom: 12 }}>
                          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.54rem", letterSpacing: "2px", textTransform: "uppercase", color: "var(--text-faint)", marginBottom: 8 }}>Funding Options</p>
                          {idea.eligible_schemes.map((s: any, j: number) => (
                            <div key={j} className="scheme-row">
                              <span className="scheme-badge">₹{(s.max / 100000).toFixed(0)}L</span>
                              <span className="scheme-name">{s.name} — {s.note}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="advice-box">
                        <p className="advice-lbl">AI Advice</p>
                        <p className="advice-text">{idea.advice}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">💡</div>
              <p className="empty-title">No ideas yet</p>
              <p className="empty-sub">Fill in your parameters and hit generate</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}