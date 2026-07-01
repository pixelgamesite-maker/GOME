import { motion } from "framer-motion";
import GalleryLayout from "@/components/GalleryLayout";
import { SafeImage } from "@/components/SafeImage";

const C = "#C9A84C";
const mono = "'Space Mono', monospace";
const pixel = "'Press Start 2P', monospace";

const LORE_SECTIONS = [
  {
    type: "intro",
    lines: [
      "Every civilization leaves something behind.",
      "Stone carvings.\nAncient scrolls.\nPaintings hanging in museums.",
      "The internet left memes.",
    ],
  },
  {
    type: "body",
    lines: [
      "At first, they were never meant to last. They were jokes shared between strangers, screenshots passed around group chats, images reposted until nobody remembered where they came from. Most disappeared as quickly as they arrived.",
      "But a few refused to die.",
    ],
  },
  {
    type: "icons",
    lines: [
      "A frog that somehow understood every human emotion.",
      "A blue friend whose calm expression survived every market cycle.",
      "A cheerful Shiba that reminded an entire blockchain how to smile again.",
    ],
  },
  {
    type: "body",
    lines: [
      "These weren't just memes anymore. They became symbols. They created communities, inspired movements, and brought millions of people together through a language that needed no translation.",
      "Some called them jokes.\nOthers called them culture.",
      "As the internet evolved, so did its legends. Memes escaped the timelines they were born on and crossed into gaming, social media, digital art, and eventually the blockchain. What once lived as pixels on a screen became collectibles, identities, and communities that people proudly carried across the web.",
    ],
  },
  {
    type: "problem",
    lines: [
      "Yet one problem remained.",
      "The internet moves fast.",
      "Yesterday's legend becomes today's forgotten tab.",
      "Entire eras disappear beneath endless scrolling, buried by newer trends and louder voices. The stories behind the icons slowly fade, even while their faces remain familiar.",
    ],
  },
  {
    type: "mission",
    lines: [
      "G.O.M.E. was created to preserve those stories.",
      "Not as screenshots.\nNot as reposts.\nBut as art.",
      "Gallery of Meme Evolution is a digital museum where internet legends are reimagined through handcrafted illustrations. Every piece is both a tribute and a time capsule — a reminder of the moments, communities, and creativity that shaped online culture.",
    ],
  },
  {
    type: "body",
    lines: [
      "This collection isn't about promising the future.\nIt's about honoring the past.",
      "Every artwork tells the story of a meme that changed the internet.\nEvery sketch captures the journey from rough concept to finished masterpiece.\nEvery collector becomes a curator, preserving a piece of digital history for the generations that come after us.",
    ],
  },
  {
    type: "close",
    lines: [
      "The gallery begins with 4,004 pieces on Ethereum, but its purpose reaches far beyond a single collection.",
      "As long as the internet continues to create legends, the gallery will always have another story to tell.",
    ],
  },
  {
    type: "finale",
    lines: [
      "Welcome to G.O.M.E.",
      "Where memes aren't just remembered.\nThey're immortalized.",
    ],
  },
];

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function GalleryLore() {
  return (
    <GalleryLayout pageId="lore">
      {/* Hero image */}
      <div style={{ position: "relative", width: "100%", maxHeight: 340, overflow: "hidden" }}>
        <SafeImage
          src="/GOME-LORE.jpg" alt="GOME Lore"
          style={{ width: "100%", height: 340, objectFit: "cover", display: "block", imageRendering: "pixelated" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(0deg, #070707 0%, transparent 55%)",
        }} />
        <div style={{ position: "absolute", bottom: 24, left: 24 }}>
          <FadeIn>
            <p style={{ margin: "0 0 6px", fontFamily: mono, fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: `${C}99` }}>
              Gallery / Lore
            </p>
            <h1 style={{ margin: 0, fontFamily: pixel, fontSize: 18, lineHeight: 1.5, color: C }}>
              THE LORE OF G.O.M.E.
            </h1>
          </FadeIn>
        </div>
      </div>

      {/* Lore content */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 24px 72px" }}>
        {LORE_SECTIONS.map((section, si) => (
          <div key={si} style={{ marginBottom: 48 }}>
            {section.lines.map((line, li) => {
              const delay = li * 0.08;
              const isMission = section.type === "mission" && li === 0;
              const isIcons = section.type === "icons";
              const isFinale = section.type === "finale";
              const isProblem = section.type === "problem" && li >= 1;

              return (
                <FadeIn key={li} delay={delay}>
                  {isFinale && li === 0 ? (
                    <p style={{
                      margin: "0 0 14px", fontFamily: pixel, fontSize: 14, lineHeight: 1.7,
                      color: C, whiteSpace: "pre-line",
                    }}>{line}</p>
                  ) : isFinale ? (
                    <p style={{
                      margin: "0 0 14px", fontFamily: pixel, fontSize: 12, lineHeight: 1.8,
                      color: "#fff", whiteSpace: "pre-line",
                    }}>{line}</p>
                  ) : isMission ? (
                    <p style={{
                      margin: "0 0 18px", fontFamily: pixel, fontSize: 11, lineHeight: 1.8,
                      color: C, whiteSpace: "pre-line",
                    }}>{line}</p>
                  ) : isIcons ? (
                    <p style={{
                      margin: "0 0 14px", paddingLeft: 16,
                      borderLeft: `3px solid ${C}55`,
                      fontFamily: mono, fontSize: 14, lineHeight: 1.8,
                      color: "rgba(255,255,255,0.85)", whiteSpace: "pre-line",
                    }}>{line}</p>
                  ) : isProblem ? (
                    <p style={{
                      margin: "0 0 12px", fontFamily: pixel, fontSize: 11, lineHeight: 1.8,
                      color: "rgba(255,255,255,0.6)", whiteSpace: "pre-line",
                    }}>{line}</p>
                  ) : (
                    <p style={{
                      margin: "0 0 16px", fontFamily: mono, fontSize: 14, lineHeight: 1.9,
                      color: section.type === "intro" ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.65)",
                      whiteSpace: "pre-line",
                    }}>{line}</p>
                  )}
                </FadeIn>
              );
            })}
            {/* Divider between sections */}
            {si < LORE_SECTIONS.length - 1 && section.type !== "body" && (
              <FadeIn delay={0.1}>
                <div style={{ borderTop: `1px solid rgba(201,168,76,0.2)`, margin: "32px 0 0" }} />
              </FadeIn>
            )}
          </div>
        ))}
      </div>
    </GalleryLayout>
  );
}
