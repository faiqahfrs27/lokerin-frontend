import { useState } from "react";
import { Share2, Linkedin, Facebook, Twitter, Link as LinkIcon } from "lucide-react";
import toast from "react-hot-toast";

const FRONTEND_URL = window.location.origin;

function buildVerifyUrl(code: string) {
  return `${FRONTEND_URL}/verify/${code}`;
}

export function ShareCertificateButton({
  code,
}: {
  code: string;
}) {
  const [open, setOpen] = useState(false);
  const verifyUrl = buildVerifyUrl(code);

  const handleLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(verifyUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  const handleFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(verifyUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  const handleX = () => {
    const text = "I just earned a verified skill badge on Lokerin! 🎉";
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(verifyUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verifyUrl);
    toast.success("Link copied to clipboard!");
    setOpen(false);
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button type="button" className="btn btn-secondary"
        onClick={() => setOpen((v) => !v)}>
        <Share2 size={14} /> Share
      </button>
      {open && (
        <ShareMenu
          onLinkedIn={handleLinkedIn}
          onFacebook={handleFacebook}
          onX={handleX}
          onCopyLink={handleCopyLink}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

function ShareMenu({
  onLinkedIn, onFacebook, onX, onCopyLink, onClose,
}: {
  onLinkedIn: () => void;
  onFacebook: () => void;
  onX: () => void;
  onCopyLink: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <div onClick={onClose}
        style={{ position: "fixed", inset: 0, zIndex: 10 }} />
      <div className="card"
        style={{ position: "absolute", top: "calc(100% + 8px)", left: 0,
          zIndex: 20, padding: 8, minWidth: 180,
          display: "flex", flexDirection: "column", gap: 2 }}>
        <ShareMenuItem icon={<Linkedin size={15} />} label="LinkedIn" onClick={onLinkedIn} />
        <ShareMenuItem icon={<Facebook size={15} />} label="Facebook" onClick={onFacebook} />
        <ShareMenuItem icon={<Twitter size={15} />} label="X (Twitter)" onClick={onX} />
        <ShareMenuItem icon={<LinkIcon size={15} />} label="Copy link" onClick={onCopyLink} />
      </div>
    </>
  );
}

function ShareMenuItem({
  icon, label, onClick,
}: {
  icon: React.ReactNode; label: string; onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick}
      style={{ display: "flex", alignItems: "center", gap: 10,
        padding: "8px 10px", borderRadius: 8, border: "none",
        background: "none", cursor: "pointer", fontSize: 13,
        color: "var(--fg)", textAlign: "left", width: "100%" }}>
      {icon} {label}
    </button>
  );
}