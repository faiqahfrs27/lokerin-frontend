import { useGoogleAuth } from "../hooks/useGoogleAuth";
import { ArrowRight } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Link, useLocation } from "react-router";
import AppMockup from "../components/register/AppMockup";
import FormField from "../components/register/FormField";
import OrangeButton from "../components/register/OrangeButton";
import RegisterLogo from "../components/register/RegisterLogo";
import ThemeToggle from "../components/register/ThemeToggle";
import { useLogin } from "../hooks/useLogin";
import { fadeUp } from "../utils/AnimationStyle";

function Login() {
  const { form, onSubmit, isPending } = useLogin();
  const { handleGoogleLogin, isPending: isGooglePending } = useGoogleAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;
  const location = useLocation();
  const isUnauthorized = location.state?.unauthorized;

  return (
    <div className="auth-page">
      {/* Left — form */}
      <div className="auth-left">
        <header className="auth-top">
          <RegisterLogo />
        </header>

        <div className="auth-body">
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="auth-form"
          >
            {isUnauthorized && (
              <div
                style={{
                  padding: "10px 14px",
                  background: "var(--danger-bg)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "var(--fs-sm)",
                  color: "var(--danger-fg)",
                  fontWeight: "var(--fw-medium)",
                }}
              >
                🔒 Please sign in to access this page.
              </div>
            )}

            <div style={fadeUp(0)} className="auth-head">
              <h1 className="t-h2 auth-h">Welcome Back</h1>
              <p className="auth-sub">Sign in to your Lokerin account.</p>
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

            <FormField
              id="password"
              label="Password"
              type="password"
              placeholder="Your password"
              error={errors.password}
              required
              autoComplete="current-password"
              delay={150}
              registration={register("password")}
            />

            <div style={fadeUp(200)} className="row-between">
              <span />
              <Link
                to="/forgot-password"
                className="link"
                style={{ fontSize: 13 }}
              >
                Forgot password?
              </Link>
            </div>

            <div style={fadeUp(250)}>
              <OrangeButton
                type="submit"
                loading={isPending}
                disabled={isPending}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  Sign in <ArrowRight size={14} strokeWidth={2} />
                </span>
              </OrangeButton>
            </div>

            <div style={fadeUp(300)} className="divider">
              <span>or continue with</span>
            </div>

            <div style={fadeUp(350)} className="social-row">
              <button
                type="button"
                className="social-btn"
                onClick={() => handleGoogleLogin()}
                disabled={isGooglePending || isPending}
              >
                <FcGoogle size={22} />
              </button>
              <button type="button" className="social-btn">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
              <button type="button" className="social-btn">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </button>
            </div>

            <p style={fadeUp(400)} className="auth-foot">
              Don't have an account?{" "}
              <Link to="/register" className="link strong">
                Sign up
              </Link>
            </p>

            <p style={fadeUp(450)} className="auth-foot">
              Are you a company?{" "}
              <Link to="/register/company" className="link strong">
                Register here
              </Link>
            </p>
          </form>
        </div>

        <footer className="auth-foot-bar">
          <span>© 2026 Lokerin. Made with ❤️ in Jakarta.</span>
          <ThemeToggle />
        </footer>
      </div>

      {/* Right — mockup */}
      <div className="auth-right">
        <div className="auth-glow" />
        <div className="auth-mockup-wrap">
          <AppMockup />
        </div>
        <div className="testimonial">
          <div className="t-avatar">RA</div>
          <div>
            <div className="t-stars">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg
                  key={i}
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="#F97316"
                >
                  <polygon points="12 2 15 9 22 9 17 14 19 22 12 17 5 22 7 14 2 9 9 9 12 2" />
                </svg>
              ))}
            </div>
            <p className="t-quote">
              "Dapet kerjaan di Tokopedia lewat Lokerin, 11 hari dari apply ke
              offer. Tanpa drama."
            </p>
            <div className="t-attrib">
              Rina A. · Product Designer · hired May 2025
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
