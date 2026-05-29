import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const industry = req.nextUrl.searchParams.get("industry") || "Technology";

  try {
    const res = await fetch(
      `http://127.0.0.1:8000/hotspots?industry=${encodeURIComponent(industry)}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return NextResponse.json({ hotspots: [] }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Hotspots proxy error:", err);
    return NextResponse.json({ hotspots: [] }, { status: 500 });
  }
}