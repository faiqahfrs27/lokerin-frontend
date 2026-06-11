import { useFieldArray } from "react-hook-form";
import type { Control } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import type { CvFormData } from "../../schemas/cvSchema";

export function ExperienceSection({
  control,
}: {
  control: Control<CvFormData>;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "experiences",
  });

  const addExperience = () =>
    append({
      company: "",
      position: "",
      startYear: "",
      endYear: "",
      description: "",
    });

  return (
    <div className="card card-pad" style={{ marginBottom: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <p className="t-kicker" style={{ margin: 0 }}>
          Work Experience
        </p>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={addExperience}
          style={{
            fontSize: 12,
            padding: "6px 12px",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Plus size={13} /> Add Experience
        </button>
      </div>
      {fields.length === 0 && (
        <p
          style={{
            color: "var(--fg-3)",
            fontSize: 13,
            textAlign: "center",
            padding: "20px 0",
          }}
        >
          No experience added yet. Click "Add Experience" to start.
        </p>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {fields.map((field, index) => (
          <ExperienceItem
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

function ExperienceItem({
  index,
  control,
  onRemove,
}: {
  index: number;
  control: Control<CvFormData>;
  onRemove: () => void;
}) {

  return (
    <div
      style={{
        padding: 16,
        borderRadius: 10,
        border: "1px solid var(--border)",
        position: "relative",
      }}
    >
      <button
        type="button"
        onClick={onRemove}
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--danger-fg)",
        }}
      >
        <Trash2 size={14} />
      </button>
      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
        <div className="ff">
          <label className="ff-label">Company</label>
          <input
            {...control.register(`experiences.${index}.company`)}
            className="ff-input"
            placeholder="Tokopedia"
          />
        </div>
        <div className="ff">
          <label className="ff-label">Position</label>
          <input
            {...control.register(`experiences.${index}.position`)}
            className="ff-input"
            placeholder="Frontend Developer"
          />
        </div>
        <div className="ff">
          <label className="ff-label">Start Year</label>
          <input
            {...control.register(`experiences.${index}.startYear`)}
            className="ff-input"
            placeholder="2022"
          />
        </div>
        <div className="ff">
          <label className="ff-label">End Year (leave blank if current)</label>
          <input
            {...control.register(`experiences.${index}.endYear`)}
            className="ff-input"
            placeholder="2024"
          />
        </div>
      </div>
      <div className="ff" style={{ marginTop: 10 }}>
        <label className="ff-label">Description</label>
        <textarea
          {...control.register(`experiences.${index}.description`)}
          className="ff-input"
          rows={2}
          placeholder="What did you do here?"
        />
      </div>
    </div>
  );
}
