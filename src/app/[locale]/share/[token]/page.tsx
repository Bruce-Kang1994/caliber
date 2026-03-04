"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import type { AssessmentResult } from "@/lib/types";

function getScoreLevel(score: number, t: (key: string) => string) {
  if (score >= 86) return { label: t("report.levelExpert"), color: "text-violet-600", bg: "bg-violet-50" };
  if (score >= 71) return { label: t("report.levelAdvanced"), color: "text-blue-600", bg: "bg-blue-50" };
  if (score >= 51) return { label: t("report.levelCompetent"), color: "text-emerald-600", bg: "bg-emerald-50" };
  if (score >= 31) return { label: t("report.levelDeveloping"), color: "text-amber-600", bg: "bg-amber-50" };
  return { label: t("report.levelBeginner"), color: "text-slate-600", bg: "bg-slate-100" };
}

export default function SharedReportPage() {
  const t = useTranslations();
  const params = useParams();
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/assessments?share=${params.token}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setResult(data.assessment.result);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [params.token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

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
        {error || !result ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{t("share.notFound")}</h3>
              <p className="text-slate-600 mb-6">{t("share.notFoundDesc")}</p>
              <Link href="/assess">
                <Button>{t("share.tryYourOwn")}</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-8">
              <Badge variant="outline" className="mb-3">{t("share.title")}</Badge>
              <h1 className="text-3xl font-bold text-slate-900">
                {t(`roles.${result.roleType}`)}
              </h1>
            </div>

            {/* Score Card */}
            <Card className="mb-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
              <CardContent className="py-8 text-center">
                <p className="text-slate-300 text-sm mb-2">{t("report.overallScore")}</p>
                <div className="text-5xl sm:text-7xl font-bold mb-2">{result.weightedScore}</div>
                <div className="text-slate-400">/100</div>
                {(() => {
                  const level = getScoreLevel(result.weightedScore, t);
                  return (
                    <Badge className={`mt-3 ${level.bg} ${level.color} border-0`}>
                      {level.label}
                    </Badge>
                  );
                })()}
              </CardContent>
            </Card>

            {/* Summary */}
            {result.summary && (
              <Card className="mb-6">
                <CardContent className="py-6">
                  <p className="text-slate-700 leading-relaxed">{result.summary}</p>
                </CardContent>
              </Card>
            )}

            {/* Strengths */}
            {result.topStrengths && result.topStrengths.length > 0 && (
              <Card className="mb-6 border-l-4 border-l-emerald-500">
                <CardHeader>
                  <CardTitle className="text-lg text-emerald-700">{t("report.strengthsTitle")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {result.topStrengths.map((s, i) => (
                      <div key={i} className="p-3 bg-emerald-50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-slate-900">{s.dimensionName}</span>
                          <Badge variant="outline" className="text-emerald-600">{s.score}/5</Badge>
                        </div>
                        <p className="text-sm text-slate-600">{s.evidence}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Weaknesses */}
            {result.topWeaknesses && result.topWeaknesses.length > 0 && (
              <Card className="mb-6 border-l-4 border-l-amber-500">
                <CardHeader>
                  <CardTitle className="text-lg text-amber-700">{t("report.weaknessesTitle")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {result.topWeaknesses.map((w, i) => (
                      <div key={i} className="p-3 bg-amber-50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-slate-900">{w.dimensionName}</span>
                          <Badge variant="outline" className="text-amber-600">{w.score}/5</Badge>
                        </div>
                        <p className="text-sm text-slate-600">{w.upgradeAdvice}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* CTA */}
            <div className="text-center mt-8">
              <p className="text-slate-600 mb-4">{t("share.ctaText")}</p>
              <Link href="/assess">
                <Button size="lg">{t("share.tryYourOwn")}</Button>
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
