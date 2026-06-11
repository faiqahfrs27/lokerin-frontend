import {
  Camera,
  KeyRound,
  Mail,
  Save,
  User,
  BadgeCheck,
  FileText,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../stores/useAuth";
import { useUpdateEmail } from "../hooks/profile/useUpdateEmail";
import { useUpdatePassword } from "../hooks/profile/useUpdatePassword";
import { useUpdatePhoto } from "../hooks/profile/useUpdatePhoto";
import { useUpdateProfile } from "../hooks/profile/useUpdateProfile";
import ProfileBadges from "../components/badge/ProfileBadges";
import { CvGeneratorSection } from "../components/profile/CvGeneratorSection";


function getInitials(name?: string | null) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ─── Photo Upload ──────────────────────────────────────────

function PhotoSection() {
  const user = useAuth((s) => s.user);
  const { mutate: uploadPhoto, isPending } = useUpdatePhoto();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadPhoto(file);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        marginBottom: 32,
      }}
    >
      <div style={{ position: "relative" }}>
        {user?.profile?.photoUrl ? (
          <img
            src={user.profile.photoUrl}
            alt="Profile"
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#F97316,#EA580C)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 24,
            }}
          >
            {getInitials(user?.profile?.fullName)}
          </div>
        )}
        <button
          onClick={() => fileRef.current?.click()}
          disabled={isPending}
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: "var(--brand)",
            border: "2px solid var(--bg)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <Camera size={13} />
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".jpg,.jpeg,.png"
          style={{ display: "none" }}
          onChange={handleFile}
        />
      </div>
      <div>
        <p
          style={{
            margin: "0 0 4px",
            fontWeight: "var(--fw-semibold)",
            color: "var(--fg)",
          }}
        >
          {user?.profile?.fullName ?? "—"}
        </p>
        <p
          style={{ margin: 0, fontSize: "var(--fs-xs)", color: "var(--fg-3)" }}
        >
          JPG, JPEG, PNG · Max 1MB
        </p>
      </div>
    </div>
  );
}

// ─── Personal Info ─────────────────────────────────────────

function PersonalInfoSection() {
  const user = useAuth((s) => s.user);
  const { mutate, isPending } = useUpdateProfile();

  const [form, setForm] = useState({
    fullName: user?.profile?.fullName ?? "",
    birthDate: user?.profile?.birthDate?.split("T")[0] ?? "",
    gender: user?.profile?.gender ?? "",
    education: user?.profile?.education ?? "",
    address: user?.profile?.address ?? "",
  });

  useEffect(() => {
    setForm({
      fullName: user?.profile?.fullName ?? "",
      birthDate: user?.profile?.birthDate?.split("T")[0] ?? "",
      gender: user?.profile?.gender ?? "",
      education: user?.profile?.education ?? "",
      address: user?.profile?.address ?? "",
    });
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({
      fullName: form.fullName,
      birthDate: form.birthDate || undefined,
      gender: form.gender as "male" | "female" | undefined,
      education: form.education,
      address: form.address,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: 16 }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="ff">
          <label className="ff-label">
            Full name <span style={{ color: "var(--danger-500)" }}>*</span>
          </label>
          <div className="ff-input">
            <input
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="John Doe"
            />
          </div>
        </div>
        <div className="ff">
          <label className="ff-label">Date of birth</label>
          <div className="ff-input">
            <input
              type="date"
              value={form.birthDate}
              onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="ff">
          <label className="ff-label">Gender</label>
          <div className="ff-input">
            <select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                font: "inherit",
                color: "var(--fg)",
              }}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>
        <div className="ff">
          <label className="ff-label">Last education</label>
          <div className="ff-input">
            <input
              value={form.education}
              onChange={(e) => setForm({ ...form, education: e.target.value })}
              placeholder="S1 Teknik Informatika"
            />
          </div>
        </div>
      </div>

      <div className="ff">
        <label className="ff-label">Address</label>
        <div className="ff-input">
          <input
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="Jl. Sudirman No. 1, Jakarta"
          />
        </div>
      </div>

      <div>
        <button type="submit" className="btn btn-primary" disabled={isPending}>
          <Save size={14} /> {isPending ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}

// ─── Update Password ───────────────────────────────────────

function PasswordSection() {
  const { form, onSubmit, isPending } = useUpdatePassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;
  const user = useAuth((s) => s.user);

  if (user?.provider !== "CREDENTIALS") {
    return (
      <p style={{ fontSize: "var(--fs-sm)", color: "var(--fg-3)" }}>
        Password cannot be changed for Google accounts.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: "flex", flexDirection: "column", gap: 16 }}
    >
      <div className="ff">
        <label className="ff-label">Current password</label>
        <div className={`ff-input${errors.currentPassword ? " is-error" : ""}`}>
          <input
            type="password"
            placeholder="••••••••"
            {...register("currentPassword")}
          />
        </div>
        {errors.currentPassword && (
          <p className="ff-err">{errors.currentPassword.message}</p>
        )}
      </div>
      <div className="ff">
        <label className="ff-label">New password</label>
        <div className={`ff-input${errors.newPassword ? " is-error" : ""}`}>
          <input
            type="password"
            placeholder="At least 8 characters"
            {...register("newPassword")}
          />
        </div>
        {errors.newPassword && (
          <p className="ff-err">{errors.newPassword.message}</p>
        )}
      </div>
      <div className="ff">
        <label className="ff-label">Confirm new password</label>
        <div className={`ff-input${errors.confirmPassword ? " is-error" : ""}`}>
          <input
            type="password"
            placeholder="Repeat new password"
            {...register("confirmPassword")}
          />
        </div>
        {errors.confirmPassword && (
          <p className="ff-err">{errors.confirmPassword.message}</p>
        )}
      </div>
      <div>
        <button type="submit" className="btn btn-primary" disabled={isPending}>
          <KeyRound size={14} /> {isPending ? "Updating..." : "Update password"}
        </button>
      </div>
    </form>
  );
}

// ─── Update Email ──────────────────────────────────────────

function EmailSection() {
  const { form, onSubmit, isPending } = useUpdateEmail();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;
  const user = useAuth((s) => s.user);

  if (user?.provider !== "CREDENTIALS") {
    return (
      <p style={{ fontSize: "var(--fs-sm)", color: "var(--fg-3)" }}>
        Email cannot be changed for Google accounts.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: "flex", flexDirection: "column", gap: 16 }}
    >
      <div className="ff">
        <label className="ff-label">Current email</label>
        <div className="ff-input" style={{ opacity: 0.6 }}>
          <input value={user?.email ?? ""} disabled />
        </div>
      </div>
      <div className="ff">
        <label className="ff-label">New email</label>
        <div className={`ff-input${errors.newEmail ? " is-error" : ""}`}>
          <input
            type="email"
            placeholder="new@email.com"
            {...register("newEmail")}
          />
        </div>
        {errors.newEmail && <p className="ff-err">{errors.newEmail.message}</p>}
      </div>
      <div className="ff">
        <label className="ff-label">Confirm with password</label>
        <div className={`ff-input${errors.password ? " is-error" : ""}`}>
          <input
            type="password"
            placeholder="Your password"
            {...register("password")}
          />
        </div>
        {errors.password && <p className="ff-err">{errors.password.message}</p>}
      </div>
      <p style={{ fontSize: "var(--fs-xs)", color: "var(--fg-3)", margin: 0 }}>
        ⚠️ You will be logged out and need to verify your new email.
      </p>
      <div>
        <button type="submit" className="btn btn-primary" disabled={isPending}>
          <Mail size={14} /> {isPending ? "Updating..." : "Update email"}
        </button>
      </div>
    </form>
  );
}

// ─── Section Card ──────────────────────────────────────────

function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="card card-pad" style={{ marginBottom: 24 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 24,
          paddingBottom: 16,
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "var(--radius-md)",
            background: "var(--brand-soft)",
            color: "var(--brand-fg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={16} />
        </div>
        <h2
          style={{
            margin: 0,
            fontSize: "var(--fs-base)",
            fontWeight: "var(--fw-semibold)",
            color: "var(--fg)",
          }}
        >
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

// ─── Profile Page ──────────────────────────────────────────

function ProfilePage() {
  return (
    <div className="dashboard-content">
      <div style={{ marginBottom: 32 }}>
        <p className="t-kicker">Account</p>
        <h1 className="t-h3" style={{ margin: "8px 0 4px" }}>
          My Profile
        </h1>
        <p style={{ color: "var(--fg-3)", fontSize: "var(--fs-sm)" }}>
          Manage your personal information and account settings.
        </p>
      </div>

      <SectionCard title="Profile photo" icon={Camera}>
        <PhotoSection />
      </SectionCard>

      <SectionCard title="Verified Skills" icon={BadgeCheck}>
        <ProfileBadges />
      </SectionCard>

      <SectionCard title="CV Generator" icon={FileText}>
        <CvGeneratorSection />
      </SectionCard>

      <SectionCard title="Personal information" icon={User}>
        <PersonalInfoSection />
      </SectionCard>

      <SectionCard title="Change password" icon={KeyRound}>
        <PasswordSection />
      </SectionCard>

      <SectionCard title="Change email" icon={Mail}>
        <EmailSection />
      </SectionCard>
    </div>
  );
}

export default ProfilePage;
