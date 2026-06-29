import Header from "@/components/Header";
import Footer from "@/components/Footer";

const P = {
  bg: "#070707", surface: "#141414", border: "rgba(255,255,255,0.08)",
  text: "#f5f5f5", muted: "rgba(255,255,255,0.45)",
  pepe: "#3ddc52", brett: "#3b82f6", bonk: "#f97316",
};
const pixel = "'Press Start 2P', monospace";
const mono = "'Space Mono', monospace";

export default function Collab() {
  return (
    <div style={{ background: P.bg, minHeight: "100vh", color: P.text, fontFamily: mono }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Space+Mono:wght@400;700&display=swap');`}</style>
      <Header />

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: P.bonk, marginBottom: 18 }}>
          Partnerships
        </p>
        <h1 style={{ fontFamily: pixel, fontSize: "clamp(20px, 5vw, 32px)", lineHeight: 1.5, marginBottom: 20 }}>
          Let's build <span style={{ color: P.bonk }}>together.</span>
        </h1>
        <p style={{ fontSize: 15, color: P.muted, lineHeight: 1.7, maxWidth: 520, margin: "0 auto 44px" }}>
          GOME is open to collaborations with meme communities, NFT projects, and culture-driven brands.
        </p>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, textAlign: "left", marginBottom: 48,
        }}>
          {[
            { title: "Community Drop", desc: "Co-branded meme collection with your community.", color: P.pepe },
            { title: "Trait Collab", desc: "Custom traits designed by your artists.", color: P.brett },
            { title: "Event Partnership", desc: "Twitter Spaces, raids, and joint mint events.", color: P.bonk },
          ].map((c) => (
            <div key={c.title} style={{
              background: P.surface, border: `1px solid ${P.border}`, padding: 24,
              borderLeft: `4px solid ${c.color}`,
            }}>
              <h4 style={{ fontFamily: pixel, fontSize: 13, lineHeight: 1.6, margin: "0 0 10px", color: c.color }}>{c.title}</h4>
              <p style={{ margin: 0, fontSize: 14, color: P.muted, lineHeight: 1.6 }}>{c.desc}</p>
            </div>
          ))}
        </div>

        <a href="https://x.com/GomeJpeg" target="_blank" rel="noreferrer" style={{
          display: "inline-block", fontFamily: mono, fontWeight: 800, fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase",
          color: "#000", background: P.bonk, padding: "16px 40px", textDecoration: "none",
          boxShadow: `0 4px 24px rgba(249,115,22,0.3)`,
        }}>
          DM us on X
        </a>
      </div>

      <Footer />
    </div>
  );
}
