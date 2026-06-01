import type { FieldError } from "react-hook-form";
import { fadeUp } from "../../utils/AnimationStyle";

interface TermsCheckboxProps {
  checked: boolean;
  onChange: () => void;
  error?: FieldError;
}

function TermsCheckbox({ checked, onChange, error }: TermsCheckboxProps) {
  return (
    <div style={fadeUp(500)}>
      <label className="checkbox terms" style={{ userSelect: "none" }}>
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span
          className="cb-box"
          style={{
            background: checked ? "var(--brand)" : "var(--surface)",
            borderColor: checked ? "var(--brand)" : "var(--border-2)",
          }}
        >
          {checked && (
            <svg
              width="11"
              height="11"
              viewBox="0 0 12 12"
              fill="none"
              style={{ display: "block" }}
            >
              <path
                d="M2 6.5L4.5 9L10 3"
                stroke="white"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
        <span style={{ fontSize: 13.5, color: "var(--fg-2)", lineHeight: 1.5 }}>
          I agree to Lokerin's{" "}
          <a href="/terms" className="link" target="_blank" rel="noreferrer">
            Terms & Conditions
          </a>{" "}
          and{" "}
          <a href="/privacy" className="link" target="_blank" rel="noreferrer">
            Privacy Policy
          </a>
        </span>
      </label>
      {error && (
        <p className="ff-err" style={{ marginTop: 4, paddingLeft: 28 }}>
          {error.message}
        </p>
      )}
    </div>
  );
}

export default TermsCheckbox;