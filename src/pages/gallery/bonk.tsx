import GalleryLayout from "@/components/GalleryLayout";
import { SafeImage } from "@/components/SafeImage";

const C = "#f97316";
const bg = "#070707";
const mono = "'Space Mono', monospace";
const pixel = "'Press Start 2P', monospace";

export default function GalleryBonk() {
  return (
    <GalleryLayout pageId="bonk">
      <div style={{ background: `${C}18`, borderBottom: `2px solid ${C}`, padding: "32px 24px 28px" }}>
        <p style={{ margin: "0 0 10px", fontFamily: mono, fontSize: 10, letterSpacing: "0.15em", color: `${C}99`, textTransform: "uppercase" }}>Gallery / Bonk</p>
        <h1 style={{ margin: "0 0 16px", fontFamily: pixel, fontSize: 20, lineHeight: 1.5, color: C }}>BONK</h1>
        <SafeImage src="/BONK.PNG" alt="Bonk" style={{ height: 180, display: "block", objectFit: "contain", imageRendering: "pixelated" }} />
      </div>

      <section style={{ maxWidth: 680, margin: "0 auto", padding: "32px 24px 48px", background: bg, color: "#f5f5f5", fontFamily: mono }}>
        <p style={{ lineHeight: 1.9, fontSize: 14, color: "rgba(255,255,255,0.9)", margin: "0 0 16px" }}>
          Not every legend begins with a plan.
        </p>
        <p style={{ lineHeight: 1.9, fontSize: 14, color: "rgba(255,255,255,0.6)", margin: "0 0 16px" }}>
          Bonk arrived as a joke, embraced by a community that refused to take itself too seriously. What started as a playful Shiba Inu quickly became a symbol of optimism, resilience, and the lighter side of crypto. Through bull runs, bear markets, and countless memes, Bonk proved that culture is built by people having fun together.
        </p>
        <p style={{ lineHeight: 1.9, fontSize: 14, color: "rgba(255,255,255,0.6)", margin: "0 0 40px" }}>
          Today, Bonk stands as one of Web3's most recognizable mascots — a reminder that sometimes the biggest movements start with a simple meme.
        </p>

        <div style={{ borderTop: `2px solid ${C}`, paddingTop: 28 }}>
          <p style={{ margin: "0 0 12px", fontFamily: pixel, fontSize: 11, lineHeight: 1.6, color: C }}>FROM SKETCH TO MEME</p>
          <p style={{ lineHeight: 1.9, fontSize: 14, color: "rgba(255,255,255,0.6)", margin: "0 0 20px" }}>
            Every G.O.M.E begins as a sketch before finding its place in the gallery. Explore how Bonk evolved from rough concepts and early line work into a polished tribute to one of crypto's most beloved internet icons.
          </p>
          <div style={{ border: `2px solid ${C}`, background: "#141414", padding: 6 }}>
            <SafeImage src="/BONK-MAKING.jpg" alt="The making of Bonk" style={{ width: "100%", display: "block", imageRendering: "pixelated" }} />
          </div>
        </div>
      </section>
    </GalleryLayout>
  );
}
