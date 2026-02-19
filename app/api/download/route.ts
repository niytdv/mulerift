import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    return new NextResponse(JSON.stringify(data, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="fraud-analysis-${Date.now()}.json"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}
