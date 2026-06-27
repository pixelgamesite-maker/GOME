import GalleryLayout from "@/components/GalleryLayout";

const P = { brett: "#3b82f6", text: "#f5f5f5", muted: "rgba(255,255,255,0.4)", surface: "#1a1a1a" };

export default function GalleryBrett() {
  return (
    <GalleryLayout pageId="brett">
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center" }}>
        <div style={{ flex: "1 1 300px" }}>
          <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 28, color: P.brett, margin: "0 0 12px" }}>
            Just a Guy. All the Vibes.
          </h3>
          <p style={{ color: P.muted, lineHeight: 1.7, fontSize: 15 }}>
            BRETT doesn't try hard. Somehow wins anyway. The laid-back king of meme culture,
            now immortalized on-chain with hand-crafted traits.
          </p>
          <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
            <Stat label="Rarity" value="Uncommon → Mythic" color={P.brett} />
            <Stat label="Supply" value="~1,335" color={P.brett} />
          </div>
        </div>
        <div style={{
          flex: "1 1 280px", height: 320, background: `${P.brett}10`, borderRadius: 20,
          border: `1px solid ${P.brett}30`, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <img src="/BRETT.PNG" alt="BRETT" style={{ maxHeight: "80%", maxWidth: "80%", objectFit: "contain", filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.5))" }} />
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
