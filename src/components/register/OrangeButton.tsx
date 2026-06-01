import type { ButtonHTMLAttributes, ReactNode } from "react";

interface OrangeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
  variant?: "primary" | "ghost";
}

function OrangeButton({
  children,
  loading = false,
  variant = "primary",
  disabled,
  ...props
}: OrangeButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <button
      className={`btn ${isPrimary ? "btn-primary auth-cta" : "btn-secondary auth-cta"}`}
      disabled={disabled || loading}
      style={{ width: "100%", opacity: disabled || loading ? 0.6 : 1 }}
      {...props}
    >
      {loading ? (
        <span
          style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            border: `2px solid ${isPrimary ? "rgba(255,255,255,0.3)" : "var(--border-2)"}`,
            borderTopColor: isPrimary ? "#fff" : "var(--fg-2)",
            animation: "spin 0.6s linear infinite",
            display: "inline-block",
          }}
        />
      ) : (
        children
      )}
    </button>
  );
}

export default OrangeButton;