import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { SafeImage } from "@/components/SafeImage";

const P = {
  bg: "#070707", gold: "#C9A84C", goldDim: "rgba(201,168,76,0.15)",
  text: "#f5f5f5", muted: "rgba(255,255,255,0.4)", surface: "#141414",
};

const FONT_LINK = "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Fredoka:wght@400;500;600;700&display=swap";

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
      minHeight: "100vh", background: P.bg, color: P.text,
      fontFamily: "'Space Grotesk', sans-serif",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: 24, position: "relative", overflow: "hidden",
    }}>
      <style>{`@import url('${FONT_LINK}');`}</style>

      {/* Glow */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 600, height: 400, borderRadius: "50%",
        background: `radial-gradient(ellipse, ${P.goldDim} 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 420 }}>
        <SafeImage src="/GOME-LOGO.png" alt="GOME" style={{
          height: 72, width: 72, objectFit: "contain", margin: "0 auto 24px", filter: "brightness(1.1)",
        }} fallback={<span style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 48, color: P.gold }}>G</span>} />

        <h1 style={{
          fontFamily: "'Fredoka', sans-serif", fontSize: "clamp(2.5rem, 6vw, 4rem)",
          fontWeight: 600, lineHeight: 1, marginBottom: 16, letterSpacing: "-0.02em",
        }}>
          Gallery of <span style={{ color: P.gold }}>Memes</span>
        </h1>

        <p style={{ fontSize: 15, color: P.muted, lineHeight: 1.7, marginBottom: 36 }}>
          Connect your X to enter the gallery, collect points, and secure your whitelist spot.
        </p>

        <button onClick={signInWithTwitter} style={{
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 13,
          letterSpacing: "0.08em", textTransform: "uppercase", color: "#000",
          background: P.gold, border: "none", borderRadius: 12, padding: "16px 40px",
          cursor: "pointer", transition: "all 0.2s", boxShadow: `0 4px 24px rgba(201,168,76,0.25)`,
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "#e0c160"; e.currentTarget.style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = P.gold; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          Sign in with X
        </button>

        <p style={{ marginTop: 20, fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
          No password required. One-click auth.
        </p>
      </div>
    </div>
  );
}
