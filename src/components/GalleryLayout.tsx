import React, { useState } from "react";
import { useLocation } from "wouter";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/lib/i18n";
import { Lock, X } from "lucide-react";

const P = {
  bg: "#070707", surface: "#141414",
  border: "rgba(255,255,255,0.08)", gold: "#C9A84C",
  text: "#f5f5f5", muted: "rgba(255,255,255,0.42)", dim: "rgba(255,255,255,0.16)",
  pepe: "#3ddc52", brett: "#3b82f6", bonk: "#f97316",
};

const pixel = "'Press Start 2P', monospace";
const mono = "'Space Mono', monospace";

export const GALLERY_PAGES = [
  { id: "pepe",          label: "PEPE",     path: "/gallery/pepe",          color: P.pepe,  img: "/pepe.gif",          tag: "OG frog energy"     },
  { id: "brett",         label: "BRETT",    path: "/gallery/brett",         color: P.brett, img: "/brett.gif",         tag: "Money never sleeps" },
  { id: "bonk",          label: "BONK",     path: "/gallery/bonk",          color: P.bonk,  img: "/bonk.gif",          tag: "Unhinged & orange"  },
  { id: "lore",          label: "Lore",     path: "/gallery/lore",          color: P.gold,  img: "/GOME-LOGO.png",     tag: "The full story"     },
  { id: "memegenerator", label: "Meme Gen", path: "/gallery/memegenerator", color: P.dim,   img: "/memegenerator.gif", tag: "Coming Season 1", soon: true },
  { id: "museum",        label: "Museum",   path: "/gallery/museum",        color: P.dim,   img: "/museum.gif",        tag: "Coming Season 1", soon: true },
];

/**
 * GalleryLayout
 *
 * The page starts EMPTY — just the Header and a floating animated icon
 * for the current character. Tap the icon → content animates open.
 * Tap again (or the ✕) → it closes. A secondary floating pill at the
 * bottom lets you switch to any other gallery page.
 */
export default function GalleryLayout({
  children,
  pageId,
}: {
  children: React.ReactNode;
  pageId: string;
}) {
  const [, navigate] = useLocation();
  const { t } = useLanguage();
  const [contentOpen, setContentOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const current = GALLERY_PAGES.find((p) => p.id === pageId);
  const accent = current?.color || P.gold;

  return (
    <div style={{ minHeight: "100vh", background: P.bg, color: P.text, fontFamily: mono }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Space+Mono:wght@400;700&display=swap');
        @keyframes float-bob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 18px ${accent}55; }
          50% { box-shadow: 0 0 36px ${accent}99; }
        }
      `}</style>

      <Header />

      {/* The idle state — centred floating character icon */}
      {!contentOpen && (
        <div style={{
          minHeight: "calc(100vh - 60px)", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", padding: 24, gap: 24,
        }}>
          <p style={{ fontFamily: pixel, fontSize: 10, color: P.muted, letterSpacing: "0.1em" }}>
            GALLERY / {current?.label?.toUpperCase()}
          </p>

          {/* Floating animated character icon — tap to open */}
          <button
            onClick={() => setContentOpen(true)}
            style={{
              background: "none", border: "none", cursor: "pointer", padding: 0,
              display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
            }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: 160, height: 160, borderRadius: "50%", overflow: "hidden",
                border: `3px solid ${accent}`,
                animation: "glow-pulse 2.4s ease-in-out infinite",
                background: "#000",
              }}
            >
              <img
                src={current?.img}
                alt={current?.label}
                style={{ width: "100%", height: "100%", objectFit: "cover", imageRendering: "pixelated" }}
              />
            </motion.div>

            <div style={{ textAlign: "center" }}>
              <p style={{ margin: "0 0 6px", fontFamily: pixel, fontSize: 14, lineHeight: 1.5, color: accent }}>
                {current?.label}
              </p>
              <p style={{ margin: 0, fontFamily: mono, fontSize: 12, color: P.muted }}>
                {current?.tag}
              </p>
            </div>

            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              style={{
                fontFamily: pixel, fontSize: 9, color: accent, lineHeight: 1.6,
                border: `1px solid ${accent}55`, padding: "8px 16px",
              }}
            >
              TAP TO EXPLORE
            </motion.div>
          </button>
        </div>
      )}

      {/* Content — hidden until icon tapped */}
      <AnimatePresence>
        {contentOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Close bar */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 20px", borderBottom: `1px solid ${P.border}`, background: P.surface,
            }}>
              <span style={{ fontFamily: pixel, fontSize: 10, color: accent, lineHeight: 1.5 }}>
                {current?.label}
              </span>
              <button
                onClick={() => setContentOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: P.muted, display: "flex" }}
              >
                <X size={18} />
              </button>
            </div>

            <main>{children}</main>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating gallery switcher pill — always visible */}
      {!pickerOpen && (
        <div style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          zIndex: 90,
        }}>
          <button
            onClick={() => setPickerOpen(true)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              fontFamily: pixel, fontSize: 9, lineHeight: 1, color: "#fff",
              background: "#0c0c0c", border: `2px solid ${accent}`,
              padding: "11px 18px", cursor: "pointer",
              boxShadow: `0 4px 20px rgba(0,0,0,0.6), 0 0 14px ${accent}44`,
              whiteSpace: "nowrap",
            }}
          >
            ◈ GALLERY
          </button>
        </div>
      )}

      {/* Gallery page picker */}
      {pickerOpen && createPortal(
        <>
          <div onClick={() => setPickerOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 998 }} />
          <div style={{
            position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
            zIndex: 999, width: "min(340px, 90vw)",
            background: "#0c0c0c", border: `2px solid ${accent}`,
            boxShadow: `0 8px 40px rgba(0,0,0,0.8)`,
          }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 16px", borderBottom: `1px solid ${P.border}`,
            }}>
              <span style={{ fontFamily: pixel, fontSize: 10, color: P.muted }}>GALLERY</span>
              <button onClick={() => setPickerOpen(false)} style={{ background: "none", border: "none", color: P.muted, cursor: "pointer", padding: 2 }}>
                <X size={16} />
              </button>
            </div>
            {GALLERY_PAGES.map((p) => {
              const isCurrent = p.id === pageId;
              return (
                <button
                  key={p.id}
                  onClick={() => { if (!p.soon) { setPickerOpen(false); navigate(p.path); } }}
                  style={{
                    display: "flex", alignItems: "center", gap: 14, width: "100%",
                    padding: "14px 16px", border: "none", borderBottom: `1px solid ${P.border}`,
                    background: isCurrent ? `${p.color}12` : "transparent",
                    cursor: p.soon ? "not-allowed" : "pointer", textAlign: "left",
                  }}
                >
                  <div style={{ width: 40, height: 40, flexShrink: 0, background: "#000", overflow: "hidden", borderRadius: "50%" }}>
                    <img src={p.img} alt={p.label} style={{ width: "100%", height: "100%", objectFit: "cover", imageRendering: "pixelated", filter: p.soon ? "grayscale(0.7) brightness(0.5)" : "none" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontFamily: pixel, fontSize: 10, lineHeight: 1.5, color: p.soon ? P.dim : isCurrent ? p.color : P.text }}>{p.label}</p>
                    <p style={{ margin: "3px 0 0", fontSize: 11, color: P.muted }}>{p.tag}</p>
                  </div>
                  {isCurrent && <span style={{ width: 7, height: 7, borderRadius: "50%", background: p.color, flexShrink: 0 }} />}
                  {p.soon && <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: P.dim, flexShrink: 0 }}><Lock size={10} /> {t("gallery.soon")}</span>}
                </button>
              );
            })}
          </div>
        </>,
        document.body
      )}
    </div>
  );
}
