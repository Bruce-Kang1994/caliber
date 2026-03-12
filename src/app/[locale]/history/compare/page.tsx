"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppHeader } from "@/components/AppHeader";
import {
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { DIMENSION_CATEGORIES, getCategoryAverage, type DimensionCategory } from "@/lib/constants";
import type { AssessmentResult } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";

const ROLE_LABELS: Record<string, string> = {
  "b2b-pm": "B2B PM",
  "c2c-pm": "Consumer PM",
  "ai-pm": "AI PM",
  "growth-pm": "Growth PM",
  "data-pm": "Data PM",
};

interface CompareData {
  older: AssessmentResult;
  newer: AssessmentResult;
  olderDate: string;
  newerDate: string;
  olderRole: string;
  newerRole: string;
}

function ScoreChange({ before, after }: { before: number; after: number }) {
  const diff = after - before;
  if (Math.abs(diff) < 0.1) return <span className="text-slate-400">--</span>;
  return (
    <span className={diff > 0 ? "text-emerald-600 font-semibold" : "text-red-500 font-semibold"}>
      {diff > 0 ? "+" : ""}{diff.toFixed(1)}
    </span>
  );
}

export default function ComparePage() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<CompareData | null>(null);
  const [error, setError] = useState("");

  const idA = searchParams.get("a");
  const idB = searchParams.get("b");

  useEffect(() => {
    if (authLoading || !user || !idA || !idB) return;

    Promise.all([
      fetch(`/api/assessments?id=${idA}`).then((r) => r.json()),
      fetch(`/api/assessments?id=${idB}`).then((r) => r.json()),
    ])
      .then(([dataA, dataB]) => {
        if (!dataA.assessment || !dataB.assessment) {
          setError("One or both assessments were not found.");
          return;
        }

        const a = dataA.assessment;
        const b = dataB.assessment;

        // Determine which is older/newer
        const aDate = new Date(a.created_at);
        const bDate = new Date(b.created_at);
        const [older, newer] = aDate < bDate ? [a, b] : [b, a];

        setData({
          older: older.result,
          newer: newer.result,
          olderDate: older.created_at,
          newerDate: newer.created_at,
          olderRole: older.target_role,
          newerRole: newer.target_role,
        });
      })
      .catch(() => {
        setError("Failed to load assessments.");
      });
  }, [user, authLoading, idA, idB]);

  const pageError =
    !user ? "Please sign in to compare assessments."
    : !idA || !idB ? "Two assessment IDs are required for comparison."
    : error;
  const loading = authLoading || (!!user && !!idA && !!idB && !error && !data);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (pageError || !data) {
    return (
      <div className="min-h-screen bg-slate-50">
        <AppHeader showNav showAuth />
        <div className="max-w-md mx-auto px-6 py-16 text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">{pageError || "Not found"}</h2>
          <Link href="/history">
            <Button className="mt-4">{t("common.back")}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const categoryKeys = Object.keys(DIMENSION_CATEGORIES) as DimensionCategory[];

  // Build radar overlay data
  const radarData = categoryKeys.map((cat) => ({
    dimension: t(`dimensionCategories.${cat}`),
    before: Math.round(getCategoryAverage(data.older.scores, cat) * 10) / 10,
    after: Math.round(getCategoryAverage(data.newer.scores, cat) * 10) / 10,
  }));

  const olderScore = Math.round(data.older.weightedScore);
  const newerScore = Math.round(data.newer.weightedScore);
  const scoreDiff = newerScore - olderScore;

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader showNav showAuth />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <Link href="/history" className="text-sm text-slate-500 hover:text-slate-700 inline-flex items-center gap-1 mb-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            {t("history.title")}
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">{t("compare.title")}</h1>
          <p className="mt-2 text-slate-600">{t("compare.subtitle")}</p>
        </div>

        {/* Score summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="py-6 text-center">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">{t("compare.before")}</p>
              <p className="text-4xl font-bold text-slate-900">{olderScore}</p>
              <p className="text-sm text-slate-500 mt-1">
                {ROLE_LABELS[data.olderRole] || data.olderRole}
              </p>
              <p className="text-xs text-slate-400 mt-1">{formatDate(data.olderDate)}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-900 to-slate-800">
            <CardContent className="py-6 text-center text-white">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">{t("compare.change")}</p>
              <p className={`text-4xl font-bold ${scoreDiff >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {scoreDiff >= 0 ? "+" : ""}{scoreDiff}
              </p>
              <p className="text-sm text-slate-400 mt-1">{t("compare.points")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-6 text-center">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">{t("compare.after")}</p>
              <p className="text-4xl font-bold text-slate-900">{newerScore}</p>
              <p className="text-sm text-slate-500 mt-1">
                {ROLE_LABELS[data.newerRole] || data.newerRole}
              </p>
              <p className="text-xs text-slate-400 mt-1">{formatDate(data.newerDate)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Radar overlay */}
        <Card className="mb-8">
          <CardContent className="py-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 text-center">{t("compare.radarTitle")}</h3>
            <div className="w-full h-[350px] sm:h-[420px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <RechartsRadar data={radarData} cx="50%" cy="50%" outerRadius="70%">
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11, fill: "#64748b" }} />
                  <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fontSize: 10, fill: "#94a3b8" }} tickCount={6} />
                  <Radar
                    name={t("compare.before")}
                    dataKey="before"
                    stroke="#94a3b8"
                    fill="#94a3b8"
                    fillOpacity={0.15}
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                  />
                  <Radar
                    name={t("compare.after")}
                    dataKey="after"
                    stroke="#2563eb"
                    fill="#2563eb"
                    fillOpacity={0.2}
                    strokeWidth={2}
                    animationDuration={800}
                  />
                  <Legend />
                  <Tooltip
                    formatter={(value) => [Number(value).toFixed(1), "Score"]}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "13px",
                    }}
                  />
                </RechartsRadar>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category breakdown table */}
        <Card>
          <CardContent className="py-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">{t("compare.breakdown")}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-2 font-medium text-slate-500">{t("compare.category")}</th>
                    <th className="text-center py-3 px-2 font-medium text-slate-500">{t("compare.before")}</th>
                    <th className="text-center py-3 px-2 font-medium text-slate-500">{t("compare.after")}</th>
                    <th className="text-center py-3 px-2 font-medium text-slate-500">{t("compare.change")}</th>
                  </tr>
                </thead>
                <tbody>
                  {radarData.map((row) => (
                    <tr key={row.dimension} className="border-b border-slate-100">
                      <td className="py-3 px-2 font-medium text-slate-900">{row.dimension}</td>
                      <td className="py-3 px-2 text-center text-slate-600">{row.before.toFixed(1)}</td>
                      <td className="py-3 px-2 text-center text-slate-900 font-medium">{row.after.toFixed(1)}</td>
                      <td className="py-3 px-2 text-center">
                        <ScoreChange before={row.before} after={row.after} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Archetype change */}
        {data.older.archetype && data.newer.archetype && data.older.archetype !== data.newer.archetype && (
          <Card className="mt-8">
            <CardContent className="py-6 text-center">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">{t("compare.archetypeChange")}</h3>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Badge variant="outline" className="text-base px-4 py-2">
                  {t(`report.archetype_${data.older.archetype}`)}
                </Badge>
                <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
                <Badge className="text-base px-4 py-2 bg-primary text-white">
                  {t(`report.archetype_${data.newer.archetype}`)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="text-center mt-8">
          <Link href="/assess">
            <Button size="lg" className="rounded-xl">{t("compare.takeAnother")}</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
