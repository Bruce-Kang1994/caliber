"use client";

import {
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { RadarDataPoint } from "@/lib/types";

interface Props {
  data: RadarDataPoint[];
}

export function AssessmentRadarChart({ data }: Props) {
  return (
    <div className="w-full h-[300px] sm:h-[420px]">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
        <RechartsRadar
          data={data}
          cx="50%"
          cy="50%"
          outerRadius="70%"
        >
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fontSize: 11, fill: "#64748b" }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 5]}
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            tickCount={6}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#2563eb"
            fill="#2563eb"
            fillOpacity={0.2}
            strokeWidth={2}
            animationDuration={800}
          />
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
  );
}
