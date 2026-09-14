"use client";

import React, { useState } from "react";
import { ChatMessage, CustomerProfile, PersonalizedReport } from "@/lib/types";
import {
  MessageSquare,
  Send,
  Sparkles,
  User,
  Bot,
  RefreshCw,
  Zap,
  Info,
} from "lucide-react";

interface ProfileAwareChatbotProps {
  currentProfile: CustomerProfile;
  currentReport: PersonalizedReport | null;
  onLogEvent?: (msg: string) => void;
}

export function ProfileAwareChatbot({
  currentProfile,
  currentReport,
  onLogEvent,
}: ProfileAwareChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg_init",
      role: "assistant",
      content: `Hello ${currentProfile.fullName.split(" ")[0]}! I am your PersonaFlow AI concierge. I have synchronized your ${currentProfile.selectedCategory} profile and your chosen pronouns (${currentProfile.pronouns}). How can I assist you with your personalized roadmap today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      provider: "PersonaFlow Synchronized Concierge",
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);

  const quickPrompts = [
    "Break down my Phase 1 daily habits",
    "How do I protect against my primary risk factor?",
    "Adjust my timeline for 8 hours/week commitment",
    "Explain the scientific basis for my core insight",
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const userText = (textToSend || input).trim();
    if (!userText || isSending) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: "user",
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsSending(true);

    onLogEvent?.(`CHAT_QUERY: User dispatched query to profile-aware concierge: "${userText.slice(0, 40)}..."`);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          profile: currentProfile,
          reportSummary: currentReport?.summary,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const botMsg: ChatMessage = {
          id: `msg_bot_${Date.now()}`,
          role: "assistant",
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          provider: data.provider,
          latencyMs: data.latencyMs,
        };
        setMessages((prev) => [...prev, botMsg]);
        onLogEvent?.(
          `CHAT_RESPONSE: ${data.provider} generated response in ${data.latencyMs}ms`
        );
      } else {
        throw new Error(data.error || "Chat failed");
      }
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `msg_fallback_${Date.now()}`,
        role: "assistant",
        content: `I've noted that question, ${currentProfile.fullName.split(" ")[0]}. Your protocol for ${currentProfile.selectedCategory} advises staying disciplined on ${currentProfile.primaryGoals[0] || "your core habit"}. Would you like me to recalculate your weekly milestones?`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        provider: "Local Rule Fallback",
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Awareness Banner */}
      <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-600 text-white shrink-0">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-bold text-blue-950 dark:text-blue-200">
                Active Customer Awareness Context
              </h4>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300">
                Pronouns: {currentProfile.pronouns}
              </span>
            </div>
            <p className="text-xs text-blue-800 dark:text-blue-300 mt-0.5">
              Customer: <strong>{currentProfile.fullName}</strong> • Category: {currentProfile.selectedCategory} • Report: {currentReport ? currentReport.reportCode : "Pending generation"}
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800 self-start sm:self-auto shrink-0">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Live LLM Thread
        </span>
      </div>

      {/* Chat Thread Container */}
      <div className="rounded-2xl bg-[var(--color-panel)] border border-[var(--color-border)] shadow-sm overflow-hidden flex flex-col h-[520px]">
        {/* Messages Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                <div
                  className={`h-8 w-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
                    isUser
                      ? "bg-blue-600 text-white"
                      : "bg-[var(--color-panel-subtle)] text-blue-600 border border-[var(--color-border)]"
                  }`}
                >
                  {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                <div className="space-y-1">
                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-[var(--color-panel-subtle)] text-[var(--color-text-primary)] rounded-tl-none border border-[var(--color-border)]"
                    }`}
                  >
                    {msg.content}
                  </div>

                  <div
                    className={`flex items-center gap-2 text-[11px] font-mono text-[var(--color-text-muted)] ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {msg.provider && (
                      <>
                        <span>•</span>
                        <span className="text-blue-600 dark:text-blue-400 font-semibold">
                          {msg.provider} {msg.latencyMs ? `(${msg.latencyMs}ms)` : ""}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isSending && (
            <div className="flex gap-3 mr-auto max-w-[85%]">
              <div className="h-8 w-8 rounded-lg shrink-0 flex items-center justify-center text-xs bg-[var(--color-panel-subtle)] text-blue-600 border border-[var(--color-border)]">
                <RefreshCw className="h-4 w-4 animate-spin" />
              </div>
              <div className="p-3.5 rounded-2xl rounded-tl-none bg-[var(--color-panel-subtle)] text-[var(--color-text-muted)] border border-[var(--color-border)] text-xs flex items-center gap-2">
                <span>Personalizing response with pronoun context...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Prompt Chips */}
        <div className="px-4 py-2 bg-[var(--color-panel-subtle)]/50 border-t border-[var(--color-border)] flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] whitespace-nowrap shrink-0">
            Suggested Prompts:
          </span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(qp)}
              className="px-2.5 py-1 rounded-full text-xs bg-[var(--color-panel)] hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-[var(--color-border)] text-[var(--color-text-secondary)] whitespace-nowrap shrink-0 transition-colors"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 sm:p-4 bg-[var(--color-panel)] border-t border-[var(--color-border)]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={`Ask anything about ${currentProfile.fullName.split(" ")[0]}'s profile or roadmap...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isSending}
              className="flex-1 px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-[var(--color-panel-subtle)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-[var(--color-text-primary)]"
            />
            <button
              type="submit"
              disabled={!input.trim() || isSending}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition-all shrink-0"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
