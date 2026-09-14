"use client";

import React, { useState } from "react";
import {
  Terminal,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Zap,
  Activity,
} from "lucide-react";

export interface LogEntry {
  id: string;
  timestamp: string;
  type: "INGEST" | "PRONOUN" | "AI" | "PDF" | "WEBHOOK" | "CMS" | "SECURITY";
  message: string;
}

interface ExecutionLogDrawerProps {
  logs: LogEntry[];
  activeProvider: string;
  chaosMode: boolean;
}

export function ExecutionLogDrawer({
  logs,
  activeProvider,
  chaosMode,
}: ExecutionLogDrawerProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [copiedCurl, setCopiedCurl] = useState<boolean>(false);

  const curlCommand = `curl -X POST https://personaflow-ai.vercel.app/api/generate-report \\
  -H "Content-Type: application/json" \\
  -d '{
    "profile": {
      "fullName": "Morgan Vance",
      "pronouns": "they/them",
      "selectedCategory": "wellness-longevity",
      "primaryGoals": ["Optimize Deep Sleep", "Lower Resting HR"],
      "lifestyleFactors": { "weeklyCommitmentHrs": 6, "budgetTier": "Executive" }
    }
  }'`;

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-[var(--color-panel)] border-t border-[var(--color-border)] shadow-2xl transition-all">
      {/* Drawer Toggle Header Bar */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between cursor-pointer hover:bg-[var(--color-panel-subtle)] transition-colors select-none"
      >
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Terminal className="h-4 w-4 text-blue-600 shrink-0" />
          <span className="text-xs font-mono font-bold text-[var(--color-text-primary)] truncate">
            Live Execution Log &amp; Telemetry Stream
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            200 OK • 0 Flaky Drops
          </span>
          {chaosMode && (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
              CHAOS MODE ACTIVE
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-mono text-[var(--color-text-muted)] hidden md:inline">
            Active: {activeProvider}
          </span>
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </div>
      </div>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 border-t border-[var(--color-border)] bg-slate-950 text-slate-200 font-mono text-xs">
          <div className="flex flex-col md:flex-row gap-4 max-h-64 overflow-y-auto">
            {/* Stream Entries */}
            <div className="flex-1 space-y-1 overflow-y-auto pr-2">
              {logs.length === 0 ? (
                <div className="text-slate-500 italic py-2">
                  System armed. Trigger a pipeline simulation or profile generation to stream real-time events.
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-2 leading-relaxed text-[11px]">
                    <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                    <span
                      className={`font-bold shrink-0 ${
                        log.type === "AI"
                          ? "text-purple-400"
                          : log.type === "PRONOUN"
                          ? "text-emerald-400"
                          : log.type === "PDF"
                          ? "text-amber-400"
                          : log.type === "WEBHOOK"
                          ? "text-blue-400"
                          : "text-slate-300"
                      }`}
                    >
                      {log.type}:
                    </span>
                    <span className="text-slate-300 break-all">{log.message}</span>
                  </div>
                ))
              )}
            </div>

            {/* Copyable cURL API Box */}
            <div className="w-full md:w-80 p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2 shrink-0">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                <span>Direct API Endpoint</span>
                <button
                  type="button"
                  onClick={handleCopyCurl}
                  className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                >
                  {copiedCurl ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedCurl ? "Copied" : "Copy cURL"}</span>
                </button>
              </div>
              <pre className="text-[10px] text-slate-300 overflow-x-auto p-2 bg-slate-950 rounded border border-slate-800/80">
                {curlCommand}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
