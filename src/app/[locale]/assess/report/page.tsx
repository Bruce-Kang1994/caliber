"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppHeader } from "@/components/AppHeader";
import { AssessmentRadarChart } from "@/components/RadarChart";
import { DIMENSIONS, DIMENSION_CATEGORIES, getCategoryAverage, type DimensionCategory } from "@/lib/constants";
import type { AssessmentResult, RadarDataPoint } from "@/lib/types";

function getScoreLevel(score: number, t: (key: string) => string) {
  if (score >= 86) return { label: t("report.levelExpert"), color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200" };
  if (score >= 71) return { label: t("report.levelAdvanced"), color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" };
  if (score >= 51) return { label: t("report.levelCompetent"), color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" };
  if (score >= 31) return { label: t("report.levelDeveloping"), color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" };
  return { label: t("report.levelBeginner"), color: "text-slate-600", bg: "bg-slate-50", border: "border-slate-200" };
}

function ReportContent() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const reportRef = useRef<HTMLDivElement>(null);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [exporting, setExporting] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSaved, setEmailSaved] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [displayScore, setDisplayScore] = useState(0);
  const [expandedDimensions, setExpandedDimensions] = useState<Set<string>>(new Set());

  useEffect(() => {
    const stored = sessionStorage.getItem("assessmentResult");
    if (!stored) {
      router.push("/assess");
      return;
    }
    const parsed = JSON.parse(stored);

    // If locale changed since assessment was run, re-analyze
    if (parsed._locale && parsed._locale !== locale) {
      const input = sessionStorage.getItem("assessmentInput");
      if (input) {
        const inputData = JSON.parse(input);
        router.push(`/assess/analyzing?role=${inputData.roleType || parsed.roleType}`);
        return;
      }
    }

    setResult(parsed);
  }, [router, locale]);

  // Score count-up animation
  useEffect(() => {
    if (!result) return;
    const target = result.weightedScore;
    const duration = 1500;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [result]);

  if (!result) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full" />
      </div>
    );
  }

  const getDimName = (key: string): string => {
    try {
      return t(`dimensions.${key}`);
    } catch {
      return DIMENSIONS.find((d) => d.key === key)?.name ?? key;
    }
  };

  // 5-category radar chart (aggregated averages)
  const categoryKeys = Object.keys(DIMENSION_CATEGORIES) as DimensionCategory[];
  const radarData: RadarDataPoint[] = categoryKeys.map((cat) => ({
    dimension: t(`dimensionCategories.${cat}`),
    score: Math.round(getCategoryAverage(result.scores, cat) * 10) / 10,
    fullMark: 5,
  }));

  const level = getScoreLevel(result.weightedScore, t);

  const scoreColor =
    result.weightedScore >= 70
      ? "text-blue-600"
      : result.weightedScore >= 50
      ? "text-amber-600"
      : "text-red-500";

  // PDF Export
  const handleExportPdf = async () => {
    setExporting(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      if (!reportRef.current) return;

      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();

      while (heightLeft > 0) {
        position -= pdf.internal.pageSize.getHeight();
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }

      pdf.save(`Caliber-Report-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch {
      alert("Failed to export PDF. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  // Share
  const handleShare = async () => {
    const shareData = {
      title: "My Caliber Report",
      text: `I scored ${result.weightedScore}/100 on Caliber! Discover your PM caliber.`,
      url: window.location.origin,
    };

    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(
        `${shareData.text}\n${shareData.url}`
      );
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader currentStep={4} />

      <main className="max-w-4xl mx-auto px-6 py-8" ref={reportRef}>
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            {t("report.title")}
          </h1>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto leading-relaxed">{result.summary}</p>
        </div>

        {/* Overall Score — Hero Card */}
        <Card className="mb-8 border-0 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 sm:p-10 text-center">
            {result.archetype ? (
              <>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-4">
                  {t("report.archetypeLabel")}
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-white">
                  {t(`report.archetype_${result.archetype}`)}
                </h2>
                <div className="w-8 h-0.5 bg-primary/60 mx-auto mt-4 mb-4 rounded-full" />
                <p className="text-base text-slate-300 max-w-md mx-auto leading-relaxed">
                  {t(`report.archetype_${result.archetype}_desc`)}
                </p>
                <div className={`inline-flex items-center gap-2 mt-5 px-4 py-1.5 rounded-full ${level.bg} ${level.border} border`}>
                  <span className={`text-sm font-semibold ${level.color}`}>{level.label}</span>
                </div>
                <p className="text-sm text-slate-400 mt-3">
                  Caliber Score: <span className="text-white font-semibold">{displayScore}</span>/100
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-slate-300 uppercase tracking-wider mb-3">
                  {t("report.overallScore")}
                </p>
                <div className="flex items-end justify-center gap-1">
                  <span className="text-5xl sm:text-7xl font-bold">{displayScore}</span>
                  <span className="text-2xl text-slate-400 mb-3">/100</span>
                </div>
                <div className={`inline-flex items-center gap-2 mt-4 px-4 py-1.5 rounded-full ${level.bg} ${level.border} border`}>
                  <span className={`text-sm font-semibold ${level.color}`}>{level.label}</span>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Radar Chart — Full Width */}
        <Card className="mb-8 border-0 shadow-md">
          <CardHeader>
            <CardTitle>{t("report.radarTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] sm:h-[400px]">
              <AssessmentRadarChart data={radarData} />
            </div>
            {/* Score Grid — Grouped by Category */}
            <div className="mt-6 space-y-4">
              {categoryKeys.map((cat) => (
                <div key={cat}>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    {t(`dimensionCategories.${cat}`)}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {DIMENSION_CATEGORIES[cat].map((dimKey) => {
                      const score = result.scores[dimKey] || 0;
                      const isStrength = score >= 4;
                      const isWeak = score <= 2;
                      const isExpanded = expandedDimensions.has(dimKey);
                      const justification = result.justifications?.[dimKey];
                      return (
                        <div key={dimKey}>
                          <div
                            className={`flex items-center justify-between text-sm px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                              isStrength ? "bg-emerald-50 hover:bg-emerald-100/70" : isWeak ? "bg-amber-50 hover:bg-amber-100/70" : "bg-slate-50 hover:bg-slate-100"
                            }`}
                            onClick={() => {
                              setExpandedDimensions((prev) => {
                                const next = new Set(prev);
                                if (next.has(dimKey)) next.delete(dimKey);
                                else next.add(dimKey);
                                return next;
                              });
                            }}
                          >
                            <span className="text-slate-700 truncate mr-2 flex items-center gap-1.5">
                              <svg
                                className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                              </svg>
                              {getDimName(dimKey)}
                            </span>
                            <Badge
                              className={
                                isStrength
                                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                                  : isWeak
                                  ? "bg-amber-100 text-amber-700 hover:bg-amber-100"
                                  : "bg-slate-100 text-slate-600 hover:bg-slate-100"
                              }
                            >
                              {score.toFixed(1)}
                            </Badge>
                          </div>
                          {isExpanded && justification && (
                            <div className="px-3 py-2 mt-1 text-xs text-slate-600 leading-relaxed bg-white rounded-lg border border-slate-100 animate-in fade-in slide-in-from-top-1 duration-200">
                              {justification}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Strengths — Green accent */}
        <Card className="mb-8 border-0 shadow-md border-l-4 border-l-emerald-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
              </span>
              {t("report.strengthsTitle")}
            </CardTitle>
            <CardDescription>{t("report.strengthsSubtitle")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.topStrengths.map((s, idx) => (
              <div key={idx} className="rounded-xl bg-emerald-50/50 border border-emerald-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-slate-900">
                    {s.dimensionName}
                  </h4>
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                    {s.score.toFixed(1)}/5.0
                  </Badge>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {s.evidence}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Weaknesses — Amber accent */}
        <Card className="mb-8 border-0 shadow-md border-l-4 border-l-amber-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5c0 .414.336.75.75.75h2.5a.75.75 0 000-1.5h-1.75v-1.75z" clipRule="evenodd" />
                </svg>
              </span>
              {t("report.weaknessesTitle")}
            </CardTitle>
            <CardDescription>{t("report.weaknessesSubtitle")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.topWeaknesses.map((w, idx) => (
              <div key={idx} className="rounded-xl bg-amber-50/50 border border-amber-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-slate-900">
                    {w.dimensionName}
                  </h4>
                  <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                    {w.score.toFixed(1)}/5.0
                  </Badge>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  {w.upgradeAdvice}
                </p>
                <div className="bg-white/70 rounded-lg p-3">
                  <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2">
                    {t("report.actionItems")}
                  </p>
                  <ul className="space-y-1.5">
                    {w.actionItems.map((item, i) => (
                      <li
                        key={i}
                        className="text-sm text-slate-700 flex items-start gap-2"
                      >
                        <span className="text-amber-500 mt-0.5 shrink-0">-</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Undervalued Experiences — Blue accent */}
        {result.undervaluedExperiences.length > 0 && (
          <Card className="mb-8 border-0 shadow-md border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 1a6 6 0 00-3.815 10.631C7.237 12.5 8 13.443 8 14.456v.644a.75.75 0 00.75.75h2.5a.75.75 0 00.75-.75v-.644c0-1.013.762-1.957 1.815-2.825A6 6 0 0010 1zM8.863 17.414a.75.75 0 00-.226 1.483 9.066 9.066 0 002.726 0 .75.75 0 00-.226-1.483 7.563 7.563 0 01-2.274 0z" />
                  </svg>
                </span>
                {t("report.undervaluedTitle")}
              </CardTitle>
              <CardDescription>{t("report.undervaluedSubtitle")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {result.undervaluedExperiences.map((exp, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm bg-blue-50/50 rounded-lg p-4 border border-blue-100">
                    <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold shrink-0 mt-0.5">
                      !
                    </span>
                    <span className="text-slate-700 leading-relaxed">
                      {exp}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Missing Elements */}
        {result.missingElements.length > 0 && (
          <Card className="mb-8 border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                  </svg>
                </span>
                {t("report.missingTitle")}
              </CardTitle>
              <CardDescription>{t("report.missingSubtitle")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {result.missingElements.map((el, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm bg-slate-50 rounded-lg p-4 border border-slate-100">
                    <span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-xs font-bold shrink-0 mt-0.5">
                      ?
                    </span>
                    <span className="text-slate-700 leading-relaxed">
                      {el}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        <Card className="mb-8 border-0 shadow-md bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <CardHeader>
            <CardTitle className="text-white">{t("report.nextStepsTitle")}</CardTitle>
            <CardDescription className="text-slate-300">
              {t("report.nextStepsSubtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              {result.nextSteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-sm text-slate-200 leading-relaxed pt-1.5">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* Email Save Gate */}
        {!emailSaved && (
          <Card className="mb-8 border-0 shadow-md border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  {t("auth.saveReport")}
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  {t("auth.saveReportDesc")}
                </p>
                <form
                  className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                      setEmailError("Please enter a valid email");
                      return;
                    }
                    setEmailError("");
                    // Store email locally (actual API integration is a V2 feature)
                    sessionStorage.setItem("caliberEmail", email);
                    setEmailSaved(true);
                  }}
                >
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("auth.emailPlaceholder")}
                    className="flex-1"
                  />
                  <Button type="submit">
                    {t("auth.saveAndContinue")}
                  </Button>
                </form>
                {emailError && (
                  <p className="text-sm text-red-500 mt-2">{emailError}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
        {emailSaved && (
          <Card className="mb-8 border-0 shadow-md bg-emerald-50 border-l-4 border-l-emerald-500">
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-emerald-700 font-medium">
                {t("auth.reportSaved")}
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Action Buttons (outside reportRef so they don't appear in PDF) */}
      <div className="max-w-4xl mx-auto px-6 pb-12">
        <div className="flex flex-wrap gap-3 justify-center">
          <Button onClick={handleExportPdf} disabled={exporting} className="rounded-xl">
            {exporting ? t("common.loading") : t("report.downloadPdf")}
          </Button>
          <Button variant="outline" onClick={handleShare} className="rounded-xl">
            {t("report.shareReport")}
          </Button>
          <Link href="/assess">
            <Button variant="ghost" className="rounded-xl">{t("report.startNew")}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense>
      <ReportContent />
    </Suspense>
  );
}
