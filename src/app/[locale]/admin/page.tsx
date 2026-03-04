"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useAuth } from "@/hooks/useAuth";

interface AdminData {
  metrics: {
    totalUsers: number;
    totalAssessments: number;
    todayAssessments: number;
    avgScore: number;
  };
  recentUsers: Array<{
    id: string;
    display_name: string | null;
    avatar_url: string | null;
    role: string;
    created_at: string;
  }>;
  recentAssessments: Array<{
    id: string;
    target_role: string;
    overall_score: number;
    locale: string;
    created_at: string;
    profiles: { display_name: string | null } | null;
  }>;
  roleDistribution: Record<string, number>;
}

const ROLE_LABELS: Record<string, string> = {
  "b2b-pm": "B2B PM",
  "c2c-pm": "Consumer PM",
  "ai-pm": "AI PM",
  "growth-pm": "Growth PM",
  "data-pm": "Data PM",
};

const ROLE_COLORS: Record<string, string> = {
  "b2b-pm": "bg-blue-500",
  "c2c-pm": "bg-emerald-500",
  "ai-pm": "bg-violet-500",
  "growth-pm": "bg-amber-500",
  "data-pm": "bg-rose-500",
};

export default function AdminPage() {
  const t = useTranslations();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user || !isAdmin) {
      setLoading(false);
      return;
    }

    fetch("/api/admin")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load admin data");
        return res.json();
      })
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [user, isAdmin, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
          <div className="flex items-center justify-between px-6 py-3 max-w-6xl mx-auto">
            <Link href="/" className="text-xl font-bold tracking-tight text-slate-900">Caliber</Link>
            <LanguageSwitcher />
          </div>
        </header>
        <div className="max-w-md mx-auto px-6 py-16 text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">{t("admin.noAccess")}</h2>
          <Link href="/">
            <Button className="mt-4">{t("common.back")}</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>{t("common.retry")}</Button>
        </div>
      </div>
    );
  }

  const metrics = data?.metrics;
  const totalRoleAssessments = Object.values(data?.roleDistribution || {}).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="flex items-center justify-between px-6 py-3 max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold tracking-tight text-slate-900">Caliber</Link>
            <span className="text-sm text-slate-500">/ {t("admin.title")}</span>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">{t("admin.title")}</h1>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="py-5">
              <p className="text-sm text-slate-500">{t("admin.totalUsers")}</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{metrics?.totalUsers || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-5">
              <p className="text-sm text-slate-500">{t("admin.totalAssessments")}</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{metrics?.totalAssessments || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-5">
              <p className="text-sm text-slate-500">{t("admin.todayAssessments")}</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{metrics?.todayAssessments || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-5">
              <p className="text-sm text-slate-500">{t("admin.avgScore")}</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{metrics?.avgScore || 0}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Role Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("admin.roleDistribution")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(data?.roleDistribution || {}).map(([role, count]) => (
                  <div key={role}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">{ROLE_LABELS[role] || role}</span>
                      <span className="text-slate-900 font-medium">{count}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${ROLE_COLORS[role] || "bg-slate-400"}`}
                        style={{ width: `${totalRoleAssessments ? (count / totalRoleAssessments) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
                {Object.keys(data?.roleDistribution || {}).length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-4">No data yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Users */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("admin.recentUsers")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(data?.recentUsers || []).map((user) => (
                  <div key={user.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-600">
                      {user.display_name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {user.display_name || "Anonymous"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {user.role === "admin" && (
                      <span className="text-xs bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full">Admin</span>
                    )}
                  </div>
                ))}
                {(data?.recentUsers || []).length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-4">No users yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Assessments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("admin.recentAssessments")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(data?.recentAssessments || []).map((a) => (
                  <div key={a.id} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {a.profiles?.display_name || "Anonymous"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {ROLE_LABELS[a.target_role] || a.target_role} · {new Date(a.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-slate-900">
                      {Math.round(a.overall_score)}
                    </span>
                  </div>
                ))}
                {(data?.recentAssessments || []).length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-4">No assessments yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
