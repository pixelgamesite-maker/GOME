import { useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "wouter";
import { SafeImage } from "@/components/SafeImage";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/lib/i18n";
import { Menu, X } from "lucide-react";

const ORANGE = "#f97316";
const pixel = "'Press Start 2P', monospace";
const mono = "'Space Mono', monospace";

const NAV_LINKS = [
  { key: "home",        path: "/home"        },
  { key: "gallery",     path: "/gallery"     },
  { key: "leaderboard", path: "/leaderboard" },
  { key: "tasks",       path: "/tasks"       },
  { key: "collab",      path: "/collab"      },
];

export default function Header() {
  const [, navigate] = useLocation();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  const go = (path: string) => { setOpen(false); navigate(path); };

  return (
    <>
      <nav style={{
        position: "sticky", top: 0, zIndex: 50, height: 60, padding: "0 18px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: ORANGE, borderBottom: "2px solid #000",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => navigate("/home")}>
          <SafeImage src="/GOME-LOGO.png" alt="GOME" style={{ height: 26, width: 26, imageRendering: "pixelated" }} />
          <span style={{ fontFamily: pixel, fontSize: 12, color: "#fff" }}>GOME</span>
        </div>
        <button onClick={() => setOpen(true)} aria-label="Menu"
          style={{ background: "none", border: "none", padding: 6, cursor: "pointer", color: "#fff", display: "flex" }}>
          <Menu size={24} />
        </button>
      </nav>

      {open && createPortal(
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 998 }} />
          <div style={{
            position: "fixed", top: 0, right: 0, bottom: 0, width: "min(300px, 84vw)", zIndex: 999,
            background: "#0c0c0c", borderLeft: `2px solid ${ORANGE}`,
            display: "flex", flexDirection: "column", padding: 20,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <span style={{ fontFamily: pixel, fontSize: 11, color: "#fff" }}>MENU</span>
              <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", padding: 4 }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: 22 }}>
              <LanguageSwitcher />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
              {NAV_LINKS.map((l) => (
                <button key={l.key} onClick={() => go(l.path)} style={{
                  fontFamily: mono, fontSize: 14, fontWeight: 700, color: "#fff",
                  textTransform: "uppercase", letterSpacing: "0.04em", textAlign: "left",
                  background: "none", border: "none", padding: "12px 4px", cursor: "pointer",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}>
                  {t(`menu.${l.key}`)}
                </button>
              ))}
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}
