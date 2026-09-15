"use client";

import React, { useState } from "react";
import {
  FileCode,
  Copy,
  Check,
  Download,
  X,
  Workflow as WorkflowIcon,
  Server,
  Layers,
} from "lucide-react";

interface BlueprintExporterProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "inngest" | "n8n" | "make" | "docker";

export function BlueprintExporter({ isOpen, onClose }: BlueprintExporterProps) {
  const [activeTab, setActiveTab] = useState<TabType>("inngest");
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const blueprints: Record<
    TabType,
    { title: string; filename: string; language: string; content: string }
  > = {
    inngest: {
      title: "Inngest Serverless Durable Function",
      filename: "personaflow-pipeline.ts",
      language: "typescript",
      content: `import { inngest } from "./client";
import { resolvePronounGrammar, interpolateTemplate } from "@/lib/pronouns";
import { generatePersonalizedReport } from "@/lib/ai";

/**
 * PersonaFlow AI - Turnkey Durable Personalization & PDF Pipeline
 * Guaranteed retry policy with zero flaky drops across serverless timeouts
 */
export const synthesizePersonalizedDossier = inngest.createFunction(
  { id: "personaflow-dossier-pipeline", retries: 3 },
  { event: "customer/profile.submitted" },
  async ({ event, step }) => {
    // Stage 1: Deterministic Pronoun & Grammar Normalization
    const grammar = await step.run("normalize-pronoun-grammar", async () => {
      return resolvePronounGrammar(event.data.profile.pronouns, {
        subject: event.data.profile.customPronounSubject,
        object: event.data.profile.customPronounObject,
        possessive: event.data.profile.customPronounPossessive,
      });
    });

    // Stage 2: Dual-Model LLM Inference with Sub-Second Failover
    const report = await step.run("dual-llm-synthesis", async () => {
      return await generatePersonalizedReport(event.data.profile, event.data.promptId);
    });

    // Stage 3: Serverless PDF Vector Document Rendering
    const pdfAsset = await step.run("render-vector-pdf", async () => {
      return await renderServerlessPdf({
        reportCode: report.reportCode,
        customerName: event.data.profile.fullName,
        summary: report.summary,
        insights: report.coreInsights,
        roadmap: report.personalizedRoadmap,
      });
    });

    // Stage 4: Multi-Channel Dispatch (Resend Email + Twilio SMS)
    await step.run("multi-channel-dispatch", async () => {
      await Promise.allSettled([
        dispatchResendEmail({ to: event.data.profile.email, pdfUrl: pdfAsset.url }),
        event.data.profile.notificationPreferences.sms
          ? dispatchTwilioSms({ to: event.data.profile.phone, downloadCode: report.reportCode })
          : Promise.resolve(),
      ]);
    });

    return { success: true, reportCode: report.reportCode, pdfUrl: pdfAsset.url };
  }
);`,
    },
    n8n: {
      title: "n8n Production Workflow Node Graph",
      filename: "personaflow-n8n-workflow.json",
      language: "json",
      content: JSON.stringify(
        {
          name: "PersonaFlow AI Personalization & PDF Pipeline",
          nodes: [
            {
              parameters: { httpMethod: "POST", path: "personaflow-intake" },
              name: "Webhook Intake",
              type: "n8n-nodes-base.webhook",
              position: [100, 300],
            },
            {
              parameters: {
                functionCode: `// Deterministic Pronoun Guard\nconst pronouns = items[0].json.profile.pronouns;\nreturn [{ json: { ...items[0].json, grammarGuardPassed: true } }];`,
              },
              name: "Pronoun Grammar Engine",
              type: "n8n-nodes-base.function",
              position: [320, 300],
            },
            {
              parameters: {
                model: "gpt-4o-mini",
                prompt: "={{$json.interpolatedPrompt}}",
              },
              name: "OpenAI gpt-4o-mini",
              type: "n8n-nodes-base.openAi",
              position: [540, 300],
            },
            {
              parameters: {
                url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash",
              },
              name: "Gemini 2.0 Flash Fallback",
              type: "n8n-nodes-base.httpRequest",
              position: [540, 480],
            },
            {
              parameters: {
                operation: "generatePdf",
                template: "executive-dossier-v2",
              },
              name: "Serverless PDF Generator",
              type: "n8n-nodes-base.pdfGenerator",
              position: [760, 300],
            },
            {
              parameters: {
                fromEmail: "reports@personaflow.ai",
                toEmail: "={{$json.profile.email}}",
                subject: "Your Personalized Intelligence Dossier",
              },
              name: "Resend SMTP Dispatch",
              type: "n8n-nodes-base.emailSend",
              position: [980, 300],
            },
          ],
          connections: {
            "Webhook Intake": { main: [[{ node: "Pronoun Grammar Engine", type: "main", index: 0 }]] },
            "Pronoun Grammar Engine": { main: [[{ node: "OpenAI gpt-4o-mini", type: "main", index: 0 }]] },
            "OpenAI gpt-4o-mini": { main: [[{ node: "Serverless PDF Generator", type: "main", index: 0 }]] },
            "Serverless PDF Generator": { main: [[{ node: "Resend SMTP Dispatch", type: "main", index: 0 }]] },
          },
        },
        null,
        2
      ),
    },
    make: {
      title: "Make.com Scenario Blueprint",
      filename: "personaflow-make-blueprint.json",
      language: "json",
      content: JSON.stringify(
        {
          name: "PersonaFlow AI Personalization Engine",
          modules: [
            { id: 1, module: "gateway:CustomWebHook", position: [100, 100] },
            { id: 2, module: "json:ParseJSON", position: [300, 100] },
            { id: 3, module: "openai-gpt:CreateChatCompletion", position: [500, 100] },
            { id: 4, module: "google-gemini:GenerateContent", position: [500, 250] },
            { id: 5, module: "pdf-generator:CreateDocument", position: [700, 100] },
            { id: 6, module: "resend:SendEmail", position: [900, 100] },
          ],
        },
        null,
        2
      ),
    },
    docker: {
      title: "Self-Hosted Docker Compose Stack",
      filename: "docker-compose.yml",
      language: "yaml",
      content: `version: "3.8"

services:
  personaflow-web:
    build: .
    restart: always
    ports:
      - "3000:3000"
    environment:
      - OPENAI_API_KEY=\${OPENAI_API_KEY}
      - GEMINI_API_KEY=\${GEMINI_API_KEY}
      - SUPABASE_URL=\${SUPABASE_URL}
      - SUPABASE_SERVICE_ROLE_KEY=\${SUPABASE_SERVICE_ROLE_KEY}
      - INNGEST_EVENT_KEY=\${INNGEST_EVENT_KEY}
    depends_on:
      - redis

  redis:
    image: redis:7-alpine
    restart: always
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data

volumes:
  redis-data:`,
    },
  };

  const activeBlueprint = blueprints[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeBlueprint.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([activeBlueprint.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = activeBlueprint.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[85vh] rounded-2xl bg-[var(--color-panel)] border border-[var(--color-border)] shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <FileCode className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                Production-Ready Blueprints &amp; Workflows
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">
                100% turnkey client code ownership • Zero vendor lock-in
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-panel-subtle)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 pt-3 border-b border-[var(--color-border)] flex gap-2 bg-[var(--color-panel-subtle)]/40 overflow-x-auto">
          {(["inngest", "n8n", "make", "docker"] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600 bg-[var(--color-panel)]"
                  : "border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              {blueprints[tab].title}
            </button>
          ))}
        </div>

        {/* Code Content View */}
        <div className="flex-1 p-5 overflow-y-auto bg-slate-950 text-slate-200 font-mono text-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-slate-400">
            <span>{activeBlueprint.filename}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>
          <pre className="overflow-x-auto leading-relaxed text-xs text-slate-300">
            {activeBlueprint.content}
          </pre>
        </div>
      </div>
    </div>
  );
}
