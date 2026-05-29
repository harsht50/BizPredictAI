import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("http://127.0.0.1:8000/history", {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ history: [] }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("History proxy error:", err);
    return NextResponse.json({ history: [] }, { status: 500 });
  }
}