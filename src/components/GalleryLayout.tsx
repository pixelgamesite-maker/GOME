import React from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { SafeImage } from "@/components/SafeImage";

const P = {
  bg: "#070707", bgElevated: "#0e0e0e", surface: "#141414",
  border: "rgba(255,255,255,0.06)", gold: "#C9A84C",
  text: "#f5f5f5", muted: "rgba(255,255,255,0.4)", dim: "rgba(255,255,255,0.15)",
  pepe: "#3ddc52", brett: "#3b82f6", bonk: "#f97316",
};

const display = "'Fredoka', sans-serif";
const body = "'Space Grotesk', sans-serif";

export const GALLERY_PAGES = [
  { id: "pepe", label: "PEPE", path: "/gallery/pepe", color: P.pepe, emoji: "🐸", img: "/pepe.gif", tag: "OG frog energy" },
  { id: "brett", label: "BRETT", path: "/gallery/brett", color: P.brett, emoji: "🟦", img: "/brett.gif", tag: "Money never sleeps" },
  { id: "bonk", label: "BONK", path: "/gallery/bonk", color: P.bonk, emoji: "🟠", img: "/bonk.gif", tag: "Unhinged & orange" },
  { id: "lore", label: "Lore", path: "/gallery/lore", color: P.gold, emoji: "📜", img: "/GOME-LOGO.png", tag: "The full story" },
  { id: "whitelist", label: "Whitelist", path: "/gallery/whitelist", color: "#a855f7", emoji: "✦", img: "/whitelist.gif", tag: "Secure your spot" },
  { id: "memegenerator", label: "Meme Gen", path: "/gallery/memegenerator", color: P.dim, emoji: "🚧", soon: true, img: "/memegenerator.gif", tag: "Coming Season 1" },
  { id: "museum", label: "Museum", path: "/gallery/museum", color: P.dim, emoji: "🏛️", soon: true, img: "/museum.gif", tag: "Coming Season 1" },
];

export default function GalleryLayout({ children, pageId }: { children: React.ReactNode; pageId: string }) {
  const { user, signOut } = useAuth();
  const [, navigate] = useLocation();

  const meta = GALLERY_PAGES.find((p) => p.id === pageId);
  const avatar = user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.id || "x"}`;

  return (
    <div style={{ minHeight: "100vh", background: P.bg, color: P.text, fontFamily: body, display: "flex", flexDirection: "column" }}>
      {/* Top Bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50, height: 64, padding: "0 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(7,7,7,0.95)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${P.border}`,
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => navigate("/home")}>
          <SafeImage src="/GOME-LOGO.png" alt="GOME" style={{ height: 28, width: 28 }} />
          <span style={{ fontFamily: display, fontSize: 16, fontWeight: 600 }}>GOME</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{
            fontSize: 12, fontWeight: 700, color: P.gold, background: P.surface,
            padding: "6px 14px", borderRadius: 20, border: `1px solid ${P.border}`,
          }}>
            Gallery
          </span>
          <img src={avatar} alt="" style={{ width: 30, height: 30, borderRadius: "50%", border: `2px solid ${meta?.color || P.gold}` }} />
          <button onClick={signOut} style={{
            fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
            color: P.muted, background: "transparent", border: "none", cursor: "pointer",
          }}>Out</button>
        </div>
      </div>

      {/* Single column, free-scrolling page */}
      <div style={{ flex: 1, padding: "20px 16px 40px" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>

          {/* Current page content, if any */}
          {meta && (
            <div style={{
              background: P.surface, borderRadius: 24, border: `1px solid ${P.border}`,
              padding: 28, position: "relative", marginBottom: 28,
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: 24, height: 24, borderTop: `3px solid ${meta.color}`, borderLeft: `3px solid ${meta.color}`, borderTopLeftRadius: 20 }} />
              <div style={{ position: "absolute", top: 0, right: 0, width: 24, height: 24, borderTop: `3px solid ${meta.color}`, borderRight: `3px solid ${meta.color}`, borderTopRightRadius: 20 }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, width: 24, height: 24, borderBottom: `3px solid ${meta.color}`, borderLeft: `3px solid ${meta.color}`, borderBottomLeftRadius: 20 }} />
              <div style={{ position: "absolute", bottom: 0, right: 0, width: 24, height: 24, borderBottom: `3px solid ${meta.color}`, borderRight: `3px solid ${meta.color}`, borderBottomRightRadius: 20 }} />

              <h2 style={{ fontFamily: display, fontSize: 24, color: meta.color, margin: "0 0 20px" }}>
                {meta.emoji} {meta.label}
              </h2>
              {children}
            </div>
          )}

          <p style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
            color: P.dim, padding: "0 4px", marginBottom: 14,
          }}>
            {meta ? "More from the Gallery" : "Navigate"}
          </p>

          {/* Vertical, tap-to-navigate cards — free scroll, no arrows */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {GALLERY_PAGES.filter((p) => p.id !== pageId).map((p) => {
              return (
                <button
                  key={p.id}
                  onClick={() => !p.soon && navigate(p.path)}
                  style={{
                    display: "flex", flexDirection: "column", width: "100%",
                    borderRadius: 28, overflow: "hidden", padding: 0, border: "none",
                    textAlign: "left", cursor: p.soon ? "not-allowed" : "pointer",
                    background: `linear-gradient(165deg, ${p.color}26 0%, ${P.surface} 60%)`,
                    boxShadow: `inset 0 0 0 1px ${P.border}`,
                  }}
                >
                  {/* Image */}
                  <div style={{ width: "100%", height: 220, background: "#000", overflow: "hidden" }}>
                    <img
                      src={p.img}
                      alt={p.label}
                      style={{
                        width: "100%", height: "100%", objectFit: "cover",
                        filter: p.soon ? "grayscale(0.6) brightness(0.55)" : "none",
                      }}
                    />
                  </div>

                  {/* Label */}
                  <div style={{
                    padding: "18px 20px 22px", display: "flex",
                    alignItems: "center", justifyContent: "space-between", gap: 12,
                  }}>
                    <div>
                      <h3 style={{ fontFamily: display, fontSize: 22, margin: "0 0 4px", color: p.soon ? P.dim : p.color }}>
                        {p.emoji} {p.label}
                      </h3>
                      <p style={{ margin: 0, fontSize: 13, color: P.muted }}>{p.tag}</p>
                    </div>

                    {p.soon ? (
                      <span style={{
                        flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 4,
                        fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                        color: P.dim, background: "rgba(255,255,255,0.04)",
                        border: `1px solid ${P.border}`, borderRadius: 20, padding: "6px 12px",
                      }}>
                        🔒 Soon
                      </span>
                    ) : (
                      <span style={{ flexShrink: 0, fontSize: 18, color: p.color }}>→</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
