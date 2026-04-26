"use client";
import { scoreColor, scoreLabel } from "@/lib/nutritionScore";

interface Props { score: number; size?: number; }

export function NutritionScore({ score, size = 100 }: Props) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 10) * circumference;
  const color = scoreColor(score);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="currentColor" strokeWidth={8} className="text-muted" />
          <circle
            cx={size/2} cy={size/2} r={radius}
            fill="none" stroke={color} strokeWidth={8}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="nutrition-ring"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold" style={{ color }}>{score.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">/ 10</span>
        </div>
      </div>
      <span className="text-xs font-medium" style={{ color }}>{scoreLabel(score)}</span>
      <span className="text-xs text-muted-foreground">Aproveitamento Nutricional</span>
    </div>
  );
}
