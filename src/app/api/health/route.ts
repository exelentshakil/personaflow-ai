import { NextResponse } from "next/server";
import { checkAiHealth } from "@/lib/ai";

export async function GET() {
  const aiHealth = await checkAiHealth();

  return NextResponse.json({
    status: aiHealth.status,
    service: "PersonaFlow AI Personalization Engine",
    version: "2.4.0-enterprise",
    timestamp: new Date().toISOString(),
    providers: {
      openai: aiHealth.openai,
      gemini: aiHealth.gemini,
      localDeterministic: { active: true, latencyMs: 8 },
    },
    capabilities: {
      pronounGrammarEngine: "active",
      promptInterpolation: "active",
      pdfGeneration: "active",
      dynamicCms: "active",
      profileAwareChat: "active",
      smsNotifications: "webhook-ready",
      twoFactorAuth: "totp-simulated",
    },
  });
}
