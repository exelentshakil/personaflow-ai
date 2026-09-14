import { NextRequest, NextResponse } from "next/server";
import { PersonalizedReport } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { report } = body as { report: PersonalizedReport };

    if (!report) {
      return NextResponse.json({ error: "Report data required" }, { status: 400 });
    }

    // Returns formatted HTML data ready for printing / client-side PDF download
    return NextResponse.json({
      success: true,
      reportCode: report.reportCode,
      downloadUrl: `/api/pdf?code=${report.reportCode}`,
      generatedAt: report.generatedAt,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "PDF generation error" },
      { status: 500 }
    );
  }
}
