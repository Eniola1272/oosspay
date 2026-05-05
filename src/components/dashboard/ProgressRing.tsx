"use client";

import { useEffect, useState } from "react";

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

function getColor(pct: number) {
  if (pct >= 100) return "#F1C40F";
  if (pct >= 67) return "#27AE60";
  if (pct >= 34) return "#F39C12";
  return "#E74C3C";
}

export function ProgressRing({ percentage, size = 80, strokeWidth = 8, label }: ProgressRingProps) {
  const [displayed, setDisplayed] = useState(0);
  const clamped = Math.min(Math.max(percentage, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayed / 100) * circumference;
  const color = getColor(clamped);

  useEffect(() => {
    const timeout = setTimeout(() => setDisplayed(clamped), 50);
    return () => clearTimeout(timeout);
  }, [clamped]);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E0E0E0"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s ease, stroke 0.3s ease" }}
        />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center text-center leading-tight">
        <span className="font-bold text-[#1A1A2E]" style={{ fontSize: size * 0.2 }}>
          {clamped >= 100 ? "✓" : `${Math.round(clamped)}%`}
        </span>
        {label && (
          <span className="text-[#666666] mt-0.5" style={{ fontSize: size * 0.13 }}>
            {label}
          </span>
        )}
      </span>
    </div>
  );
}
