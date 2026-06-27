import { useLocation } from "wouter";

const P = {
  bg: "#070707", surface: "#141414", border: "rgba(255,255,255,0.06)",
  gold: "#C9A84C", text: "#f5f5f5", muted: "rgba(255,255,255,0.4)",
  pepe: "#3ddc52", brett: "#3b82f6", bonk: "#f97316",
};

const display = "'Fredoka', sans-serif";
const body = "'Space Grotesk', sans-serif";

export default function Collab() {
  const [, navigate] = useLocation();

  return (
    <div style={{ background: P.bg, minHeight: "100vh", color: P.text, fontFamily: body }}>
      <nav style={{
        height: 72, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: `1px solid ${P.border}`, background: "rgba(7,7,7,0.92)", backdropFilter: "blur(20px)",
      }}>
        <button onClick={() => navigate("/")} style={{
          fontFamily: display, fontSize: 16, color: P.gold, background: "transparent", border: "none", cursor: "pointer",
        }}>‹ GOME</button>
        <span style={{ fontFamily: display, fontSize: 18, fontWeight: 600 }}>Collab</span>
        <div style={{ width: 60 }} />
      </nav>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: P.gold, marginBottom: 14 }}>
          Partnerships
        </p>
        <h1 style={{ fontFamily: display, fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 600, marginBottom: 16 }}>
          Let's build <span style={{ color: P.gold }}>together.</span>
        </h1>
        <p style={{ fontSize: 16, color: P.muted, lineHeight: 1.7, maxWidth: 520, margin: "0 auto 40px" }}>
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
              background: P.surface, border: `1px solid ${P.border}`, borderRadius: 16, padding: 24,
              borderLeft: `4px solid ${c.color}`,
            }}>
              <h4 style={{ fontFamily: display, fontSize: 18, margin: "0 0 8px", color: c.color }}>{c.title}</h4>
              <p style={{ margin: 0, fontSize: 14, color: P.muted, lineHeight: 1.6 }}>{c.desc}</p>
            </div>
          ))}
        </div>

        <a href="https://x.com/GomeJpeg" target="_blank" rel="noreferrer" style={{
          display: "inline-block", fontWeight: 800, fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase",
          color: "#000", background: P.gold, borderRadius: 12, padding: "16px 40px", textDecoration: "none",
          boxShadow: `0 4px 24px rgba(201,168,76,0.25)`,
        }}>
          DM us on X
        </a>
      </div>
    </div>
  );
}
