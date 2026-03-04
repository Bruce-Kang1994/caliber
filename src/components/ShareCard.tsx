"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import type { AssessmentResult } from "@/lib/types";
import { DIMENSION_CATEGORIES, getCategoryAverage, type DimensionCategory } from "@/lib/constants";

const ARCHETYPE_LABELS: Record<string, string> = {
  craftsperson: "The Craftsperson",
  strategist: "The Strategist",
  "growth-hacker": "The Growth Hacker",
  visionary: "The Visionary",
  operator: "The Operator",
};

function getLevel(score: number) {
  if (score >= 86) return "Expert";
  if (score >= 71) return "Advanced";
  if (score >= 51) return "Competent";
  if (score >= 31) return "Developing";
  return "Entry Level";
}

type Format = "linkedin" | "story";

interface ShareCardProps {
  result: AssessmentResult;
}

export function ShareCard({ result }: ShareCardProps) {
  const t = useTranslations();
  const [generating, setGenerating] = useState(false);
  const [format, setFormat] = useState<Format>("linkedin");
  const cardRef = useRef<HTMLDivElement>(null);

  const score = Math.round(result.weightedScore);
  const level = getLevel(score);
  const archetype = result.archetype
    ? t(`report.archetype_${result.archetype}`)
    : null;

  const categoryKeys = Object.keys(DIMENSION_CATEGORIES) as DimensionCategory[];
  const categoryData = categoryKeys.map((cat) => ({
    name: t(`dimensionCategories.${cat}`),
    avg: Math.round(getCategoryAverage(result.scores, cat) * 10) / 10,
  }));

  const handleDownload = async () => {
    setGenerating(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current!, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: null,
      });

      const link = document.createElement("a");
      link.download = `Caliber-${format === "story" ? "Story" : "Card"}-${score}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      // silently fail
    } finally {
      setGenerating(false);
    }
  };

  const isStory = format === "story";
  const cardWidth = isStory ? 360 : 480;
  const cardHeight = isStory ? 640 : 270;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-slate-700">
          {t("share.downloadCard")}
        </h3>
      </div>

      {/* Format Selector */}
      <div className="flex gap-2">
        <button
          className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
            format === "linkedin"
              ? "bg-primary text-white border-primary"
              : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
          }`}
          onClick={() => setFormat("linkedin")}
        >
          LinkedIn / Twitter
        </button>
        <button
          className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
            format === "story"
              ? "bg-primary text-white border-primary"
              : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
          }`}
          onClick={() => setFormat("story")}
        >
          Instagram Story
        </button>
      </div>

      {/* Card Preview */}
      <div className="overflow-hidden rounded-xl border border-slate-200 inline-block">
        <div
          ref={cardRef}
          style={{
            width: cardWidth,
            height: cardHeight,
            padding: isStory ? 32 : 24,
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: isStory ? "center" : "space-between",
            gap: isStory ? 24 : 12,
            color: "white",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: isStory ? 20 : 16, fontWeight: 700, letterSpacing: "-0.5px" }}>
              Caliber
            </span>
            <span style={{ fontSize: isStory ? 12 : 10, color: "#64748b" }}>PM Assessment</span>
          </div>

          {/* Archetype + Score */}
          <div style={{ textAlign: isStory ? "center" : "left" }}>
            {archetype && (
              <>
                <div style={{ fontSize: isStory ? 12 : 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "2px", marginBottom: 8 }}>
                  PM Archetype
                </div>
                <div style={{ fontSize: isStory ? 28 : 20, fontWeight: 700, marginBottom: 12 }}>
                  {archetype}
                </div>
              </>
            )}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 4, justifyContent: isStory ? "center" : "flex-start" }}>
              <span style={{ fontSize: isStory ? 56 : 40, fontWeight: 800, lineHeight: 1 }}>{score}</span>
              <span style={{ fontSize: isStory ? 20 : 14, color: "#64748b", marginBottom: isStory ? 6 : 4 }}>/100</span>
            </div>
            <div
              style={{
                display: "inline-block",
                padding: "3px 12px",
                borderRadius: 12,
                background: "rgba(59, 130, 246, 0.2)",
                color: "#60a5fa",
                fontSize: isStory ? 14 : 11,
                fontWeight: 600,
                marginTop: 8,
              }}
            >
              {level}
            </div>
          </div>

          {/* Category Bars (story only) */}
          {isStory && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
              {categoryData.map((cat) => (
                <div key={cat.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 11, color: "#94a3b8", width: 90, textAlign: "right" }}>{cat.name}</span>
                  <div
                    style={{
                      flex: 1,
                      height: 6,
                      borderRadius: 3,
                      background: "rgba(255,255,255,0.1)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${(cat.avg / 5) * 100}%`,
                        height: "100%",
                        borderRadius: 3,
                        background: "#3b82f6",
                      }}
                    />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, width: 30 }}>{cat.avg}</span>
                </div>
              ))}
            </div>
          )}

          {/* Footer CTA */}
          <div style={{ fontSize: isStory ? 13 : 10, color: "#475569", textAlign: isStory ? "center" : "left" }}>
            What&apos;s your PM caliber? → caliber.pm
          </div>
        </div>
      </div>

      {/* Download Button */}
      <Button
        onClick={handleDownload}
        disabled={generating}
        size="sm"
        variant="outline"
        className="rounded-xl"
      >
        {generating ? t("common.loading") : t("share.downloadImage")}
      </Button>
    </div>
  );
}
