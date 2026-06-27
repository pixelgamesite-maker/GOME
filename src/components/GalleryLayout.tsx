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
  { id: "pepe", label: "PEPE", path: "/gallery/pepe", color: P.pepe, emoji: "🐸", img: "/pepe.gif" },
  { id: "brett", label: "BRETT", path: "/gallery/brett", color: P.brett, emoji: "🟦", img: "/brett.gif" },
  { id: "bonk", label: "BONK", path: "/gallery/bonk", color: P.bonk, emoji: "🟠", img: "/bonk.gif" },
  { id: "lore", label: "Lore", path: "/gallery/lore", color: P.gold, emoji: "📜", img: "/GOME-LOGO.png" },
  { id: "whitelist", label: "Whitelist", path: "/gallery/whitelist", color: "#a855f7", emoji: "✦", img: "/whitelist.gif" },
  { id: "memegenerator", label: "Meme Gen", path: "/gallery/memegenerator", color: P.dim, emoji: "🚧", soon: true, img: "/memegenerator.gif" },
  { id: "museum", label: "Museum", path: "/gallery/museum", color: P.dim, emoji: "🏛️", soon: true, img: "/museum.gif" },
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
        height: 64, padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
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

      {/* Body: Sidebar + Content */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Vertical Card Sidebar — free scroll, no arrows */}
        <div style={{
          width: 248, flexShrink: 0, background: P.bgElevated,
          borderRight: `1px solid ${P.border}`, padding: "20px 14px",
          display: "flex", flexDirection: "column", gap: 14, overflowY: "auto",
        }}>
          <p style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
            color: P.dim, padding: "0 4px", marginBottom: 2,
          }}>Navigate</p>

          {GALLERY_PAGES.map((p) => {
            const active = p.id === pageId;
            return (
              <button
                key={p.id}
                onClick={() => !p.soon && navigate(p.path)}
                style={{
                  display: "flex", flexDirection: "column", width: "100%",
                  borderRadius: 18, overflow: "hidden", padding: 0,
                  textAlign: "left", cursor: p.soon ? "not-allowed" : "pointer",
                  background: active ? `linear-gradient(165deg, ${p.color}22, ${P.surface} 75%)` : P.surface,
                  border: active ? `1.5px solid ${p.color}` : `1px solid ${P.border}`,
                  transition: "border-color 0.2s, transform 0.15s",
                }}
                onMouseEnter={(e) => { if (!p.soon) e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
              >
                {/* Image box */}
                <div style={{
                  width: "100%", height: 104, background: "#000",
                  position: "relative", overflow: "hidden",
                }}>
                  <img
                    src={p.img}
                    alt={p.label}
                    style={{
                      width: "100%", height: "100%", objectFit: "cover",
                      filter: p.soon ? "grayscale(0.6) brightness(0.6)" : "none",
                      opacity: p.soon ? 0.7 : 1,
                    }}
                  />
                  {active && (
                    <div style={{
                      position: "absolute", inset: 0,
                      boxShadow: `inset 0 0 0 1.5px ${p.color}`,
                    }} />
                  )}
                </div>

                {/* Label row */}
                <div style={{
                  padding: "10px 12px 12px", display: "flex",
                  flexDirection: "column", gap: 6,
                }}>
                  <span style={{
                    fontFamily: display, fontSize: 14, fontWeight: 600,
                    color: active ? p.color : p.soon ? P.dim : P.text,
                  }}>
                    {p.label}
                  </span>

                  {p.soon && (
                    <span style={{
                      display: "inline-flex", alignSelf: "flex-start", alignItems: "center", gap: 4,
                      fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                      color: P.dim, background: "rgba(255,255,255,0.04)",
                      border: `1px solid ${P.border}`, borderRadius: 20, padding: "3px 9px",
                    }}>
                      🔒 Coming Soon
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Content — Free Scroll */}
        <div style={{ flex: 1, overflowY: "auto", padding: 28, position: "relative" }}>
          {/* Metallic Frame */}
          <div style={{
            maxWidth: 1000, margin: "0 auto", minHeight: "100%",
            background: P.surface, borderRadius: 24, border: `1px solid ${P.border}`,
            padding: 32, position: "relative",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}>
            {/* Corner accents */}
            <div style={{ position: "absolute", top: 0, left: 0, width: 24, height: 24, borderTop: `3px solid ${meta?.color || P.gold}`, borderLeft: `3px solid ${meta?.color || P.gold}`, borderTopLeftRadius: 20 }} />
            <div style={{ position: "absolute", top: 0, right: 0, width: 24, height: 24, borderTop: `3px solid ${meta?.color || P.gold}`, borderRight: `3px solid ${meta?.color || P.gold}`, borderTopRightRadius: 20 }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, width: 24, height: 24, borderBottom: `3px solid ${meta?.color || P.gold}`, borderLeft: `3px solid ${meta?.color || P.gold}`, borderBottomLeftRadius: 20 }} />
            <div style={{ position: "absolute", bottom: 0, right: 0, width: 24, height: 24, borderBottom: `3px solid ${meta?.color || P.gold}`, borderRight: `3px solid ${meta?.color || P.gold}`, borderBottomRightRadius: 20 }} />

            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontFamily: display, fontSize: 24, color: meta?.color || P.gold, margin: 0 }}>
                {meta?.emoji} {meta?.label}
              </h2>
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
