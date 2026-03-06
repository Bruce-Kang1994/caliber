"use client";

import { useState, useCallback, Suspense } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AppHeader } from "@/components/AppHeader";
import { StepIndicatorBar } from "@/components/StepIndicator";
import type { PMRole, PMLevel, WorkExperience, ProjectDetail } from "@/lib/types";

function emptyProject(): ProjectDetail {
  return { name: "", background: "", actions: "", results: "" };
}

function emptyExperience(): WorkExperience {
  return {
    company: "",
    title: "",
    duration: "",
    responsibilities: "",
    projects: [emptyProject()],
    achievements: [],
  };
}

function InputPageContent() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = (searchParams.get("role") || "ai-pm") as PMRole;
  const level = (searchParams.get("level") || "mid") as PMLevel;

  const [tab, setTab] = useState<"upload" | "manual">("upload");
  const [experiences, setExperiences] = useState<WorkExperience[]>([
    emptyExperience(),
  ]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [expandedExps, setExpandedExps] = useState<Set<number>>(new Set());

  // --- Resume Upload ---
  const handleFileUpload = useCallback(
    async (file: File) => {
      if (!file.name.toLowerCase().endsWith(".pdf")) {
        setUploadError("Please upload a PDF file");
        return;
      }

      setUploading(true);
      setUploadError("");
      setUploadSuccess(false);

      try {
        const formData = new FormData();
        formData.append("pdf", file);
        formData.append("roleType", role);
        formData.append("locale", locale);

        const res = await fetch("/api/parse-resume", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          let errMsg = "Failed to parse resume";
          try { const err = await res.json(); errMsg = err.error || errMsg; } catch { /* noop */ }
          throw new Error(errMsg);
        }

        // Read NDJSON stream from resume parser
        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let parsed = false;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const msg = JSON.parse(line);
              if (msg.type === "result" && msg.experiences?.length > 0) {
                setExperiences(msg.experiences);
                const expanded = new Set<number>();
                msg.experiences.forEach((exp: WorkExperience, i: number) => {
                  if (exp.projects?.length > 0 || exp.achievements?.length > 0) {
                    expanded.add(i);
                  }
                });
                setExpandedExps(expanded);
                setUploadSuccess(true);
                setTab("manual");
                parsed = true;
              } else if (msg.type === "error") {
                throw new Error(msg.error);
              }
            } catch (e) {
              if (e instanceof Error && e.message !== "Failed to parse resume") throw e;
            }
          }
        }

        if (!parsed) {
          throw new Error("Failed to extract experiences from resume");
        }
      } catch (err) {
        setUploadError(
          err instanceof Error ? err.message : "Failed to parse resume"
        );
      } finally {
        setUploading(false);
      }
    },
    [role, locale]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFileUpload(file);
    },
    [handleFileUpload]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFileUpload(file);
    },
    [handleFileUpload]
  );

  // --- Experience Form Handlers ---
  const updateExperience = (
    idx: number,
    field: keyof WorkExperience,
    value: string | ProjectDetail[] | string[]
  ) => {
    setExperiences((prev) =>
      prev.map((exp, i) => (i === idx ? { ...exp, [field]: value } : exp))
    );
  };

  const updateProject = (
    expIdx: number,
    projIdx: number,
    field: keyof ProjectDetail,
    value: string
  ) => {
    setExperiences((prev) =>
      prev.map((exp, i) =>
        i === expIdx
          ? {
              ...exp,
              projects: exp.projects.map((p, j) =>
                j === projIdx ? { ...p, [field]: value } : p
              ),
            }
          : exp
      )
    );
  };

  const addExperience = () => setExperiences((prev) => [...prev, emptyExperience()]);
  const removeExperience = (idx: number) =>
    setExperiences((prev) => prev.filter((_, i) => i !== idx));
  const addProject = (expIdx: number) =>
    setExperiences((prev) =>
      prev.map((exp, i) =>
        i === expIdx
          ? { ...exp, projects: [...exp.projects, emptyProject()] }
          : exp
      )
    );
  const removeProject = (expIdx: number, projIdx: number) =>
    setExperiences((prev) =>
      prev.map((exp, i) =>
        i === expIdx
          ? { ...exp, projects: exp.projects.filter((_, j) => j !== projIdx) }
          : exp
      )
    );

  // --- Submit ---
  const totalChars = experiences.reduce((sum, exp) => {
    let chars = (exp.company + exp.title + exp.duration + exp.responsibilities).length;
    exp.projects.forEach((p) => {
      chars += (p.name + p.background + p.actions + p.results).length;
    });
    chars += exp.achievements.join("").length;
    return sum + chars;
  }, 0);
  const hasMinContent = totalChars >= 100;
  const hasValidExperience = experiences.some(
    (exp) => exp.company.trim() && exp.title.trim()
  );

  const handleSubmit = () => {
    // Store in sessionStorage and navigate to analyzing page
    sessionStorage.setItem(
      "assessmentInput",
      JSON.stringify({ roleType: role, level, experiences, inputMethod: tab })
    );
    router.push(`/assess/analyzing?role=${role}&level=${level}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader currentStep={2} />

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <StepIndicatorBar current={2} />
        </div>
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900">
            {t("input.title")}
          </h1>
          <p className="mt-3 text-slate-600">{t("input.subtitle")}</p>
        </div>

        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as "upload" | "manual")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">{t("input.uploadTab")}</TabsTrigger>
            <TabsTrigger value="manual">{t("input.manualTab")}</TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div
                  className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                    uploading
                      ? "border-blue-400 bg-blue-50"
                      : "border-slate-300 hover:border-slate-400"
                  }`}
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {uploading ? (
                    <div>
                      <div className="animate-spin w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4" />
                      <p className="text-slate-600">{t("input.parsing")}</p>
                    </div>
                  ) : (
                    <>
                      <svg
                        className="w-12 h-12 text-slate-400 mx-auto mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                        />
                      </svg>
                      <p className="text-slate-600 mb-2">
                        {t("input.uploadDesc")}
                      </p>
                      <p className="text-sm text-slate-400 mb-4">
                        {t("input.uploadHint")}
                      </p>
                      <label className="inline-block">
                        <input
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          onChange={handleFileInput}
                        />
                        <Button variant="outline" asChild>
                          <span>{t("input.uploadButton")}</span>
                        </Button>
                      </label>
                    </>
                  )}
                </div>

                {uploadError && (
                  <p className="mt-4 text-sm text-red-600">{uploadError}</p>
                )}
                {uploadSuccess && (
                  <p className="mt-4 text-sm text-green-600">
                    {t("input.parseSuccess")}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manual Tab */}
          <TabsContent value="manual" className="mt-6 space-y-6">
            {experiences.map((exp, expIdx) => (
              <Card key={expIdx}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {exp.company || `${t("input.manualTitle")} #${expIdx + 1}`}
                    </CardTitle>
                    {exp.title && (
                      <CardDescription>{exp.title}</CardDescription>
                    )}
                  </div>
                  {experiences.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeExperience(expIdx)}
                    >
                      {t("input.removeExperience")}
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        {t("input.company")}
                      </label>
                      <Input
                        value={exp.company}
                        onChange={(e) =>
                          updateExperience(expIdx, "company", e.target.value)
                        }
                        placeholder="Google, Stripe, etc."
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        {t("input.jobTitle")}
                      </label>
                      <Input
                        value={exp.title}
                        onChange={(e) =>
                          updateExperience(expIdx, "title", e.target.value)
                        }
                        placeholder="Product Manager"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      {t("input.duration")}
                    </label>
                    <Input
                      value={exp.duration}
                      onChange={(e) =>
                        updateExperience(expIdx, "duration", e.target.value)
                      }
                      placeholder="2020.03 - 2022.09"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      {t("input.responsibilities")}
                    </label>
                    <Textarea
                      value={exp.responsibilities}
                      onChange={(e) =>
                        updateExperience(
                          expIdx,
                          "responsibilities",
                          e.target.value
                        )
                      }
                      placeholder={t("input.responsibilitiesHint")}
                      className="mt-1"
                      rows={2}
                    />
                  </div>

                  {/* Progressive disclosure: Projects & Achievements */}
                  {expandedExps.has(expIdx) ? (
                    <>
                      <div className="space-y-4">
                        {exp.projects.map((proj, projIdx) => (
                          <div
                            key={projIdx}
                            className="border rounded-lg p-4 bg-slate-50 space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <Badge variant="secondary">
                                {t("input.projectName")} #{projIdx + 1}
                              </Badge>
                              {exp.projects.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-red-700 h-7 text-xs"
                                  onClick={() => removeProject(expIdx, projIdx)}
                                >
                                  {t("input.removeProject")}
                                </Button>
                              )}
                            </div>
                            <Input
                              value={proj.name}
                              onChange={(e) =>
                                updateProject(expIdx, projIdx, "name", e.target.value)
                              }
                              placeholder={t("input.projectName")}
                            />
                            <Textarea
                              value={proj.background}
                              onChange={(e) =>
                                updateProject(expIdx, projIdx, "background", e.target.value)
                              }
                              placeholder={t("input.projectBackgroundHint")}
                              rows={2}
                            />
                            <Textarea
                              value={proj.actions}
                              onChange={(e) =>
                                updateProject(expIdx, projIdx, "actions", e.target.value)
                              }
                              placeholder={t("input.projectActionsHint")}
                              rows={2}
                            />
                            <Textarea
                              value={proj.results}
                              onChange={(e) =>
                                updateProject(expIdx, projIdx, "results", e.target.value)
                              }
                              placeholder={t("input.projectResultsHint")}
                              rows={2}
                            />
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addProject(expIdx)}
                        >
                          + {t("input.addProject")}
                        </Button>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-slate-700">
                          {t("input.achievements")}
                        </label>
                        <Textarea
                          value={exp.achievements.join("\n")}
                          onChange={(e) =>
                            updateExperience(
                              expIdx,
                              "achievements",
                              e.target.value.split("\n").filter((a) => a.trim())
                            )
                          }
                          placeholder={t("input.achievementsHint")}
                          className="mt-1"
                          rows={3}
                        />
                      </div>
                    </>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-800 w-full justify-center"
                      onClick={() => setExpandedExps((prev) => new Set(prev).add(expIdx))}
                    >
                      + {t("input.addMoreDetail")}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}

            <Button variant="outline" onClick={addExperience} className="w-full">
              + {t("input.addExperience")}
            </Button>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-between">
          <Link href="/assess">
            <Button variant="outline">{t("common.back")}</Button>
          </Link>
          <div className="flex flex-col items-end gap-2">
            {hasValidExperience && !hasMinContent && (
              <p className="text-sm text-amber-600">{t("input.minContentHint")}</p>
            )}
            <Button disabled={!hasValidExperience || !hasMinContent} onClick={handleSubmit}>
              {t("input.startAssessment")}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function InputPage() {
  return (
    <Suspense>
      <InputPageContent />
    </Suspense>
  );
}
