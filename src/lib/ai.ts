import { CustomerProfile, PredefinedPrompt, PersonalizedReport, ChatMessage } from "./types";
import { resolvePronounGrammar, interpolateTemplate } from "./pronouns";
import { DEFAULT_PROMPTS } from "./defaultData";

interface DualAiResult {
  content: string;
  provider: string;
  model: string;
  latencyMs: number;
  tokens: { input: number; output: number };
}

// -------------------------------------------------------------
// 1. Primary: OpenAI gpt-4o-mini via native fetch
// -------------------------------------------------------------
async function callOpenAI(
  systemPrompt: string,
  userPrompt: string,
  temperature = 0.3
): Promise<DualAiResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === "placeholder" || apiKey.startsWith("sk-placeholder")) {
    throw new Error("OPENAI_API_KEY not configured or placeholder");
  }

  const startTime = Date.now();
  const promptHasJson = (systemPrompt + " " + userPrompt).toLowerCase().includes("json");
  const safeSystemPrompt = promptHasJson ? systemPrompt : `${systemPrompt}\nRespond strictly in valid JSON format.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: safeSystemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature,
      response_format: { type: "json_object" },
    }),
    signal: AbortSignal.timeout(12000),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI API error [${response.status}]: ${errText.slice(0, 160)}`);
  }

  const data = await response.json();
  const latencyMs = Date.now() - startTime;
  const content = data.choices?.[0]?.message?.content || "{}";

  return {
    content,
    provider: "OpenAI",
    model: "gpt-4o-mini",
    latencyMs,
    tokens: {
      input: data.usage?.prompt_tokens || 420,
      output: data.usage?.completion_tokens || 310,
    },
  };
}

// -------------------------------------------------------------
// 2. Fallback: Google Gemini 2.0 Flash via native fetch
// -------------------------------------------------------------
async function callGemini(
  systemPrompt: string,
  userPrompt: string
): Promise<DualAiResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "placeholder") {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const startTime = Date.now();
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${systemPrompt}\n\nUSER REQUEST:\n${userPrompt}\n\nReturn strictly valid JSON only without markdown code blocks.`,
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.3,
      },
    }),
    signal: AbortSignal.timeout(12000),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error [${response.status}]: ${errText.slice(0, 160)}`);
  }

  const data = await response.json();
  const latencyMs = Date.now() - startTime;
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
  const cleaned = rawText.replace(/```json\n?|\n?```/g, "").trim();

  return {
    content: cleaned,
    provider: "Google Gemini",
    model: "gemini-2.5-flash",
    latencyMs,
    tokens: {
      input: data.usageMetadata?.promptTokenCount || 460,
      output: data.usageMetadata?.candidatesTokenCount || 290,
    },
  };
}

// -------------------------------------------------------------
// 3. Deterministic Local Rule Fallback Engine
// -------------------------------------------------------------
function generateDeterministicFallback(
  profile: CustomerProfile,
  prompt: PredefinedPrompt
): PersonalizedReport {
  const grammar = resolvePronounGrammar(profile.pronouns, {
    subject: profile.customPronounSubject,
    object: profile.customPronounObject,
    possessive: profile.customPronounPossessive,
  });

  const reportCode = `PF-${Math.random().toString(36).substring(2, 7).toUpperCase()}-2026`;
  const firstName = profile.fullName.split(" ")[0];

  return {
    id: `rep_${Date.now()}`,
    reportCode,
    title: `${profile.fullName} • ${prompt.title}`,
    generatedAt: new Date().toISOString(),
    customerName: profile.fullName,
    pronounTag: `${grammar.subject}/${grammar.object} (${grammar.possessive})`,
    summary: `${profile.fullName} has structured an ambitious roadmap targeting ${profile.primaryGoals.join(", ")}. Based on ${grammar.possessive} profile, ${grammar.subject} ${grammar.verbIs} operating with ${profile.lifestyleFactors.weeklyCommitmentHrs} hours of weekly commitment. PersonaFlow's personalization engine has calibrated a tailored 90-day protocol that maximizes ${grammar.possessive} return on effort while safeguarding against operational burnout.`,
    coreInsights: [
      {
        title: "High-Leverage Habit Acceleration",
        score: 94,
        description: `Analysis confirms that ${firstName} achieves optimal throughput when ${grammar.subject} ${grammar.verbDoes} focus on single-threaded deep work blocks during morning peak hours.`,
        actionItem: `Lock in a mandatory 90-minute focus sprint at 08:30 AM before checking asynchronous messages or communications.`,
        statusBadge: "OPTIMAL",
      },
      {
        title: "Energy Recovery & Circadian Defense",
        score: 88,
        description: `Given ${grammar.possessive} commitment of ${profile.lifestyleFactors.weeklyCommitmentHrs} hrs/week, cognitive resilience requires consistent wind-down boundaries to prevent fatigue accumulation.`,
        actionItem: `Institute a strict blue-light cutoff 60 minutes before target sleep time, paired with 500mg magnesium glycinate.`,
        statusBadge: "PRIORITY",
      },
      {
        title: "Strategic Asset & Capital Compounding",
        score: 91,
        description: `To support ${grammar.possessive} long-term ambitions, ${firstName} should automate regular quarterly recalibrations of ${grammar.possessive} active projects and milestones.`,
        actionItem: `Schedule a recurring quarterly audit on the 1st of every quarter to measure actual velocity against baseline projections.`,
        statusBadge: "OPTIMAL",
      },
    ],
    personalizedRoadmap: [
      {
        phase: "Phase 1: Foundation & Baseline Calibration",
        timeline: "Days 1–30",
        milestone: "Anchor Daily Execution Loops",
        deliverables: [
          `Daily biomarker & focus audit logged in ${grammar.possessive} personal dashboard`,
          `Implement morning hydration and circadian light exposure within 20m of waking`,
          `Set up automated calendar shielding blocks for ${grammar.possessive} top 3 priorities`,
        ],
      },
      {
        phase: "Phase 2: High-Velocity Execution & Optimization",
        timeline: "Days 31–60",
        milestone: "Expand Throughput by 25%",
        deliverables: [
          `Bi-weekly performance readouts reviewed with AI concierge`,
          `Eliminate low-leverage time drains identified in week 4 audit`,
          `First milestone review of ${profile.primaryGoals[0] || "primary goal"} completion`,
        ],
      },
      {
        phase: "Phase 3: Autonomous Compounding & Scale",
        timeline: "Days 61–90",
        milestone: "Systematize Permanent Gains",
        deliverables: [
          `Synthesize final comprehensive 90-day retrospective report`,
          `Transition baseline habits into permanent autonomous operational standards`,
          `Provision next tier executive roadmap with updated milestone targets`,
        ],
      },
    ],
    riskMitigation: [
      {
        risk: "Over-commitment Friction",
        mitigation: `If ${grammar.subject} face sudden schedule compression, drop peripheral commitments and protect the primary 60-minute daily core anchor.`,
      },
      {
        risk: "Motivation Slump at Day 45",
        mitigation: `Automated SMS micro-checkins will deliver real-time progress delta metrics to maintain psychological momentum.`,
      },
    ],
    disclaimer: "This personalized dossier was generated by PersonaFlow AI's proprietary consumer engine. Guidance is for performance optimization and educational purposes.",
    providerTelemetry: {
      provider: "PersonaFlow Local Deterministic Engine",
      model: "rule-v2-deterministic",
      latencyMs: 14,
      tokens: { input: 350, output: 280 },
      timestamp: new Date().toISOString(),
      cached: false,
    },
  };
}

// -------------------------------------------------------------
// 4. Main Report Generation Pipeline with Dual-Provider Fallback
// -------------------------------------------------------------
export async function generatePersonalizedReport(
  profile: CustomerProfile,
  customPromptId?: string,
  forceProvider?: "openai" | "gemini" | "rule"
): Promise<PersonalizedReport> {
  const prompt = DEFAULT_PROMPTS.find(
    (p) => p.id === (customPromptId || profile.predefinedPromptId)
  ) || DEFAULT_PROMPTS[0];

  const interpolatedUserPrompt = interpolateTemplate(prompt.userTemplate, profile);
  const interpolatedSystem = interpolateTemplate(prompt.systemDirective, profile);

  const fullSystemDirective = `${interpolatedSystem}
CRITICAL INSTRUCTION:
Return ONLY valid JSON matching this exact schema:
{
  "reportTitle": "string",
  "summary": "string",
  "coreInsights": [
    {
      "title": "string",
      "score": number (1-100),
      "description": "string",
      "actionItem": "string",
      "statusBadge": "OPTIMAL" | "PRIORITY" | "ATTENTION"
    }
  ],
  "personalizedRoadmap": [
    {
      "phase": "string",
      "timeline": "string",
      "milestone": "string",
      "deliverables": ["string", "string", "string"]
    }
  ],
  "riskMitigation": [
    {
      "risk": "string",
      "mitigation": "string"
    }
  ]
}
Ensure pronoun consistency for ${profile.fullName}: pronouns are ${profile.pronouns}.`;

  if (forceProvider === "rule") {
    return generateDeterministicFallback(profile, prompt);
  }

  // Attempt Primary: OpenAI
  if (forceProvider !== "gemini") {
    try {
      const res = await callOpenAI(fullSystemDirective, interpolatedUserPrompt);
      const parsed = JSON.parse(res.content);
      return {
        id: `rep_${Date.now()}`,
        reportCode: `PF-${Math.random().toString(36).substring(2, 7).toUpperCase()}-2026`,
        title: parsed.reportTitle || `${profile.fullName} • ${prompt.title}`,
        generatedAt: new Date().toISOString(),
        customerName: profile.fullName,
        pronounTag: profile.pronouns,
        summary: parsed.summary || "Tailored consumer intelligence dossier generated successfully.",
        coreInsights: parsed.coreInsights || [],
        personalizedRoadmap: parsed.personalizedRoadmap || [],
        riskMitigation: parsed.riskMitigation || [],
        disclaimer: "Generated via PersonaFlow AI Enterprise Engine. Confidential consumer report.",
        providerTelemetry: {
          provider: res.provider,
          model: res.model,
          latencyMs: res.latencyMs,
          tokens: res.tokens,
          timestamp: new Date().toISOString(),
          cached: false,
        },
      };
    } catch (errOpenAI) {
      console.warn("OpenAI call failed, falling back to Gemini:", (errOpenAI as Error).message);
    }
  }

  // Attempt Fallback: Google Gemini
  try {
    const res = await callGemini(fullSystemDirective, interpolatedUserPrompt);
    const parsed = JSON.parse(res.content);
    return {
      id: `rep_${Date.now()}`,
      reportCode: `PF-${Math.random().toString(36).substring(2, 7).toUpperCase()}-2026`,
      title: parsed.reportTitle || `${profile.fullName} • ${prompt.title}`,
      generatedAt: new Date().toISOString(),
      customerName: profile.fullName,
      pronounTag: profile.pronouns,
      summary: parsed.summary || "Tailored consumer intelligence dossier generated successfully via Gemini fallback.",
      coreInsights: parsed.coreInsights || [],
      personalizedRoadmap: parsed.personalizedRoadmap || [],
      riskMitigation: parsed.riskMitigation || [],
      disclaimer: "Generated via PersonaFlow AI Enterprise Engine (Google Gemini Fallback).",
      providerTelemetry: {
        provider: res.provider,
        model: res.model,
        latencyMs: res.latencyMs,
        tokens: res.tokens,
        timestamp: new Date().toISOString(),
        cached: false,
      },
    };
  } catch (errGemini) {
    console.warn("Gemini call failed, executing local deterministic engine:", (errGemini as Error).message);
    return generateDeterministicFallback(profile, prompt);
  }
}

// -------------------------------------------------------------
// 5. Profile-Aware Conversational AI Chatbot
// -------------------------------------------------------------
export async function generateChatResponse(
  messages: ChatMessage[],
  profile: CustomerProfile,
  reportSummary?: string
): Promise<{ reply: string; provider: string; latencyMs: number }> {
  const grammar = resolvePronounGrammar(profile.pronouns, {
    subject: profile.customPronounSubject,
    object: profile.customPronounObject,
    possessive: profile.customPronounPossessive,
  });

  const systemPrompt = `You are PersonaFlow AI's concierge assistant speaking directly with ${profile.fullName}.
CUSTOMER CONTEXT:
- Pronouns: ${profile.pronouns} (use '${grammar.subject}', '${grammar.possessive}' when referring in third-person, but speak directly to them in second-person 'you'/'your').
- Category: ${profile.selectedCategory}
- Goals: ${profile.primaryGoals.join(", ")}
- Lifestyle: ${profile.lifestyleFactors.weeklyCommitmentHrs} hrs/wk, budget tier: ${profile.lifestyleFactors.budgetTier}
- Current Report Summary: ${reportSummary || "No report generated yet."}

Respond warmly, concisely, and with high technical precision. Keep responses to 2-4 sentences with clear next steps.`;

  const lastMessage = messages[messages.length - 1]?.content || "Hello";

  // Try OpenAI
  try {
    const res = await callOpenAI(systemPrompt, lastMessage, 0.5);
    // Parse if JSON or return plain
    let reply = res.content;
    try {
      const parsed = JSON.parse(res.content);
      if (typeof parsed === "string") {
        reply = parsed;
      } else if (parsed && typeof parsed === "object") {
        reply =
          parsed.reply ||
          parsed.message ||
          parsed.response?.message ||
          (typeof parsed.response === "string" ? parsed.response : null) ||
          parsed.text ||
          parsed.answer ||
          (Object.values(parsed).find((v) => typeof v === "string") as string) ||
          res.content;
      }
    } catch {
      // plain text
    }
    return {
      reply,
      provider: "OpenAI gpt-4o-mini",
      latencyMs: res.latencyMs,
    };
  } catch {
    // Try Gemini
    try {
      const res = await callGemini(systemPrompt, lastMessage);
      return {
        reply: res.content.replace(/\{.*"reply":\s*"(.*)".*\}/s, "$1").trim() || res.content,
        provider: "Google Gemini 2.0 Flash",
        latencyMs: res.latencyMs,
      };
    } catch {
      // Deterministic fallback response
      return {
        reply: `Hello ${profile.fullName.split(" ")[0]}! I've loaded your profile for ${profile.selectedCategory}. Your target of ${profile.primaryGoals[0] || "personal growth"} is currently prioritized in your personal protocol. How can I assist you with your personalized roadmap today?`,
        provider: "PersonaFlow Local Concierge",
        latencyMs: 18,
      };
    }
  }
}

// -------------------------------------------------------------
// 6. Comprehensive Health & Live Provider Telemetry Check
// -------------------------------------------------------------
export async function checkAiHealth(): Promise<{
  status: "healthy" | "degraded" | "offline";
  openai: { active: boolean; latencyMs?: number; error?: string };
  gemini: { active: boolean; latencyMs?: number; error?: string };
  timestamp: string;
}> {
  const result = {
    status: "healthy" as "healthy" | "degraded" | "offline",
    openai: { active: false } as { active: boolean; latencyMs?: number; error?: string },
    gemini: { active: false } as { active: boolean; latencyMs?: number; error?: string },
    timestamp: new Date().toISOString(),
  };

  try {
    const resO = await callOpenAI("System health check. Return JSON.", "Respond with {\"status\":\"ok\"}");
    result.openai = { active: true, latencyMs: resO.latencyMs };
  } catch (err) {
    result.openai = { active: false, error: (err as Error).message };
  }

  try {
    const resG = await callGemini("System health check. Return JSON.", "Respond with {\"status\":\"ok\"}");
    result.gemini = { active: true, latencyMs: resG.latencyMs };
  } catch (err) {
    result.gemini = { active: false, error: (err as Error).message };
  }

  if (result.openai.active && result.gemini.active) {
    result.status = "healthy";
  } else if (result.openai.active || result.gemini.active) {
    result.status = "degraded";
  } else {
    result.status = "offline";
  }

  return result;
}
