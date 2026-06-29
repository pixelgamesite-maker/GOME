import GalleryLayout from "@/components/GalleryLayout";
import Footer from "@/components/Footer";
import { SafeImage } from "@/components/SafeImage";

const P = { bonk: "#f97316", bg: "#070707", text: "#f5f5f5", muted: "rgba(255,255,255,0.5)", surface: "#141414" };
const pixel = "'Press Start 2P', monospace";
const mono = "'Space Mono', monospace";

export default function GalleryBonk() {
  return (
    <>
      <GalleryLayout pageId="bonk" />

      <div style={{ background: P.bg, color: P.text, fontFamily: mono }}>
        <section style={{ maxWidth: 680, margin: "0 auto", padding: "16px 24px 56px" }}>
          <h2 style={{ fontFamily: pixel, fontSize: 18, lineHeight: 1.6, color: P.bonk, margin: "0 0 20px" }}>BONK</h2>

          <p style={{ lineHeight: 1.8, color: "rgba(255,255,255,0.9)", margin: "0 0 18px" }}>
            Not every legend begins with a plan.
          </p>
          <p style={{ lineHeight: 1.8, color: P.muted, margin: "0 0 18px" }}>
            Bonk arrived as a joke, embraced by a community that refused to take itself too seriously. What started as a
            playful Shiba Inu quickly became a symbol of optimism, resilience, and the lighter side of crypto. Through
            bull runs, bear markets, and countless memes, Bonk proved that culture is built by people having fun together.
          </p>
          <p style={{ lineHeight: 1.8, color: P.muted, margin: "0 0 36px" }}>
            Today, Bonk stands as one of Web3's most recognizable mascots — a reminder that sometimes the biggest
            movements start with a simple meme.
          </p>

          <div style={{ display: "flex", gap: 12, marginBottom: 40 }}>
            <Stat label="Rarity" value="Rare → Exotic" color={P.bonk} />
            <Stat label="Supply" value="~1,335" color={P.bonk} />
          </div>

          <div style={{ borderTop: `2px solid ${P.bonk}`, paddingTop: 28 }}>
            <p style={{ fontFamily: pixel, fontSize: 12, lineHeight: 1.6, color: P.bonk, margin: "0 0 14px" }}>
              FROM SKETCH TO MEME
            </p>
            <p style={{ lineHeight: 1.8, color: P.muted, margin: "0 0 20px" }}>
              Every G.O.M.E begins as a sketch before finding its place in the gallery. Explore how Bonk evolved from
              rough concepts and early line work into a polished tribute to one of crypto's most beloved internet icons.
              Every revision, every color choice, and every detail helped shape the final piece you see today.
            </p>
            <div style={{ border: `2px solid ${P.bonk}`, background: P.surface, padding: 6 }}>
              <SafeImage src="/BONK-MAKING.jpg" alt="The making of Bonk" style={{ width: "100%", display: "block", imageRendering: "pixelated" }} />
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ background: P.surface, border: "1px solid rgba(255,255,255,0.08)", padding: "12px 16px", flex: 1 }}>
      <p style={{ margin: "0 0 4px", fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
      <p style={{ margin: 0, fontFamily: pixel, fontSize: 11, lineHeight: 1.5, color }}>{value}</p>
    </div>
  );
}
