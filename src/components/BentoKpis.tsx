"use client";

import React from "react";
import { Zap, CheckCircle2, Layers, FileDown, ShieldCheck } from "lucide-react";

interface BentoKpisProps {
  lastLatency?: number;
  reportCount?: number;
  providerName?: string;
}

export function BentoKpis({
  lastLatency = 342,
  reportCount = 14,
  providerName = "OpenAI gpt-4o-mini",
}: BentoKpisProps) {
  return (
    <section className="py-4 sm:py-5 border-b border-[var(--color-border)] bg-[var(--color-panel-subtle)]/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
          {/* Metric 1: Inference Latency */}
          <div className="p-3.5 rounded-xl bg-[var(--color-panel)] border border-[var(--color-border)] shadow-sm">
            <div className="flex items-center justify-between gap-1 text-[var(--color-text-secondary)] mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">AI Latency</span>
              <Zap className="h-3.5 w-3.5 text-blue-600 shrink-0" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums tracking-tight text-[var(--color-text-primary)]">
              {lastLatency}<span className="text-sm font-sans font-medium text-[var(--color-text-muted)] ml-1">ms</span>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5 truncate font-mono">
              {providerName.includes("OpenAI") ? "gpt-4o-mini" : "gemini-2.5-flash"}
            </p>
          </div>

          {/* Metric 2: Pronoun Agreement */}
          <div className="p-3.5 rounded-xl bg-[var(--color-panel)] border border-[var(--color-border)] shadow-sm">
            <div className="flex items-center justify-between gap-1 text-[var(--color-text-secondary)] mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Grammar Guard</span>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums tracking-tight text-[var(--color-text-primary)]">
              100.0<span className="text-sm font-sans font-medium text-[var(--color-text-muted)] ml-1">%</span>
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium truncate">
              Pronoun agreement locked
            </p>
          </div>

          {/* Metric 3: Dynamic CMS Catalog */}
          <div className="p-3.5 rounded-xl bg-[var(--color-panel)] border border-[var(--color-border)] shadow-sm">
            <div className="flex items-center justify-between gap-1 text-[var(--color-text-secondary)] mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">CMS Products</span>
              <Layers className="h-3.5 w-3.5 text-purple-600 shrink-0" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums tracking-tight text-[var(--color-text-primary)]">
              4<span className="text-sm font-sans font-medium text-[var(--color-text-muted)] ml-1">Tiers</span>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5 truncate">
              Zero-code dynamic catalog
            </p>
          </div>

          {/* Metric 4: PDF Dossier Speed */}
          <div className="p-3.5 rounded-xl bg-[var(--color-panel)] border border-[var(--color-border)] shadow-sm">
            <div className="flex items-center justify-between gap-1 text-[var(--color-text-secondary)] mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">PDF Render</span>
              <FileDown className="h-3.5 w-3.5 text-amber-500 shrink-0" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums tracking-tight text-[var(--color-text-primary)]">
              0.8<span className="text-sm font-sans font-medium text-[var(--color-text-muted)] ml-1">sec</span>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5 truncate">
              Instant print &amp; download
            </p>
          </div>

          {/* Metric 5: Multi-Channel Dispatch */}
          <div className="p-3.5 rounded-xl bg-[var(--color-panel)] border border-[var(--color-border)] shadow-sm col-span-2 md:col-span-1">
            <div className="flex items-center justify-between gap-1 text-[var(--color-text-secondary)] mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Reliability SLA</span>
              <ShieldCheck className="h-3.5 w-3.5 text-blue-600 shrink-0" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums tracking-tight text-[var(--color-text-primary)]">
              99.99<span className="text-sm font-sans font-medium text-[var(--color-text-muted)] ml-1">%</span>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5 truncate">
              Failover circuit breaker
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
