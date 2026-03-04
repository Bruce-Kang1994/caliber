"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

function getLevel(score: number, t: (key: string) => string) {
  if (score >= 86) return { label: t("report.levelExpert"), color: "text-violet-600", bg: "bg-violet-50" };
  if (score >= 71) return { label: t("report.levelAdvanced"), color: "text-blue-600", bg: "bg-blue-50" };
  if (score >= 51) return { label: t("report.levelCompetent"), color: "text-emerald-600", bg: "bg-emerald-50" };
  if (score >= 31) return { label: t("report.levelDeveloping"), color: "text-amber-600", bg: "bg-amber-50" };
  return { label: t("report.levelBeginner"), color: "text-slate-600", bg: "bg-slate-100" };
}

const ARCHETYPE_LABELS: Record<string, string> = {
  craftsperson: "report.archetype_craftsperson",
  strategist: "report.archetype_strategist",
  "growth-hacker": "report.archetype_growth-hacker",
  visionary: "report.archetype_visionary",
  operator: "report.archetype_operator",
};

export default function ChallengePage() {
  const t = useTranslations();
  const params = useParams();
  const [challengeData, setChallengeData] = useState<{
    score: number;
    archetype?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/assessments?share=${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        const result = data.assessment.result;
        setChallengeData({
          score: Math.round(result.weightedScore),
          archetype: result.archetype,
        });
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [params.id]);

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
          <Link href="/" className="text-xl font-bold tracking-tight text-slate-900">Caliber</Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link href="/assess"><Button size="sm">{t("common.getStarted")}</Button></Link>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-6 py-16 text-center">
        {error || !challengeData ? (
          <Card>
            <CardContent className="py-12">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{t("share.notFound")}</h3>
              <p className="text-slate-600 mb-6">{t("share.notFoundDesc")}</p>
              <Link href="/assess"><Button>{t("share.tryYourOwn")}</Button></Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Challenge Card */}
            <div className="mb-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.047 8.287 8.287 0 009 9.601a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.468 5.99 5.99 0 00-1.925 3.547 5.975 5.975 0 01-2.133-1.001A3.75 3.75 0 0012 18z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">{t("share.challengeTitle")}</h1>
              <p className="text-slate-600">{t("share.challengeDesc")}</p>
            </div>

            <Card className="mb-8 border-0 shadow-lg bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden">
              <CardContent className="py-8">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                  {t("share.challengeScored")}
                </p>
                <div className="text-6xl font-bold mb-2">{challengeData.score}</div>
                <div className="text-slate-400 text-sm mb-3">/100</div>
                {(() => {
                  const level = getLevel(challengeData.score, t);
                  return <Badge className={`${level.bg} ${level.color} border-0`}>{level.label}</Badge>;
                })()}
                {challengeData.archetype && ARCHETYPE_LABELS[challengeData.archetype] && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-lg font-semibold">{t(ARCHETYPE_LABELS[challengeData.archetype])}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <p className="text-slate-600 mb-6">{t("share.challengeYourTurn")}</p>

            <Link href="/assess">
              <Button size="lg" className="rounded-xl px-8 h-12 text-base shadow-lg shadow-primary/20">
                {t("share.challengeAccept")}
              </Button>
            </Link>
          </>
        )}
      </main>
    </div>
  );
}
