import { TREK_DIFFICULTIES } from "@/constants/trekConstants";
import { TrekDifficulty } from "@/types/trek";

interface Props {
  difficulty: TrekDifficulty;
  size?: "sm" | "md";
}

export default function TrekDifficultyBadge({ difficulty, size = "md" }: Props) {
  const data = TREK_DIFFICULTIES.find((d) => d.value === difficulty);
  if (!data) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold border rounded-full ${data.color} ${
        size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1"
      }`}
    >
      {data.emoji} {data.label}
    </span>
  );
}