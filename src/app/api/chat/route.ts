import { NextRequest, NextResponse } from "next/server";
import { generateChatResponse } from "@/lib/ai";
import { ChatMessage, CustomerProfile } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, profile, reportSummary } = body as {
      messages: ChatMessage[];
      profile: CustomerProfile;
      reportSummary?: string;
    };

    if (!messages || !profile) {
      return NextResponse.json(
        { error: "Invalid request: messages and profile required." },
        { status: 400 }
      );
    }

    const response = await generateChatResponse(messages, profile, reportSummary);

    return NextResponse.json({
      success: true,
      ...response,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
