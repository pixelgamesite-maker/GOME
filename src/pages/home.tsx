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
import { useLanguage } from "@/lib/i18n";

const P = {
  bg: "#070707", surface: "#141414", border: "rgba(255,255,255,0.08)",
  text: "#f5f5f5", muted: "rgba(255,255,255,0.45)", dim: "rgba(255,255,255,0.18)",
  pepe: "#3ddc52", brett: "#3b82f6", bonk: "#f97316",
};

const marker = "'Permanent Marker', cursive";
const cursive = "'Caveat', cursive";
const mono = "'Space Mono', monospace";
const body = "'Space Grotesk', sans-serif";

const SUPPLY = "4,404";

// Real collection preview assets — /1.jpg through /20.jpg in public/
const COLLECTION_IMAGES = Array.from({ length: 20 }, (_, i) => `/${i + 1}.jpg`);

export default function Home() {
  const { user, loading, signOut } = useAuth();
  const [, navigate] = useLocation();
  const [totalPoints, setTotalPoints] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    if (!loading && !user) navigate("/");
  }, [user, loading, navigate]);

  if (loading || !user) return null;

  const meta = user.user_metadata || {};
  const avatar = meta.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.id}`;
  const ringGradient = `conic-gradient(${P.pepe}, ${P.brett}, ${P.bonk}, ${P.pepe})`;

  return (
    <div style={{ background: P.bg, minHeight: "100vh", color: P.text, fontFamily: body }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Caveat:wght@400;700&family=Space+Mono:wght@400;700&display=swap');
        @keyframes gome-pulse {
          0%, 100% { text-shadow: 0 0 22px rgba(255,255,255,0.3); }
          50% { text-shadow: 0 0 44px rgba(255,255,255,0.65); }
        }
      `}</style>

      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50, height: 72,
        padding: "0 16px 0 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(7,7,7,0.92)", backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${P.border}`, gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <SafeImage src="/GOME-LOGO.png" alt="GOME" style={{ height: 30, width: 30 }} />
          <span style={{ fontFamily: marker, fontSize: 18 }}>GOME</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <LanguageSwitcher />
          <span style={{
            fontFamily: mono, fontSize: 12, color: P.text, background: P.surface,
            border: `1px solid ${P.border}`, padding: "6px 14px", borderRadius: 20,
          }}>
            {totalPoints} {t("nav.pts")}
          </span>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: ringGradient, padding: 2, flexShrink: 0 }}>
            <img src={avatar} alt="avatar" style={{ width: "100%", height: "100%", borderRadius: "50%", display: "block", border: `2px solid ${P.bg}` }} />
          </div>
          <button onClick={signOut} style={{
            fontFamily: mono, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
            color: P.muted, background: "transparent", border: "none", cursor: "pointer",
          }}>{t("nav.out")}</button>
        </div>
      </nav>

      {/* HERO — headline, stats, CTAs all in one block */}
      <section style={{ position: "relative", padding: "96px 24px 48px", overflow: "hidden" }}>
        <WireframeDecor />

        <SafeImage src="/GOME-HERO.png" alt="GOME" style={{ height: 150, margin: "0 auto 28px", display: "block" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, fontFamily: mono, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: P.muted }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: P.pepe, flexShrink: 0 }} />
          {t("hero.status")} · @GomeJpeg
        </div>

        <h1 style={{
          fontFamily: marker, fontSize: "clamp(46px, 13vw, 88px)", color: "#fff",
          lineHeight: 1, margin: "0 0 2px", animation: "gome-pulse 2.6s ease-in-out infinite",
        }}>
          GOME
        </h1>
        <h2 style={{ fontFamily: marker, fontSize: "clamp(26px, 7vw, 46px)", color: P.pepe, lineHeight: 1, margin: "0 0 20px" }}>
          {t("hero.subtitle")}
        </h2>

        <p style={{ fontFamily: cursive, fontSize: 20, color: "rgba(255,255,255,0.78)", maxWidth: 400, margin: "0 0 32px", lineHeight: 1.5 }}>
          {t("hero.tagline")}
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 32 }}>
          <StatBox label={t("stat.mintPrice")} value={t("stat.tba")} />
          <StatBox label={t("stat.supply")} value={SUPPLY} />
          <StatBox label={t("stat.chain")} value="Ethereum" />
          <StatBox label={t("stat.launchpad")} value="OpenSea" />
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={() => navigate("/gallery")} style={outlinePill(P.pepe)}>{t("cta.gallery")}</button>
          <button onClick={() => navigate("/collab")} style={outlinePill(P.bonk)}>{t("cta.collab")}</button>
          <WhitelistApp triggerLabel={t("cta.whitelist")} triggerStyle={solidPill(P.brett)} />
        </div>
      </section>

      {/* STEP INTO THE GALLERY — big bold CTA */}
      <section style={{ padding: "16px 24px 64px", textAlign: "center" }}>
        <p style={eyebrow}>{t("explore.eyebrow")}</p>
        <h2 style={{ fontFamily: marker, fontSize: 32, color: "#fff", margin: "0 0 14px" }}>{t("explore.title")}</h2>
        <p style={{ fontFamily: cursive, fontSize: 18, color: P.muted, maxWidth: 420, margin: "0 auto 30px", lineHeight: 1.5 }}>
          {t("explore.desc")}
        </p>
        <button
          onClick={() => navigate("/gallery")}
          style={{
            fontFamily: mono, fontWeight: 700, fontSize: 14, textTransform: "uppercase", letterSpacing: "0.06em",
            background: P.pepe, color: "#000", border: "none", borderRadius: 14,
            padding: "18px 40px", cursor: "pointer", boxShadow: `0 0 34px ${P.pepe}55`,
          }}
        >
          {t("explore.button")}
        </button>
      </section>

      {/* COLLECTION — infinite scrolling marquee */}
      <CollectionMarquee images={COLLECTION_IMAGES} supply={SUPPLY} />

      {/* CHARACTER SECTIONS */}
      <CharacterSection bg={P.pepe} name="PEPE" img="/PEPE.PNG" blurb={t("character.pepe")} />
      <CharacterSection bg={`linear-gradient(160deg, ${P.bonk}, #ec4899)`} name="BONK" img="/BONK.PNG" blurb={t("character.bonk")} />
      <CharacterSection bg={P.brett} name="BRETT" img="/BRETT.PNG" blurb={t("character.brett")} />

      {/* MEME ME */}
      <section style={{ padding: "64px 24px", textAlign: "center" }}>
        <p style={eyebrow}>{t("roast.eyebrow")}</p>
        <h2 style={{ fontFamily: marker, fontSize: 30, color: "#fff", margin: "0 0 12px" }}>{t("roast.title")}</h2>
        <p style={{ fontFamily: cursive, fontSize: 17, color: P.muted, maxWidth: 380, margin: "0 auto 32px" }}>
          {t("roast.desc")}
        </p>
        <MemeMe />
      </section>

      {/* TASKS — its own component, see @/components/TasksPanel */}
      <main style={{ maxWidth: 700, margin: "0 auto", padding: "8px 24px 72px" }}>
        <TasksPanel onPointsChange={setTotalPoints} />
      </main>

      {/* LEADERBOARD */}
      <section style={{ padding: "16px 24px 80px", textAlign: "center" }}>
        <p style={eyebrow}>{t("leaderboard.eyebrow")}</p>
        <h2 style={{ fontFamily: marker, fontSize: 30, color: "#fff", margin: "0 0 32px" }}>{t("leaderboard.title")}</h2>
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
    <section style={{ padding: "8px 0 56px", overflow: "hidden" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px", textAlign: "center", marginBottom: 4 }}>
        <p style={eyebrow}>{t("collection.eyebrow")}</p>
        <h2 style={{ fontFamily: marker, fontSize: 30, color: "#fff", margin: "0 0 8px" }}>{t("collection.title")}</h2>
      </div>

      <div style={{ overflow: "hidden", cursor: "grab" }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <motion.div
          style={{ display: "flex", gap: 18, padding: "28px 24px" }}
          animate={{ x: paused ? undefined : [0, -(images.length * 150)] }}
          transition={{ duration: 26, repeat: Infinity, ease: "linear", repeatType: "loop" }}
        >
          {[...images, ...images].map((src, i) => (
            <div key={i} style={{
              flexShrink: 0, width: 130, transform: `rotate(${rotations[i % rotations.length]}deg)`,
              background: "#fff", border: "3px solid #000", borderRadius: 6, padding: 6,
              boxShadow: "4px 4px 0 rgba(0,0,0,0.6)",
            }}>
              <img
                src={src} alt={`GOME #${(i % images.length) + 1}`}
                style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block", borderRadius: 2 }}
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
      <h2 style={{ fontFamily: marker, fontSize: 38, color: "#fff", margin: "0 0 14px", textShadow: "0 3px 0 rgba(0,0,0,0.2)" }}>
        {name}
      </h2>
      <p style={{ color: "rgba(255,255,255,0.95)", fontSize: 15, lineHeight: 1.7, maxWidth: 420, margin: "0 auto 28px" }}>
        {blurb}
      </p>
      <div style={{ display: "inline-block", background: "#fff", borderRadius: 28, padding: 18, boxShadow: "0 14px 34px rgba(0,0,0,0.25)" }}>
        <SafeImage src={img} alt={name} style={{ height: 200, display: "block", objectFit: "contain" }} />
      </div>
    </section>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: P.surface, border: `1px solid ${P.border}`, borderRadius: 14, padding: "12px 18px", minWidth: 108 }}>
      <p style={{ margin: "0 0 4px", fontFamily: mono, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: P.muted }}>{label}</p>
      <p style={{ margin: 0, fontFamily: mono, fontWeight: 700, fontSize: 16, color: "#fff" }}>{value}</p>
    </div>
  );
}

/* Faint wireframe shapes for hero atmosphere */
function WireframeDecor() {
  return (
    <svg style={{ position: "absolute", top: 0, right: 0, width: 220, height: 220, opacity: 0.18, pointerEvents: "none" }} viewBox="0 0 200 200">
      <polygon points="100,10 180,60 180,140 100,190 20,140 20,60" fill="none" stroke="#fff" strokeWidth="1" />
      <polygon points="100,40 150,70 150,130 100,160 50,130 50,70" fill="none" stroke="#fff" strokeWidth="1" />
      <line x1="100" y1="10" x2="100" y2="190" stroke="#fff" strokeWidth="0.5" />
    </svg>
  );
}

const eyebrow: React.CSSProperties = {
  fontFamily: mono, fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase",
  color: P.muted, margin: "0 0 10px",
};

function outlinePill(color: string): React.CSSProperties {
  return {
    fontFamily: mono, fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase",
    color, background: "transparent", border: `1.5px solid ${color}`, borderRadius: 30,
    padding: "10px 20px", cursor: "pointer",
  };
}
function solidPill(color: string): React.CSSProperties {
  return {
    ...outlinePill(color), background: color, color: "#fff", border: "none", boxShadow: `0 0 24px ${color}55`,
  };
}
