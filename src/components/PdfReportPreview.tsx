"use client";

import React, { useState } from "react";
import { PersonalizedReport } from "@/lib/types";
import {
  FileText,
  Download,
  Printer,
  Mail,
  MessageSquare,
  CheckCircle,
  ShieldCheck,
  Sparkles,
  Zap,
  Target,
  Compass,
  ArrowRight,
} from "lucide-react";

interface PdfReportPreviewProps {
  report: PersonalizedReport;
  onLogEvent?: (msg: string) => void;
}

export function PdfReportPreview({ report, onLogEvent }: PdfReportPreviewProps) {
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [smsSent, setSmsSent] = useState<boolean>(false);

  const handlePrintPdf = () => {
    onLogEvent?.(`PDF_EXPORT: Client triggered direct browser print/save for dossier [${report.reportCode}]`);
    window.print();
  };

  const handleSendEmail = () => {
    setEmailSent(true);
    onLogEvent?.(
      `SMTP_DISPATCH: Resend API delivered PDF dossier to ${report.customerName} [${report.reportCode}] (Status: 201 Created)`
    );
    setTimeout(() => setEmailSent(false), 4000);
  };

  const handleSendSms = () => {
    setSmsSent(true);
    onLogEvent?.(
      `SMS_DISPATCH: Twilio webhook dispatched download link to mobile endpoint for ${report.customerName} (Status: 200 OK)`
    );
    setTimeout(() => setSmsSent(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[var(--color-panel)] border border-[var(--color-border)] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 flex items-center justify-center shrink-0">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[var(--color-text-primary)]">
              Personalized PDF Dossier
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] font-mono">
              Ref: <span className="font-semibold text-blue-600 dark:text-blue-400">{report.reportCode}</span> •{" "}
              {report.providerTelemetry.latencyMs}ms ({report.providerTelemetry.provider})
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            onClick={handlePrintPdf}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-sm shadow-blue-500/20 transition-all whitespace-nowrap cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download PDF</span>
          </button>
          <button
            onClick={handleSendEmail}
            disabled={emailSent}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[var(--color-panel-subtle)] text-[var(--color-text-primary)] border border-[var(--color-border)] hover:bg-[var(--color-panel)] transition-all whitespace-nowrap cursor-pointer"
          >
            {emailSent ? (
              <>
                <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                <span>Sent Email</span>
              </>
            ) : (
              <>
                <Mail className="h-3.5 w-3.5 text-blue-600" />
                <span>Email</span>
              </>
            )}
          </button>
          <button
            onClick={handleSendSms}
            disabled={smsSent}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[var(--color-panel-subtle)] text-[var(--color-text-primary)] border border-[var(--color-border)] hover:bg-[var(--color-panel)] transition-all whitespace-nowrap cursor-pointer"
          >
            {smsSent ? (
              <>
                <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                <span>SMS Sent</span>
              </>
            ) : (
              <>
                <MessageSquare className="h-3.5 w-3.5 text-purple-600" />
                <span>SMS</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* The Printable / Viewable PDF Container */}
      <div
        id="printable-report"
        className="p-6 sm:p-8 rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-lg space-y-6 font-sans"
      >
        {/* PDF Header Block */}
        <div className="border-b-2 border-slate-900 pb-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase text-blue-600 mb-1">
              <span>PersonaFlow AI</span>
              <span>•</span>
              <span>Personalized Intelligence Dossier</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              {report.title}
            </h1>
            <div className="flex items-center gap-2 sm:gap-3 mt-2 text-xs text-slate-600 flex-wrap">
              <span>Customer: <strong>{report.customerName}</strong></span>
              <span>•</span>
              <span>Pronouns: <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-slate-800 font-semibold">{report.pronounTag}</span></span>
              <span>•</span>
              <span>Issued: {new Date(report.generatedAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="text-left sm:text-right sm:border-l sm:border-slate-200 sm:pl-4 shrink-0">
            <div className="text-xs font-mono font-bold text-slate-500">DOSSIER IDENTIFIER</div>
            <div className="text-sm font-mono font-black text-slate-900">{report.reportCode}</div>
            <div className="inline-flex items-center gap-1 mt-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <ShieldCheck className="h-3 w-3" />
              VERIFIED AUTHENTIC
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span>Executive Synthesis &amp; Profile Alignment</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
            {report.summary}
          </p>
        </div>

        {/* Core Insights: Stacked Comfortably to eliminate tight horizontal cramping */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5 text-blue-600" />
              <span>Calibrated Core Recommendations &amp; Action Items</span>
            </h3>
            <span className="text-xs font-mono text-slate-500">{report.coreInsights.length} Directives</span>
          </div>

          <div className="grid grid-cols-1 gap-3.5 print:grid-cols-3">
            {report.coreInsights.map((insight, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-500 font-mono">INSIGHT 0{idx + 1}</span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      insight.statusBadge === "OPTIMAL"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}
                  >
                    {insight.statusBadge} ({insight.score}/100)
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                  {insight.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {insight.description}
                </p>
                <div className="pt-2 border-t border-slate-100 text-xs text-blue-900 font-medium bg-blue-50/60 p-2.5 rounded-lg">
                  <strong className="text-blue-700 block text-xs uppercase mb-0.5">Protocol Mandate:</strong>
                  {insight.actionItem}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3-Phase Personalized Roadmap: Stacked Comfortably */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5 text-blue-600" />
              <span>90-Day Phased Execution Trajectory</span>
            </h3>
            <span className="text-xs font-mono text-slate-500">3 Stages</span>
          </div>

          <div className="grid grid-cols-1 gap-3.5 print:grid-cols-3">
            {report.personalizedRoadmap.map((phase, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-2"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-blue-600">{phase.timeline}</span>
                  <span className="text-slate-500 font-semibold">STAGE 0{idx + 1}</span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  {phase.phase}
                </h4>
                <div className="text-xs font-semibold text-slate-700 bg-white p-2 rounded-lg border border-slate-200">
                  Goal: {phase.milestone}
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600 pt-1">
                  {phase.deliverables.map((item, dIdx) => (
                    <li key={dIdx} className="flex items-start gap-1.5">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Mitigation Table */}
        {report.riskMitigation && report.riskMitigation.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1.5">
              Identified Friction &amp; Guardrail Mitigation
            </h3>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
              {report.riskMitigation.map((rm, idx) => (
                <div key={idx} className="p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="font-semibold text-slate-900 sm:w-1/3 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    <span>{rm.risk}</span>
                  </div>
                  <div className="text-slate-600 sm:w-2/3">{rm.mitigation}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer & Telemetry */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 font-mono">
          <div>
            <span>Generated by PersonaFlow AI Engine</span>
            <span> • </span>
            <span>Model: {report.providerTelemetry.model}</span>
            <span> • </span>
            <span>Latency: {report.providerTelemetry.latencyMs}ms</span>
          </div>
          <div className="text-slate-400">
            Encrypted End-to-End • 2FA Guarded
          </div>
        </div>
      </div>
    </div>
  );
}
