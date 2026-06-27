import GalleryLayout from "@/components/GalleryLayout";

const P = { dim: "rgba(255,255,255,0.15)", text: "#f5f5f5", muted: "rgba(255,255,255,0.4)" };

export default function GalleryMuseum() {
  return (
    <GalleryLayout pageId="museum">
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🏛️</div>
        <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 24, color: P.text, marginBottom: 8 }}>
          Museum of Meme
        </h3>
        <p style={{ color: P.muted, fontSize: 14 }}>
          A curated history of internet culture. Coming soon.
        </p>
      </div>
    </GalleryLayout>
  );
}
