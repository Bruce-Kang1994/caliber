import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Caliber — PM Capability Assessment";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
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
        {/* Logo */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "white",
            letterSpacing: "-2px",
            marginBottom: 16,
          }}
        >
          Caliber
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: "#94a3b8",
            marginBottom: 48,
          }}
        >
          PM Capability Assessment
        </div>

        {/* Score Preview */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 64,
          }}
        >
          {/* Score */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: 14, color: "#64748b", textTransform: "uppercase", letterSpacing: "2px", marginBottom: 8 }}>
              Caliber Score
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 4 }}>
              <span style={{ fontSize: 72, fontWeight: 800, color: "white" }}>82</span>
              <span style={{ fontSize: 24, color: "#64748b", marginBottom: 12 }}>/100</span>
            </div>
            <div
              style={{
                padding: "4px 16px",
                borderRadius: 20,
                background: "rgba(59, 130, 246, 0.2)",
                color: "#60a5fa",
                fontSize: 16,
                fontWeight: 600,
                marginTop: 8,
              }}
            >
              Advanced
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 120, background: "rgba(255,255,255,0.1)" }} />

          {/* Dimensions */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {[
              { label: "Product Skills", score: "4.2", color: "#3b82f6" },
              { label: "Business Acumen", score: "3.5", color: "#10b981" },
              { label: "AI Expertise", score: "4.6", color: "#8b5cf6" },
              { label: "Soft Skills", score: "3.8", color: "#f59e0b" },
            ].map((d) => (
              <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 120,
                    height: 8,
                    borderRadius: 4,
                    background: "rgba(255,255,255,0.1)",
                    overflow: "hidden",
                    display: "flex",
                  }}
                >
                  <div
                    style={{
                      width: `${(parseFloat(d.score) / 5) * 100}%`,
                      height: "100%",
                      borderRadius: 4,
                      background: d.color,
                    }}
                  />
                </div>
                <span style={{ fontSize: 14, color: "#94a3b8", width: 120 }}>{d.label}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "white" }}>{d.score}</span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 120, background: "rgba(255,255,255,0.1)" }} />

          {/* Archetype */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: 14, color: "#64748b", textTransform: "uppercase", letterSpacing: "2px", marginBottom: 8 }}>
              PM Archetype
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "white" }}>
              The Strategist
            </div>
          </div>
        </div>

        {/* Bottom tagline */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            fontSize: 16,
            color: "#475569",
          }}
        >
          15 Dimensions · 5 Roles · AI-Powered · 5 Minutes
        </div>
      </div>
    ),
    { ...size }
  );
}
