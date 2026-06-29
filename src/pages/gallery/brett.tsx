import GalleryLayout from "@/components/GalleryLayout";
import Footer from "@/components/Footer";
import { SafeImage } from "@/components/SafeImage";

const P = { brett: "#3b82f6", bg: "#070707", text: "#f5f5f5", muted: "rgba(255,255,255,0.5)", surface: "#141414" };
const pixel = "'Press Start 2P', monospace";
const mono = "'Space Mono', monospace";

export default function GalleryBrett() {
  return (
    <>
      <GalleryLayout pageId="brett" />

      <div style={{ background: P.bg, color: P.text, fontFamily: mono }}>
        <section style={{ maxWidth: 680, margin: "0 auto", padding: "16px 24px 56px" }}>
          <h2 style={{ fontFamily: pixel, fontSize: 18, lineHeight: 1.6, color: P.brett, margin: "0 0 20px" }}>BRETT</h2>

          <p style={{ lineHeight: 1.8, color: "rgba(255,255,255,0.9)", margin: "0 0 18px" }}>
            Some icons don't chase the spotlight — they become it.
          </p>
          <p style={{ lineHeight: 1.8, color: P.muted, margin: "0 0 18px" }}>
            Brett earned his place in internet culture through his unmistakable blue look, laid-back attitude, and
            effortless charm. While the internet never stops moving, Brett remains calm, becoming a symbol of
            confidence, friendship, and the lighter side of Web3.
          </p>
          <p style={{ lineHeight: 1.8, color: P.muted, margin: "0 0 36px" }}>
            From memes to blockchain communities, Brett has evolved into more than a character — he's a familiar face
            that represents the fun, creativity, and culture shared across the internet.
          </p>

          <div style={{ display: "flex", gap: 12, marginBottom: 40 }}>
            <Stat label="Rarity" value="Uncommon → Mythic" color={P.brett} />
            <Stat label="Supply" value="~1,335" color={P.brett} />
          </div>

          <div style={{ borderTop: `2px solid ${P.brett}`, paddingTop: 28 }}>
            <p style={{ fontFamily: pixel, fontSize: 12, lineHeight: 1.6, color: P.brett, margin: "0 0 14px" }}>
              FROM SKETCH TO MEME
            </p>
            <p style={{ lineHeight: 1.8, color: P.muted, margin: "0 0 20px" }}>
              Every G.O.M.E begins as a sketch before finding its place in the gallery. Follow Brett's creative journey
              from early concepts and rough line work to the final illustration. Each iteration refines his signature
              personality, transforming a simple idea into a tribute to one of the internet's most recognizable mascots.
            </p>
            <div style={{ border: `2px solid ${P.brett}`, background: P.surface, padding: 6 }}>
              <SafeImage src="/BRETT-MAKING.jpg" alt="The making of Brett" style={{ width: "100%", display: "block", imageRendering: "pixelated" }} />
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
