import { NextResponse } from "next/server";
import path from "path";
import { analyzeCsv } from "@/lib/pythonBridge";
import { getMockAnalysisResult } from "@/lib/mockAnalysis";

const IS_VERCEL = process.env.NEXT_PUBLIC_VERCEL === 'true' || process.env.VERCEL === '1';

export async function POST() {
  console.log("=== /api/sample POST called ===");
  try {
    let result;

    if (IS_VERCEL) {
      // Vercel doesn't support Python - use mock data
      console.log('⚠️ Running on Vercel - using mock analysis data');
      result = getMockAnalysisResult();
    } else {
      // Local/Railway - use Python engine
      const samplePath = path.join(process.cwd(), "public", "sample_data.csv");
      console.log("Sample CSV path:", samplePath);
      
      console.log("Calling Python detection engine...");
      result = await analyzeCsv(samplePath);
      console.log("Python analysis completed successfully");
      console.log("Result summary:", result?.summary);
    }

    // Serialize with custom float formatting
    let jsonString = JSON.stringify(result);
    
    // Replace numeric values with .1 decimal format for specific fields
    jsonString = jsonString.replace(/"(suspicion_score|risk_score|processing_time_seconds)":(\d+\.?\d*)([,\}])/g, (match, field, value, suffix) => {
      const num = parseFloat(value);
      return `"${field}":${num.toFixed(1)}${suffix}`;
    });

    console.log("Returning formatted JSON response");
    return new NextResponse(jsonString, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("=== SAMPLE ANALYSIS ERROR ===");
    console.error("Error type:", error?.constructor?.name);
    console.error("Error message:", error instanceof Error ? error.message : String(error));
    console.error("Full error:", error);
    console.error("Stack trace:", error instanceof Error ? error.stack : "No stack trace");
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Sample analysis failed",
        details: error instanceof Error ? error.stack : String(error)
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  console.log("=== /api/sample GET called ===");
  try {
    let result;

    if (IS_VERCEL) {
      // Vercel doesn't support Python - use mock data
      console.log('⚠️ Running on Vercel - using mock analysis data');
      result = getMockAnalysisResult();
    } else {
      // Local/Railway - use Python engine
      const samplePath = path.join(process.cwd(), "public", "sample_data.csv");
      console.log("Sample CSV path:", samplePath);
      
      console.log("Calling Python detection engine...");
      result = await analyzeCsv(samplePath);
      console.log("Python analysis completed successfully");
    }

    // Serialize with custom float formatting
    let jsonString = JSON.stringify(result);
    
    // Replace numeric values with .1 decimal format for specific fields
    jsonString = jsonString.replace(/"(suspicion_score|risk_score|processing_time_seconds)":(\d+\.?\d*)([,\}])/g, (match, field, value, suffix) => {
      const num = parseFloat(value);
      return `"${field}":${num.toFixed(1)}${suffix}`;
    });

    console.log("Returning formatted JSON response");
    return new NextResponse(jsonString, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("=== SAMPLE ANALYSIS ERROR (GET) ===");
    console.error("Error type:", error?.constructor?.name);
    console.error("Error message:", error instanceof Error ? error.message : String(error));
    console.error("Full error:", error);
    console.error("Stack trace:", error instanceof Error ? error.stack : "No stack trace");
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Sample analysis failed",
        details: error instanceof Error ? error.stack : String(error)
      },
      { status: 500 }
    );
  }
}
