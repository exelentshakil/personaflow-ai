"use client";

import React from "react";
import { useTheme } from "next-themes";
import {
  Sparkles,
  Sun,
  Moon,
  ShieldCheck,
  Zap,
  Activity,
  Download,
  Calculator,
  Flame,
  Layers,
  MessageSquare,
  FileText,
  Settings,
  UserCheck,
} from "lucide-react";

interface NavbarProps {
  activeTab: "studio" | "chat" | "cms" | "account";
  setActiveTab: (tab: "studio" | "chat" | "cms" | "account") => void;
  onQuickDemo: () => void;
  onOpenBlueprints: () => void;
  onOpenRoi: () => void;
  onOpenChaos: () => void;
  chaosActive: boolean;
  isGenerating: boolean;
}

export function Navbar({
  activeTab,
  setActiveTab,
  onQuickDemo,
  onOpenBlueprints,
  onOpenRoi,
  onOpenChaos,
  chaosActive,
  isGenerating,
}: NavbarProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-panel)]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-2 sm:gap-4">
          {/* Brand & Workspace */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-[var(--color-text-primary)]">
                  PersonaFlow<span className="text-blue-600">.ai</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Dual-AI Armed
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] truncate hidden md:block">
                Consumer Personalization Engine &amp; Automated PDF Delivery
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="flex items-center gap-1 p-1 rounded-xl bg-[var(--color-panel-subtle)] border border-[var(--color-border)] overflow-x-auto shrink-0">
            <button
              onClick={() => setActiveTab("studio")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === "studio"
                  ? "bg-[var(--color-panel)] text-blue-600 shadow-sm"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Persona Studio</span>
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === "chat"
                  ? "bg-[var(--color-panel)] text-blue-600 shadow-sm"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>AI Concierge</span>
            </button>
            <button
              onClick={() => setActiveTab("cms")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === "cms"
                  ? "bg-[var(--color-panel)] text-blue-600 shadow-sm"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>CMS Catalog</span>
            </button>
            <button
              onClick={() => setActiveTab("account")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === "account"
                  ? "bg-[var(--color-panel)] text-blue-600 shadow-sm"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span>Account &amp; 2FA</span>
            </button>
          </nav>

          {/* Action Tools & Theme */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Quick Demo Trigger */}
            <button
              onClick={onQuickDemo}
              disabled={isGenerating}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition-all disabled:opacity-50 whitespace-nowrap"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Run Live Pipeline</span>
            </button>

            {/* Chaos Failover */}
            <button
              onClick={onOpenChaos}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap ${
                chaosActive
                  ? "bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800 animate-pulse"
                  : "bg-[var(--color-panel)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-panel-subtle)]"
              }`}
              title="Disaster Recovery Chaos Test"
            >
              <Flame className="h-3.5 w-3.5 text-rose-500" />
              <span className="hidden sm:inline">Failover</span>
            </button>

            {/* ROI Calculator */}
            <button
              onClick={onOpenRoi}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[var(--color-panel)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-panel-subtle)] transition-all whitespace-nowrap"
              title="Token Burn & ROI Calculator"
            >
              <Calculator className="h-3.5 w-3.5 text-amber-500" />
              <span className="hidden sm:inline">ROI</span>
            </button>

            {/* Blueprints Exporter */}
            <button
              onClick={onOpenBlueprints}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[var(--color-panel)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-panel-subtle)] transition-all whitespace-nowrap"
              title="Download Production Blueprints (n8n, Make, Inngest)"
            >
              <Download className="h-3.5 w-3.5 text-blue-500" />
              <span className="hidden sm:inline">Export</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] text-[var(--color-text-secondary)] hover:bg-[var(--color-panel-subtle)] transition-colors shrink-0"
              aria-label="Toggle theme"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-400" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
