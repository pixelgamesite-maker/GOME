import GalleryLayout from "@/components/GalleryLayout";
import { SafeImage } from "@/components/SafeImage";

const C = "#3b82f6";
const bg = "#070707";
const mono = "'Space Mono', monospace";
const pixel = "'Press Start 2P', monospace";

export default function GalleryBrett() {
  return (
    <GalleryLayout pageId="brett">
      <div style={{ background: `${C}18`, borderBottom: `2px solid ${C}`, padding: "32px 24px 28px" }}>
        <p style={{ margin: "0 0 10px", fontFamily: mono, fontSize: 10, letterSpacing: "0.15em", color: `${C}99`, textTransform: "uppercase" }}>Gallery / Brett</p>
        <h1 style={{ margin: "0 0 16px", fontFamily: pixel, fontSize: 20, lineHeight: 1.5, color: C }}>BRETT</h1>
        <SafeImage src="/BRETT.PNG" alt="Brett" style={{ height: 180, display: "block", objectFit: "contain", imageRendering: "pixelated" }} />
      </div>

      <section style={{ maxWidth: 680, margin: "0 auto", padding: "32px 24px 48px", background: bg, color: "#f5f5f5", fontFamily: mono }}>
        <p style={{ lineHeight: 1.9, fontSize: 14, color: "rgba(255,255,255,0.9)", margin: "0 0 16px" }}>
          Some icons don't chase the spotlight — they become it.
        </p>
        <p style={{ lineHeight: 1.9, fontSize: 14, color: "rgba(255,255,255,0.6)", margin: "0 0 16px" }}>
          Brett earned his place in internet culture through his unmistakable blue look, laid-back attitude, and effortless charm. While the internet never stops moving, Brett remains calm, becoming a symbol of confidence, friendship, and the lighter side of Web3.
        </p>
        <p style={{ lineHeight: 1.9, fontSize: 14, color: "rgba(255,255,255,0.6)", margin: "0 0 40px" }}>
          From memes to blockchain communities, Brett has evolved into more than a character — he's a familiar face that represents the fun, creativity, and culture shared across the internet.
        </p>

        <div style={{ borderTop: `2px solid ${C}`, paddingTop: 28 }}>
          <p style={{ margin: "0 0 12px", fontFamily: pixel, fontSize: 11, lineHeight: 1.6, color: C }}>FROM SKETCH TO MEME</p>
          <p style={{ lineHeight: 1.9, fontSize: 14, color: "rgba(255,255,255,0.6)", margin: "0 0 20px" }}>
            Every G.O.M.E begins as a sketch before finding its place in the gallery. Follow Brett's creative journey from early concepts and rough line work to the final illustration.
          </p>
          <div style={{ border: `2px solid ${C}`, background: "#141414", padding: 6 }}>
            <SafeImage src="/BRETT-MAKING.jpg" alt="The making of Brett" style={{ width: "100%", display: "block", imageRendering: "pixelated" }} />
          </div>
        </div>
      </section>
    </GalleryLayout>
  );
}
