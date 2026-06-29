import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import { useLanguage } from "@/lib/i18n";
import { ArrowRight, Lock } from "lucide-react";

const P = {
  bg: "#070707", surface: "#141414",
  border: "rgba(255,255,255,0.07)", gold: "#C9A84C",
  text: "#f5f5f5", muted: "rgba(255,255,255,0.42)", dim: "rgba(255,255,255,0.16)",
  pepe: "#3ddc52", brett: "#3b82f6", bonk: "#f97316",
};

const pixel = "'Press Start 2P', monospace";
const mono = "'Space Mono', monospace";

export const GALLERY_PAGES = [
  { id: "pepe", label: "PEPE", path: "/gallery/pepe", color: P.pepe, img: "/pepe.gif", tag: "OG frog energy" },
  { id: "brett", label: "BRETT", path: "/gallery/brett", color: P.brett, img: "/brett.gif", tag: "Money never sleeps" },
  { id: "bonk", label: "BONK", path: "/gallery/bonk", color: P.bonk, img: "/bonk.gif", tag: "Unhinged & orange" },
  { id: "lore", label: "Lore", path: "/gallery/lore", color: P.gold, img: "/GOME-LOGO.png", tag: "The full story" },
  { id: "memegenerator", label: "Meme Gen", path: "/gallery/memegenerator", color: P.dim, soon: true, img: "/memegenerator.gif", tag: "Coming Season 1" },
  { id: "museum", label: "Museum", path: "/gallery/museum", color: P.dim, soon: true, img: "/museum.gif", tag: "Coming Season 1" },
];

export default function GalleryLayout({ pageId }: { children?: React.ReactNode; pageId: string }) {
  const [, navigate] = useLocation();
  const { t } = useLanguage();

  return (
    <div style={{ minHeight: "100vh", background: P.bg, color: P.text, fontFamily: mono, display: "flex", flexDirection: "column" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Space+Mono:wght@400;700&display=swap');`}</style>

      <Header />

      {/* The whole page is one animated vertical carousel */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px" }}>
        <GalleryCarousel pageId={pageId} onSelect={(path) => navigate(path)} t={t} />
      </div>
    </div>
  );
}

/* ── Vertical, swipeable, tap-to-navigate carousel ──
   Single transformed track + plain-flow children, instead of each card
   individually position:absolute + its own transform. Far more reliable
   for click/tap hit-testing across browsers. */
function GalleryCarousel({
  pageId, onSelect, t,
}: { pageId: string; onSelect: (path: string) => void; t: (key: string) => string }) {
  const startIndex = Math.max(0, GALLERY_PAGES.findIndex((p) => p.id === pageId));
  const [index, setIndex] = useState(startIndex);
  const dragStartY = useRef<number | null>(null);

  useEffect(() => {
    const i = GALLERY_PAGES.findIndex((p) => p.id === pageId);
    if (i >= 0) setIndex(i);
  }, [pageId]);

  const total = GALLERY_PAGES.length;
  const cardHeight = 312;
  const gap = 20;
  const step = cardHeight + gap;

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
    <div style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", maxWidth: 440 }}>
      <div
        style={{ position: "relative", width: "100%", height: "min(560px, 70vh)", overflow: "hidden" }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onWheel={onWheel}
      >
        <div
          style={{
            display: "flex", flexDirection: "column", gap,
            transform: `translateY(calc(50% - ${index * step + cardHeight / 2}px))`,
            transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {GALLERY_PAGES.map((p, i) => {
            const offset = i - index;
            const isActive = offset === 0;
            const visible = Math.abs(offset) <= 2;

            return (
              <button
                key={p.id}
                onClick={() => !p.soon && onSelect(p.path)}
                style={{
                  flexShrink: 0, width: "100%", height: cardHeight, borderRadius: 0,
                  overflow: "hidden", border: "none", padding: 0, textAlign: "left",
                  cursor: p.soon ? "not-allowed" : "pointer",
                  transform: `scale(${isActive ? 1 : 0.88})`,
                  opacity: visible ? (isActive ? 1 : 0.4) : 0,
                  filter: isActive ? "none" : "blur(0.5px)",
                  transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s, filter 0.4s",
                  background: P.surface,
                  boxShadow: isActive ? `0 18px 40px rgba(0,0,0,0.5), inset 0 0 0 2px ${p.color}` : `inset 0 0 0 1px ${P.border}`,
                  pointerEvents: visible ? "auto" : "none",
                  position: "relative",
                }}
              >
                <div style={{ position: "relative", width: "100%", height: "64%", background: "#000" }}>
                  <img
                    src={p.img}
                    alt={p.label}
                    style={{
                      width: "100%", height: "100%", objectFit: "cover", imageRendering: "pixelated",
                      filter: p.soon ? "grayscale(0.65) brightness(0.5)" : "none",
                    }}
                  />
                  <div style={{
                    position: "absolute", left: 0, right: 0, bottom: 0, height: 48,
                    background: `linear-gradient(180deg, transparent, ${P.surface})`,
                  }} />
                </div>

                <div style={{
                  padding: "14px 20px 0", display: "flex", alignItems: "flex-start",
                  justifyContent: "space-between", gap: 12,
                }}>
                  <div>
                    <h3 style={{ fontFamily: pixel, fontSize: 14, lineHeight: 1.5, margin: "0 0 7px", color: p.soon ? P.dim : p.color }}>
                      {p.label}
                    </h3>
                    <p style={{ margin: 0, fontSize: 11, letterSpacing: "0.04em", color: P.muted }}>{p.tag}</p>
                  </div>

                  {p.soon ? (
                    <span style={{
                      flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 5,
                      fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                      color: P.dim, background: "rgba(255,255,255,0.04)",
                      border: `1px solid ${P.border}`, borderRadius: 0, padding: "5px 11px",
                    }}>
                      <Lock size={10} /> {t("gallery.soon")}
                    </span>
                  ) : (
                    <span style={{
                      flexShrink: 0, width: 28, height: 28, borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: `${p.color}1a`, border: `1px solid ${p.color}55`, color: p.color,
                    }}>
                      <ArrowRight size={14} />
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
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
