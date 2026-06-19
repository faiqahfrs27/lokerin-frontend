import { ArrowRight, CheckCircle } from "lucide-react";
import { Link, useParams } from "react-router";
import FormField from "../components/register/FormField";
import OrangeButton from "../components/register/OrangeButton";
import PasswordStrength from "../components/register/PasswordStrength";
import RegisterLogo from "../components/register/RegisterLogo";
import ThemeToggle from "../components/register/ThemeToggle";
import { useResetPassword } from "../hooks/useResetPassword";
import { fadeUp } from "../utils/AnimationStyle";

function SuccessState() {
  return (
    <div style={fadeUp(0)} className="auth-success">
      <div className="success-ring">
        <div className="success-dot">
          <CheckCircle size={28} strokeWidth={1.75} />
        </div>
      </div>
      <h2 className="t-h3 success-h">Password updated!</h2>
      <p className="auth-sub success-sub">
        Your password has been reset successfully.
        Redirecting you to sign in...
      </p>
      <div className="success-actions">
        <Link to="/login" className="btn btn-primary">
          Sign in now <ArrowRight size={14} strokeWidth={2} />
        </Link>
      </div>
    </div>
  );
}

function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const { form, onSubmit, isPending, isSuccess } = useResetPassword(token ?? "");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = form;

  const newPassword = watch("newPassword") ?? "";

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-left">
          <div className="auth-body">
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "var(--danger-fg)", fontSize: 15 }}>
                Invalid reset link. Please request a new one.
              </p>
              <Link to="/forgot-password" className="link strong" style={{ marginTop: 12, display: "inline-block" }}>
                Request new link
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      {/* Left — form */}
      <div className="auth-left">
        <header className="auth-top">
          <RegisterLogo />
        </header>

        <div className="auth-body">
          {isSuccess ? (
            <SuccessState />
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="auth-form"
            >
              <div style={fadeUp(0)} className="auth-head">
                <h1 className="t-h2 auth-h">Set new password</h1>
                <p className="auth-sub">
                  Choose a strong password for your account.
                </p>
              </div>

              <div style={fadeUp(100)}>
                <FormField
                  id="newPassword"
                  label="New password"
                  type="password"
                  placeholder="At least 8 characters"
                  error={errors.newPassword}
                  required
                  autoComplete="new-password"
                  delay={0}
                  registration={register("newPassword")}
                />
                <PasswordStrength password={newPassword} />
              </div>

              <FormField
                id="confirmNewPassword"
                label="Confirm new password"
                type="password"
                placeholder="Repeat new password"
                error={errors.confirmNewPassword}
                required
                autoComplete="new-password"
                delay={150}
                registration={register("confirmNewPassword")}
              />

              <div style={fadeUp(250)}>
                <OrangeButton
                  type="submit"
                  loading={isPending}
                  disabled={isPending}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    Update password <ArrowRight size={14} strokeWidth={2} />
                  </span>
                </OrangeButton>
              </div>

              <p style={fadeUp(300)} className="auth-foot">
                Remember your password?{" "}
                <Link to="/login" className="link strong">Sign in</Link>
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
              <CheckCircle size={28} strokeWidth={1.75} />
            </div>
          </div>
          <h2 className="t-h3" style={{ marginBottom: 12, letterSpacing: "-0.03em" }}>
            Almost there
          </h2>
          <p style={{ fontSize: 15, color: "var(--fg-3)", lineHeight: 1.6 }}>
            Pick a password that's at least{" "}
            <strong style={{ color: "var(--fg-2)" }}>8 characters</strong>,
            includes an uppercase letter and a number.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;