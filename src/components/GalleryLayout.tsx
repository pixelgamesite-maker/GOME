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
  { id: "pepe", label: "PEPE", path: "/gallery/pepe", color: P.pepe, emoji: "🐸" },
  { id: "brett", label: "BRETT", path: "/gallery/brett", color: P.brett, emoji: "🟦" },
  { id: "bonk", label: "BONK", path: "/gallery/bonk", color: P.bonk, emoji: "🟠" },
  { id: "lore", label: "Lore", path: "/gallery/lore", color: P.gold, emoji: "📜" },
  { id: "whitelist", label: "Whitelist", path: "/gallery/whitelist", color: "#a855f7", emoji: "✦" },
  { id: "memegenerator", label: "Meme Gen", path: "/gallery/memegenerator", color: P.dim, emoji: "🚧", soon: true },
  { id: "museum", label: "Museum", path: "/gallery/museum", color: P.dim, emoji: "🏛️", soon: true },
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
        {/* Vertical Sidebar */}
        <div style={{
          width: 220, flexShrink: 0, background: P.bgElevated,
          borderRight: `1px solid ${P.border}`, padding: "20px 14px",
          display: "flex", flexDirection: "column", gap: 6, overflowY: "auto",
        }}>
          <p style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
            color: P.dim, padding: "0 10px", marginBottom: 8,
          }}>Navigate</p>
          {GALLERY_PAGES.map((p) => {
            const active = p.id === pageId;
            return (
              <button
                key={p.id}
                onClick={() => !p.soon && navigate(p.path)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "12px 10px", borderRadius: 12, border: "none", width: "100%",
                  background: active ? `${p.color}15` : "transparent",
                  color: active ? p.color : p.soon ? P.dim : P.text,
                  cursor: p.soon ? "not-allowed" : "pointer",
                  transition: "all 0.2s", textAlign: "left",
                  fontFamily: body, fontSize: 13, fontWeight: 700,
                  borderLeft: active ? `3px solid ${p.color}` : "3px solid transparent",
                }}
              >
                <span style={{ fontSize: 16 }}>{p.emoji}</span>
                <span style={{ flex: 1 }}>{p.label}</span>
                {p.soon && <span style={{ fontSize: 9, color: P.dim, fontWeight: 600 }}>SOON</span>}
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
