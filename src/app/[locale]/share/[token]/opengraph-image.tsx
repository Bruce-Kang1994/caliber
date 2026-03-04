import { ImageResponse } from "next/og";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "edge";
export const alt = "Caliber PM Assessment Result";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ARCHETYPE_LABELS: Record<string, string> = {
  craftsperson: "The Craftsperson",
  strategist: "The Strategist",
  "growth-hacker": "The Growth Hacker",
  visionary: "The Visionary",
  operator: "The Operator",
};

function getLevel(score: number) {
  if (score >= 86) return { label: "Expert", color: "#8b5cf6" };
  if (score >= 71) return { label: "Advanced", color: "#3b82f6" };
  if (score >= 51) return { label: "Competent", color: "#10b981" };
  if (score >= 31) return { label: "Developing", color: "#f59e0b" };
  return { label: "Entry Level", color: "#64748b" };
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  // Fetch the shared assessment
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("assessments")
    .select("result, overall_score")
    .eq("share_token", token)
    .eq("is_public", true)
    .single();

  // Fallback to generic OG if not found
  if (!data?.result) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div style={{ fontSize: 64, fontWeight: 800, color: "white" }}>Caliber</div>
          <div style={{ fontSize: 28, color: "#94a3b8", marginTop: 16 }}>PM Capability Assessment</div>
        </div>
      ),
      { ...size }
    );
  }

  const result = data.result as {
    weightedScore: number;
    archetype?: string;
    roleType: string;
    scores: Record<string, number>;
  };

  const score = Math.round(result.weightedScore);
  const level = getLevel(score);
  const archetype = result.archetype ? ARCHETYPE_LABELS[result.archetype] || result.archetype : null;

  const categories = [
    { label: "Product", keys: ["requirement-analysis", "product-design", "system-architecture", "zero-to-one"], color: "#3b82f6" },
    { label: "Business", keys: ["data-driven", "business-decomposition", "commercialization", "growth"], color: "#10b981" },
    { label: "AI", keys: ["ai-product-design", "ai-tech-understanding", "ai-tool-application"], color: "#8b5cf6" },
    { label: "Soft Skills", keys: ["user-research", "project-management", "self-awareness"], color: "#f59e0b" },
    { label: "Global", keys: ["cross-cultural"], color: "#ec4899" },
  ];

  const categoryScores = categories.map((cat) => {
    const scores = cat.keys.map((k) => result.scores[k] || 0).filter(Boolean);
    const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    return { ...cat, avg: Math.round(avg * 10) / 10 };
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: "white", letterSpacing: "-0.5px" }}>
            Caliber
          </div>
          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.2)" }} />
          <div style={{ fontSize: 16, color: "#64748b" }}>PM Assessment</div>
        </div>

        {/* Main Content */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 64,
            marginTop: 32,
          }}
        >
          {/* Left: Score + Archetype */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {archetype && (
              <div style={{ fontSize: 14, color: "#64748b", textTransform: "uppercase", letterSpacing: "2px", marginBottom: 12 }}>
                PM Archetype
              </div>
            )}
            {archetype && (
              <div style={{ fontSize: 32, fontWeight: 700, color: "white", marginBottom: 16 }}>
                {archetype}
              </div>
            )}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 4 }}>
              <span style={{ fontSize: 80, fontWeight: 800, color: "white", lineHeight: 1 }}>{score}</span>
              <span style={{ fontSize: 28, color: "#64748b", marginBottom: 8 }}>/100</span>
            </div>
            <div
              style={{
                padding: "6px 20px",
                borderRadius: 20,
                background: `${level.color}22`,
                color: level.color,
                fontSize: 18,
                fontWeight: 600,
                marginTop: 12,
              }}
            >
              {level.label}
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 180, background: "rgba(255,255,255,0.1)" }} />

          {/* Right: Category Bars */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {categoryScores.map((cat) => (
              <div key={cat.label} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 90, fontSize: 14, color: "#94a3b8", textAlign: "right" }}>
                  {cat.label}
                </div>
                <div
                  style={{
                    width: 160,
                    height: 10,
                    borderRadius: 5,
                    background: "rgba(255,255,255,0.1)",
                    overflow: "hidden",
                    display: "flex",
                  }}
                >
                  <div
                    style={{
                      width: `${(cat.avg / 5) * 100}%`,
                      height: "100%",
                      borderRadius: 5,
                      background: cat.color,
                    }}
                  />
                </div>
                <span style={{ fontSize: 16, fontWeight: 700, color: "white", width: 40 }}>
                  {cat.avg.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div style={{ fontSize: 16, color: "#475569" }}>
            What&apos;s your PM caliber?
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#3b82f6",
              padding: "4px 12px",
              borderRadius: 12,
              background: "rgba(59, 130, 246, 0.15)",
            }}
          >
            Take the test →
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
