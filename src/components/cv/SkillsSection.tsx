import { useState } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import type { Control } from "react-hook-form";
import { X, Plus } from "lucide-react";
import type { CvFormData } from "../../schemas/cvSchema";

export function SkillsSection({ control }: { control: Control<CvFormData> }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "additionalSkills" as never,
  });
  const skills = useWatch({ control, name: "additionalSkills" as never }) as
    | string[]
    | undefined;

  const [input, setInput] = useState("");

  const addSkill = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    append(trimmed as never);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="card card-pad" style={{ marginBottom: 16 }}>
      <p className="t-kicker" style={{ marginBottom: 16 }}>Additional Skills</p>
      <p style={{ fontSize: 13, color: "var(--fg-3)", margin: "0 0 12px" }}>
        Your verified Lokerin badges will be included automatically.
        Add any other skills here.
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="ff-input"
          placeholder="e.g. Figma, Docker, Python..."
          style={{ flex: 1 }}
        />
        <button type="button" className="btn btn-secondary"
          onClick={addSkill}
          style={{ display: "flex", alignItems: "center", gap: 6,
            padding: "0 16px", whiteSpace: "nowrap" }}>
          <Plus size={13} /> Add
        </button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {fields.map((field, index) => (
          <span key={field.id}
            style={{ display: "flex", alignItems: "center", gap: 6,
              background: "var(--brand-soft)", color: "var(--brand)",
              fontSize: 13, fontWeight: 600, padding: "4px 10px",
              borderRadius: 999, border: "1px solid var(--brand)" }}>
            {skills?.[index]}
            <button type="button" onClick={() => remove(index)}
              style={{ background: "none", border: "none",
                cursor: "pointer", color: "var(--brand)",
                padding: 0, display: "flex" }}>
              <X size={12} />
            </button>
          </span>
        ))}
        {fields.length === 0 && (
          <p style={{ color: "var(--fg-3)", fontSize: 13 }}>
            No additional skills yet.
          </p>
        )}
      </div>
    </div>
  );
}