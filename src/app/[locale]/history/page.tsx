"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useAuth } from "@/hooks/useAuth";

interface AssessmentItem {
  id: string;
  target_role: string;
  input_method: string;
  overall_score: number;
  locale: string;
  share_token: string;
  is_public: boolean;
  created_at: string;
}

const ROLE_LABELS: Record<string, string> = {
  "b2b-pm": "B2B PM",
  "c2c-pm": "Consumer PM",
  "ai-pm": "AI PM",
  "growth-pm": "Growth PM",
  "data-pm": "Data PM",
};

function getScoreColor(score: number) {
  if (score >= 86) return "text-violet-600 bg-violet-50";
  if (score >= 71) return "text-blue-600 bg-blue-50";
  if (score >= 51) return "text-emerald-600 bg-emerald-50";
  if (score >= 31) return "text-amber-600 bg-amber-50";
  return "text-slate-600 bg-slate-100";
}

export default function HistoryPage() {
  const t = useTranslations();
  const { user, loading: authLoading } = useAuth();
  const [assessments, setAssessments] = useState<AssessmentItem[] | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (authLoading || !user) return;

    fetch("/api/assessments")
      .then((res) => res.json())
      .then((data) => {
        setAssessments(data.assessments || []);
      })
      .catch(() => setAssessments([]));
  }, [user, authLoading]);

  const loading = authLoading || (!!user && assessments === null);
  const assessmentList = assessments ?? [];

  const handleDelete = async (id: string) => {
    if (!confirm(t("history.deleteConfirm"))) return;
    const res = await fetch(`/api/assessments?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setAssessments((prev) => (prev ?? []).filter((a) => a.id !== id));
    }
  };

  const handleToggleShare = async (id: string, currentPublic: boolean) => {
    const res = await fetch("/api/assessments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_public: !currentPublic }),
    });
    if (res.ok) {
      const data = await res.json();
      setAssessments((prev) =>
        (prev ?? []).map((a) =>
          a.id === id ? { ...a, is_public: !currentPublic, share_token: data.share_token } : a
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="flex items-center justify-between px-6 py-3 max-w-6xl mx-auto">
          <Link href="/" className="text-xl font-bold tracking-tight text-slate-900">
            Caliber
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link href="/assess">
              <Button size="sm">{t("common.getStarted")}</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">{t("history.title")}</h1>
          <p className="mt-2 text-slate-600">{t("history.subtitle")}</p>
        </div>

        {!user && !authLoading && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-slate-600 mb-4">{t("history.signInRequired")}</p>
              <Link href="/auth">
                <Button>{t("common.signIn")}</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {loading && (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        )}

        {!loading && user && assessmentList.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{t("history.empty")}</h3>
              <p className="text-slate-600 mb-6">{t("history.emptyDesc")}</p>
              <Link href="/assess">
                <Button>{t("history.startFirst")}</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {!loading && assessmentList.length > 0 && (
          <div className="space-y-4">
            {assessmentList.length >= 2 && (
              <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 p-4">
                <p className="text-sm text-slate-600">
                  {selected.size === 0
                    ? t("history.selectToCompare")
                    : selected.size === 1
                    ? t("history.selectOneMore")
                    : t("history.readyToCompare")}
                </p>
                <div className="flex gap-2">
                  {selected.size > 0 && (
                    <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())}>
                      {t("history.clearSelection")}
                    </Button>
                  )}
                  {selected.size === 2 && (
                    <Link href={`/history/compare?a=${[...selected][0]}&b=${[...selected][1]}`}>
                      <Button size="sm">{t("history.compare")}</Button>
                    </Link>
                  )}
                </div>
              </div>
            )}
            {assessmentList.map((assessment) => (
              <Card
                key={assessment.id}
                className={`hover:shadow-md transition-shadow ${selected.has(assessment.id) ? "ring-2 ring-primary" : ""}`}
              >
                <CardContent className="py-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {assessmentList.length >= 2 && (
                        <button
                          onClick={() => {
                            setSelected((prev) => {
                              const next = new Set(prev);
                              if (next.has(assessment.id)) {
                                next.delete(assessment.id);
                              } else if (next.size < 2) {
                                next.add(assessment.id);
                              }
                              return next;
                            });
                          }}
                          className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                            selected.has(assessment.id)
                              ? "bg-primary border-primary text-white"
                              : "border-slate-300 hover:border-slate-400"
                          }`}
                        >
                          {selected.has(assessment.id) && (
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      )}
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg ${getScoreColor(assessment.overall_score)}`}>
                        {Math.round(assessment.overall_score)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900">
                            {ROLE_LABELS[assessment.target_role] || assessment.target_role}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {assessment.input_method === "resume" ? t("history.resume") : t("history.manual")}
                          </Badge>
                          {assessment.is_public && (
                            <Badge className="text-xs bg-blue-100 text-blue-700">{t("history.shared")}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5">
                          {new Date(assessment.created_at).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleShare(assessment.id, assessment.is_public)}
                        title={assessment.is_public ? "Make private" : "Make public"}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                        </svg>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(assessment.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </Button>
                      <Link href={`/history/${assessment.id}`}>
                        <Button size="sm">{t("history.viewReport")}</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
