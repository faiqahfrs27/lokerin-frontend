import { FileUp, X } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useApply } from "../../hooks/jobs/useApply";
import { useUploadCv } from "../../hooks/jobs/useUploadCV";

interface ApplyModalProps {
  jobId: string;
  jobTitle: string;
  hasTest: boolean;
  onClose: () => void;
}

function ApplyModal({ jobId, jobTitle, hasTest, onClose }: ApplyModalProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [expectedSalary, setExpectedSalary] = useState("");
  const [step, setStep] = useState<"form" | "success">("form");

  const { mutateAsync: uploadCv, isPending: isUploading } = useUploadCv();
  const { mutateAsync: apply, isPending: isApplying } = useApply();

  const isPending = isUploading || isApplying;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("CV size must be less than 5MB.");
      return;
    }
    setCvFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvFile) { toast.error("Please upload your CV."); return; }

    const { cvUrl } = await uploadCv(cvFile);
    await apply({
      jobId,
      cvUrl,
      expectedSalary: expectedSalary ? Number(expectedSalary) : undefined,
    });
    setStep("success");
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "var(--overlay)", backdropFilter: "blur(2px)" }}>
      <div className="card" style={{ width: "100%", maxWidth: 480, overflow: "hidden" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
          <div>
            <p className="kicker" style={{ margin: 0 }}>Apply</p>
            <h2 style={{ margin: "4px 0 0", fontSize: "var(--fs-lg)", fontWeight: "var(--fw-bold)" }}>{jobTitle}</h2>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-icon"><X size={18} /></button>
        </div>

        {step === "success" ? (
          <div style={{ padding: "40px 24px", textAlign: "center" }}>
            <p style={{ fontSize: 48, margin: "0 0 16px" }}>🎉</p>
            <h3 style={{ margin: "0 0 8px" }}>Application submitted!</h3>
            <p style={{ color: "var(--fg-3)", marginBottom: 24 }}>You can track your application status in your dashboard.</p>
            <button className="btn btn-primary" onClick={onClose}>Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
            {hasTest && (
              <div style={{ padding: "12px 16px", background: "var(--warning-bg)", borderRadius: "var(--radius-md)", fontSize: "var(--fs-sm)", color: "var(--warning-fg)" }}>
                ⚠️ This job requires a pre-selection test. Make sure you've completed it before applying.
              </div>
            )}

            {/* CV Upload */}
            <div className="ff">
              <label className="ff-label">Upload CV <span style={{ color: "var(--danger-500)" }}>*</span></label>
              <div
                onClick={() => fileRef.current?.click()}
                style={{ border: "2px dashed var(--border-2)", borderRadius: "var(--radius-md)", padding: "24px", textAlign: "center", cursor: "pointer", transition: "all 200ms", background: cvFile ? "var(--brand-soft)" : "var(--surface)" }}
              >
                <FileUp size={24} style={{ color: cvFile ? "var(--brand-fg)" : "var(--fg-3)", margin: "0 auto 8px" }} />
                {cvFile ? (
                  <p style={{ margin: 0, fontSize: "var(--fs-sm)", color: "var(--brand-fg)", fontWeight: "var(--fw-semibold)" }}>{cvFile.name}</p>
                ) : (
                  <>
                    <p style={{ margin: "0 0 4px", fontSize: "var(--fs-sm)", fontWeight: "var(--fw-medium)" }}>Click to upload CV</p>
                    <p style={{ margin: 0, fontSize: "var(--fs-xs)", color: "var(--fg-3)" }}>PDF only · Max 5MB</p>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept=".pdf" style={{ display: "none" }} onChange={handleFileChange} />
            </div>

            {/* Expected Salary */}
            <div className="ff">
              <label className="ff-label">Expected salary <span style={{ color: "var(--fg-3)", fontWeight: 400 }}>(optional)</span></label>
              <div className="ff-input">
                <span style={{ color: "var(--fg-3)", fontSize: "var(--fs-sm)", flexShrink: 0 }}>Rp</span>
                <input
                  type="number"
                  placeholder="e.g. 8000000"
                  value={expectedSalary}
                  onChange={(e) => setExpectedSalary(e.target.value)}
                  min={0}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isPending} style={{ flex: 1 }}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isPending} style={{ flex: 2 }}>
                {isPending ? "Submitting..." : "Submit application"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ApplyModal;