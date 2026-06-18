import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <p style={{ fontSize: 64, margin: "0 0 8px", lineHeight: 1 }}>404</p>
      <h1
        style={{
          margin: "0 0 12px",
          fontSize: "var(--fs-2xl)",
          fontWeight: "var(--fw-bold)",
          color: "var(--fg)",
        }}
      >
        Page not found
      </h1>
      <p
        style={{
          margin: "0 0 32px",
          fontSize: "var(--fs-base)",
          color: "var(--fg-3)",
          maxWidth: 360,
        }}
      >
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="btn btn-primary"
        style={{
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <ArrowLeft size={16} />
        Back to home
      </Link>
    </div>
  );
}