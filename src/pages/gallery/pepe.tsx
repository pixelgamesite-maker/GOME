import GalleryLayout from "@/components/GalleryLayout";

const P = { pepe: "#3ddc52", text: "#f5f5f5", muted: "rgba(255,255,255,0.4)", surface: "#1a1a1a" };

export default function GalleryPepe() {
  return (
    <GalleryLayout pageId="pepe">
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center" }}>
        <div style={{ flex: "1 1 300px" }}>
          <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 28, color: P.pepe, margin: "0 0 12px" }}>
            The Original Meme
          </h3>
          <p style={{ color: P.muted, lineHeight: 1.7, fontSize: 15 }}>
            PEPE is the face of internet culture. Green, unserious, and completely iconic.
            Every collection needs a PEPE. In GOME, PEPE traits range from classic feels to ultra-rare golden variants.
          </p>
          <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
            <Stat label="Rarity" value="Common → Legendary" color={P.pepe} />
            <Stat label="Supply" value="~1,334" color={P.pepe} />
          </div>
        </div>
        <div style={{
          flex: "1 1 280px", height: 320, background: `${P.pepe}10`, borderRadius: 20,
          border: `1px solid ${P.pepe}30`, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <img src="/PEPE.PNG" alt="PEPE" style={{ maxHeight: "80%", maxWidth: "80%", objectFit: "contain", filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.5))" }} />
        </div>
      </div>
    </GalleryLayout>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ background: P.surface, padding: "14px 18px", borderRadius: 12, border: `1px solid rgba(255,255,255,0.06)` }}>
      <p style={{ margin: "0 0 4px", fontSize: 11, color: "rgba(255,255,255,0.3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</p>
      <p style={{ margin: 0, fontFamily: "'Fredoka', sans-serif", fontSize: 16, color, fontWeight: 600 }}>{value}</p>
    </div>
  );
}
