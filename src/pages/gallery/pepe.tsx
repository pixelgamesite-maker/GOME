import GalleryLayout from "@/components/GalleryLayout";
import Footer from "@/components/Footer";
import { SafeImage } from "@/components/SafeImage";

const P = { pepe: "#3ddc52", bg: "#070707", text: "#f5f5f5", muted: "rgba(255,255,255,0.5)", surface: "#141414" };
const pixel = "'Press Start 2P', monospace";
const mono = "'Space Mono', monospace";

export default function GalleryPepe() {
  return (
    <>
      <GalleryLayout pageId="pepe" />

      <div style={{ background: P.bg, color: P.text, fontFamily: mono }}>
        <section style={{ maxWidth: 680, margin: "0 auto", padding: "16px 24px 56px" }}>
          <h2 style={{ fontFamily: pixel, fontSize: 18, lineHeight: 1.6, color: P.pepe, margin: "0 0 20px" }}>PEPE</h2>

          <p style={{ lineHeight: 1.8, color: "rgba(255,255,255,0.9)", margin: "0 0 18px" }}>
            Before timelines, before crypto, before "GM" and "WAGMI," there was a frog.
          </p>
          <p style={{ lineHeight: 1.8, color: P.muted, margin: "0 0 18px" }}>
            Pepe wasn't created to rule the internet. He simply existed — expressive, relatable, and endlessly remixable.
            As the web evolved, so did he. Every emotion, every market cycle, every inside joke found its way onto Pepe's face.
          </p>
          <p style={{ lineHeight: 1.8, color: P.muted, margin: "0 0 18px" }}>
            Over time, he became more than a meme. He became the internet's emotional language.
          </p>
          <p style={{ lineHeight: 1.8, color: P.muted, margin: "0 0 36px" }}>
            Today, Pepe lives everywhere — from group chats and timelines to NFTs and blockchain culture — proving that
            the simplest characters often leave the biggest legacy.
          </p>

          <div style={{ display: "flex", gap: 12, marginBottom: 40 }}>
            <Stat label="Rarity" value="Common → Legendary" color={P.pepe} />
            <Stat label="Supply" value="~1,334" color={P.pepe} />
          </div>

          <div style={{ borderTop: `2px solid ${P.pepe}`, paddingTop: 28 }}>
            <p style={{ fontFamily: pixel, fontSize: 12, lineHeight: 1.6, color: P.pepe, margin: "0 0 14px" }}>
              THE MAKING OF PEPE
            </p>
            <p style={{ lineHeight: 1.8, color: P.muted, margin: "0 0 20px" }}>
              Every G.O.M.E begins as a sketch before becoming part of the gallery. This section showcases the creative
              journey — from rough concepts and line art to color exploration and the final piece.
            </p>
            <div style={{ border: `2px solid ${P.pepe}`, background: P.surface, padding: 6 }}>
              <SafeImage src="/PEPE-MAKING.jpg" alt="The making of Pepe" style={{ width: "100%", display: "block", imageRendering: "pixelated" }} />
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
