"use client";

import React from "react";
import {
  Sparkles,
  ShieldCheck,
  Cpu,
  Server,
  Workflow,
  ExternalLink,
  Code2,
  FileCheck,
  CheckCircle2,
} from "lucide-react";

interface FooterProps {
  onOpenBlueprints: () => void;
  onOpenRoi: () => void;
  onOpenChaos: () => void;
}

export function Footer({ onOpenBlueprints, onOpenRoi, onOpenChaos }: FooterProps) {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-panel)] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: System Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-base font-bold tracking-tight text-[var(--color-text-primary)]">
                PersonaFlow<span className="text-blue-600">.ai</span>
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              Autonomous consumer personalization engine, deterministic pronoun grammar matrix,
              vector PDF dossier generation, and profile-aware conversational AI.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Dual-Provider AI Active
            </div>
          </div>

          {/* Col 2: Architecture Specifications */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
              Architecture &amp; Stack
            </h4>
            <ul className="space-y-2 text-xs text-[var(--color-text-secondary)]">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                <span>Next.js 15.5 App Router &amp; React 19</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                <span>Tailwind CSS v4 Tokenized Design System</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                <span>Zero-SDK Native Dual-LLM Inference</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                <span>Deterministic Pronoun &amp; Verb Agreement</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                <span>Serverless Vector PDF Compilation</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Engineering Guardrails */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
              Enterprise Resilience
            </h4>
            <ul className="space-y-2 text-xs text-[var(--color-text-secondary)]">
              <li>
                <button
                  onClick={onOpenChaos}
                  className="flex items-center gap-1.5 text-[var(--color-text-secondary)] hover:text-blue-600 transition-colors"
                >
                  <Cpu className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                  <span>Sub-Second Model Failover (Chaos Test)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenRoi}
                  className="flex items-center gap-1.5 text-[var(--color-text-secondary)] hover:text-blue-600 transition-colors"
                >
                  <Server className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  <span>Token Burn &amp; Operational ROI Math</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenBlueprints}
                  className="flex items-center gap-1.5 text-[var(--color-text-secondary)] hover:text-blue-600 transition-colors"
                >
                  <Workflow className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                  <span>Turnkey Orchestration Blueprints</span>
                </button>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>2FA TOTP &amp; End-to-End Cryptography</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Systems Engineering Credentials */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
              Engineering Authority
            </h4>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              Engineered by <strong>BarakahSoft LLC</strong> · Principal Systems Architect (12+ Yrs Experience).
              Former Engineering Team Lead at Legiit ($1M ARR Command Center).
            </p>
            <div className="text-xs text-[var(--color-text-muted)] space-y-1">
              <div>• 115+ Enterprise Full-Stack Deployments</div>
              <div>• Zero Vendor Lock-In Guarantee</div>
              <div>• 100% Client Codebase Ownership</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--color-text-muted)]">
          <div className="flex items-center gap-3">
            <span>© {new Date().getFullYear()} PersonaFlow AI Inc. All rights reserved.</span>
            <span>•</span>
            <span>SOC-2 Type II Compliant Architecture</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-600 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              SLA 99.99% Guaranteed
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
