import { NextRequest, NextResponse } from "next/server";
import { generatePersonalizedReport } from "@/lib/ai";
import { CustomerProfile } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profile, customPromptId, forceProvider } = body as {
      profile: CustomerProfile;
      customPromptId?: string;
      forceProvider?: "openai" | "gemini" | "rule";
    };

    if (!profile || !profile.fullName) {
      return NextResponse.json(
        { error: "Invalid request: customer profile is required." },
        { status: 400 }
      );
    }

    const report = await generatePersonalizedReport(profile, customPromptId, forceProvider);

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error) {
    console.error("Report generation error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
