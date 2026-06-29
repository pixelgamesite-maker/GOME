import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { SafeImage } from "@/components/SafeImage";

const P = {
  bg: "#070707", bonk: "#f97316", bonkDim: "rgba(249,115,22,0.15)",
  text: "#f5f5f5", muted: "rgba(255,255,255,0.4)", surface: "#141414",
};

const FONT_LINK = "https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Space+Mono:wght@400;700&display=swap";
const pixel = "'Press Start 2P', monospace";
const mono = "'Space Mono', monospace";

export default function Landing() {
  const { signInWithTwitter, session } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (session) navigate("/home");
    const l = document.createElement("link");
    l.rel = "stylesheet"; l.href = FONT_LINK; document.head.appendChild(l);
  }, [session, navigate]);

  return (
    <div style={{
      minHeight: "100vh", background: P.bg, color: P.text, fontFamily: mono,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: 24, position: "relative", overflow: "hidden",
    }}>
      <style>{`@import url('${FONT_LINK}');`}</style>

      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 600, height: 400, borderRadius: "50%",
        background: `radial-gradient(ellipse, ${P.bonkDim} 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 420 }}>
        <SafeImage src="/GOME-LOGO.png" alt="GOME" style={{
          height: 64, width: 64, objectFit: "contain", margin: "0 auto 24px", imageRendering: "pixelated",
        }} fallback={<span style={{ fontFamily: pixel, fontSize: 36, color: P.bonk }}>G</span>} />

        <h1 style={{
          fontFamily: pixel, fontSize: "clamp(20px, 5vw, 30px)",
          lineHeight: 1.6, marginBottom: 20,
        }}>
          Gallery of <span style={{ color: P.bonk }}>Memes</span>
        </h1>

        <p style={{ fontSize: 14, color: P.muted, lineHeight: 1.7, marginBottom: 36 }}>
          Connect your X to enter the gallery, collect points, and secure your whitelist spot.
        </p>

        <button onClick={signInWithTwitter} style={{
          fontFamily: mono, fontWeight: 700, fontSize: 13,
          letterSpacing: "0.08em", textTransform: "uppercase", color: "#000",
          background: P.bonk, border: "2px solid #000", borderRadius: 0, padding: "16px 40px",
          cursor: "pointer", transition: "transform 0.15s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
        >
          Sign in with X
        </button>

        <p style={{ marginTop: 20, fontSize: 11, color: "rgba(255,255,255,0.2)" }}>
          No password required. One-click auth.
        </p>
      </div>
    </div>
  );
}
