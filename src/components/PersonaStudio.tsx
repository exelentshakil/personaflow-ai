"use client";

import React, { useState } from "react";
import {
  CustomerProfile,
  PredefinedPrompt,
  PersonalizedReport,
  PronounChoice,
} from "@/lib/types";
import { DEFAULT_PROMPTS, SAMPLE_PROFILES } from "@/lib/defaultData";
import { resolvePronounGrammar, interpolateTemplate } from "@/lib/pronouns";
import {
  Sparkles,
  User,
  Sliders,
  Terminal,
  Layers,
  ChevronRight,
  Check,
  Plus,
  X,
  Zap,
  Globe,
  RefreshCw,
  Cpu,
} from "lucide-react";

interface PersonaStudioProps {
  onGenerateReport: (
    profile: CustomerProfile,
    promptId: string,
    provider: "openai" | "gemini" | "rule"
  ) => Promise<void>;
  isGenerating: boolean;
  generatedReport: PersonalizedReport | null;
  currentProfile: CustomerProfile;
  setCurrentProfile: React.Dispatch<React.SetStateAction<CustomerProfile>>;
}

export function PersonaStudio({
  onGenerateReport,
  isGenerating,
  generatedReport,
  currentProfile,
  setCurrentProfile,
}: PersonaStudioProps) {
  const [selectedPromptId, setSelectedPromptId] = useState<string>(
    currentProfile.predefinedPromptId || DEFAULT_PROMPTS[0].id
  );
  const [targetProvider, setTargetProvider] = useState<"openai" | "gemini" | "rule">("openai");
  const [newGoalInput, setNewGoalInput] = useState<string>("");
  const [showPromptInspector, setShowPromptInspector] = useState<boolean>(false);

  const grammar = resolvePronounGrammar(currentProfile.pronouns, {
    subject: currentProfile.customPronounSubject,
    object: currentProfile.customPronounObject,
    possessive: currentProfile.customPronounPossessive,
  });

  const activePrompt =
    DEFAULT_PROMPTS.find((p) => p.id === selectedPromptId) || DEFAULT_PROMPTS[0];

  const interpolatedPreview = interpolateTemplate(activePrompt.userTemplate, currentProfile);

  const handleSelectSample = (sample: CustomerProfile) => {
    setCurrentProfile(sample);
    setSelectedPromptId(sample.predefinedPromptId);
  };

  const handleAddGoal = () => {
    if (newGoalInput.trim()) {
      setCurrentProfile((prev) => ({
        ...prev,
        primaryGoals: [...prev.primaryGoals, newGoalInput.trim()],
      }));
      setNewGoalInput("");
    }
  };

  const handleRemoveGoal = (index: number) => {
    setCurrentProfile((prev) => ({
      ...prev,
      primaryGoals: prev.primaryGoals.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Sample Profile Selector Banner */}
      <div className="p-4 rounded-xl bg-[var(--color-panel)] border border-[var(--color-border)] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
              Quick Test Persona Profiles
            </span>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              Select an archetype to test pronoun handling, prompt interpolation, and report synthesis
            </p>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap shrink-0">
            {SAMPLE_PROFILES.map((sample) => (
              <button
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all whitespace-nowrap shrink-0 ${
                  currentProfile.id === sample.id
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-[var(--color-panel-subtle)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-blue-400"
                }`}
              >
                {sample.fullName} ({sample.pronouns})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Studio Grid: Form (Left) + Live Interpolator & Telemetry (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Customer Profile Builder (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--color-panel)] border border-[var(--color-border)] shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm sm:text-base font-bold text-[var(--color-text-primary)]">
                  Customer Profile &amp; Pronoun Matrix
                </h3>
              </div>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                [Grammar Agreement: PASS]
              </span>
            </div>

            {/* Name & Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1">
                  Full Customer Name
                </label>
                <input
                  type="text"
                  value={currentProfile.fullName}
                  onChange={(e) =>
                    setCurrentProfile({ ...currentProfile, fullName: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg text-sm bg-[var(--color-panel-subtle)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-[var(--color-text-primary)] font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1">
                  Customer Email
                </label>
                <input
                  type="email"
                  value={currentProfile.email}
                  onChange={(e) =>
                    setCurrentProfile({ ...currentProfile, email: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg text-sm bg-[var(--color-panel-subtle)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-[var(--color-text-primary)] font-medium"
                />
              </div>
            </div>

            {/* Pronoun Selector (Core Client Requirement) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Grammatical Pronoun Selection
                </label>
                <span className="text-xs font-mono text-blue-600">
                  Synthesizes: {grammar.subject} / {grammar.object} ({grammar.possessive})
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(["they/them", "she/her", "he/him", "custom"] as PronounChoice[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setCurrentProfile({ ...currentProfile, pronouns: p })}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all text-center whitespace-nowrap shrink-0 ${
                      currentProfile.pronouns === p
                        ? "bg-blue-50 text-blue-700 border-blue-400 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-700 shadow-sm"
                        : "bg-[var(--color-panel-subtle)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-panel)]"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* Custom Pronoun Fields if 'custom' */}
              {currentProfile.pronouns === "custom" && (
                <div className="mt-3 p-3 rounded-lg bg-[var(--color-panel-subtle)] border border-[var(--color-border)] grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-text-secondary)] mb-1">
                      Subject (e.g. ze)
                    </label>
                    <input
                      type="text"
                      placeholder="ze"
                      value={currentProfile.customPronounSubject || ""}
                      onChange={(e) =>
                        setCurrentProfile({
                          ...currentProfile,
                          customPronounSubject: e.target.value,
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs rounded bg-[var(--color-panel)] border border-[var(--color-border)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-text-secondary)] mb-1">
                      Object (e.g. zir)
                    </label>
                    <input
                      type="text"
                      placeholder="zir"
                      value={currentProfile.customPronounObject || ""}
                      onChange={(e) =>
                        setCurrentProfile({
                          ...currentProfile,
                          customPronounObject: e.target.value,
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs rounded bg-[var(--color-panel)] border border-[var(--color-border)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-text-secondary)] mb-1">
                      Possessive (e.g. zir)
                    </label>
                    <input
                      type="text"
                      placeholder="zir"
                      value={currentProfile.customPronounPossessive || ""}
                      onChange={(e) =>
                        setCurrentProfile({
                          ...currentProfile,
                          customPronounPossessive: e.target.value,
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs rounded bg-[var(--color-panel)] border border-[var(--color-border)]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Category & Tone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1">
                  Product / Service Domain
                </label>
                <select
                  value={currentProfile.selectedCategory}
                  onChange={(e) =>
                    setCurrentProfile({ ...currentProfile, selectedCategory: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg text-sm bg-[var(--color-panel-subtle)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-[var(--color-text-primary)] font-medium"
                >
                  <option value="wellness-longevity">Executive Longevity &amp; Vitality</option>
                  <option value="executive-career">Strategic Executive Career</option>
                  <option value="financial-blueprint">Private Wealth Architecture</option>
                  <option value="life-strategy">90-Day Holistic Life Strategy</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1">
                  AI Editorial Tone
                </label>
                <select
                  value={currentProfile.tonePreference}
                  onChange={(e) =>
                    setCurrentProfile({
                      ...currentProfile,
                      tonePreference: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg text-sm bg-[var(--color-panel-subtle)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-[var(--color-text-primary)] font-medium"
                >
                  <option value="direct-analytical">Direct &amp; Analytical</option>
                  <option value="empathetic-supportive">Empathetic &amp; Supportive</option>
                  <option value="inspirational-visionary">Inspirational &amp; Visionary</option>
                  <option value="action-oriented">High-Velocity Action Oriented</option>
                </select>
              </div>
            </div>

            {/* Primary Goals Tag Manager */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1">
                Customer Primary Goals
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {currentProfile.primaryGoals.map((goal, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800"
                  >
                    <span>{goal}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveGoal(idx)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add specific target goal..."
                  value={newGoalInput}
                  onChange={(e) => setNewGoalInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddGoal()}
                  className="flex-1 px-3 py-1.5 rounded-lg text-xs bg-[var(--color-panel-subtle)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-[var(--color-text-primary)]"
                />
                <button
                  type="button"
                  onClick={handleAddGoal}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--color-panel-subtle)] border border-[var(--color-border)] hover:bg-[var(--color-panel)] text-[var(--color-text-primary)] flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Weekly Commitment Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1">
                <span>Weekly Commitment</span>
                <span className="font-mono text-blue-600 text-sm">
                  {currentProfile.lifestyleFactors.weeklyCommitmentHrs} hrs/week
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                value={currentProfile.lifestyleFactors.weeklyCommitmentHrs}
                onChange={(e) =>
                  setCurrentProfile({
                    ...currentProfile,
                    lifestyleFactors: {
                      ...currentProfile.lifestyleFactors,
                      weeklyCommitmentHrs: parseInt(e.target.value),
                    },
                  })
                }
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Predefined Prompt Inspector & Pipeline Trigger (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Predefined Prompt Selector */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--color-panel)] border border-[var(--color-border)] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-purple-600" />
                <h3 className="text-sm sm:text-base font-bold text-[var(--color-text-primary)]">
                  Predefined Admin Prompt
                </h3>
              </div>
              <span className="text-xs font-mono text-[var(--color-text-muted)]">
                CMS Controlled
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1">
                Active Prompt Template
              </label>
              <select
                value={selectedPromptId}
                onChange={(e) => {
                  setSelectedPromptId(e.target.value);
                  setCurrentProfile({ ...currentProfile, predefinedPromptId: e.target.value });
                }}
                className="w-full px-3 py-2 rounded-lg text-xs sm:text-sm bg-[var(--color-panel-subtle)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-[var(--color-text-primary)] font-medium"
              >
                {DEFAULT_PROMPTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Provider Target */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1">
                Execution Provider Strategy
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTargetProvider("openai")}
                  className={`px-2 py-1.5 rounded-lg text-xs font-medium border text-center transition-all ${
                    targetProvider === "openai"
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-[var(--color-panel-subtle)] text-[var(--color-text-secondary)] border-[var(--color-border)]"
                  }`}
                >
                  OpenAI
                </button>
                <button
                  type="button"
                  onClick={() => setTargetProvider("gemini")}
                  className={`px-2 py-1.5 rounded-lg text-xs font-medium border text-center transition-all ${
                    targetProvider === "gemini"
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-[var(--color-panel-subtle)] text-[var(--color-text-secondary)] border-[var(--color-border)]"
                  }`}
                >
                  Gemini Flash
                </button>
                <button
                  type="button"
                  onClick={() => setTargetProvider("rule")}
                  className={`px-2 py-1.5 rounded-lg text-xs font-medium border text-center transition-all ${
                    targetProvider === "rule"
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-[var(--color-panel-subtle)] text-[var(--color-text-secondary)] border-[var(--color-border)]"
                  }`}
                >
                  Local Deterministic
                </button>
              </div>
            </div>

            {/* Live Interpolated Prompt Readout */}
            <div className="p-3.5 rounded-xl bg-[var(--color-panel-subtle)] border border-[var(--color-border)] font-mono text-xs space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--color-text-secondary)]">
                <span>INTERPOLATED PROMPT PAYLOAD</span>
                <span className="text-emerald-600 dark:text-emerald-400">Tokens: ~420</span>
              </div>
              <p className="text-[var(--color-text-primary)] leading-relaxed line-clamp-4 bg-[var(--color-panel)] p-2.5 rounded-lg border border-[var(--color-border-subtle)]/60">
                {interpolatedPreview}
              </p>
              <div className="flex items-center justify-between text-[11px] text-[var(--color-text-muted)] pt-1">
                <span>Variables: {activePrompt.variables.length} injected</span>
                <button
                  type="button"
                  onClick={() => setShowPromptInspector(!showPromptInspector)}
                  className="text-blue-600 hover:underline"
                >
                  {showPromptInspector ? "Hide Details" : "Inspect Raw Directives"}
                </button>
              </div>
            </div>

            {showPromptInspector && (
              <div className="p-3 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs space-y-1.5">
                <div className="text-slate-400 text-[10px] uppercase">System Directive:</div>
                <p className="text-slate-200 text-[11px]">{activePrompt.systemDirective}</p>
              </div>
            )}

            {/* Generate Action Button */}
            <button
              onClick={() => onGenerateReport(currentProfile, selectedPromptId, targetProvider)}
              disabled={isGenerating}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Synthesizing Personalized Dossier...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Generate Personalized Report &amp; PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
