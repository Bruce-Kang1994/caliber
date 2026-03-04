"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useAuth } from "@/hooks/useAuth";
import type { AssessmentResult } from "@/lib/types";

// Reuse the report rendering from the main report page
// For now, a simplified version that loads from API
export default function HistoryDetailPage() {
  const t = useTranslations();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setError("Please sign in to view this report.");
      setLoading(false);
      return;
    }

    fetch(`/api/assessments?id=${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setResult(data.assessment.result);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [user, authLoading, params.id]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
          <div className="flex items-center justify-between px-6 py-3 max-w-6xl mx-auto">
            <Link href="/" className="text-xl font-bold tracking-tight text-slate-900">
              Caliber
            </Link>
            <LanguageSwitcher />
          </div>
        </header>
        <div className="max-w-md mx-auto px-6 py-16 text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">{error || "Not found"}</h2>
          <Link href="/history">
            <Button className="mt-4">{t("common.back")}</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Store in sessionStorage and redirect to the full report page
  // This reuses the existing rich report rendering
  useEffect(() => {
    if (result) {
      sessionStorage.setItem("assessmentResult", JSON.stringify({ ...result, _locale: "en" }));
      window.location.href = `/${params.locale || "en"}/assess/report?role=${result.roleType}&from=history`;
    }
  }, [result, params.locale]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-600">Loading report...</p>
      </div>
    </div>
  );
}
