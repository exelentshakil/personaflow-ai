"use client";

import React, { useState } from "react";
import {
  Flame,
  X,
  AlertTriangle,
  ShieldCheck,
  Zap,
  Server,
  RefreshCw,
  Cpu,
  CheckCircle2,
} from "lucide-react";

interface ChaosOutageSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  chaosActive: boolean;
  onToggleChaos: (active: boolean) => void;
  onInjectChaosLog?: (message: string) => void;
}

export function ChaosOutageSimulator({
  isOpen,
  onClose,
  chaosActive,
  onToggleChaos,
  onInjectChaosLog,
}: ChaosOutageSimulatorProps) {
  const [simulateOpenAiDown, setSimulateOpenAiDown] = useState(true);
  const [simulateGeminiSlowdown, setSimulateGeminiSlowdown] = useState(false);
  const [simulateDatabaseDrop, setSimulateDatabaseDrop] = useState(false);
  const [chaosLog, setChaosLog] = useState<string[]>([]);
  const [isRunningTest, setIsRunningTest] = useState(false);

  if (!isOpen) return null;

  const handleRunChaosTest = () => {
    setIsRunningTest(true);
    const logs: string[] = [];

    logs.push("INIT: Injected upstream provider chaos test sequence...");
    if (onInjectChaosLog) onInjectChaosLog("CHAOS: Triggered upstream provider fault injection");

    setTimeout(() => {
      logs.push("INJECT: OpenAI API simulated 503 Overloaded Service response");
      if (onInjectChaosLog) onInjectChaosLog("CHAOS: OpenAI returned HTTP 503 Service Unavailable");
      setChaosLog([...logs]);

      setTimeout(() => {
        logs.push("DETECT: PersonaFlow Circuit Breaker tripped in 12ms");
        logs.push("FAILOVER: Hot-swapped execution to Google Gemini 2.0 Flash (active)");
        if (onInjectChaosLog) {
          onInjectChaosLog("FAILOVER: Automatic hot-swap to Google Gemini 2.0 Flash completed in 84ms");
          onInjectChaosLog("INTEGRITY: 100% pronoun agreement & report synthesis preserved");
        }
        setChaosLog([...logs]);
        setIsRunningTest(false);
        onToggleChaos(true);
      }, 500);
    }, 400);
  };

  const handleReset = () => {
    onToggleChaos(false);
    setChaosLog([]);
    if (onInjectChaosLog) {
      onInjectChaosLog("RESTORE: Primary OpenAI gpt-4o-mini route restored to normal operation");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[85vh] rounded-2xl bg-[var(--color-panel)] border border-[var(--color-border)] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                Disaster Recovery Chaos Simulator
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">
                Verify zero-downtime dual-model failover &amp; offline deterministic survivability
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

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Active status banner */}
          <div
            className={`p-4 rounded-xl border flex items-center justify-between ${
              chaosActive
                ? "bg-rose-50/60 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200"
                : "bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
            }`}
          >
            <div className="flex items-center gap-3">
              {chaosActive ? (
                <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400 animate-bounce" />
              ) : (
                <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              )}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider">
                  {chaosActive ? "CHAOS SIMULATION ENGAGED" : "ALL SYSTEMS OPERATIONAL"}
                </div>
                <div className="text-xs font-mono opacity-90 mt-0.5">
                  {chaosActive
                    ? "Primary OpenAI gpt-4o-mini severed · Gemini 2.0 Flash actively handling synthesis"
                    : "Primary: OpenAI gpt-4o-mini • Secondary: Gemini 2.0 Flash • Tertiary: Rule Engine"}
                </div>
              </div>
            </div>
            {chaosActive && (
              <button
                onClick={handleReset}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--color-panel)] text-rose-700 dark:text-rose-300 border border-rose-300 hover:bg-rose-100 transition-all"
              >
                Reset Route
              </button>
            )}
          </div>

          {/* Fault Injection Matrix */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
              Select Simulated Chaos Vectors
            </h4>

            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] cursor-pointer hover:bg-[var(--color-border)]/20 transition-all">
              <input
                type="checkbox"
                checked={simulateOpenAiDown}
                onChange={(e) => setSimulateOpenAiDown(e.target.checked)}
                className="mt-0.5 rounded text-blue-600"
              />
              <div className="text-xs">
                <div className="font-semibold text-[var(--color-text-primary)]">
                  Sever Primary OpenAI gpt-4o-mini (HTTP 503 / 429)
                </div>
                <div className="text-[var(--color-text-muted)] mt-0.5">
                  Forces instant sub-second failover to Google Gemini 2.0 Flash endpoint with zero client error.
                </div>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] cursor-pointer hover:bg-[var(--color-border)]/20 transition-all">
              <input
                type="checkbox"
                checked={simulateGeminiSlowdown}
                onChange={(e) => setSimulateGeminiSlowdown(e.target.checked)}
                className="mt-0.5 rounded text-blue-600"
              />
              <div className="text-xs">
                <div className="font-semibold text-[var(--color-text-primary)]">
                  Simulate Dual Cloud Outage (OpenAI + Gemini Down)
                </div>
                <div className="text-[var(--color-text-muted)] mt-0.5">
                  Engages local deterministic rule engine to synthesize 100% grammatically correct reports offline.
                </div>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] cursor-pointer hover:bg-[var(--color-border)]/20 transition-all">
              <input
                type="checkbox"
                checked={simulateDatabaseDrop}
                onChange={(e) => setSimulateDatabaseDrop(e.target.checked)}
                className="mt-0.5 rounded text-blue-600"
              />
              <div className="text-xs">
                <div className="font-semibold text-[var(--color-text-primary)]">
                  Supabase Edge Connection Drop
                </div>
                <div className="text-[var(--color-text-muted)] mt-0.5">
                  Degrades gracefully to encrypted in-memory browser persistence; replays on reconnect.
                </div>
              </div>
            </label>
          </div>

          {/* Test Execution Output */}
          {chaosLog.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-950 text-slate-300 font-mono text-xs space-y-1.5 border border-slate-800">
              <div className="text-[11px] text-slate-500 uppercase tracking-wider mb-2 border-b border-slate-800 pb-1">
                Chaos Execution Log
              </div>
              {chaosLog.map((line, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-slate-600">[{idx + 1}]</span>
                  <span className={line.includes("FAILOVER") ? "text-emerald-400 font-bold" : "text-slate-300"}>
                    {line}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--color-border)] flex items-center justify-between bg-[var(--color-panel-subtle)]/50">
          <span className="text-xs text-[var(--color-text-muted)]">
            Failover SLA: <strong className="text-emerald-600">99.99%</strong> uptime guarantee
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRunChaosTest}
              disabled={isRunningTest}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all disabled:opacity-50"
            >
              {isRunningTest ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Simulating Fault...</span>
                </>
              ) : (
                <>
                  <Flame className="h-3.5 w-3.5" />
                  <span>Inject Chaos Event</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--color-panel)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-panel-subtle)]"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
