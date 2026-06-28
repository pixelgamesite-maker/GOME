import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { SafeImage } from "@/components/SafeImage";
import MemeMe from "@/components/MemeMe";
import Leaderboard from "@/components/Leaderboard";
import WhitelistApp from "@/components/WhitelistApp";
import TasksPanel from "@/components/TasksPanel";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import DoNotTapButton from "@/components/DoNotTapButton";
import { useLanguage } from "@/lib/i18n";

const P = {
  bg: "#070707", surface: "#141414", border: "rgba(255,255,255,0.08)",
  text: "#f5f5f5", muted: "rgba(255,255,255,0.45)", dim: "rgba(255,255,255,0.18)",
  pepe: "#3ddc52", brett: "#3b82f6", bonk: "#f97316",
  zone2: "#1a0f0a",
};

// Pixel theme — Home only, per request. Other pages stay as they are.
const pixel = "'Press Start 2P', monospace";
const mono = "'Space Mono', monospace";
const heroGradient = "linear-gradient(180deg, #fb923c 0%, #c2410c 100%)";
const pixelClip = "polygon(0 8px,8px 8px,8px 0,calc(100% - 8px) 0,calc(100% - 8px) 8px,100% 8px,100% calc(100% - 8px),calc(100% - 8px) calc(100% - 8px),calc(100% - 8px) 100%,8px 100%,8px calc(100% - 8px),0 calc(100% - 8px))";

const SUPPLY = "4,404";

// Real numbered collection assets — only 1.jpg through 11.jpg exist right now
const COLLECTION_IMAGES = Array.from({ length: 11 }, (_, i) => `/${i + 1}.jpg`);

export default function Home() {
  const { user, loading, signOut } = useAuth();
  const [, navigate] = useLocation();
  const [totalPoints, setTotalPoints] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (!loading && !user) navigate("/");
  }, [user, loading, navigate]);

  if (loading || !user) return null;

  const meta = user.user_metadata || {};
  const avatar = meta.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.id}`;
  const ringGradient = `conic-gradient(${P.pepe}, ${P.brett}, ${P.bonk}, ${P.pepe})`;

  return (
    <div style={{ background: P.bg, minHeight: "100vh", color: P.text, fontFamily: mono }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Space+Mono:wght@400;700&display=swap');
        @keyframes gome-pulse {
          0%, 100% { text-shadow: 0 0 22px rgba(255,255,255,0.4); }
          50% { text-shadow: 0 0 44px rgba(255,255,255,0.8); }
        }
      `}</style>

      {/* ZONE 1 — Navbar + Hero share one continuous gradient, stopping right above the Collab/Whitelist bar */}
      <div style={{ background: heroGradient, position: "relative" }}>
        {/* faint scanline texture for the retro feel */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.06,
          backgroundImage: "repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 3px)",
        }} />

        {/* Nav */}
        <nav style={{
          position: "sticky", top: 0, zIndex: 50, height: 64, padding: "0 20px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <SafeImage src="/GOME-LOGO.png" alt="GOME" style={{ height: 28, width: 28, imageRendering: "pixelated" }} />
            <span style={{ fontFamily: pixel, fontSize: 13, color: "#fff" }}>GOME</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative" }}>
            <LanguageSwitcher />
            <button
              onClick={() => setMenuOpen((v) => !v)}
              style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
            >
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: ringGradient, padding: 2 }}>
                <img src={avatar} alt="avatar" style={{ width: "100%", height: "100%", borderRadius: "50%", display: "block", border: "2px solid #fff" }} />
              </div>
            </button>

            {menuOpen && (
              <>
                <div onClick={() => setMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 55 }} />
                <div style={{
                  position: "absolute", top: 44, right: 0, zIndex: 60, minWidth: 160,
                  background: "#0c0c0c", border: "2px solid #000", padding: 14,
                  display: "flex", flexDirection: "column", gap: 10,
                }}>
                  <span style={{ fontFamily: mono, fontSize: 13, color: "#fff" }}>{totalPoints} {t("nav.pts")}</span>
                  <button onClick={signOut} style={{
                    fontFamily: mono, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
                    color: P.bonk, background: "transparent", border: "none", cursor: "pointer", textAlign: "left", padding: 0,
                  }}>{t("nav.out")}</button>
                </div>
              </>
            )}
          </div>
        </nav>

        {/* Hero */}
        <section style={{ position: "relative", padding: "32px 24px 48px", textAlign: "center" }}>
          <SafeImage src="/Bonk-hero.png" alt="GOME" style={{ height: 260, margin: "0 auto 24px", display: "block", imageRendering: "pixelated" }} />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 18, fontFamily: mono, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.85)" }}>
            <span style={{ width: 7, height: 7, background: "#fff", flexShrink: 0 }} />
            {t("hero.status")} · @GomeJpeg
          </div>

          <h1 style={{
            fontFamily: pixel, fontSize: "clamp(28px, 9vw, 48px)", color: "#fff",
            lineHeight: 1.3, margin: "0 0 10px", animation: "gome-pulse 2.6s ease-in-out infinite",
          }}>
            GOME
          </h1>
          <h2 style={{ fontFamily: pixel, fontSize: "clamp(14px, 4vw, 20px)", color: "#fff", lineHeight: 1.5, margin: "0 0 18px" }}>
            {t("hero.subtitle")}
          </h2>

          <p style={{ fontFamily: mono, fontSize: 14, color: "rgba(255,255,255,0.85)", maxWidth: 380, margin: "0 auto 28px", lineHeight: 1.6 }}>
            {t("hero.tagline")}
          </p>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            <StatBox label={t("stat.mintPrice")} value={t("stat.tba")} />
            <StatBox label={t("stat.supply")} value={SUPPLY} />
            <StatBox label={t("stat.chain")} value="Ethereum" />
            <StatBox label={t("stat.launchpad")} value="OpenSea" />
          </div>
        </section>

        {/* Collab | Whitelist — one rectangle, split in two, sitting right at the zone seam */}
        <div style={{ display: "flex", justifyContent: "center", padding: "0 24px 28px" }}>
          <div style={{ display: "flex", width: "100%", maxWidth: 420, height: 58, clipPath: pixelClip, border: "2px solid #000" }}>
            <button onClick={() => navigate("/collab")} style={splitBtn(P.bonk)}>{t("cta.collab")}</button>
            <div style={{ width: 2, background: "#000", flexShrink: 0 }} />
            <WhitelistApp triggerLabel={t("cta.whitelist")} triggerStyle={splitBtn(P.brett)} />
          </div>
        </div>
      </div>

      {/* ZONE 2 — starts right under the Collab/Whitelist bar, stops right above the Pepe section */}
      <div style={{ background: P.zone2 }}>
        <section style={{ padding: "48px 24px" }}>
          <DoNotTapButton />
        </section>

        <CollectionMarquee images={COLLECTION_IMAGES} supply={SUPPLY} />

        <section style={{ textAlign: "center", padding: "0 24px 56px" }}>
          <SafeImage src="/GOME-HERO.png" alt="GOME" style={{ height: 170, margin: "0 auto", display: "block", imageRendering: "pixelated" }} />
        </section>
      </div>

      {/* CHARACTER SECTIONS — unchanged colors, this is where zone 2 hands off */}
      <CharacterSection bg={P.pepe} name="PEPE" img="/PEPE.PNG" blurb={t("character.pepe")} />
      <CharacterSection bg={`linear-gradient(160deg, ${P.bonk}, #ec4899)`} name="BONK" img="/BONK.PNG" blurb={t("character.bonk")} />
      <CharacterSection bg={P.brett} name="BRETT" img="/BRETT.PNG" blurb={t("character.brett")} />

      {/* MEME ME */}
      <section style={{ padding: "64px 24px", textAlign: "center" }}>
        <p style={eyebrow}>{t("roast.eyebrow")}</p>
        <h2 style={{ fontFamily: pixel, fontSize: 22, color: "#fff", margin: "0 0 14px" }}>{t("roast.title")}</h2>
        <p style={{ fontFamily: mono, fontSize: 14, color: P.muted, maxWidth: 380, margin: "0 auto 32px" }}>
          {t("roast.desc")}
        </p>
        <MemeMe />
      </section>

      {/* TASKS */}
      <main style={{ maxWidth: 700, margin: "0 auto", padding: "8px 24px 72px" }}>
        <TasksPanel onPointsChange={setTotalPoints} />
      </main>

      {/* LEADERBOARD */}
      <section style={{ padding: "16px 24px 80px", textAlign: "center" }}>
        <p style={eyebrow}>{t("leaderboard.eyebrow")}</p>
        <h2 style={{ fontFamily: pixel, fontSize: 22, color: "#fff", margin: "0 0 32px" }}>{t("leaderboard.title")}</h2>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <Leaderboard limit={10} showViewAll />
        </div>
      </section>
    </div>
  );
}

/* Infinite horizontal scroll of numbered collection pieces, rotated like scattered photos */
function CollectionMarquee({ images, supply }: { images: string[]; supply: string }) {
  const [paused, setPaused] = useState(false);
  const { t } = useLanguage();
  const rotations = [-3, 2, -1.5, 3, -2, 1, -3.5, 2.5, -1, 1.5];

  return (
    <section style={{ padding: "8px 0 48px", overflow: "hidden" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px", textAlign: "center", marginBottom: 4 }}>
        <p style={eyebrow}>{t("collection.eyebrow")}</p>
        <h2 style={{ fontFamily: pixel, fontSize: 20, color: "#fff", margin: "0 0 8px" }}>{t("collection.title")}</h2>
      </div>

      <div style={{ overflow: "hidden", cursor: "grab" }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <motion.div
          style={{ display: "flex", gap: 18, padding: "28px 24px" }}
          animate={{ x: paused ? undefined : [0, -(images.length * 150)] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear", repeatType: "loop" }}
        >
          {[...images, ...images].map((src, i) => (
            <div key={i} style={{
              flexShrink: 0, width: 130, transform: `rotate(${rotations[i % rotations.length]}deg)`,
              background: "#fff", border: "3px solid #000", padding: 6, imageRendering: "pixelated",
            }}>
              <img
                src={src} alt={`GOME #${(i % images.length) + 1}`}
                style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block", imageRendering: "pixelated" }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>
          ))}
        </motion.div>
      </div>

      <p style={{ textAlign: "center", fontFamily: mono, fontSize: 11, letterSpacing: "0.1em", color: P.muted, textTransform: "uppercase" }}>
        {supply} {t("collection.captionSuffix")}
      </p>
    </section>
  );
}

function CharacterSection({ bg, name, blurb, img }: { bg: string; name: string; blurb: string; img: string }) {
  return (
    <section style={{ background: bg, padding: "56px 24px 64px", textAlign: "center" }}>
      <h2 style={{ fontFamily: pixel, fontSize: 24, color: "#fff", margin: "0 0 16px", textShadow: "0 3px 0 rgba(0,0,0,0.2)" }}>
        {name}
      </h2>
      <p style={{ color: "rgba(255,255,255,0.95)", fontSize: 15, lineHeight: 1.7, maxWidth: 420, margin: "0 auto 28px" }}>
        {blurb}
      </p>
      <div style={{ display: "inline-block", background: "#fff", padding: 18, boxShadow: "0 14px 34px rgba(0,0,0,0.25)" }}>
        <SafeImage src={img} alt={name} style={{ height: 200, display: "block", objectFit: "contain", imageRendering: "pixelated" }} />
      </div>
    </section>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "rgba(0,0,0,0.28)", border: "1px solid rgba(0,0,0,0.4)", padding: "12px 16px", minWidth: 100 }}>
      <p style={{ margin: "0 0 4px", fontFamily: mono, fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}>{label}</p>
      <p style={{ margin: 0, fontFamily: mono, fontWeight: 700, fontSize: 14, color: "#fff" }}>{value}</p>
    </div>
  );
}

const eyebrow: React.CSSProperties = {
  fontFamily: mono, fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase",
  color: P.muted, margin: "0 0 10px",
};

function splitBtn(color: string): React.CSSProperties {
  return {
    flex: 1, fontFamily: mono, fontSize: 12, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase",
    color: "#fff", background: color, border: "none", borderRadius: 0, cursor: "pointer",
  };
}
