"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useAuth } from "@/hooks/useAuth";

type Tab = "overview" | "users" | "assessments";

interface Metrics {
  totalUsers: number;
  totalAssessments: number;
  todayAssessments: number;
  avgScore: number;
}

interface UserRow {
  id: string;
  display_name: string | null;
  email: string;
  avatar_url: string | null;
  role: string;
  created_at: string;
}

interface AssessmentRow {
  id: string;
  target_role: string;
  input_method: string;
  overall_score: number | null;
  locale: string;
  is_public: boolean;
  share_token: string | null;
  created_at: string;
  user_id: string;
  profiles: { display_name: string | null } | null;
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
  const [tab, setTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Overview
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [roleDistribution, setRoleDistribution] = useState<Record<string, number>>({});

  // Users
  const [users, setUsers] = useState<UserRow[]>([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [usersPage, setUsersPage] = useState(1);
  const [usersSearch, setUsersSearch] = useState("");

  // Assessments
  const [assessments, setAssessments] = useState<AssessmentRow[]>([]);
  const [assessmentsTotal, setAssessmentsTotal] = useState(0);
  const [assessmentsPage, setAssessmentsPage] = useState(1);
  const [assessmentsSearch, setAssessmentsSearch] = useState("");

  // Action states
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchTab = useCallback(async (currentTab: Tab, page = 1, search = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ tab: currentTab });
      if (search) params.set("search", search);
      if (currentTab !== "overview") params.set("page", String(page));

      const res = await fetch(`/api/admin?${params}`);
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();

      if (currentTab === "overview") {
        setMetrics(data.metrics);
        setRoleDistribution(data.roleDistribution || {});
      } else if (currentTab === "users") {
        setUsers(data.users);
        setUsersTotal(data.total);
      } else if (currentTab === "assessments") {
        setAssessments(data.assessments);
        setAssessmentsTotal(data.total);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !isAdmin) {
      setLoading(false);
      return;
    }
    fetchTab("overview");
  }, [user, isAdmin, authLoading, fetchTab]);

  const switchTab = (newTab: Tab) => {
    setTab(newTab);
    if (newTab === "overview") fetchTab("overview");
    else if (newTab === "users") {
      setUsersPage(1);
      fetchTab("users", 1, usersSearch);
    } else {
      setAssessmentsPage(1);
      fetchTab("assessments", 1, assessmentsSearch);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    setActionLoading(userId);
    try {
      const res = await fetch("/api/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateRole", userId, role: newRole }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to update role");
      } else {
        fetchTab("users", usersPage, usersSearch);
      }
    } catch {
      alert("Network error");
    }
    setActionLoading(null);
  };

  const handleDelete = async (type: "user" | "assessment", id: string, label: string) => {
    if (!confirm(`Delete ${type}: ${label}?`)) return;
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin?type=${type}&id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to delete");
      } else {
        if (type === "user") fetchTab("users", usersPage, usersSearch);
        else fetchTab("assessments", assessmentsPage, assessmentsSearch);
        fetchTab("overview");
      }
    } catch {
      alert("Network error");
    }
    setActionLoading(null);
  };

  const handleExportCSV = async () => {
    try {
      const res = await fetch("/api/admin?tab=export");
      if (!res.ok) throw new Error("Export failed");
      const data = await res.json();

      // Users CSV
      const usersCsv = [
        ["ID", "Name", "Email", "Role", "Created At"].join(","),
        ...data.users.map((u: { id: string; display_name: string | null; email: string; role: string; created_at: string }) =>
          [u.id, u.display_name || "", u.email, u.role, u.created_at].join(",")
        ),
      ].join("\n");

      // Assessments CSV
      const assessmentsCsv = [
        ["ID", "User", "Target Role", "Score", "Method", "Locale", "Public", "Created At"].join(","),
        ...data.assessments.map((a: { id: string; profiles: { display_name: string | null } | null; target_role: string; overall_score: number | null; input_method: string; locale: string; is_public: boolean; created_at: string }) =>
          [a.id, a.profiles?.display_name || "", a.target_role, a.overall_score ?? "", a.input_method, a.locale, a.is_public, a.created_at].join(",")
        ),
      ].join("\n");

      const blob = new Blob(
        [`=== USERS ===\n${usersCsv}\n\n=== ASSESSMENTS ===\n${assessmentsCsv}`],
        { type: "text/csv" }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `caliber-export-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Export failed");
    }
  };

  // Auth guards
  if (authLoading) {
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
          <div className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
            <Link href="/" className="text-xl font-bold tracking-tight text-slate-900">Caliber</Link>
            <LanguageSwitcher />
          </div>
        </header>
        <div className="max-w-md mx-auto px-6 py-16 text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">{t("admin.noAccess")}</h2>
          <Link href="/"><Button className="mt-4">{t("common.back")}</Button></Link>
        </div>
      </div>
    );
  }

  const totalRoleAssessments = Object.values(roleDistribution).reduce((a, b) => a + b, 0);
  const usersPageCount = Math.ceil(usersTotal / 20);
  const assessmentsPageCount = Math.ceil(assessmentsTotal / 20);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold tracking-tight text-slate-900">Caliber</Link>
            <span className="text-sm text-slate-400">/</span>
            <span className="text-sm font-medium text-slate-700">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </Button>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Tab Navigation */}
        <div className="flex gap-1 mb-6 bg-white rounded-lg border border-slate-200 p-1 w-fit">
          {(["overview", "users", "assessments"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => switchTab(t)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                tab === t
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              {t === "overview" ? "Overview" : t === "users" ? `Users (${usersTotal || metrics?.totalUsers || 0})` : `Assessments (${assessmentsTotal || metrics?.totalAssessments || 0})`}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
            <button className="ml-2 underline" onClick={() => { setError(""); fetchTab(tab); }}>Retry</button>
          </div>
        )}

        {/* OVERVIEW TAB */}
        {tab === "overview" && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: t("admin.totalUsers"), value: metrics?.totalUsers || 0, color: "text-blue-600" },
                { label: t("admin.totalAssessments"), value: metrics?.totalAssessments || 0, color: "text-emerald-600" },
                { label: t("admin.todayAssessments"), value: metrics?.todayAssessments || 0, color: "text-amber-600" },
                { label: t("admin.avgScore"), value: metrics?.avgScore || 0, color: "text-violet-600" },
              ].map((m) => (
                <Card key={m.label}>
                  <CardContent className="py-5">
                    <p className="text-sm text-slate-500">{m.label}</p>
                    <p className={`text-3xl font-bold mt-1 ${m.color}`}>{m.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("admin.roleDistribution")}</CardTitle>
              </CardHeader>
              <CardContent>
                {totalRoleAssessments > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(roleDistribution).map(([role, count]) => (
                      <div key={role}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-600">{ROLE_LABELS[role] || role}</span>
                          <span className="text-slate-900 font-medium">{count} ({Math.round((count / totalRoleAssessments) * 100)}%)</span>
                        </div>
                        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${ROLE_COLORS[role] || "bg-slate-400"}`}
                            style={{ width: `${(count / totalRoleAssessments) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 text-center py-8">No assessment data yet</p>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* USERS TAB */}
        {tab === "users" && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Input
                placeholder="Search by name..."
                value={usersSearch}
                onChange={(e) => setUsersSearch(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { setUsersPage(1); fetchTab("users", 1, usersSearch); } }}
                className="max-w-xs"
              />
              <Button variant="outline" size="sm" onClick={() => { setUsersPage(1); fetchTab("users", 1, usersSearch); }}>
                Search
              </Button>
              {usersSearch && (
                <Button variant="ghost" size="sm" onClick={() => { setUsersSearch(""); setUsersPage(1); fetchTab("users", 1, ""); }}>
                  Clear
                </Button>
              )}
              <span className="text-sm text-slate-500 ml-auto">{usersTotal} users total</span>
            </div>

            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left py-3 px-4 font-medium text-slate-500">User</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Email</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Role</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Joined</th>
                      <th className="text-right py-3 px-4 font-medium text-slate-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading && (
                      <tr><td colSpan={5} className="text-center py-8 text-slate-400">Loading...</td></tr>
                    )}
                    {!loading && users.length === 0 && (
                      <tr><td colSpan={5} className="text-center py-8 text-slate-400">No users found</td></tr>
                    )}
                    {!loading && users.map((u) => (
                      <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-600 shrink-0">
                              {u.display_name?.[0]?.toUpperCase() || "?"}
                            </div>
                            <span className="font-medium text-slate-900 truncate max-w-[160px]">
                              {u.display_name || "—"}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600 truncate max-w-[200px]">{u.email}</td>
                        <td className="py-3 px-4">
                          <select
                            value={u.role}
                            onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                            disabled={actionLoading === u.id || u.id === user?.id}
                            className={`text-xs px-2 py-1 rounded-md border cursor-pointer ${
                              u.role === "admin"
                                ? "bg-violet-50 border-violet-200 text-violet-700"
                                : "bg-slate-50 border-slate-200 text-slate-700"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete("user", u.id, u.display_name || u.email)}
                            disabled={actionLoading === u.id || u.id === user?.id}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 text-xs h-7 px-2"
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {usersPageCount > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={usersPage <= 1}
                    onClick={() => { const p = usersPage - 1; setUsersPage(p); fetchTab("users", p, usersSearch); }}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-slate-500">Page {usersPage} of {usersPageCount}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={usersPage >= usersPageCount}
                    onClick={() => { const p = usersPage + 1; setUsersPage(p); fetchTab("users", p, usersSearch); }}
                  >
                    Next
                  </Button>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* ASSESSMENTS TAB */}
        {tab === "assessments" && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Input
                placeholder="Search by role (e.g. b2b-pm)..."
                value={assessmentsSearch}
                onChange={(e) => setAssessmentsSearch(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { setAssessmentsPage(1); fetchTab("assessments", 1, assessmentsSearch); } }}
                className="max-w-xs"
              />
              <Button variant="outline" size="sm" onClick={() => { setAssessmentsPage(1); fetchTab("assessments", 1, assessmentsSearch); }}>
                Search
              </Button>
              {assessmentsSearch && (
                <Button variant="ghost" size="sm" onClick={() => { setAssessmentsSearch(""); setAssessmentsPage(1); fetchTab("assessments", 1, ""); }}>
                  Clear
                </Button>
              )}
              <span className="text-sm text-slate-500 ml-auto">{assessmentsTotal} assessments total</span>
            </div>

            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left py-3 px-4 font-medium text-slate-500">User</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Target Role</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Score</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Method</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Locale</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Public</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Date</th>
                      <th className="text-right py-3 px-4 font-medium text-slate-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading && (
                      <tr><td colSpan={8} className="text-center py-8 text-slate-400">Loading...</td></tr>
                    )}
                    {!loading && assessments.length === 0 && (
                      <tr><td colSpan={8} className="text-center py-8 text-slate-400">No assessments found</td></tr>
                    )}
                    {!loading && assessments.map((a) => (
                      <tr key={a.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                        <td className="py-3 px-4 text-slate-900 font-medium truncate max-w-[140px]">
                          {a.profiles?.display_name || "Anonymous"}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary" className="text-xs">
                            {ROLE_LABELS[a.target_role] || a.target_role}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`font-bold ${
                            (a.overall_score || 0) >= 80 ? "text-emerald-600" :
                            (a.overall_score || 0) >= 60 ? "text-amber-600" : "text-red-500"
                          }`}>
                            {a.overall_score != null ? Math.round(a.overall_score) : "—"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500 capitalize">{a.input_method}</td>
                        <td className="py-3 px-4 text-slate-500 uppercase text-xs">{a.locale}</td>
                        <td className="py-3 px-4">
                          {a.is_public ? (
                            <span className="text-xs text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Yes</span>
                          ) : (
                            <span className="text-xs text-slate-400">No</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          {new Date(a.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete("assessment", a.id, `${a.profiles?.display_name || "Anonymous"}'s assessment`)}
                            disabled={actionLoading === a.id}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 text-xs h-7 px-2"
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {assessmentsPageCount > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={assessmentsPage <= 1}
                    onClick={() => { const p = assessmentsPage - 1; setAssessmentsPage(p); fetchTab("assessments", p, assessmentsSearch); }}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-slate-500">Page {assessmentsPage} of {assessmentsPageCount}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={assessmentsPage >= assessmentsPageCount}
                    onClick={() => { const p = assessmentsPage + 1; setAssessmentsPage(p); fetchTab("assessments", p, assessmentsSearch); }}
                  >
                    Next
                  </Button>
                </div>
              )}
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
