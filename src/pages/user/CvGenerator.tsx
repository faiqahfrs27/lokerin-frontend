import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Download, Save } from "lucide-react";
import { useGetCv, useSaveCv, useDownloadCv } from "../../hooks/useCv";
import { useMySubscription } from "../../hooks/useSubscription";
import { cvFormSchema, type CvFormData } from "../../schemas/cvSchema";
import { ExperienceSection } from "../../components/cv/ExperienceSection";
import { EducationSection } from "../../components/cv/EducationSection";
import { SkillsSection } from "../../components/cv/SkillsSection";

function CvGenerator() {
  const navigate = useNavigate();
  const { data: sub, isLoading: subLoading } = useMySubscription();
  const { data: cvData, isLoading: cvLoading } = useGetCv();
  const { mutate: saveCv, isPending: saving } = useSaveCv();
  const { mutate: downloadCv, isPending: downloading } = useDownloadCv();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CvFormData>({
    resolver: zodResolver(cvFormSchema) as any,
    defaultValues: {
      summary: "",
      phone: "",
      portfolioUrl: "",
      experiences: [],
      educations: [],
      additionalSkills: [],
    },
  });

  // Guard: redirect to pricing if not subscriber
  useEffect(() => {
    if (!subLoading && sub?.status !== "active") {
      navigate("/pricing", { replace: true });
    }
  }, [sub, subLoading, navigate]);

  // Populate form with saved CV data
  useEffect(() => {
    if (cvData) reset(cvData);
  }, [cvData, reset]);

  const onSubmit = (data: CvFormData) => saveCv(data);

  if (subLoading || cvLoading) {
    return <div className="dev-state">Loading...</div>;
  }

  return (
    <div className="dashboard-content">
      <Header onDownload={downloadCv} downloading={downloading} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <BasicInfoSection register={register} errors={errors} />
        <ExperienceSection control={control} />
        <EducationSection control={control} />
        <SkillsSection control={control} />
        <SaveButton saving={saving} />
      </form>
    </div>
  );
}

function Header({
  onDownload,
  downloading,
}: {
  onDownload: () => void;
  downloading: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 28,
      }}
    >
      <div>
        <p className="t-kicker">CV Generator</p>
        <h1 className="t-h3" style={{ margin: "8px 0 4px" }}>
          My CV
        </h1>
        <p style={{ color: "var(--fg-3)", fontSize: 14, margin: 0 }}>
          Fill in your details and download your ATS-friendly CV.
        </p>
      </div>
      <button
        className="btn btn-primary"
        onClick={onDownload}
        disabled={downloading}
        type="button"
        style={{ display: "flex", alignItems: "center", gap: 8 }}
      >
        <Download size={14} />
        {downloading ? "Generating..." : "Download CV"}
      </button>
    </div>
  );
}

function BasicInfoSection({
  register,
  errors,
}: {
  register: ReturnType<typeof useForm<CvFormData>>["register"];
  errors: ReturnType<typeof useForm<CvFormData>>["formState"]["errors"];
}) {
  return (
    <div className="card card-pad" style={{ marginBottom: 16 }}>
      <p className="t-kicker" style={{ marginBottom: 16 }}>
        Basic Information
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div className="ff">
          <label className="ff-label">Professional Summary</label>
          <textarea
            {...register("summary")}
            className="ff-input"
            rows={4}
            placeholder="Brief description about yourself..."
          />
        </div>
        <div
          style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }}
        >
          <div className="ff">
            <label className="ff-label">Phone</label>
            <input
              {...register("phone")}
              className="ff-input"
              placeholder="+62812345678"
            />
          </div>
          <div className="ff">
            <label className="ff-label">Portfolio URL</label>
            <input
              {...register("portfolioUrl")}
              className="ff-input"
              placeholder="github.com/username"
            />
            {errors.portfolioUrl && (
              <p
                style={{
                  color: "var(--danger-fg)",
                  fontSize: 12,
                  margin: "4px 0 0",
                }}
              >
                {errors.portfolioUrl.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SaveButton({ saving }: { saving: boolean }) {
  return (
    <button
      className="btn btn-secondary"
      type="submit"
      disabled={saving}
      style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}
    >
      <Save size={14} />
      {saving ? "Saving..." : "Save CV"}
    </button>
  );
}

export default CvGenerator;
