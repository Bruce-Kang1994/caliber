"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { DimensionKey } from "@/lib/types";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ScoreAdjustment {
  adjusted_score: number;
  evidence: string[];
  gaps: string[];
  suggestion: string;
}

export type { ScoreAdjustment };

function parseScoreAdjustment(raw: string, currentScore: number): ScoreAdjustment | null {
  const trimmed = raw.trim();
  if (!trimmed.startsWith("{") || !trimmed.includes("adjusted_score")) return null;

  try {
    const parsed = JSON.parse(trimmed) as Partial<ScoreAdjustment>;
    if (typeof parsed.adjusted_score !== "number" || !Array.isArray(parsed.evidence)) {
      return null;
    }

    return {
      adjusted_score: Math.max(
        Math.max(1, currentScore - 1.5),
        Math.min(Math.min(5, currentScore + 1.5), parsed.adjusted_score)
      ),
      evidence: parsed.evidence.filter((item): item is string => typeof item === "string").slice(0, 4),
      gaps: Array.isArray(parsed.gaps)
        ? parsed.gaps.filter((item): item is string => typeof item === "string").slice(0, 3)
        : [],
      suggestion: typeof parsed.suggestion === "string" ? parsed.suggestion : "",
    };
  } catch {
    return null;
  }
}

interface DeepDiveDrawerProps {
  open: boolean;
  onClose: () => void;
  dimensionKey: DimensionKey;
  dimensionName: string;
  currentScore: number;
  locale: string;
  initialAdjustment?: ScoreAdjustment | null;
  onScoreUpdate: (dimensionKey: DimensionKey, adjustment: ScoreAdjustment) => void;
}

export function DeepDiveDrawer({
  open,
  onClose,
  dimensionKey,
  dimensionName,
  currentScore,
  locale,
  initialAdjustment = null,
  onScoreUpdate,
}: DeepDiveDrawerProps) {
  const t = useTranslations();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [adjustment, setAdjustment] = useState<ScoreAdjustment | null>(null);
  const [exchangeCount, setExchangeCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const prevDimKeyRef = useRef<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);
  const maxExchanges = 5;

  // Reset state when dimension changes
  useEffect(() => {
    if (open && dimensionKey !== prevDimKeyRef.current) {
      abortControllerRef.current?.abort();
      prevDimKeyRef.current = dimensionKey;
      setMessages([]);
      setInput("");
      setAdjustment(initialAdjustment);
      setExchangeCount(0);
      setIsLoading(false);
    }
  }, [open, dimensionKey, initialAdjustment]);

  useEffect(() => {
    if (!open) {
      abortControllerRef.current?.abort();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      setAdjustment(initialAdjustment);
    }
  }, [initialAdjustment, open]);

  // Auto-start: send initial request to get AI's first question
  useEffect(() => {
    if (open && messages.length === 0 && !isLoading && dimensionKey === prevDimKeyRef.current) {
      sendToApi([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, messages.length, dimensionKey]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when drawer opens
  useEffect(() => {
    if (open && !isLoading) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open, isLoading]);

  const sendToApi = useCallback(async (conversationMessages: Message[], options?: { forceFinalize?: boolean }) => {
    const requestId = ++requestIdRef.current;
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setIsLoading(true);
    try {
      const res = await fetch("/api/deep-dive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          dimensionKey,
          dimensionName,
          currentScore,
          messages: conversationMessages,
          locale,
          forceFinalize: options?.forceFinalize ?? false,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null) as { error?: string } | null;
        throw new Error(errorData?.error || `API error: ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let fullText = "";

      // Add empty assistant message to stream into
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (requestId !== requestIdRef.current) return;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        setMessages(prev => {
          if (requestId !== requestIdRef.current || prev.length === 0) return prev;
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: fullText };
          return updated;
        });
      }

      const parsed = parseScoreAdjustment(fullText, currentScore);
      if (parsed && requestId === requestIdRef.current) {
        setAdjustment(parsed);
        onScoreUpdate(dimensionKey, parsed);
      }
    } catch (err) {
      if (controller.signal.aborted) return;
      const errMsg = err instanceof Error ? err.message : String(err);
      setMessages(prev => [...prev, { role: "assistant", content: `⚠️ ${errMsg}` }]);
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [dimensionKey, dimensionName, currentScore, locale, onScoreUpdate]);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading || exchangeCount >= maxExchanges) return;

    const userMessage: Message = { role: "user", content: trimmed };
    const newMessages = [...messages, userMessage];
    const nextExchangeCount = exchangeCount + 1;
    setMessages(newMessages);
    setInput("");
    setExchangeCount(nextExchangeCount);

    await sendToApi(newMessages, { forceFinalize: nextExchangeCount >= maxExchanges });
  }, [exchangeCount, input, isLoading, maxExchanges, messages, sendToApi]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isComplete = !!adjustment;

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-slate-900 truncate">
              {t("deepDive.title")}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-500 truncate">{dimensionName}</span>
              <Badge variant="outline" className="text-xs shrink-0">
                {currentScore.toFixed(1)}/5.0
              </Badge>
              {adjustment && (
                <>
                  <span className="text-xs text-slate-400">→</span>
                  <Badge className={`text-xs shrink-0 ${adjustment.adjusted_score > currentScore ? "bg-emerald-100 text-emerald-700" : adjustment.adjusted_score < currentScore ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}`}>
                    {adjustment.adjusted_score.toFixed(1)}/5.0
                  </Badge>
                </>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress */}
        <div className="px-5 py-2 border-b border-slate-50">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{t("deepDive.exchange", { current: exchangeCount, max: maxExchanges })}</span>
            {isComplete && <span className="text-emerald-600 font-medium">{t("deepDive.complete")}</span>}
          </div>
          <div className="mt-1 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${Math.min((exchangeCount / maxExchanges) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {adjustment && messages.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <AdjustmentCard
                adjustment={adjustment}
                currentScore={currentScore}
                t={t}
                title={t("deepDive.lastRecord")}
              />
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-white rounded-br-md"
                    : "bg-slate-100 text-slate-800 rounded-bl-md"
                }`}
              >
                {msg.role === "assistant" && adjustment && i === messages.length - 1 ? (
                  <AdjustmentCard adjustment={adjustment} currentScore={currentScore} t={t} />
                ) : (
                  <span className="whitespace-pre-wrap">{msg.content}</span>
                )}
                {msg.role === "assistant" && isLoading && i === messages.length - 1 && !msg.content && (
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-slate-100 px-5 py-4">
          {isComplete ? (
            <Button onClick={onClose} className="w-full rounded-xl">
              {t("deepDive.backToReport")}
            </Button>
          ) : (
            <div className="flex gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("deepDive.inputPlaceholder")}
                rows={2}
                className="flex-1 resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                disabled={isLoading || exchangeCount >= maxExchanges}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading || exchangeCount >= maxExchanges}
                size="sm"
                className="self-end rounded-xl px-4 h-10"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </Button>
            </div>
          )}
          {!adjustment && exchangeCount >= maxExchanges && !isLoading && (
            <p className="mt-2 text-xs text-slate-500">{t("deepDive.complete")}</p>
          )}
        </div>
      </div>
    </>
  );
}

function AdjustmentCard({
  adjustment,
  currentScore,
  t,
  title,
}: {
  adjustment: ScoreAdjustment;
  currentScore: number;
  t: (key: string, values?: Record<string, string | number>) => string;
  title?: string;
}) {
  const diff = adjustment.adjusted_score - currentScore;
  const isUp = diff > 0;
  const isDown = diff < 0;

  return (
    <div className="space-y-3">
      {title && (
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {title}
        </div>
      )}
      {/* Score change */}
      <div className="flex items-center gap-3">
        <div className="text-center">
          <div className="text-xs text-slate-500">{t("deepDive.before")}</div>
          <div className="text-lg font-bold text-slate-400">{currentScore.toFixed(1)}</div>
        </div>
        <div className={`text-lg ${isUp ? "text-emerald-500" : isDown ? "text-amber-500" : "text-slate-400"}`}>
          →
        </div>
        <div className="text-center">
          <div className="text-xs text-slate-500">{t("deepDive.after")}</div>
          <div className={`text-lg font-bold ${isUp ? "text-emerald-600" : isDown ? "text-amber-600" : "text-slate-600"}`}>
            {adjustment.adjusted_score.toFixed(1)}
          </div>
        </div>
        {diff !== 0 && (
          <Badge className={`ml-2 ${isUp ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
            {isUp ? "+" : ""}{diff.toFixed(1)}
          </Badge>
        )}
      </div>

      {/* Evidence */}
      <div>
        <div className="text-xs font-semibold text-slate-600 mb-1">{t("deepDive.evidenceLabel")}</div>
        <ul className="space-y-1">
          {adjustment.evidence.map((e, i) => (
            <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
              <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
              {e}
            </li>
          ))}
        </ul>
      </div>

      {/* Gaps */}
      {adjustment.gaps.length > 0 && (
        <div>
          <div className="text-xs font-semibold text-slate-600 mb-1">{t("deepDive.gapsLabel")}</div>
          <ul className="space-y-1">
            {adjustment.gaps.map((g, i) => (
              <li key={i} className="text-xs text-slate-500 flex items-start gap-1.5">
                <span className="text-amber-500 mt-0.5 shrink-0">△</span>
                {g}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestion */}
      {adjustment.suggestion && (
        <div className="bg-white/50 rounded-lg p-2.5 border border-slate-200/50">
          <div className="text-xs font-semibold text-primary mb-1">{t("deepDive.suggestionLabel")}</div>
          <p className="text-xs text-slate-600">{adjustment.suggestion}</p>
        </div>
      )}
    </div>
  );
}
