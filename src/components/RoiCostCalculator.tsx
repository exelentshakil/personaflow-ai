"use client";

import React, { useState } from "react";
import {
  Calculator,
  X,
  TrendingUp,
  DollarSign,
  Zap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

interface RoiCostCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RoiCostCalculator({ isOpen, onClose }: RoiCostCalculatorProps) {
  const [monthlyReports, setMonthlyReports] = useState<number>(5000);
  const [avgArpu, setAvgArpu] = useState<number>(49);
  const [conversionRate, setConversionRate] = useState<number>(4.5);
  const [manualTimeMinutes, setManualTimeMinutes] = useState<number>(25);
  const [hourlyWage, setHourlyWage] = useState<number>(22);

  if (!isOpen) return null;

  // Inference math (gpt-4o-mini ~$0.15/1M input, $0.60/1M output, ~2.5k tokens total per report)
  const tokenCostPerReport = 0.0014;
  const totalAiMonthlyCost = monthlyReports * tokenCostPerReport;

  // Human baseline cost
  const humanHoursPerReport = manualTimeMinutes / 60;
  const humanCostPerReport = humanHoursPerReport * hourlyWage;
  const totalHumanMonthlyCost = monthlyReports * humanCostPerReport;

  // Savings & Revenue
  const netMonthlySavings = Math.max(0, totalHumanMonthlyCost - totalAiMonthlyCost);
  const annualSavings = netMonthlySavings * 12;

  // New Revenue generated via personalized PDF & chatbot conversion
  const paidCustomers = Math.floor(monthlyReports * (conversionRate / 100));
  const newMonthlyRevenue = paidCustomers * avgArpu;
  const annualRevenue = newMonthlyRevenue * 12;

  // ROI multiplier
  const roiMultiplier = Math.round((newMonthlyRevenue + netMonthlySavings) / Math.max(1, totalAiMonthlyCost));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-3xl max-h-[90vh] rounded-2xl bg-[var(--color-panel)] border border-[var(--color-border)] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                Token Burn &amp; Operational ROI Calculator
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">
                Quantify the cost-per-dossier, labor displacement, and automated revenue capture
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

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top KPI Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                AI Cost Per Dossier
              </span>
              <div className="mt-1 text-2xl sm:text-3xl font-bold font-mono text-blue-900 dark:text-blue-100">
                ${tokenCostPerReport.toFixed(4)}
              </div>
              <p className="mt-1 text-xs text-blue-700/80 dark:text-blue-300/80">
                Dual-provider cached tokens
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Annual Labor Savings
              </span>
              <div className="mt-1 text-2xl sm:text-3xl font-bold font-mono text-emerald-900 dark:text-emerald-100">
                ${annualSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <p className="mt-1 text-xs text-emerald-700/80 dark:text-emerald-300/80">
                Displaces manual doc curation
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Operational ROI
              </span>
              <div className="mt-1 text-2xl sm:text-3xl font-bold font-mono text-amber-900 dark:text-amber-100">
                {roiMultiplier.toLocaleString()}x
              </div>
              <p className="mt-1 text-xs text-amber-700/80 dark:text-amber-300/80">
                Efficiency multiple on LLM spend
              </p>
            </div>
          </div>

          {/* Interactive Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-xl bg-[var(--color-panel-subtle)] border border-[var(--color-border)]">
            {/* Slider 1: Monthly Dossiers */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-[var(--color-text-primary)]">
                  Monthly Dossiers Synthesized
                </label>
                <span className="text-xs font-bold font-mono text-blue-600">
                  {monthlyReports.toLocaleString()} reports
                </span>
              </div>
              <input
                type="range"
                min={200}
                max={50000}
                step={200}
                value={monthlyReports}
                onChange={(e) => setMonthlyReports(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-[11px] text-[var(--color-text-muted)] mt-1">
                <span>200</span>
                <span>25,000</span>
                <span>50,000</span>
              </div>
            </div>

            {/* Slider 2: Average Order Value / ARPU */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-[var(--color-text-primary)]">
                  Average Product ARPU ($)
                </label>
                <span className="text-xs font-bold font-mono text-emerald-600">
                  ${avgArpu} / user
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={200}
                step={5}
                value={avgArpu}
                onChange={(e) => setAvgArpu(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-[11px] text-[var(--color-text-muted)] mt-1">
                <span>$10 (Basic)</span>
                <span>$100</span>
                <span>$200 (Executive)</span>
              </div>
            </div>

            {/* Slider 3: Conversion Rate */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-[var(--color-text-primary)]">
                  Personalized PDF to Paid Conversion
                </label>
                <span className="text-xs font-bold font-mono text-purple-600">
                  {conversionRate}%
                </span>
              </div>
              <input
                type="range"
                min={0.5}
                max={15}
                step={0.5}
                value={conversionRate}
                onChange={(e) => setConversionRate(Number(e.target.value))}
                className="w-full accent-purple-600"
              />
              <div className="flex justify-between text-[11px] text-[var(--color-text-muted)] mt-1">
                <span>0.5% (Cold)</span>
                <span>7.5%</span>
                <span>15.0% (High-Intent)</span>
              </div>
            </div>

            {/* Slider 4: Human Labor Minutes */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-[var(--color-text-primary)]">
                  Manual Preparation Time Saved
                </label>
                <span className="text-xs font-bold font-mono text-amber-600">
                  {manualTimeMinutes} mins / report
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={60}
                step={5}
                value={manualTimeMinutes}
                onChange={(e) => setManualTimeMinutes(Number(e.target.value))}
                className="w-full accent-amber-600"
              />
              <div className="flex justify-between text-[11px] text-[var(--color-text-muted)] mt-1">
                <span>5 mins</span>
                <span>30 mins</span>
                <span>60 mins</span>
              </div>
            </div>
          </div>

          {/* Detailed Financial Breakdown Table */}
          <div className="border border-[var(--color-border)] rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-[var(--color-panel-subtle)] border-b border-[var(--color-border)] font-semibold text-xs text-[var(--color-text-primary)]">
              Operational Economics Breakdown (Monthly)
            </div>
            <div className="divide-y divide-[var(--color-border)] text-xs font-mono">
              <div className="px-4 py-3 flex justify-between items-center">
                <span className="text-[var(--color-text-secondary)] font-sans">
                  PersonaFlow AI Inference (gpt-4o-mini + Gemini fallback)
                </span>
                <span className="font-bold text-[var(--color-text-primary)]">
                  ${totalAiMonthlyCost.toFixed(2)}/mo
                </span>
              </div>
              <div className="px-4 py-3 flex justify-between items-center">
                <span className="text-[var(--color-text-secondary)] font-sans">
                  Traditional Human Specialist Cost ({hourlyWage}/hr @ {manualTimeMinutes}m)
                </span>
                <span className="text-rose-600 font-semibold">
                  ${totalHumanMonthlyCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo
                </span>
              </div>
              <div className="px-4 py-3 flex justify-between items-center bg-emerald-50/30 dark:bg-emerald-950/20">
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold font-sans">
                  Direct Labor Net Savings
                </span>
                <span className="text-emerald-600 font-bold">
                  +${netMonthlySavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo
                </span>
              </div>
              <div className="px-4 py-3 flex justify-between items-center bg-blue-50/30 dark:bg-blue-950/20">
                <span className="text-blue-700 dark:text-blue-400 font-semibold font-sans">
                  New Automated Pipeline Revenue ({paidCustomers} paid converts)
                </span>
                <span className="text-blue-600 font-bold">
                  +${newMonthlyRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--color-border)] flex items-center justify-between bg-[var(--color-panel-subtle)]/50">
          <div className="text-xs text-[var(--color-text-muted)] flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>Based on live token pricing across OpenAI gpt-4o-mini ($0.15/$0.60 per 1M)</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm"
          >
            Close Calculator
          </button>
        </div>
      </div>
    </div>
  );
}
