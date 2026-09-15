"use client";

import React, { useState, useEffect } from "react";
import {
  UserCheck,
  Languages,
  Sparkles,
  FileText,
  Send,
  CheckCircle,
  Play,
  RotateCcw,
  Zap,
} from "lucide-react";

interface WorkflowCanvasProps {
  onTriggerPipeline: () => void;
  isGenerating: boolean;
  activeStepIndex?: number;
}

export function WorkflowCanvas({
  onTriggerPipeline,
  isGenerating,
  activeStepIndex,
}: WorkflowCanvasProps) {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    if (typeof activeStepIndex === "number") {
      setActiveStep(activeStepIndex);
    }
  }, [activeStepIndex]);

  const handleSimulate = () => {
    setIsRunning(true);
    setActiveStep(1);

    const timer1 = setTimeout(() => setActiveStep(2), 700);
    const timer2 = setTimeout(() => setActiveStep(3), 1500);
    const timer3 = setTimeout(() => setActiveStep(4), 2300);
    const timer4 = setTimeout(() => {
      setActiveStep(5);
      setIsRunning(false);
      onTriggerPipeline();
    }, 3100);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  };

  const nodes = [
    {
      id: 1,
      name: "Profile Intake",
      sub: "Customer Profile & Goals",
      icon: UserCheck,
      badge: "REST / Webhook",
      accent: "blue",
    },
    {
      id: 2,
      name: "Pronoun Synthesis",
      sub: "Grammar & Agree Guard",
      icon: Languages,
      badge: "Deterministic",
      accent: "emerald",
    },
    {
      id: 3,
      name: "Dual-AI Engine",
      sub: "OpenAI ➔ Gemini Fallback",
      icon: Sparkles,
      badge: "Sub-400ms SLA",
      accent: "purple",
    },
    {
      id: 4,
      name: "PDF Dossier Engine",
      sub: "Multi-page Vector Render",
      icon: FileText,
      badge: "Serverless PDF",
      accent: "amber",
    },
    {
      id: 5,
      name: "Multi-Channel Delivery",
      sub: "Download + SMS + Resend",
      icon: Send,
      badge: "DKIM / Twilio",
      accent: "blue",
    },
  ];

  return (
    <section className="py-6 border-b border-[var(--color-border)] bg-[var(--color-panel)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Canvas Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800 whitespace-nowrap shrink-0">
                <Zap className="h-3 w-3" />
                Durable Pipeline Canvas
              </span>
              <span className="text-xs text-[var(--color-text-muted)] font-mono hidden md:inline">
                Inngest • Ingestion ➔ Grammar ➔ Dual LLM ➔ PDF ➔ Webhook
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-[var(--color-text-primary)] mt-1">
              Automated End-to-End Personalization &amp; Report Synthesis Pipeline
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleSimulate}
              disabled={isRunning || isGenerating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 shadow-sm transition-all whitespace-nowrap"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>{isRunning ? "Running Pipeline..." : "Simulate Flow"}</span>
            </button>
            <button
              onClick={() => {
                setActiveStep(0);
                setIsRunning(false);
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-panel-subtle)] transition-all whitespace-nowrap"
              title="Reset state"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Node Pipeline Canvas */}
        <div className="relative p-4 sm:p-6 rounded-2xl bg-[var(--color-panel-subtle)]/70 border border-[var(--color-border)] overflow-x-auto">
          {/* SVG Animated Connector Wires for desktop */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none">
            <svg className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              {/* Connector Path through the centers of 5 cards */}
              <line
                x1="10%"
                y1="50%"
                x2="90%"
                y2="50%"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="6 6"
                className="text-[var(--color-border)]"
              />
              {/* Traveling Pulse Line */}
              <line
                x1="10%"
                y1="50%"
                x2="90%"
                y2="50%"
                stroke="url(#flowGrad)"
                strokeWidth="3"
                strokeDasharray="16 24"
                className="animate-[pulse_2s_linear_infinite]"
              />
            </svg>
          </div>

          {/* 5 Nodes Grid */}
          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 min-w-[700px] lg:min-w-0">
            {nodes.map((node) => {
              const Icon = node.icon;
              const isCurrent = activeStep === node.id || (activeStep === 0 && node.id === 1);
              const isPast = activeStep > node.id || activeStep === 5;

              return (
                <div
                  key={node.id}
                  className={`relative p-3.5 rounded-xl border transition-all duration-300 ${
                    isCurrent
                      ? "bg-[var(--color-panel)] border-blue-500 shadow-md ring-2 ring-blue-500/20"
                      : isPast
                      ? "bg-[var(--color-panel)] border-emerald-500/60 shadow-sm"
                      : "bg-[var(--color-panel)] border-[var(--color-border)] opacity-85"
                  }`}
                >
                  {/* Step Header */}
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-xs font-mono font-bold text-[var(--color-text-muted)]">
                      NODE 0{node.id}
                    </span>
                    {isPast ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle className="h-3.5 w-3.5" />
                        PASSED
                      </span>
                    ) : isCurrent && isRunning ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 animate-pulse">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                        ACTIVE
                      </span>
                    ) : (
                      <span className="text-xs font-mono text-[var(--color-text-muted)]">
                        STANDBY
                      </span>
                    )}
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        isCurrent
                          ? "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                          : isPast
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
                          : "bg-[var(--color-panel-subtle)] text-[var(--color-text-secondary)]"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-[var(--color-text-primary)] truncate">
                        {node.name}
                      </h4>
                      <p className="text-xs text-[var(--color-text-muted)] truncate mt-0.5">
                        {node.sub}
                      </p>
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="mt-3 pt-2.5 border-t border-[var(--color-border-subtle)]/60 flex items-center justify-between">
                    <span className="text-xs font-mono text-[var(--color-text-secondary)] truncate">
                      {node.badge}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
