import React, { useState } from "react";
import { useLocation } from "wouter";
import { createPortal } from "react-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/lib/i18n";
import { ChevronUp, Lock, X } from "lucide-react";

const P = {
  bg: "#070707", surface: "#141414",
  border: "rgba(255,255,255,0.08)", gold: "#C9A84C",
  text: "#f5f5f5", muted: "rgba(255,255,255,0.42)", dim: "rgba(255,255,255,0.16)",
  pepe: "#3ddc52", brett: "#3b82f6", bonk: "#f97316",
};

const pixel = "'Press Start 2P', monospace";
const mono = "'Space Mono', monospace";

export const GALLERY_PAGES = [
  { id: "pepe",         label: "PEPE",    path: "/gallery/pepe",          color: P.pepe,  img: "/pepe.gif",          tag: "OG frog energy"      },
  { id: "brett",        label: "BRETT",   path: "/gallery/brett",         color: P.brett, img: "/brett.gif",         tag: "Money never sleeps"  },
  { id: "bonk",         label: "BONK",    path: "/gallery/bonk",          color: P.bonk,  img: "/bonk.gif",          tag: "Unhinged & orange"   },
  { id: "lore",         label: "Lore",    path: "/gallery/lore",          color: P.gold,  img: "/GOME-LOGO.png",     tag: "The full story"      },
  { id: "memegenerator",label: "Meme Gen",path: "/gallery/memegenerator", color: P.dim,   img: "/memegenerator.gif", tag: "Coming Season 1", soon: true },
  { id: "museum",       label: "Museum",  path: "/gallery/museum",        color: P.dim,   img: "/museum.gif",        tag: "Coming Season 1", soon: true },
];

/**
 * GalleryLayout — simple shell: Header + children + Footer + floating nav pill.
 * No carousel. Each page just renders its own content as normal page flow.
 * The floating pill at the bottom lets you jump to any other gallery page.
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
  const [open, setOpen] = useState(false);

  const current = GALLERY_PAGES.find((p) => p.id === pageId);
  const accent = current?.color || P.gold;

  return (
    <div style={{ minHeight: "100vh", background: P.bg, color: P.text, fontFamily: mono }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Space+Mono:wght@400;700&display=swap');`}</style>

      <Header />

      {/* Page content — just flows naturally */}
      <main>{children}</main>

      <Footer />

      {/* Floating gallery navigator pill */}
      <div style={{
        position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
        zIndex: 90, display: "flex", alignItems: "center",
      }}>
        <button
          onClick={() => setOpen(true)}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            fontFamily: pixel, fontSize: 10, lineHeight: 1,
            color: "#fff", background: "#0c0c0c",
            border: `2px solid ${accent}`,
            padding: "12px 20px", cursor: "pointer",
            boxShadow: `0 4px 24px rgba(0,0,0,0.6), 0 0 16px ${accent}44`,
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ color: accent }}>◈</span>
          {current?.label ?? "GALLERY"}
          <ChevronUp size={14} style={{ opacity: 0.7 }} />
        </button>
      </div>

      {/* Gallery page picker — portal so it's never clipped */}
      {open && createPortal(
        <>
          <div
            onClick={() => setOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 998 }}
          />
          <div style={{
            position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)",
            zIndex: 999, width: "min(340px, 90vw)",
            background: "#0c0c0c", border: `2px solid ${accent}`,
            boxShadow: `0 8px 40px rgba(0,0,0,0.8), 0 0 20px ${accent}33`,
          }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 16px", borderBottom: `1px solid ${P.border}`,
            }}>
              <span style={{ fontFamily: pixel, fontSize: 10, color: P.muted }}>GALLERY</span>
              <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: P.muted, cursor: "pointer", padding: 2 }}>
                <X size={16} />
              </button>
            </div>

            {GALLERY_PAGES.map((p) => {
              const isCurrent = p.id === pageId;
              return (
                <button
                  key={p.id}
                  onClick={() => { if (!p.soon) { setOpen(false); navigate(p.path); } }}
                  style={{
                    display: "flex", alignItems: "center", gap: 14, width: "100%",
                    padding: "14px 16px", border: "none", borderBottom: `1px solid ${P.border}`,
                    background: isCurrent ? `${p.color}12` : "transparent",
                    cursor: p.soon ? "not-allowed" : "pointer",
                    textAlign: "left",
                  }}
                >
                  <div style={{ width: 40, height: 40, flexShrink: 0, background: "#000", overflow: "hidden" }}>
                    <img
                      src={p.img} alt={p.label}
                      style={{
                        width: "100%", height: "100%", objectFit: "cover",
                        filter: p.soon ? "grayscale(0.7) brightness(0.5)" : "none",
                        imageRendering: "pixelated",
                      }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      margin: 0, fontFamily: pixel, fontSize: 11, lineHeight: 1.5,
                      color: p.soon ? P.dim : isCurrent ? p.color : P.text,
                    }}>{p.label}</p>
                    <p style={{ margin: "3px 0 0", fontSize: 11, color: P.muted }}>{p.tag}</p>
                  </div>
                  {isCurrent && (
                    <span style={{ flexShrink: 0, width: 7, height: 7, borderRadius: "50%", background: p.color }} />
                  )}
                  {p.soon && (
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: P.dim, flexShrink: 0 }}>
                      <Lock size={10} /> {t("gallery.soon")}
                    </span>
                  )}
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
