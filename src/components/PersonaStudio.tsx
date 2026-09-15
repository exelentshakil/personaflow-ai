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
  Users,
  UserCheck,
  Sliders,
  Terminal,
  Layers,
  ChevronRight,
  ChevronDown,
  Check,
  Plus,
  X,
  Zap,
  Globe,
  RefreshCw,
  Cpu,
  Target,
  Clock,
  Compass,
  FileCode,
  ShieldCheck,
  CheckCircle2,
  Copy,
  SlidersHorizontal,
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
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

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

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(interpolatedPreview);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Quick Archetype Switcher Bar */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-[var(--color-panel)] border border-[var(--color-border)] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 flex items-center justify-center shrink-0">
              <SlidersHorizontal className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
                Live Archetype Fast-Switcher
              </span>
              <p className="text-xs text-[var(--color-text-muted)]">
                Test deterministic pronoun agreements &amp; domain prompts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {SAMPLE_PROFILES.map((sample) => {
              const isSelected = currentProfile.id === sample.id;
              return (
                <button
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap shrink-0 ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-[var(--color-panel-subtle)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-blue-400 hover:text-[var(--color-text-primary)]"
                  }`}
                >
                  <User className="h-3.5 w-3.5" />
                  <span>{sample.fullName.split(" ")[0]}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-xs font-mono ${
                      isSelected
                        ? "bg-blue-700 text-blue-100"
                        : "bg-[var(--color-panel)] text-[var(--color-text-muted)]"
                    }`}
                  >
                    {sample.pronouns}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Customer Profile & Pronoun Matrix Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[var(--color-panel)] border border-[var(--color-border)] shadow-sm space-y-5">
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <UserCheck className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[var(--color-text-primary)]">
                Customer Profile &amp; Pronoun Matrix
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">
                Zod-validated consumer identity with deterministic grammar agreement
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span className="font-mono">Grammar Guard: PASS</span>
          </span>
        </div>

        {/* Name & Email Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5">
              <User className="h-3.5 w-3.5 text-blue-600" />
              <span>Customer Full Name</span>
            </label>
            <input
              type="text"
              value={currentProfile.fullName}
              onChange={(e) =>
                setCurrentProfile({ ...currentProfile, fullName: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-[var(--color-panel-subtle)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-[var(--color-text-primary)] font-medium"
              placeholder="e.g. Morgan Vance"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5">
              <Globe className="h-3.5 w-3.5 text-blue-600" />
              <span>Contact Email (PDF Destination)</span>
            </label>
            <input
              type="email"
              value={currentProfile.email}
              onChange={(e) =>
                setCurrentProfile({ ...currentProfile, email: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-[var(--color-panel-subtle)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-[var(--color-text-primary)] font-medium"
              placeholder="e.g. client@domain.com"
            />
          </div>
        </div>

        {/* Pronoun Selector (Core Client Requirement) */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
              <Users className="h-3.5 w-3.5 text-blue-600" />
              <span>Grammatical Pronoun Agreement</span>
            </label>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              <span>Resolves:</span>
              <strong>
                {grammar.subject} / {grammar.object} • {grammar.verbIs}
              </strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { val: "they/them" as PronounChoice, label: "they / them", icon: Users },
              { val: "she/her" as PronounChoice, label: "she / her", icon: User },
              { val: "he/him" as PronounChoice, label: "he / him", icon: User },
              { val: "custom" as PronounChoice, label: "custom (ze/zir)", icon: Sliders },
            ].map(({ val, label, icon: Icon }) => (
              <button
                key={val}
                type="button"
                onClick={() => setCurrentProfile({ ...currentProfile, pronouns: val })}
                className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                  currentProfile.pronouns === val
                    ? "bg-blue-50 text-blue-700 border-blue-400 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-700 shadow-sm"
                    : "bg-[var(--color-panel-subtle)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-panel)] hover:border-blue-300"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Custom Pronoun Fields if 'custom' */}
          {currentProfile.pronouns === "custom" && (
            <div className="mt-3 p-3.5 rounded-xl bg-[var(--color-panel-subtle)] border border-[var(--color-border)] grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
                  Subject Pronoun (e.g. ze)
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
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-[var(--color-panel)] border border-[var(--color-border)] text-[var(--color-text-primary)]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
                  Object Pronoun (e.g. zir)
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
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-[var(--color-panel)] border border-[var(--color-border)] text-[var(--color-text-primary)]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
                  Possessive Pronoun (e.g. zir)
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
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-[var(--color-panel)] border border-[var(--color-border)] text-[var(--color-text-primary)]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Category Domain & Editorial Tone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5">
              <Compass className="h-3.5 w-3.5 text-blue-600" />
              <span>Product / Service Domain</span>
            </label>
            <select
              value={currentProfile.selectedCategory}
              onChange={(e) =>
                setCurrentProfile({ ...currentProfile, selectedCategory: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-[var(--color-panel-subtle)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-[var(--color-text-primary)] font-medium"
            >
              <option value="wellness-longevity">Executive Longevity &amp; Vitality</option>
              <option value="executive-career">Strategic Executive Career</option>
              <option value="financial-blueprint">Private Wealth Architecture</option>
              <option value="life-strategy">90-Day Holistic Life Strategy</option>
            </select>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5">
              <Sparkles className="h-3.5 w-3.5 text-purple-600" />
              <span>AI Editorial Tone</span>
            </label>
            <select
              value={currentProfile.tonePreference}
              onChange={(e) =>
                setCurrentProfile({
                  ...currentProfile,
                  tonePreference: e.target.value as any,
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-[var(--color-panel-subtle)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-[var(--color-text-primary)] font-medium"
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
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5">
            <Target className="h-3.5 w-3.5 text-rose-500" />
            <span>Customer Primary Goals</span>
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {currentProfile.primaryGoals.map((goal, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800"
              >
                <span>{goal}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveGoal(idx)}
                  className="text-blue-500 hover:text-blue-700 transition-colors"
                  aria-label="Remove goal"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add specific target goal (e.g. Lower resting heart rate by 6 bpm)..."
              value={newGoalInput}
              onChange={(e) => setNewGoalInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddGoal()}
              className="flex-1 px-3.5 py-2 rounded-xl text-xs bg-[var(--color-panel-subtle)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-[var(--color-text-primary)]"
            />
            <button
              type="button"
              onClick={handleAddGoal}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--color-panel-subtle)] border border-[var(--color-border)] hover:bg-[var(--color-panel)] text-[var(--color-text-primary)] flex items-center gap-1.5 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Goal</span>
            </button>
          </div>
        </div>

        {/* Weekly Commitment Slider */}
        <div className="p-3.5 rounded-xl bg-[var(--color-panel-subtle)] border border-[var(--color-border)]">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-amber-500" />
              <span>Weekly Commitment Capacity</span>
            </span>
            <span className="font-mono text-blue-600 dark:text-blue-400 text-sm font-bold">
              {currentProfile.lifestyleFactors.weeklyCommitmentHrs} hrs / week
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

      {/* 3. AI Model Strategy & CMS Predefined Prompt Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[var(--color-panel)] border border-[var(--color-border)] shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Terminal className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[var(--color-text-primary)]">
                AI Orchestrator &amp; Predefined Prompt Directive
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">
                Managed in CMS catalog • Dual-provider inference with deterministic failover
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            <Layers className="h-3 w-3" />
            <span>CMS Controlled</span>
          </span>
        </div>

        {/* Prompt Template Dropdown */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5">
            <FileCode className="h-3.5 w-3.5 text-purple-600" />
            <span>Active CMS Prompt Template</span>
          </label>
          <select
            value={selectedPromptId}
            onChange={(e) => setSelectedPromptId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-[var(--color-panel-subtle)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-purple-500/30 text-[var(--color-text-primary)] font-medium"
          >
            {DEFAULT_PROMPTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.category})
              </option>
            ))}
          </select>
        </div>

        {/* Dual AI Provider Strategy Selector */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5">
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            <span>Inference Provider Routing</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => setTargetProvider("openai")}
              className={`p-3 rounded-xl border text-left transition-all ${
                targetProvider === "openai"
                  ? "bg-emerald-50/70 border-emerald-400 dark:bg-emerald-950/40 dark:border-emerald-700 shadow-sm"
                  : "bg-[var(--color-panel-subtle)] border-[var(--color-border)] hover:bg-[var(--color-panel)]"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-text-primary)]">
                  <Zap className="h-3.5 w-3.5 text-emerald-600" />
                  <span>OpenAI</span>
                </div>
                <span className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                  gpt-4o-mini
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)]">
                Primary • Structured JSON schema
              </p>
            </button>

            <button
              type="button"
              onClick={() => setTargetProvider("gemini")}
              className={`p-3 rounded-xl border text-left transition-all ${
                targetProvider === "gemini"
                  ? "bg-blue-50/70 border-blue-400 dark:bg-blue-950/40 dark:border-blue-700 shadow-sm"
                  : "bg-[var(--color-panel-subtle)] border-[var(--color-border)] hover:bg-[var(--color-panel)]"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-text-primary)]">
                  <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                  <span>Google Gemini</span>
                </div>
                <span className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                  2.5 Flash
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)]">
                Active failover • Sub-second speed
              </p>
            </button>

            <button
              type="button"
              onClick={() => setTargetProvider("rule")}
              className={`p-3 rounded-xl border text-left transition-all ${
                targetProvider === "rule"
                  ? "bg-purple-50/70 border-purple-400 dark:bg-purple-950/40 dark:border-purple-700 shadow-sm"
                  : "bg-[var(--color-panel-subtle)] border-[var(--color-border)] hover:bg-[var(--color-panel)]"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-text-primary)]">
                  <Cpu className="h-3.5 w-3.5 text-purple-600" />
                  <span>Deterministic</span>
                </div>
                <span className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300">
                  Local Rule
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)]">
                100% offline uptime guarantee
              </p>
            </button>
          </div>
        </div>

        {/* Collapsible Prompt Inspector */}
        <div className="border border-[var(--color-border)] rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setShowPromptInspector(!showPromptInspector)}
            className="w-full px-4 py-3 bg-[var(--color-panel-subtle)] hover:bg-[var(--color-panel)] flex items-center justify-between transition-colors text-left"
          >
            <div className="flex items-center gap-2">
              <Terminal className="h-3.5 w-3.5 text-purple-600" />
              <span className="text-xs font-semibold text-[var(--color-text-primary)]">
                Inspect Interpolated Prompt Payload
              </span>
              <span className="text-xs font-mono text-[var(--color-text-muted)]">
                ({currentProfile.fullName} • {grammar.subject}/{grammar.object})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-purple-600 dark:text-purple-400">
                {showPromptInspector ? "Hide Payload" : "View Payload"}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-[var(--color-text-muted)] transition-transform duration-200 ${
                  showPromptInspector ? "rotate-180" : ""
                }`}
              />
            </div>
          </button>

          {showPromptInspector && (
            <div className="p-4 bg-slate-950 font-mono text-xs text-slate-300 space-y-3 border-t border-[var(--color-border)]">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                <span>Directives: {activePrompt.systemDirective.length} chars • User Payload: {interpolatedPreview.length} chars</span>
                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className="flex items-center gap-1 text-slate-300 hover:text-white px-2 py-0.5 rounded bg-slate-900 border border-slate-700"
                >
                  {copiedPrompt ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedPrompt ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <pre className="whitespace-pre-wrap leading-relaxed text-xs text-slate-200 max-h-48 overflow-y-auto">
                {interpolatedPreview}
              </pre>
            </div>
          )}
        </div>

        {/* Action Trigger Button */}
        <button
          type="button"
          onClick={() => onGenerateReport(currentProfile, selectedPromptId, targetProvider)}
          disabled={isGenerating}
          className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/20 active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin text-white" />
              <span>Synthesizing Intelligence Dossier ({targetProvider.toUpperCase()})...</span>
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 text-amber-300 fill-amber-300" />
              <span>Generate Personalized Report &amp; Vector PDF</span>
              <ChevronRight className="h-4 w-4 text-blue-200" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
