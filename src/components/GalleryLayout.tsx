import React, { useEffect, useRef, useState } from "react";
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
  { id: "pepe", label: "PEPE", path: "/gallery/pepe", color: P.pepe, img: "/pepe.gif", tag: "OG frog energy" },
  { id: "brett", label: "BRETT", path: "/gallery/brett", color: P.brett, img: "/brett.gif", tag: "Money never sleeps" },
  { id: "bonk", label: "BONK", path: "/gallery/bonk", color: P.bonk, img: "/bonk.gif", tag: "Unhinged & orange" },
  { id: "lore", label: "Lore", path: "/gallery/lore", color: P.gold, img: "/GOME-LOGO.png", tag: "The full story" },
  { id: "whitelist", label: "Whitelist", path: "/gallery/whitelist", color: "#a855f7", img: "/whitelist.gif", tag: "Secure your spot" },
  { id: "memegenerator", label: "Meme Gen", path: "/gallery/memegenerator", color: P.dim, soon: true, img: "/memegenerator.gif", tag: "Coming Season 1" },
  { id: "museum", label: "Museum", path: "/gallery/museum", color: P.dim, soon: true, img: "/museum.gif", tag: "Coming Season 1" },
];

export default function GalleryLayout({ pageId }: { children?: React.ReactNode; pageId: string }) {
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

      {/* The whole page is one animated vertical carousel */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px" }}>
        <GalleryCarousel pageId={pageId} onSelect={(path) => navigate(path)} />
      </div>
    </div>
  );
}

/* ── Beautiful vertical, swipeable, tap-to-navigate carousel ── */
function GalleryCarousel({ pageId, onSelect }: { pageId: string; onSelect: (path: string) => void }) {
  const startIndex = Math.max(0, GALLERY_PAGES.findIndex((p) => p.id === pageId));
  const [index, setIndex] = useState(startIndex);
  const dragStartY = useRef<number | null>(null);

  useEffect(() => {
    const i = GALLERY_PAGES.findIndex((p) => p.id === pageId);
    if (i >= 0) setIndex(i);
  }, [pageId]);

  const total = GALLERY_PAGES.length;
  const cardHeight = 360;
  const gap = 22;
  const step = cardHeight + gap;
  const containerHeight = "min(620px, 72vh)";

  const goTo = (i: number) => setIndex(Math.max(0, Math.min(total - 1, i)));

  const onTouchStart = (e: React.TouchEvent) => { dragStartY.current = e.touches[0].clientY; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (dragStartY.current === null) return;
    const delta = dragStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(delta) > 36) goTo(index + (delta > 0 ? 1 : -1));
    dragStartY.current = null;
  };
  const onWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaY) < 12) return;
    goTo(index + (e.deltaY > 0 ? 1 : -1));
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", maxWidth: 460 }}>
      <div
        style={{ position: "relative", width: "100%", height: containerHeight, overflow: "hidden" }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onWheel={onWheel}
      >
        {GALLERY_PAGES.map((p, i) => {
          const offset = i - index;
          const isActive = offset === 0;
          const translateY = `calc(50% + ${offset * step}px - ${cardHeight / 2}px)`;
          const visible = Math.abs(offset) <= 2;

          return (
            <button
              key={p.id}
              onClick={() => !p.soon && onSelect(p.path)}
              style={{
                position: "absolute", left: 0, right: 0, top: 0,
                height: cardHeight, borderRadius: 28, overflow: "hidden",
                border: "none", padding: 0, textAlign: "left",
                cursor: p.soon ? "not-allowed" : "pointer",
                transform: `translateY(${translateY}) scale(${isActive ? 1 : 0.86})`,
                opacity: visible ? (isActive ? 1 : 0.4) : 0,
                filter: isActive ? "none" : "blur(1px)",
                zIndex: isActive ? 2 : 1,
                transition: "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.45s, filter 0.45s",
                background: `linear-gradient(165deg, ${p.color}29 0%, ${P.surface} 62%)`,
                boxShadow: isActive ? `0 16px 40px rgba(0,0,0,0.5), inset 0 0 0 1.5px ${p.color}` : `inset 0 0 0 1px ${P.border}`,
                pointerEvents: visible ? "auto" : "none",
              }}
            >
              <div style={{ width: "100%", height: "62%", background: "#000" }}>
                <img
                  src={p.img}
                  alt={p.label}
                  style={{
                    width: "100%", height: "100%", objectFit: "cover",
                    filter: p.soon ? "grayscale(0.6) brightness(0.55)" : "none",
                  }}
                />
              </div>
              <div style={{
                padding: "16px 20px", display: "flex", alignItems: "center",
                justifyContent: "space-between", gap: 12,
              }}>
                <div>
                  <h3 style={{ fontFamily: display, fontSize: 21, margin: "0 0 3px", color: p.soon ? P.dim : p.color }}>
                    {p.label}
                  </h3>
                  <p style={{ margin: 0, fontSize: 12, color: P.muted }}>{p.tag}</p>
                </div>
                {p.soon ? (
                  <span style={{
                    flexShrink: 0, fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
                    textTransform: "uppercase", color: P.dim, background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${P.border}`, borderRadius: 20, padding: "6px 12px",
                  }}>Soon</span>
                ) : (
                  <span style={{ flexShrink: 0, fontSize: 18, color: p.color }}>→</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Side dots */}
      <div style={{ display: "flex", flexDirection: "column", gap: 9, flexShrink: 0 }}>
        {GALLERY_PAGES.map((p, i) => (
          <button
            key={p.id}
            onClick={() => goTo(i)}
            aria-label={p.label}
            style={{
              width: i === index ? 10 : 7, height: i === index ? 10 : 7, borderRadius: "50%",
              border: "none", padding: 0, cursor: "pointer",
              background: i === index ? p.color : "rgba(255,255,255,0.2)",
              transition: "all 0.25s",
            }}
          />
        ))}
      </div>
    </div>
  );
}
