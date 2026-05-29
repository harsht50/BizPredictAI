"use client";

import { useEffect, useRef, useState } from "react";

const INDUSTRIES = [
  "Technology", "Manufacturing", "Retail", "Healthcare",
  "Finance", "Agriculture", "Tourism", "Education", "Logistics", "Real Estate"
];

const RISK_COLOR: Record<string, string> = {
  High: "#ef4444",
  Medium: "#f59e0b",
  Low: "#22c55e",
};

export default function HeatmapPage() {
  const mapRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState("Technology");
  const [hotspots, setHotspots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => setLeafletLoaded(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!leafletLoaded || mapInstanceRef.current) return;
    const L = (window as any).L;

    const map = L.map(mapRef.current, {
      center: [22.5, 82.5],
      zoom: 5,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);
    L.control.attribution({ position: "bottomleft", prefix: "© CartoDB" }).addTo(map);

    mapInstanceRef.current = map;
  }, [leafletLoaded]);

  useEffect(() => {
    if (!leafletLoaded || !mapInstanceRef.current) return;
    fetchHotspots(selectedIndustry);
  }, [selectedIndustry, leafletLoaded]);

  const fetchHotspots = async (industry: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/hotspots?industry=${encodeURIComponent(industry)}`);
      if (!res.ok) throw new Error("Failed to fetch hotspots");
      const data = await res.json();
      setHotspots(data.hotspots || []);
      plotMarkers(data.hotspots || []);
    } catch (err) {
      console.error(err);
      setError("Could not load hotspot data. Is the backend running?");
      setHotspots([]);
      plotMarkers([]);
    } finally {
      setLoading(false);
    }
  };

  const plotMarkers = (spots: any[]) => {
    const L = (window as any).L;
    const map = mapInstanceRef.current;
    if (!map || !L) return;

    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    spots.forEach((spot) => {
      const color = RISK_COLOR[spot.risk] || "#4f46e5";

      const pulseIcon = L.divIcon({
        className: "",
        html: `
          <div style="position:relative;width:48px;height:48px;transform:translate(-50%,-50%)">
            <div style="position:absolute;inset:0;border-radius:50%;background:${color};opacity:0.12;animation:pulse-ring 2s ease-out infinite;"></div>
            <div style="position:absolute;inset:8px;border-radius:50%;background:${color};opacity:0.25;animation:pulse-ring 2s ease-out infinite 0.4s;"></div>
            <div style="position:absolute;inset:16px;border-radius:50%;background:${color};box-shadow:0 0 10px ${color}80;"></div>
          </div>
        `,
        iconSize: [48, 48],
        iconAnchor: [24, 24],
      });

      const marker = L.marker([spot.lat, spot.lng], { icon: pulseIcon }).addTo(map);

      marker.bindPopup(`
        <div style="font-family:'DM Sans',sans-serif;background:#fff;color:#0f172a;border-radius:12px;padding:16px 18px;min-width:210px;border:1px solid #e2e8f0;box-shadow:0 8px 32px rgba(0,0,0,0.1);">
          <div style="font-size:1rem;font-weight:700;color:#0f172a;margin-bottom:4px;">${spot.city}</div>
          <div style="font-size:0.7rem;color:#94a3b8;margin-bottom:12px;font-family:'DM Mono',monospace;text-transform:uppercase;letter-spacing:1px;">${spot.state}</div>
          <div style="display:flex;flex-direction:column;gap:8px;">
            <div style="display:flex;justify-content:space-between;font-size:0.78rem;">
              <span style="color:#64748b;">Success</span>
              <span style="color:#4f46e5;font-weight:600;">${spot.success_rate}%</span>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:0.78rem;">
              <span style="color:#64748b;">Avg. Profit</span>
              <span style="color:#4f46e5;font-weight:600;">₹${spot.avg_profit?.toLocaleString()}</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.78rem;margin-top:2px;">
              <span style="color:#64748b;">Risk</span>
              <span style="background:${color}18;color:${color};border:1px solid ${color}44;padding:2px 10px;border-radius:999px;font-size:0.65rem;font-family:'DM Mono',monospace;">${spot.risk}</span>
            </div>
          </div>
        </div>
      `, { className: "custom-popup" });

      markersRef.current.push(marker);
    });

    if (spots.length > 0) {
      const bounds = L.latLngBounds(spots.map((s: any) => [s.lat, s.lng]));
      map.fitBounds(bounds, { padding: [60, 60] });
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "'DM Sans', sans-serif", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes pulse-ring { 0% { transform: scale(0.6); opacity: 0.6; } 100% { transform: scale(1.8); opacity: 0; } }
        @keyframes shimmer { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }

        .header {
          display: flex; align-items: center; gap: 20px;
          padding: 20px 40px;
          border-bottom: 1px solid var(--border);
          background: var(--bg-card);
          box-shadow: var(--shadow);
          position: relative; z-index: 1000;
        }
        .page-title { font-family: 'Playfair Display', serif; font-size: 1.6rem; font-weight: 800; color: var(--text); letter-spacing: -0.5px; }
        .page-tag { font-family: 'DM Mono', monospace; font-size: 0.6rem; color: #4f46e5; background: var(--accent-bg); border: 1px solid var(--accent-border); padding: 3px 10px; border-radius: 4px; letter-spacing: 2px; text-transform: uppercase; }

        .industry-bar {
          display: flex; gap: 8px; padding: 12px 40px; overflow-x: auto;
          border-bottom: 1px solid var(--border);
          background: var(--bg-card); z-index: 999;
          scrollbar-width: none;
        }
        .industry-bar::-webkit-scrollbar { display: none; }

        .ind-btn {
          font-family: 'DM Mono', monospace; font-size: 0.68rem;
          padding: 7px 16px; border-radius: 8px; border: 1.5px solid var(--border);
          background: transparent; color: var(--text-faint); cursor: pointer; white-space: nowrap;
          transition: all 0.2s; letter-spacing: 0.5px;
        }
        .ind-btn:hover { border-color: var(--accent-border); color: #4f46e5; background: var(--accent-bg); }
        .ind-btn.active { background: #4f46e5; border-color: #4f46e5; color: #fff; font-weight: 600; }

        .map-container { flex: 1; position: relative; min-height: 0; }
        #india-map { width: 100%; height: 100%; min-height: calc(100vh - 138px); }

        .custom-popup .leaflet-popup-content-wrapper { background: transparent !important; border: none !important; box-shadow: none !important; border-radius: 12px !important; padding: 0 !important; }
        .custom-popup .leaflet-popup-content { margin: 0 !important; }
        .custom-popup .leaflet-popup-tip-container { display: none; }
        .leaflet-popup-close-button { color: #94a3b8 !important; top: 10px !important; right: 12px !important; font-size: 18px !important; }

        .overlay-panel {
          position: absolute; top: 20px; right: 20px; z-index: 998;
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: 14px; padding: 18px 20px; min-width: 175px;
          box-shadow: var(--shadow-md);
        }
        .legend-title { font-family: 'DM Mono', monospace; font-size: 0.58rem; letter-spacing: 2px; text-transform: uppercase; color: var(--text-faint); margin-bottom: 12px; }
        .legend-item { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
        .legend-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
        .legend-label { font-family: 'DM Mono', monospace; font-size: 0.7rem; color: var(--text-muted); }

        .count-chip {
          position: absolute; bottom: 24px; left: 24px; z-index: 998;
          font-family: 'DM Mono', monospace; font-size: 0.7rem;
          background: var(--bg-card); border: 1px solid var(--accent-border);
          color: #4f46e5; padding: 8px 16px; border-radius: 999px;
          box-shadow: var(--shadow);
        }

        .loading-overlay {
          position: absolute; inset: 0; z-index: 997;
          display: flex; align-items: center; justify-content: center;
          background: rgba(248,250,252,0.75); backdrop-filter: blur(4px);
        }
        .loading-text { font-family: 'DM Mono', monospace; font-size: 0.72rem; color: #4f46e5; letter-spacing: 3px; text-transform: uppercase; animation: shimmer 1.5s ease-in-out infinite; }

        .error-chip {
          position: absolute; top: 20px; left: 50%; transform: translateX(-50%); z-index: 999;
          font-family: 'DM Mono', monospace; font-size: 0.7rem;
          background: var(--danger-bg); border: 1px solid var(--danger-border);
          color: var(--danger-text); padding: 10px 20px; border-radius: 8px; white-space: nowrap;
        }
      `}</style>

      <div className="header">
        <h1 className="page-title">Business Hotspot Map</h1>
        <span className="page-tag">India</span>
      </div>

      <div className="industry-bar">
        {INDUSTRIES.map((ind) => (
          <button key={ind} className={`ind-btn ${selectedIndustry === ind ? "active" : ""}`} onClick={() => setSelectedIndustry(ind)}>
            {ind}
          </button>
        ))}
      </div>

      <div className="map-container">
        <div id="india-map" ref={mapRef} />

        {loading && (
          <div className="loading-overlay">
            <p className="loading-text">Scanning Hotspots...</p>
          </div>
        )}

        {error && <div className="error-chip">⚠ {error}</div>}

        <div className="overlay-panel">
          <div className="legend-title">Risk Level</div>
          {Object.entries(RISK_COLOR).map(([risk, color]) => (
            <div className="legend-item" key={risk}>
              <div className="legend-dot" style={{ background: color }} />
              <span className="legend-label">{risk} Risk</span>
            </div>
          ))}
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
            <div className="legend-title">Industry</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "#4f46e5", fontWeight: 600 }}>{selectedIndustry}</div>
          </div>
        </div>

        {!loading && hotspots.length > 0 && (
          <div className="count-chip">◉ {hotspots.length} hotspots found</div>
        )}
      </div>
    </div>
  );
}
