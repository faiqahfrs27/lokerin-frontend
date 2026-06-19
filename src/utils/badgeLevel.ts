export interface LevelInfo {
  label: string;
  iconBg: string;
  glow: string;
}

const LEVELS = {
  gold: {
    label: "Gold",
    iconBg: "linear-gradient(135deg,#F97316,#C2410C)",
    glow: "rgba(194,65,12,.5)",
  },
  silver: {
    label: "Silver",
    iconBg: "linear-gradient(135deg,#FB923C,#F97316)",
    glow: "rgba(249,115,22,.4)",
  },
  bronze: {
    label: "Bronze",
    iconBg: "linear-gradient(135deg,#FDBA74,#FB923C)",
    glow: "rgba(253,186,116,.35)",
  },
};

export function getBadgeLevel(score: number): LevelInfo {
  if (score >= 95) return LEVELS.gold;
  if (score >= 85) return LEVELS.silver;
  return LEVELS.bronze;
}