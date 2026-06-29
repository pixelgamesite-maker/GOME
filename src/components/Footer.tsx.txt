import { useLocation } from "wouter";
import { useLanguage } from "@/lib/i18n";
import { Twitter } from "lucide-react";

/**
 * Footer — shared across pages, same reasoning as Header: one place to
 * edit instead of every page.
 */

const ORANGE = "#f97316";
const pixel = "'Press Start 2P', monospace";
const mono = "'Space Mono', monospace";

const LINKS = [
  { key: "home", path: "/home" },
  { key: "gallery", path: "/gallery" },
  { key: "leaderboard", path: "/leaderboard" },
  { key: "tasks", path: "/tasks" },
  { key: "collab", path: "/collab" },
];

export default function Footer() {
  const [, navigate] = useLocation();
  const { t } = useLanguage();

  return (
    <footer style={{ background: "#0c0c0c", borderTop: `2px solid ${ORANGE}`, padding: "40px 24px 28px" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
        <p style={{ fontFamily: pixel, fontSize: 14, color: "#fff", margin: "0 0 18px" }}>GOME</p>

        <a
          href="https://x.com/GomeJpeg" target="_blank" rel="noreferrer"
          style={{
            display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28,
            fontFamily: mono, fontSize: 13, fontWeight: 700, color: "#fff",
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)",
            padding: "10px 18px", textDecoration: "none",
          }}
        >
          <Twitter size={14} /> @GomeJpeg
        </a>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, marginBottom: 24 }}>
          {LINKS.map((l) => (
            <button
              key={l.key}
              onClick={() => navigate(l.path)}
              style={{
                fontFamily: mono, fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.6)",
                background: "none", border: "none", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.04em",
              }}
            >
              {t(`menu.${l.key}`)}
            </button>
          ))}
        </div>

        <p style={{ fontFamily: mono, fontSize: 10, color: "rgba(255,255,255,0.3)", margin: 0 }}>
          © {new Date().getFullYear()} GOME — Gallery Of Meme
        </p>
      </div>
    </footer>
  );
}
