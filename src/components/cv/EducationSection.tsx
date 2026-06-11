import { useFieldArray } from "react-hook-form";
import type { Control } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import type { CvFormData } from "../../schemas/cvSchema";

export function EducationSection({ control }: { control: Control<CvFormData> }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "educations",
  });

  const addEducation = () => append({
    institution: "", degree: "",
    major: "", startYear: "", endYear: "", gpa: "",
  });

  return (
    <div className="card card-pad" style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 16 }}>
        <p className="t-kicker" style={{ margin: 0 }}>Education</p>
        <button type="button" className="btn btn-ghost"
          onClick={addEducation}
          style={{ fontSize: 12, padding: "6px 12px",
            display: "flex", alignItems: "center", gap: 6 }}>
          <Plus size={13} /> Add Education
        </button>
      </div>
      {fields.length === 0 && (
        <p style={{ color: "var(--fg-3)", fontSize: 13, textAlign: "center",
          padding: "20px 0" }}>
          No education added yet. Click "Add Education" to start.
        </p>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {fields.map((field, index) => (
          <EducationItem
            key={field.id}
            index={index}
            control={control}
            onRemove={() => remove(index)}
          />
        ))}
      </div>
    </div>
  );
}

function EducationItem({
  index,
  control,
  onRemove,
}: {
  index: number;
  control: Control<CvFormData>;
  onRemove: () => void;
}) {
  return (
    <div style={{ padding: 16, borderRadius: 10,
      border: "1px solid var(--border)", position: "relative" }}>
      <button type="button" onClick={onRemove}
        style={{ position: "absolute", top: 12, right: 12,
          background: "none", border: "none", cursor: "pointer",
          color: "var(--danger-fg)" }}>
        <Trash2 size={14} />
      </button>
      <div style={{ display: "grid", gap: 10,
        gridTemplateColumns: "1fr 1fr" }}>
        <div className="ff" style={{ gridColumn: "1 / -1" }}>
          <label className="ff-label">Institution</label>
          <input {...control.register(`educations.${index}.institution`)}
            className="ff-input" placeholder="Universitas Indonesia" />
        </div>
        <div className="ff">
          <label className="ff-label">Degree</label>
          <input {...control.register(`educations.${index}.degree`)}
            className="ff-input" placeholder="S1" />
        </div>
        <div className="ff">
          <label className="ff-label">Major</label>
          <input {...control.register(`educations.${index}.major`)}
            className="ff-input" placeholder="Ilmu Komputer" />
        </div>
        <div className="ff">
          <label className="ff-label">Start Year</label>
          <input {...control.register(`educations.${index}.startYear`)}
            className="ff-input" placeholder="2018" />
        </div>
        <div className="ff">
          <label className="ff-label">End Year</label>
          <input {...control.register(`educations.${index}.endYear`)}
            className="ff-input" placeholder="2022" />
        </div>
        <div className="ff">
          <label className="ff-label">GPA (optional)</label>
          <input {...control.register(`educations.${index}.gpa`)}
            className="ff-input" placeholder="3.8" />
        </div>
      </div>
    </div>
  );
}