import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

/**
 * MemeMe — "Roast Me" collectible card generator.
 *
 * The user is already authenticated via X to use GOME at all, so this
 * skips the separate "connect X" step and just reads avatar/handle off
 * the existing session. Click → generates a random roast card. Reroll
 * for a new one, or share the result as a tweet intent.
 *
 * Usage:
 *   <MemeMe />
 */

const RARITIES = [
  { tier: "Common", tag: "Average Degen", color: "#3ddc52" },
  { tier: "Rare", tag: "Reply Goblin", color: "#3b82f6" },
  { tier: "Epic", tag: "Terminally Online", color: "#a855f7" },
  { tier: "Legendary", tag: "Main Character", color: "#f97316" },
  { tier: "Mythic", tag: "Touches Grass", color: "#ef4444" },
];

const STATUSES = [
  "Professional NPC", "Exit Liquidity", "Chart Watcher", "Alpha Addict",
  "Reply Guy", "Meme Wizard", "Gas Victim", "Diamond Hands (Allegedly)",
  "Touches Grass (Rare)", "Certified Degen", "JPEG Collector", "FOMO Survivor",
];

const ABOUTS = [
  'Still waiting for "soon."', "Thinks every dip is the bottom.",
  'Says "GM" like it\'s a full-time job.', "Has 47 PFPs and no profile banner.",
  "Buys tops professionally.", 'Permanently "doing research."',
  "Farms engagement harder than yields.", "One more mint won't hurt.",
  "Refreshes OpenSea every 12 seconds.", "Believes every roadmap.",
];

const POWERS = [
  "+100 Copium", "Infinite Hopium", "Can smell free mint from miles away.",
  "Summons rugs accidentally.", "Generates FOMO in nearby wallets.",
  "Resistant to bear markets.", 'Master of "wen?"',
];

const WEAKNESSES = [
  "Gas fees.", "Reality.", "Selling too early.", "Selling too late.",
  "Sleep.", "Grass.", "DYOR.",
];

const RATING_TAGS = [
  "Terminally Online", "Unbothered", "Down Bad", "Built Different",
  "Locked In", "Cooked", "Goated (Allegedly)", "Mid But Confident",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function pickTwo<T>(arr: T[]): T[] {
  const a = [...arr].sort(() => Math.random() - 0.5);
  return [a[0], a[1]];
}

type Roast = {
  status: string; about: string; powers: string[]; weakness: string;
  rating: string; ratingTag: string; rarity: typeof RARITIES[number];
};

function generateRoast(): Roast {
  return {
    status: pick(STATUSES),
    about: pick(ABOUTS),
    powers: pickTwo(POWERS),
    weakness: pick(WEAKNESSES),
    rating: (Math.random() * 8.4 + 1.5).toFixed(1),
    ratingTag: pick(RATING_TAGS),
    rarity: pick(RARITIES),
  };
}

const mono = "'JetBrains Mono', 'Courier New', monospace";
const display = "'Fredoka', sans-serif";

export default function MemeMe() {
  const { user } = useAuth();
  const [roast, setRoast] = useState<Roast | null>(null);

  const meta = user?.user_metadata || {};
  const avatar = meta.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.id || "x"}`;
  const handle = meta.preferred_username || meta.user_name || "anon";
  const displayName = meta.full_name || meta.name || handle;

  const reroll = () => setRoast(generateRoast());

  const shareText = roast
    ? `Just got roasted by GOME 💀\n\nSTATUS: ${roast.status}\nRATING: ${roast.rating}/10 — ${roast.ratingTag}\nRARITY: ${roast.rarity.tier} ("${roast.rarity.tag}")\n\n@GomeJpeg`
    : "";

  const shareOnX = () => {
    if (!roast) return;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <style>{`
        @keyframes gome-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      {!roast && (
        <button onClick={reroll} style={ctaBtn}>
          Roast Me →
        </button>
      )}

      {roast && (
        <>
          <div style={{
            width: "100%", maxWidth: 380, borderRadius: 24, padding: 28,
            background: "#0c0c0c", border: `2px solid ${roast.rarity.color}`,
            fontFamily: mono, color: "#fff", boxShadow: `0 0 40px ${roast.rarity.color}33`,
          }}>
            <h3 style={{
              margin: "0 0 4px", fontFamily: display, fontSize: 26, fontWeight: 700,
              textAlign: "center", letterSpacing: "0.05em",
              background: `linear-gradient(90deg, ${roast.rarity.color}, #ffffff, ${roast.rarity.color})`,
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
              animation: "gome-shimmer 2.8s linear infinite",
            }}>
              G.O.M.E
            </h3>
            <div style={{ borderTop: "1px dashed rgba(255,255,255,0.25)", margin: "10px 0 16px" }} />

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <img src={avatar} alt="" style={{ width: 34, height: 34, borderRadius: "50%", flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: "#fff" }}>{displayName} (@{handle})</span>
            </div>

            <Row label="STATUS" value={roast.status} valueColor={roast.rarity.color} bold />
            <Row label="ABOUT" value={roast.about} />
            <Row label="POWER" value={roast.powers.join("\n")} />
            <Row label="WEAKNESS" value={roast.weakness} />
            <Row label="RATING" value={`${roast.rating}/10 ${roast.ratingTag}`} />

            <div style={{
              marginTop: 18, padding: "10px 14px", borderRadius: 12,
              background: `${roast.rarity.color}1a`, border: `1px solid ${roast.rarity.color}55`,
              textAlign: "center", fontSize: 12, color: roast.rarity.color, fontWeight: 700,
            }}>
              {roast.rarity.tier.toUpperCase()} — "{roast.rarity.tag}"
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={reroll} style={outlineBtn}>Reroll</button>
            <button onClick={shareOnX} style={ctaBtn}>Share on X</button>
          </div>
        </>
      )}
    </div>
  );
}

function Row({ label, value, valueColor, bold }: { label: string; value: string; valueColor?: string; bold?: boolean }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <p style={{ margin: "0 0 4px", fontSize: 10, letterSpacing: "0.12em", color: "rgba(255,255,255,0.4)" }}>{label}</p>
      <p style={{
        margin: 0, fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-line",
        color: valueColor || "#fff", fontWeight: bold ? 700 : 400,
      }}>{value}</p>
    </div>
  );
}

const ctaBtn: React.CSSProperties = {
  fontFamily: display, fontSize: 14, fontWeight: 700, color: "#000",
  background: "#3ddc52", border: "none", borderRadius: 30,
  padding: "14px 28px", cursor: "pointer",
};
const outlineBtn: React.CSSProperties = {
  fontFamily: display, fontSize: 14, fontWeight: 700, color: "#fff",
  background: "transparent", border: "2px solid rgba(255,255,255,0.3)", borderRadius: 30,
  padding: "14px 28px", cursor: "pointer",
};
