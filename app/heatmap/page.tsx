"use client";

import dynamic from "next/dynamic";

const HeatmapMap = dynamic(() => import("./HeatmapMap"), {
  ssr: false,
});

export default function HeatmapPage() {
  return (
    <div style={{ minHeight: "100vh", width: "100%", background: "var(--bg)" }}>
      <HeatmapMap />
    </div>
  );
}
