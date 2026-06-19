import { Medal } from "lucide-react";
import { getBadgeLevel } from "../../utils/badgeLevel";
import type { MyBadge } from "../../types/badge";

function BadgeChip({ badge }: { badge: MyBadge }) {
  const score = badge.result.score ?? 0;
  const lvl = getBadgeLevel(score);

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 16px 8px 8px",
        borderRadius: "var(--radius-pill)",
        background: "var(--brand-soft)",
      }}
    >
      <IconCircle iconBg={lvl.iconBg} glow={lvl.glow} />
      <span style={{ fontSize: 14, fontWeight: 700, color: "var(--brand-fg)" }}>
        {badge.assessment.title}
      </span>
      <LevelPill label={lvl.label} iconBg={lvl.iconBg} />
    </div>
  );
}

function IconCircle({ iconBg, glow }: { iconBg: string; glow: string }) {
  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: iconBg,
        boxShadow: `0 3px 12px ${glow}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "none",
      }}
    >
      <Medal size={20} color="#fff" />
    </div>
  );
}

function LevelPill({ label, iconBg }: { label: string; iconBg: string }) {
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.02em",
        padding: "3px 9px",
        borderRadius: "var(--radius-pill)",
        background: iconBg,
        color: "#fff",
      }}
    >
      {label}
    </span>
  );
}

export default BadgeChip;