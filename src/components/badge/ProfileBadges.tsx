import { Link } from "react-router";
import { useMyBadges } from "../../hooks/badge/useMyBadges";
import BadgeChip from "./BadgeChip";

function ProfileBadges() {
  const { data: badges, isLoading, error } = useMyBadges();

  if (isLoading)
    return <p style={{ color: "var(--fg-3)", fontSize: 13 }}>Loading badges...</p>;
  if (error)
    return <p style={{ color: "var(--fg-3)", fontSize: 13 }}>Failed to load badges.</p>;
  if (!badges || badges.length === 0) return <EmptyBadges />;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      {badges.map((b) => (
        <BadgeChip key={b.id} badge={b} />
      ))}
    </div>
  );
}

function EmptyBadges() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "32px 20px",
        border: "1.5px dashed var(--border)",
        borderRadius: "var(--radius-md)",
        color: "var(--fg-3)",
        fontSize: 13,
      }}
    >
      <p style={{ margin: "0 0 8px" }}>No verified skills yet.</p>
      <Link
        to="/dashboard/assessments"
        style={{ color: "var(--brand)", textDecoration: "none", fontSize: 13 }}
      >
        Take an assessment → to earn your first badge.
      </Link>
    </div>
  );
}

export default ProfileBadges;