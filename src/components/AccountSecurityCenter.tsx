"use client";

import React, { useState } from "react";
import { CustomerProfile } from "@/lib/types";
import {
  UserCheck,
  ShieldCheck,
  Smartphone,
  Mail,
  KeyRound,
  CheckCircle,
  CreditCard,
  QrCode,
  Lock,
  Bell,
  RefreshCw,
} from "lucide-react";

interface AccountSecurityCenterProps {
  currentProfile: CustomerProfile;
  onLogEvent?: (msg: string) => void;
}

export function AccountSecurityCenter({
  currentProfile,
  onLogEvent,
}: AccountSecurityCenterProps) {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(
    currentProfile.twoFactorEnabled
  );
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [totpCode, setTotpCode] = useState<string>("");
  const [totpSuccess, setTotpSuccess] = useState<boolean>(false);

  const [smsEnabled, setSmsEnabled] = useState<boolean>(
    currentProfile.notificationPreferences.sms
  );
  const [newsletterEnabled, setNewsletterEnabled] = useState<boolean>(
    currentProfile.notificationPreferences.newsletter
  );
  const [smsPingStatus, setSmsPingStatus] = useState<string | null>(null);

  const handleToggle2Fa = () => {
    if (!twoFactorEnabled) {
      setShowQrModal(true);
    } else {
      setTwoFactorEnabled(false);
      onLogEvent?.("SECURITY_EVENT: Two-Factor Authentication (2FA) deactivated for account");
    }
  };

  const handleVerifyTotp = (e: React.FormEvent) => {
    e.preventDefault();
    if (totpCode.length === 6) {
      setTotpSuccess(true);
      setTimeout(() => {
        setTwoFactorEnabled(true);
        setShowQrModal(false);
        setTotpSuccess(false);
        setTotpCode("");
        onLogEvent?.("SECURITY_EVENT: 2FA TOTP authenticator successfully registered & verified");
      }, 1000);
    }
  };

  const handleTestSmsPing = () => {
    setSmsPingStatus("Dispatching Twilio SMS...");
    onLogEvent?.(`SMS_GATEWAY: Dispatched test SMS verification to ${currentProfile.phone}`);
    setTimeout(() => {
      setSmsPingStatus("SMS delivered successfully! (Twilio SID: SM982173x)");
      setTimeout(() => setSmsPingStatus(null), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="p-5 rounded-2xl bg-[var(--color-panel)] border border-[var(--color-border)] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
            {currentProfile.fullName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                {currentProfile.fullName}
              </h3>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Active Member
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              {currentProfile.email} • {currentProfile.phone} • Pronouns: <strong>{currentProfile.pronouns}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--color-panel-subtle)] border border-[var(--color-border)]">
            <CreditCard className="h-3.5 w-3.5 text-blue-600" />
            <span>Stripe Billing: Visa •••• 4242</span>
          </span>
        </div>
      </div>

      {/* Grid: 2FA Security (6 cols) + Notifications & SMS (6 cols) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 2FA Security Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--color-panel)] border border-[var(--color-border)] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <h4 className="text-sm font-bold text-[var(--color-text-primary)]">
                Two-Factor Authentication (2FA)
              </h4>
            </div>
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                twoFactorEnabled
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}
            >
              {twoFactorEnabled ? "2FA ACTIVE" : "2FA DISABLED"}
            </span>
          </div>

          <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
            Protect your personalized health and financial dossiers with standard time-based one-time password (TOTP) authentication compatible with Google Authenticator, 1Password, or Authy.
          </p>

          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium text-[var(--color-text-primary)]">
              <Lock className="h-4 w-4 text-slate-400" />
              <span>Require 2FA on sign-in &amp; report download</span>
            </div>
            <button
              onClick={handleToggle2Fa}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                twoFactorEnabled
                  ? "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
            </button>
          </div>

          {/* QR Code Setup Modal */}
          {showQrModal && (
            <div className="p-4 rounded-xl bg-[var(--color-panel-subtle)] border border-[var(--color-border)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--color-text-primary)] flex items-center gap-1.5">
                  <QrCode className="h-4 w-4 text-blue-600" />
                  Scan Authenticator QR Code
                </span>
                <button
                  onClick={() => setShowQrModal(false)}
                  className="text-xs text-[var(--color-text-muted)]"
                >
                  Cancel
                </button>
              </div>

              <div className="p-4 bg-white rounded-lg border border-slate-200 flex flex-col items-center justify-center space-y-2 text-slate-900">
                <div className="h-28 w-28 border-2 border-slate-900 p-2 flex items-center justify-center font-mono text-[10px] text-center bg-slate-50">
                  [SIMULATED 2FA TOTP QR CODE MATRIX]
                </div>
                <div className="text-[11px] font-mono text-slate-600">
                  Secret: <strong>PF-2026-X89K-M2V9</strong>
                </div>
              </div>

              <form onSubmit={handleVerifyTotp} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit code"
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/[^0-9]/g, ""))}
                  className="flex-1 px-3 py-2 text-xs font-mono text-center tracking-widest rounded-lg bg-[var(--color-panel)] border border-[var(--color-border)] font-bold"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1"
                >
                  {totpSuccess ? <CheckCircle className="h-3.5 w-3.5" /> : null}
                  <span>{totpSuccess ? "Verified!" : "Confirm"}</span>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Notifications, SMS & Newsletter */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--color-panel)] border border-[var(--color-border)] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-blue-600" />
              <h4 className="text-sm font-bold text-[var(--color-text-primary)]">
                SMS Notifications &amp; Newsletters
              </h4>
            </div>
            <span className="text-xs font-mono text-emerald-600 font-semibold">
              Twilio + Resend Ready
            </span>
          </div>

          <div className="space-y-4 divide-y divide-[var(--color-border)]">
            {/* SMS Toggle */}
            <div className="pt-2 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-primary)]">
                  <Smartphone className="h-3.5 w-3.5 text-purple-600" />
                  <span>SMS Milestone Alerts &amp; PDF Links</span>
                </div>
                <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
                  Receive text notifications when new personalized dossiers finish rendering.
                </p>
              </div>
              <input
                type="checkbox"
                checked={smsEnabled}
                onChange={(e) => {
                  setSmsEnabled(e.target.checked);
                  onLogEvent?.(`SETTINGS: SMS notifications toggled to ${e.target.checked}`);
                }}
                className="h-4 w-4 rounded accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Test SMS Ping */}
            <div className="pt-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--color-text-muted)] font-mono">
                  Destination: {currentProfile.phone}
                </span>
                <button
                  type="button"
                  onClick={handleTestSmsPing}
                  className="px-2.5 py-1 text-xs font-semibold bg-[var(--color-panel-subtle)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-panel)] rounded-lg transition-all"
                >
                  Send Test SMS
                </button>
              </div>
              {smsPingStatus && (
                <div className="mt-2 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded border border-emerald-200 dark:border-emerald-800">
                  {smsPingStatus}
                </div>
              )}
            </div>

            {/* Newsletter Toggle */}
            <div className="pt-3 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-primary)]">
                  <Mail className="h-3.5 w-3.5 text-blue-600" />
                  <span>Weekly Curated Consumer Digest</span>
                </div>
                <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
                  Weekly personalized bio-longevity and financial trajectory insights.
                </p>
              </div>
              <input
                type="checkbox"
                checked={newsletterEnabled}
                onChange={(e) => {
                  setNewsletterEnabled(e.target.checked);
                  onLogEvent?.(`SETTINGS: Newsletter subscription toggled to ${e.target.checked}`);
                }}
                className="h-4 w-4 rounded accent-blue-600 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
