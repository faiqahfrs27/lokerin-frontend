import { ArrowRight, CheckCircle, Loader, XCircle } from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import RegisterLogo from "../components/register/RegisterLogo";
import ThemeToggle from "../components/register/ThemeToggle";
import { useVerifyEmail } from "../hooks/useVerifyEmail";
import { fadeUp } from "../utils/AnimationStyle";

function LoadingState() {
  return (
    <div style={fadeUp(0)} className="auth-success">
      <div className="success-ring">
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "var(--surface-2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loader
            size={28}
            strokeWidth={1.75}
            style={{
              color: "var(--brand)",
              animation: "spin 1s linear infinite",
            }}
          />
        </div>
      </div>
      <h2 className="t-h3 success-h">Verifying your email...</h2>
      <p className="auth-sub success-sub">Please wait a moment.</p>
    </div>
  );
}

function SuccessState({ email }: { email?: string }) {
  return (
    <div style={fadeUp(0)} className="auth-success">
      <div className="success-ring">
        <div className="success-dot">
          <CheckCircle size={28} strokeWidth={1.75} />
        </div>
      </div>
      <h2 className="t-h3 success-h">Email verified!</h2>
      <p className="auth-sub success-sub">
        {email && (
          <>
            <strong>{email}</strong> has been verified.{" "}
          </>
        )}
        You can now sign in to your account.
        Redirecting in 2 seconds...
      </p>
      <div className="success-actions">
        <Link to="/login" className="btn btn-primary">
          Sign in now <ArrowRight size={14} strokeWidth={2} />
        </Link>
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  const isExpired = message.toLowerCase().includes("expired");
  const isUsed = message.toLowerCase().includes("already been used");
  const isAlreadyVerified = message.toLowerCase().includes("already verified");

  return (
    <div style={fadeUp(0)} className="auth-success">
      <div className="success-ring" style={{ background: "var(--danger-bg)" }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "var(--danger-500)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          <XCircle size={28} strokeWidth={1.75} />
        </div>
      </div>
      <h2 className="t-h3 success-h">
        {isAlreadyVerified ? "Already verified" : "Verification failed"}
      </h2>
      <p className="auth-sub success-sub">{message}</p>
      <div className="success-actions">
        {isAlreadyVerified ? (
          <Link to="/login" className="btn btn-primary">
            Sign in <ArrowRight size={14} strokeWidth={2} />
          </Link>
        ) : (isExpired || isUsed) ? (
          <Link to="/resend-verification" className="btn btn-primary">
            Request new link <ArrowRight size={14} strokeWidth={2} />
          </Link>
        ) : (
          <Link to="/login" className="btn btn-secondary">
            Back to sign in
          </Link>
        )}
      </div>
    </div>
  );
}

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const navigate = useNavigate();
  const { isLoading, isSuccess, isError, errorMessage, data } =
    useVerifyEmail(token);

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-left">
          <header className="auth-top">
            <RegisterLogo />
          </header>
          <div className="auth-body">
            <ErrorState message="Invalid verification link. Please check your email and try again." />
          </div>
          <footer className="auth-foot-bar">
            <span>© 2026 Lokerin. Made with ❤️ in Jakarta.</span>
            <ThemeToggle />
          </footer>
        </div>
        <div className="auth-right">
          <div className="auth-glow" />
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <header className="auth-top">
          <RegisterLogo />
        </header>

        <div className="auth-body">
          {isLoading && <LoadingState />}
          {isSuccess && <SuccessState email={data?.data?.email} />}
          {isError && <ErrorState message={errorMessage} />}
        </div>

        <footer className="auth-foot-bar">
          <span>© 2026 Lokerin. Made with ❤️ in Jakarta.</span>
          <ThemeToggle />
        </footer>
      </div>

      <div className="auth-right">
        <div className="auth-glow" />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            maxWidth: 400,
          }}
        >
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: "50%",
              background: "var(--brand-soft)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "var(--brand)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "var(--shadow-orange)",
                color: "white",
              }}
            >
              <CheckCircle size={28} strokeWidth={1.75} />
            </div>
          </div>
          <h2
            className="t-h3"
            style={{ marginBottom: 12, letterSpacing: "-0.03em" }}
          >
            One click away
          </h2>
          <p style={{ fontSize: 15, color: "var(--fg-3)", lineHeight: 1.6 }}>
            Verifying your email unlocks job applications, skill assessments,
            and everything Lokerin has to offer.
          </p>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;