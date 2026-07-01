import GalleryLayout from "@/components/GalleryLayout";
import Footer from "@/components/Footer";
import { SafeImage } from "@/components/SafeImage";

const C = "#3ddc52";
const bg = "#070707";
const mono = "'Space Mono', monospace";
const pixel = "'Press Start 2P', monospace";

export default function GalleryPepe() {
  return (
    <GalleryLayout pageId="pepe">
      {/* Hero bar */}
      <div style={{ background: `${C}18`, borderBottom: `2px solid ${C}`, padding: "32px 24px 28px" }}>
        <p style={{ margin: "0 0 10px", fontFamily: mono, fontSize: 10, letterSpacing: "0.15em", color: `${C}99`, textTransform: "uppercase" }}>Gallery / Pepe</p>
        <h1 style={{ margin: "0 0 16px", fontFamily: pixel, fontSize: 20, lineHeight: 1.5, color: C }}>PEPE</h1>
        <SafeImage src="/PEPE.PNG" alt="Pepe" style={{ height: 180, display: "block", objectFit: "contain", imageRendering: "pixelated" }} />
      </div>

      {/* Story */}
      <section style={{ maxWidth: 680, margin: "0 auto", padding: "32px 24px 48px", background: bg, color: "#f5f5f5", fontFamily: mono }}>
        <p style={{ lineHeight: 1.9, fontSize: 14, color: "rgba(255,255,255,0.9)", margin: "0 0 16px" }}>
          Before timelines, before crypto, before "GM" and "WAGMI," there was a frog.
        </p>
        <p style={{ lineHeight: 1.9, fontSize: 14, color: "rgba(255,255,255,0.6)", margin: "0 0 16px" }}>
          Pepe wasn't created to rule the internet. He simply existed — expressive, relatable, and endlessly remixable. As the web evolved, so did he. Every emotion, every market cycle, every inside joke found its way onto Pepe's face.
        </p>
        <p style={{ lineHeight: 1.9, fontSize: 14, color: "rgba(255,255,255,0.6)", margin: "0 0 16px" }}>
          Over time, he became more than a meme. He became the internet's emotional language.
        </p>
        <p style={{ lineHeight: 1.9, fontSize: 14, color: "rgba(255,255,255,0.6)", margin: "0 0 40px" }}>
          Today, Pepe lives everywhere — from group chats and timelines to NFTs and blockchain culture — proving that the simplest characters often leave the biggest legacy.
        </p>

        {/* Making of */}
        <div style={{ borderTop: `2px solid ${C}`, paddingTop: 28 }}>
          <p style={{ margin: "0 0 12px", fontFamily: pixel, fontSize: 11, lineHeight: 1.6, color: C }}>THE MAKING OF PEPE</p>
          <p style={{ lineHeight: 1.9, fontSize: 14, color: "rgba(255,255,255,0.6)", margin: "0 0 20px" }}>
            Every G.O.M.E begins as a sketch before becoming part of the gallery. This section showcases the creative journey — from rough concepts and line art to color exploration and the final piece.
          </p>
          <div style={{ border: `2px solid ${C}`, background: "#141414", padding: 6 }}>
            <SafeImage src="/PEPE-MAKING.jpg" alt="The making of Pepe" style={{ width: "100%", display: "block", imageRendering: "pixelated" }} />
          </div>
        </div>
      </section>
    </GalleryLayout>
  );
}
