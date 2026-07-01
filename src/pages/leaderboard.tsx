import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/lib/i18n";

const P = { bg: "#070707", text: "#f5f5f5", muted: "rgba(255,255,255,0.45)", border: "rgba(255,255,255,0.08)" };
const pixel = "'Press Start 2P', monospace";
const mono = "'Space Mono', monospace";
const ACCENT = "#3ddc52";

const LOADING_MESSAGES = [
  "FETCHING LEGENDS...",
  "COUNTING POINTS...",
  "RANKING DEGENS...",
  "ALMOST THERE...",
  "JUST KIDDING.",
];

export default function LeaderboardPage() {
  const { t } = useLanguage();
  const [clicked, setClicked] = useState(false);
  const [progress, setProgress] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!clicked) return;

    // Progress bar races to ~96% then stalls, then snaps to "done"
    const intervals: ReturnType<typeof setInterval>[] = [];

    let p = 0;
    const bar = setInterval(() => {
      p += Math.random() * 14;
      if (p >= 96) { p = 96; clearInterval(bar); }
      setProgress(p);
    }, 280);
    intervals.push(bar);

    // Cycle through loading messages
    const msg = setInterval(() => {
      setMsgIndex((i) => {
        if (i >= LOADING_MESSAGES.length - 1) {
          clearInterval(msg);
          // Snap bar to 100 and reveal "coming soon"
          setTimeout(() => { setProgress(100); setDone(true); }, 400);
          return i;
        }
        return i + 1;
      });
    }, 900);
    intervals.push(msg);

    return () => intervals.forEach(clearInterval);
  }, [clicked]);

  return (
    <div style={{ background: P.bg, minHeight: "100vh", color: P.text, fontFamily: mono }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Space+Mono:wght@400;700&display=swap');
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
      <Header />

      <main style={{ maxWidth: 600, margin: "0 auto", padding: "60px 24px 80px", textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <p style={{ margin: "0 0 10px", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: P.muted }}>
            {t("leaderboard.eyebrow")}
          </p>
          <h1 style={{ margin: "0 0 48px", fontFamily: pixel, fontSize: 18, lineHeight: 1.6, color: "#fff" }}>
            LEADERBOARD
          </h1>
        </motion.div>

        {!clicked ? (
          /* ── Idle state ── */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <p style={{ margin: "0 0 32px", fontSize: 14, color: P.muted, lineHeight: 1.7 }}>
              See who's leading the GOME ranks.<br />Top 1000 wallets get a guaranteed mint.
            </p>
            <button
              onClick={() => setClicked(true)}
              style={{
                fontFamily: pixel, fontSize: 12, lineHeight: 1.6, color: "#000",
                background: ACCENT, border: "none", padding: "16px 36px",
                cursor: "pointer", boxShadow: `0 0 28px ${ACCENT}55`,
              }}
            >
              VIEW LEADERBOARD
            </button>
          </motion.div>
        ) : !done ? (
          /* ── Loading state ── */
          <motion.div
            key="loading"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}
          >
            {/* Progress bar */}
            <div style={{ width: "100%", height: 6, background: P.border, overflow: "hidden" }}>
              <motion.div
                style={{ height: "100%", background: ACCENT, originX: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeOut", duration: 0.3 }}
              />
            </div>

            {/* Cycling message */}
            <AnimatePresence mode="wait">
              <motion.p
                key={msgIndex}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                style={{ fontFamily: pixel, fontSize: 10, lineHeight: 1.8, color: ACCENT }}
              >
                {LOADING_MESSAGES[msgIndex]}
              </motion.p>
            </AnimatePresence>

            <p style={{ fontSize: 12, color: P.muted }}>{Math.round(progress)}%</p>
          </motion.div>
        ) : (
          /* ── Coming soon reveal ── */
          <motion.div
            key="soon"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}
          >
            {/* Full bar */}
            <div style={{ width: "100%", height: 6, background: ACCENT }} />

            <motion.p
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              style={{ fontFamily: pixel, fontSize: 22, lineHeight: 1.6, color: ACCENT }}
            >
              COMING SOON
            </motion.p>

            <p style={{ fontSize: 13, color: P.muted, lineHeight: 1.7, maxWidth: 360 }}>
              The leaderboard is being built. Keep completing tasks — your points are being tracked and will count when rankings go live.
            </p>

            <div style={{ padding: "14px 20px", border: `1px solid ${P.border}`, background: "rgba(255,255,255,0.03)", width: "100%" }}>
              <p style={{ margin: 0, fontFamily: pixel, fontSize: 9, lineHeight: 1.8, color: P.muted }}>
                TOP 1000 WALLETS GET GUARANTEED MINT
              </p>
            </div>

            <button
              onClick={() => { setClicked(false); setProgress(0); setMsgIndex(0); setDone(false); }}
              style={{
                fontFamily: mono, fontSize: 12, fontWeight: 700, color: P.muted,
                background: "transparent", border: `1px solid ${P.border}`,
                padding: "10px 22px", cursor: "pointer",
              }}
            >
              Go Back
            </button>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}
