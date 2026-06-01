const STRENGTH_COLORS = [
  "",
  "var(--danger-500)",
  "var(--warning-500)",
  "var(--brand-orange-400)",
  "var(--success-500)",
];
const STRENGTH_LABELS = ["", "Lemah", "Okay", "Bagus", "Kuat"];

function getStrength(p: string) {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
}

interface PasswordStrengthProps {
  password: string;
}

function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password.length) return null;
  const strength = getStrength(password);

  return (
    <div className="strength" style={{ marginTop: 8 }}>
      <div className="str-bars">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="str-bar"
            style={{
              background: i <= strength ? STRENGTH_COLORS[strength] : "var(--surface-3)",
            }}
          />
        ))}
      </div>
      {strength > 0 && (
        <span className="str-lbl" style={{ color: STRENGTH_COLORS[strength] }}>
          {STRENGTH_LABELS[strength]}
        </span>
      )}
    </div>
  );
}

export default PasswordStrength;