import React from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/lib/i18n";
import { Lock } from "lucide-react";

const P = {
  bg: "#070707", surface: "#141414", border: "rgba(255,255,255,0.08)",
  text: "#f5f5f5", muted: "rgba(255,255,255,0.42)", dim: "rgba(255,255,255,0.16)",
  pepe: "#3ddc52", brett: "#3b82f6", bonk: "#f97316", gold: "#C9A84C",
};
const pixel = "'Press Start 2P', monospace";
const mono = "'Space Mono', monospace";

export const GALLERY_PAGES = [
  { id: "pepe",          label: "PEPE",     path: "/gallery/pepe",          color: P.pepe,  img: "/pepe.gif",          tag: "OG frog energy"     },
  { id: "brett",         label: "BRETT",    path: "/gallery/brett",         color: P.brett, img: "/brett.gif",         tag: "Money never sleeps" },
  { id: "bonk",          label: "BONK",     path: "/gallery/bonk",          color: P.bonk,  img: "/bonk.gif",          tag: "Unhinged & orange"  },
  { id: "lore",          label: "Lore",     path: "/gallery/lore",          color: P.gold,  img: "/GOME-LORE.jpg",     tag: "The full story"     },
  { id: "memegenerator", label: "Meme Gen", path: "/gallery/memegenerator", color: P.dim,   img: "/memegenerator.gif", tag: "Coming Season 1", soon: true },
  { id: "museum",        label: "Museum",   path: "/gallery/museum",        color: P.dim,   img: "/museum.gif",        tag: "Coming Season 1", soon: true },
];

/**
 * GalleryLayout — dual purpose:
 *
 * 1. No pageId  →  Hub: 3×2 grid of all gallery pages (used at /gallery)
 * 2. With pageId →  Shell: Header + children + Footer for a sub-page
 *
 * One component, one file, zero duplication.
 */
export default function GalleryLayout({
  children,
  pageId,
}: {
  children?: React.ReactNode;
  pageId?: string;
}) {
  const [, navigate] = useLocation();
  const { t } = useLanguage();

  return (
    <div style={{ minHeight: "100vh", background: P.bg, color: P.text, fontFamily: mono }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Space+Mono:wght@400;700&display=swap');`}</style>
      <Header />

      {!pageId ? (
        /* ── HUB: 3×2 grid ── */
        <main style={{ maxWidth: 680, margin: "0 auto", padding: "36px 20px 80px" }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <p style={{ margin: "0 0 8px", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: P.muted }}>G.O.M.E</p>
            <h1 style={{ margin: "0 0 32px", fontFamily: pixel, fontSize: 16, lineHeight: 1.6, color: "#fff" }}>GALLERY</h1>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {GALLERY_PAGES.map((p, i) => (
              <motion.button
                key={p.id}
                onClick={() => !p.soon && navigate(p.path)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.35 }}
                whileHover={!p.soon ? { scale: 1.03 } : {}}
                whileTap={!p.soon ? { scale: 0.97 } : {}}
                style={{
                  display: "flex", flexDirection: "column", padding: 0,
                  background: P.surface, border: `2px solid ${p.soon ? P.border : p.color}`,
                  cursor: p.soon ? "not-allowed" : "pointer", overflow: "hidden",
                  textAlign: "left", opacity: p.soon ? 0.55 : 1,
                  boxShadow: p.soon ? "none" : `0 0 14px ${p.color}22`,
                }}
              >
                <div style={{ width: "100%", aspectRatio: "1", background: "#000", overflow: "hidden" }}>
                  <img src={p.img} alt={p.label} style={{ width: "100%", height: "100%", objectFit: "cover", imageRendering: "pixelated", filter: p.soon ? "grayscale(0.7) brightness(0.5)" : "none" }} />
                </div>
                <div style={{ padding: "10px 10px 12px" }}>
                  <p style={{ margin: "0 0 4px", fontFamily: pixel, fontSize: 10, lineHeight: 1.4, color: p.soon ? P.dim : p.color }}>{p.label}</p>
                  {p.soon
                    ? <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 9, color: P.dim }}><Lock size={9} /> {t("gallery.soon")}</span>
                    : <p style={{ margin: 0, fontSize: 10, color: P.muted, lineHeight: 1.4 }}>{p.tag}</p>
                  }
                </div>
              </motion.button>
            ))}
          </div>
        </main>
      ) : (
        /* ── SUB-PAGE SHELL ── */
        <main>{children}</main>
      )}

      <Footer />
    </div>
  );
}
