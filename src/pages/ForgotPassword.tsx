import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import { Link } from "react-router";
import FormField from "../components/register/FormField";
import OrangeButton from "../components/register/OrangeButton";
import RegisterLogo from "../components/register/RegisterLogo";
import ThemeToggle from "../components/register/ThemeToggle";
import { useForgotPassword } from "../hooks/useForgotPassword";
import { fadeUp } from "../utils/AnimationStyle";

function SuccessState({ email }: { email: string }) {
  return (
    <div style={fadeUp(0)} className="auth-success">
      <div className="success-ring">
        <div className="success-dot">
          <Mail size={28} strokeWidth={1.75} />
        </div>
      </div>
      <h2 className="t-h3 success-h">Check your email</h2>
      <p className="auth-sub success-sub">
        We sent a password reset link to{" "}
        <strong>{email}</strong>. The link expires in 15 minutes.
      </p>
      <div className="success-actions">
        <Link to="/login" className="btn btn-secondary">
          <ArrowLeft size={14} strokeWidth={2} />
          Back to sign in
        </Link>
      </div>
      <p className="auth-foot">
        Didn't receive the email?{" "}
        <Link to="/forgot-password" className="link strong"
          onClick={() => window.location.reload()}
        >
          Try again
        </Link>
      </p>
    </div>
  );
}

function ForgotPassword() {
  const { form, onSubmit, isPending, isSubmitted } = useForgotPassword();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = form;

  const email = watch("email") ?? "";

  return (
    <div className="auth-page">
      {/* Left — form */}
      <div className="auth-left">
        <header className="auth-top">
          <RegisterLogo />
        </header>

        <div className="auth-body">
          {isSubmitted ? (
            <SuccessState email={email} />
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="auth-form"
            >
              <div style={fadeUp(0)} className="auth-head">
                <h1 className="t-h2 auth-h">Forgot password?</h1>
                <p className="auth-sub">
                  Enter your email and we'll send you a reset link.
                </p>
              </div>

              <FormField
                id="email"
                label="Email"
                type="email"
                placeholder="you@example.com"
                error={errors.email}
                required
                autoComplete="email"
                delay={100}
                registration={register("email")}
              />

              <div style={fadeUp(200)}>
                <OrangeButton
                  type="submit"
                  loading={isPending}
                  disabled={isPending}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    Send reset link <ArrowRight size={14} strokeWidth={2} />
                  </span>
                </OrangeButton>
              </div>

              <p style={fadeUp(250)} className="auth-foot">
                <Link to="/login" className="link" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <ArrowLeft size={13} strokeWidth={2} />
                  Back to sign in
                </Link>
              </p>
            </form>
          )}
        </div>

        <footer className="auth-foot-bar">
          <span>© 2026 Lokerin. Made with ❤️ in Jakarta.</span>
          <ThemeToggle />
        </footer>
      </div>

      {/* Right — decorative */}
      <div className="auth-right">
        <div className="auth-glow" />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 400 }}>
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
              <Mail size={28} strokeWidth={1.75} />
            </div>
          </div>
          <h2
            className="t-h3"
            style={{ marginBottom: 12, letterSpacing: "-0.03em" }}
          >
            Password reset
          </h2>
          <p style={{ fontSize: 15, color: "var(--fg-3)", lineHeight: 1.6 }}>
            We'll send a secure link to your email. The link expires in{" "}
            <strong style={{ color: "var(--fg-2)" }}>15 minutes</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;