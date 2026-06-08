import { Facebook, Linkedin, Share2, Twitter } from "lucide-react";
import { useState } from "react";

interface ShareButtonsProps {
  title: string;
  url: string;
}

function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const text = encodeURIComponent(`Check out this job: ${title}`);
  const encodedUrl = encodeURIComponent(url);

  const platforms = [
    { label: "LinkedIn", icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, color: "#0A66C2" },
    { label: "Twitter/X", icon: Twitter, href: `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`, color: "#000000" },
    { label: "Facebook", icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, color: "#1877F2" },
    { label: "WhatsApp", icon: Share2, href: `https://api.whatsapp.com/send?text=${text}%20${encodedUrl}`, color: "#25D366" },
  ];

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {platforms.map(({ label, icon: Icon, href, color }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            title={`Share to ${label}`}
            style={{ width: 38, height: 38, borderRadius: "var(--radius-md)", background: color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", flexShrink: 0 }}
          >
            <Icon size={16} />
          </a>
        ))}
      </div>
      <button className="btn btn-secondary" style={{ fontSize: 13 }} onClick={copyLink}>
        {copied ? "✓ Link copied!" : "Copy link"}
      </button>
    </div>
  );
}

export default ShareButtons;