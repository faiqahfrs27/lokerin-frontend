import { Loader2 } from "lucide-react";

interface SpinnerProps {
  size?: number;
  text?: string;
  fullPage?: boolean;
}

function Spinner({ size = 24, text, fullPage = false }: SpinnerProps) {
  const containerStyle = fullPage
    ? {
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        color: "var(--fg-3)",
      }
    : {
        padding: 40,
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        color: "var(--fg-3)",
      };

  return (
    <div style={containerStyle}>
      <Loader2 size={size} className="spin" />
      {text && <span style={{ fontSize: 13 }}>{text}</span>}
    </div>
  );
}

export default Spinner;