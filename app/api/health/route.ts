import { NextResponse } from "next/server";

const IS_VERCEL = process.env.VERCEL === '1';

export async function GET() {
  const checks: Record<string, boolean | string> = {
    server: "ok",
    platform: IS_VERCEL ? "vercel" : "other",
  };

  // Only check filesystem on non-Vercel platforms
  if (!IS_VERCEL) {
    const { existsSync } = await import("fs");
    const path = await import("path");
    
    checks.python = existsSync(path.join(process.cwd(), "python-engine", "main.py"));
    checks.sampleData = existsSync(path.join(process.cwd(), "public", "sample_data.csv"));
    checks.video = existsSync(path.join(process.cwd(), "public", "vid", "landing-video.mp4"));
    checks.tmpDir = existsSync(path.join(process.cwd(), "tmp"));
  }

  const allHealthy = Object.values(checks).every(v => v === true || v === "ok" || typeof v === "string");

  return NextResponse.json({
    status: allHealthy ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    checks,
    environment: process.env.NODE_ENV || "development",
  }, {
    status: allHealthy ? 200 : 503
  });
}
