import GalleryLayout from "@/components/GalleryLayout";

const P = { gold: "#C9A84C", text: "#f5f5f5", muted: "rgba(255,255,255,0.4)" };

export default function GalleryLore() {
  return (
    <GalleryLayout pageId="lore">
      <div style={{ maxWidth: 640 }}>
        <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 26, color: P.gold, margin: "0 0 20px" }}>
          From the Trenches to the Chain
        </h3>
        <p style={{ color: P.muted, lineHeight: 1.8, fontSize: 15, marginBottom: 16 }}>
          GOME started as a joke in a group chat. Three meme coins, three communities, one question:
          what if we put them all in one place?
        </p>
        <p style={{ color: P.muted, lineHeight: 1.8, fontSize: 15, marginBottom: 16 }}>
          Now it's a 4,004-piece collection on Ethereum. No roadmap promises. No utility fluff.
          Just art, culture, and the memes that got us here.
        </p>
        <div style={{
          marginTop: 28, padding: 20, borderRadius: 16, background: "rgba(201,168,76,0.05)",
          border: `1px solid rgba(201,168,76,0.15)`,
        }}>
          <p style={{ margin: 0, fontFamily: "'Fredoka', sans-serif", fontSize: 18, color: P.gold, marginBottom: 8 }}>
            "We didn't choose the meme life. The meme life chose us."
          </p>
          <p style={{ margin: 0, fontSize: 12, color: P.muted }}>— Founding intern, probably</p>
        </div>
      </div>
    </GalleryLayout>
  );
}
