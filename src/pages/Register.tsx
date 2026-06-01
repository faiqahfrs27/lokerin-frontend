import { ArrowRight } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router";
import AppMockup from "../components/register/AppMockup";
import FormField from "../components/register/FormField";
import OrangeButton from "../components/register/OrangeButton";
import PasswordStrength from "../components/register/PasswordStrength";
import RegisterLogo from "../components/register/RegisterLogo";
import TermsCheckbox from "../components/register/TermsCheckbox";
import ThemeToggle from "../components/register/ThemeToggle";
import { useRegister } from "../hooks/useRegister";
import { fadeUp } from "../utils/AnimationStyle";

function Register() {
  const navigate = useNavigate();
  const { form, onSubmit, isPending } = useRegister();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const password = watch("password") ?? "";
  const agreeToTerms = watch("agreeToTerms");

  return (
    <div className="auth-page">
      {/* Left — form */}
      <div className="auth-left">
        <header className="auth-top">
          <RegisterLogo />
        </header>

        <div className="auth-body">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="auth-form">
            <div style={fadeUp(0)} className="auth-head">
              <h1 className="t-h2 auth-h">Create your account</h1>
              <p className="auth-sub">Join 5,000+ users on Lokerin.</p>
            </div>

            {/* Role toggle */}
            <div style={fadeUp(50)} className="role-toggle">
              <button type="button" className="role-tab active">
                Job seeker
              </button>
              <button
                type="button"
                className="role-tab"
                onClick={() => navigate("/auth/register")}
              >
                Company
              </button>
            </div>

            <FormField
              id="fullName"
              label="Full name"
              placeholder="John Doe"
              error={errors.fullName}
              required
              autoComplete="name"
              delay={100}
              registration={register("fullName")}
            />

            <FormField
              id="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email}
              required
              autoComplete="email"
              delay={150}
              registration={register("email")}
            />

            <div style={fadeUp(200)}>
              <FormField
                id="password"
                label="Password"
                type="password"
                placeholder="At least 8 characters"
                error={errors.password}
                required
                autoComplete="new-password"
                delay={0}
                registration={register("password")}
              />
              <PasswordStrength password={password} />
            </div>

            <FormField
              id="confirmPassword"
              label="Confirm password"
              type="password"
              placeholder="Repeat password"
              error={errors.confirmPassword}
              required
              autoComplete="new-password"
              delay={250}
              registration={register("confirmPassword")}
            />

            <TermsCheckbox
              checked={agreeToTerms}
              onChange={() => setValue("agreeToTerms", !agreeToTerms, { shouldValidate: true })}
              error={errors.agreeToTerms}
            />

            <div style={fadeUp(350)}>
              <OrangeButton type="submit" loading={isPending} disabled={isPending}>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  Create account <ArrowRight size={14} strokeWidth={2} />
                </span>
              </OrangeButton>
            </div>

            <div style={fadeUp(400)} className="divider">
              <span>or continue with</span>
            </div>

            <div style={fadeUp(450)} className="social-row">
              <button type="button" className="social-btn">
                <FcGoogle size={22} />
              </button>
              <button type="button" className="social-btn">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              <button type="button" className="social-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </button>
            </div>

            <p style={fadeUp(500)} className="auth-foot">
              Already have an account?{" "}
              <Link to="/login" className="link strong">Sign in</Link>
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
              {[1,2,3,4,5].map((i) => (
                <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="#F97316">
                  <polygon points="12 2 15 9 22 9 17 14 19 22 12 17 5 22 7 14 2 9 9 9 12 2" />
                </svg>
              ))}
            </div>
            <p className="t-quote">"Dapet kerjaan di Tokopedia lewat Lokerin, 11 hari dari apply ke offer. Tanpa drama."</p>
            <div className="t-attrib">Rina A. · Product Designer · hired May 2025</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;