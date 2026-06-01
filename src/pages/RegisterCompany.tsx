import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router";
import AppMockup from "../components/register/AppMockup";
import ThemeToggle from "../components/register/ThemeToggle";
import FormField from "../components/register/FormField";
import OrangeButton from "../components/register/OrangeButton";
import PasswordStrength from "../components/register/PasswordStrength";
import RegisterLogo from "../components/register/RegisterLogo";
import TermsCheckbox from "../components/register/TermsCheckbox";
import { useRegisterCompany } from "../hooks/useRegisterCompany";
import { fadeUp } from "../utils/AnimationStyle";

function RegisterCompany() {
  const navigate = useNavigate();
  const { form, onSubmit, isPending } = useRegisterCompany();
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
              <p className="auth-sub">Post jobs and find the best talent.</p>
            </div>

            {/* Role toggle */}
            <div style={fadeUp(50)} className="role-toggle">
              <button
                type="button"
                className="role-tab"
                onClick={() => navigate("/auth/register")}
              >
                Job seeker
              </button>
              <button type="button" className="role-tab active">
                Company
              </button>
            </div>

            <FormField
              id="name"
              label="Company name"
              placeholder="PT. Contoh Indonesia"
              error={errors.name}
              required
              autoComplete="organization"
              delay={100}
              registration={register("name")}
            />

            <FormField
              id="email"
              label="Email"
              type="email"
              placeholder="hrd@company.com"
              error={errors.email}
              required
              autoComplete="email"
              delay={150}
              registration={register("email")}
            />

            <FormField
              id="phone"
              label="Phone"
              type="tel"
              placeholder="081234567890"
              error={errors.phone}
              required
              autoComplete="tel"
              delay={200}
              registration={register("phone")}
            />

            <FormField
              id="city"
              label="City"
              placeholder="Jakarta"
              error={errors.city}
              autoComplete="address-level2"
              delay={250}
              registration={register("city")}
            />

            <div style={fadeUp(300)}>
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
              delay={350}
              registration={register("confirmPassword")}
            />

            <TermsCheckbox
              checked={agreeToTerms}
              onChange={() => setValue("agreeToTerms", !agreeToTerms, { shouldValidate: true })}
              error={errors.agreeToTerms}
            />

            <div style={fadeUp(450)}>
              <OrangeButton type="submit" loading={isPending} disabled={isPending}>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  Create account <ArrowRight size={14} strokeWidth={2} />
                </span>
              </OrangeButton>
            </div>

            <p style={fadeUp(500)} className="auth-foot">
              Already have an account?{" "}
              <Link to="/login" className="link strong">Sign in</Link>
            </p>
          </form>
        </div>

        <footer className="auth-foot-bar">
          <span>© 2025 Lokerin. Made with ❤️ in Jakarta.</span>
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

export default RegisterCompany;