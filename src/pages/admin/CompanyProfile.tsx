import { Building2, Camera, MapPin, Phone, Save } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCompany } from "../../hooks/company/useCompany";
import { useUpdateCompany } from "../../hooks/company/useUpdateCompany";
import { useUpdateCompanyLogo } from "../../hooks/company/useUpdateCompanyLogo";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

interface RteEditorProps {
  content: string;
  onChange: (html: string) => void;
}

function RteEditor({ content, onChange }: RteEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Describe your company..." }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  // Sync content dari luar (saat data API load)
  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content]);

  if (!editor) return null;

  const btn = (action: () => void, active: boolean, label: string) => (
    <button
      type="button"
      onClick={action}
      style={{
        padding: "4px 10px",
        borderRadius: "var(--radius-sm)",
        border: "1px solid var(--border-2)",
        background: active ? "var(--brand-soft)" : "var(--surface)",
        color: active ? "var(--brand-fg)" : "var(--fg-2)",
        fontWeight: active ? 700 : 500,
        fontSize: 13,
        cursor: "pointer",
        fontFamily: "inherit",
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ border: "1px solid var(--border-2)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", padding: "10px 14px", borderBottom: "1px solid var(--border)", background: "var(--surface-2)" }}>
        {btn(() => editor.chain().focus().toggleBold().run(), editor.isActive("bold"), "B")}
        {btn(() => editor.chain().focus().toggleItalic().run(), editor.isActive("italic"), "I")}
        {btn(() => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive("heading", { level: 2 }), "H2")}
        {btn(() => editor.chain().focus().toggleHeading({ level: 3 }).run(), editor.isActive("heading", { level: 3 }), "H3")}
        {btn(() => editor.chain().focus().toggleBulletList().run(), editor.isActive("bulletList"), "• List")}
        {btn(() => editor.chain().focus().toggleOrderedList().run(), editor.isActive("orderedList"), "1. List")}
      </div>
      <EditorContent
        editor={editor}
        style={{ minHeight: 200, padding: "12px 14px", fontSize: "var(--fs-sm)", color: "var(--fg)", background: "var(--surface)" }}
      />
    </div>
  );
}

// ─── Logo Section ──────────────────────────────────────────

function LogoSection({ logoUrl, name }: { logoUrl: string | null; name: string }) {
  const { mutate: uploadLogo, isPending } = useUpdateCompanyLogo();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadLogo(file);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32 }}>
      <div style={{ position: "relative" }}>
        {logoUrl ? (
          <img src={logoUrl} alt={name} style={{ width: 80, height: 80, borderRadius: "var(--radius-md)", objectFit: "cover" }} />
        ) : (
          <div style={{ width: 80, height: 80, borderRadius: "var(--radius-md)", background: "var(--brand-soft)", color: "var(--brand-fg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 800 }}>
            {name.charAt(0)}
          </div>
        )}
        <button
          onClick={() => fileRef.current?.click()}
          disabled={isPending}
          style={{ position: "absolute", bottom: 0, right: 0, width: 26, height: 26, borderRadius: "50%", background: "var(--brand)", border: "2px solid var(--bg)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          <Camera size={13} />
        </button>
        <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png" style={{ display: "none" }} onChange={handleFile} />
      </div>
      <div>
        <p style={{ margin: "0 0 4px", fontWeight: "var(--fw-semibold)", color: "var(--fg)" }}>{name}</p>
        <p style={{ margin: 0, fontSize: "var(--fs-xs)", color: "var(--fg-3)" }}>JPG, JPEG, PNG · Max 2MB</p>
      </div>
    </div>
  );
}

function CompanyProfile() {
  const { data: company, isLoading } = useCompany();
  const { mutate, isPending } = useUpdateCompany();

  const [form, setForm] = useState({ name: "", phone: "", city: "" });
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!company) return;
    setForm({ name: company.name, phone: company.phone ?? "", city: company.city ?? "" });
    setDescription(company.descriptionRte ?? "");
  }, [company]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ name: form.name, phone: form.phone, city: form.city, descriptionRte: description });
  };

  if (isLoading) return <div style={{ padding: 40, color: "var(--fg-3)" }}>Loading...</div>;

  return (
    <div style={{ padding: "32px 40px", maxWidth: 800 }}>
      <div style={{ marginBottom: 32 }}>
        <p className="t-kicker">Admin</p>
        <h1 className="t-h3" style={{ margin: "8px 0 4px" }}>Company Profile</h1>
        <p style={{ color: "var(--fg-3)", fontSize: "var(--fs-sm)" }}>Manage your company's public profile.</p>
      </div>

      {/* Logo */}
      <div className="card card-pad" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
          <div style={{ width: 32, height: 32, borderRadius: "var(--radius-md)", background: "var(--brand-soft)", color: "var(--brand-fg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Building2 size={16} />
          </div>
          <h2 style={{ margin: 0, fontSize: "var(--fs-base)", fontWeight: "var(--fw-semibold)" }}>Company logo</h2>
        </div>
        <LogoSection logoUrl={company?.logoUrl ?? null} name={company?.name ?? "C"} />
      </div>

      {/* Info form */}
      <div className="card card-pad" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
          <div style={{ width: 32, height: 32, borderRadius: "var(--radius-md)", background: "var(--brand-soft)", color: "var(--brand-fg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Phone size={16} />
          </div>
          <h2 style={{ margin: 0, fontSize: "var(--fs-base)", fontWeight: "var(--fw-semibold)" }}>Company information</h2>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="ff">
              <label className="ff-label">Company name <span style={{ color: "var(--danger-500)" }}>*</span></label>
              <div className="ff-input">
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="PT. Contoh Indonesia" />
              </div>
            </div>
            <div className="ff">
              <label className="ff-label">Phone</label>
              <div className="ff-input">
                <Phone size={14} style={{ color: "var(--fg-3)" }} />
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="081234567890" />
              </div>
            </div>
          </div>

          <div className="ff">
            <label className="ff-label">City</label>
            <div className="ff-input">
              <MapPin size={14} style={{ color: "var(--fg-3)" }} />
              <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Jakarta" />
            </div>
          </div>

          <div className="ff">
            <label className="ff-label">Company description</label>
            <RteEditor content={description} onChange={setDescription} />
          </div>

          <div>
            <button type="submit" className="btn btn-primary" disabled={isPending}>
              <Save size={14} /> {isPending ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CompanyProfile;