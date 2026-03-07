import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { analyzeCsv } from "@/lib/pythonBridge";
import { getMockAnalysisResult } from "@/lib/mockAnalysis";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit
const IS_VERCEL = process.env.NEXT_PUBLIC_VERCEL === 'true' || process.env.VERCEL === '1';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 413 }
      );
    }

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      return NextResponse.json(
        { error: "Invalid file type. Only CSV files are allowed" },
        { status: 400 }
      );
    }

    console.log(`📁 File uploaded: ${file.name} (${(file.size / 1024).toFixed(2)}KB)`);

    let result;

    if (IS_VERCEL) {
      // Vercel doesn't support Python - use mock data
      console.log('⚠️ Running on Vercel - using mock analysis data');
      result = getMockAnalysisResult();
    } else {
      // Local/Railway - use Python engine
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const tmpDir = path.join(process.cwd(), "tmp");
      await mkdir(tmpDir, { recursive: true });
      
      const tmpPath = path.join(tmpDir, `upload-${Date.now()}.csv`);
      await writeFile(tmpPath, buffer);

      result = await analyzeCsv(tmpPath);
    }

    // Serialize with custom float formatting
    let jsonString = JSON.stringify(result);
    
    // Replace numeric values with .1 decimal format for specific fields
    jsonString = jsonString.replace(/"(suspicion_score|risk_score|processing_time_seconds)":(\d+\.?\d*)([,\}])/g, (match, field, value, suffix) => {
      const num = parseFloat(value);
      return `"${field}":${num.toFixed(1)}${suffix}`;
    });

    return new NextResponse(jsonString, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Analysis failed" },
      { status: 500 }
    );
  }
}
