import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import { Sparkles, RefreshCw, Share2, Activity, Info, Zap, AlertTriangle, Star } from "lucide-react";

const RARITIES = [
  { tier: "Common",    tag: "Average Degen",      color: "#3ddc52" },
  { tier: "Rare",      tag: "Reply Goblin",        color: "#3b82f6" },
  { tier: "Epic",      tag: "Terminally Online",   color: "#a855f7" },
  { tier: "Legendary", tag: "Main Character",      color: "#f97316" },
  { tier: "Mythic",    tag: "Touches Grass",       color: "#ef4444" },
];

const STATUSES = [
  "Professional NPC","Chart Watcher","Alpha Addict","Reply Guy","Meme Wizard","Gas Victim",
  "Diamond Hands (Allegedly)","Touches Grass (Rare)","FOMO Survivor","Certified Degen",
  "Professional Lurker","Reply Warrior","Exit Liquidity","Alpha Hunter","Bag Holder",
  "FOMO Enjoyer","Thread Skipper","Meme Archaeologist","Internet Goblin","Timeline Camper",
  "JPEG Collector","Market Survivor","Copium Consumer","Main Character (Self-Proclaimed)",
  "Bullposting Expert","Bear Market Veteran","Discord Resident","Touches Grass (Unverified)",
  "Terminally Online","Hopium Dealer","Vibe Curator","Chaos Agent","Keyboard Gladiator",
  "Gas Fee Victim","Keyboard Philosopher","Rug Magnet","Exit Timing Expert",
  "Moon Mission Specialist","Blockchain Tourist","Meme Mercenary","Quote Tweet Sniper",
  "NFT Hoarder","Bull Market Believer","Bear Market Doomer","Certified Yapper",
  "GM Enthusiast","Wallet Speedrunner","Chain Hopper","Pixel Collector","Liquidity Donor",
  "Notification Addict","On-Chain Detective","Screenshot Millionaire","Web3 Explorer",
  "Meme Blacksmith","Chaos Consultant","Timeline Ghost","Vibes Maxxer",
];

const ABOUTS = [
  "Thinks every dip is the bottom.","Says \"GM\" like it's a full-time job.",
  "Has 47 PFPs and no profile banner.","Buys tops professionally.",
  "Permanently \"doing research.\"","Farms engagement harder than yields.",
  "One more mint won't hurt.","Refreshes OpenSea every 12 seconds.",
  "Refreshes the timeline every 5 seconds.","Thinks every rumor is alpha.",
  "Hasn't recovered from the last rug.","Still waiting for \"soon.\"",
  "Clicks every mysterious link.","Buys first, researches later.",
  "Believes every roadmap.","Knows exactly one candlestick pattern.",
  "Lives inside the replies.","Has screenshots for everything.",
  "Collects memes like they're Pokémon.","Accidentally becomes exit liquidity.",
  "Says \"wen\" in every Discord.","Thinks sleep is bearish.",
  "Can't resist a free mint.","Calls every correction a buying opportunity.",
  "Has trust issues with bridges.","Runs entirely on hopium.",
  "Survived five market cycles emotionally.","Claims they're \"just observing.\"",
  "Treats every rumor like breaking news.","Opens X before opening their eyes.",
  "Buys because the vibes felt right.","Saves memes faster than money.",
  "Has twenty tabs and trusts none of them.","Measures time in market cycles.",
  "Confuses patience with bag holding.","Starts every sentence with \"technically...\"",
  "Keeps receipts for internet arguments.","Thinks every dip builds character.",
  "Lives for surprise announcements.","Somehow ends up in every space.",
];

const POWERS = [
  "+100 Copium","Infinite Hopium","Can smell free mint from miles away.",
  "Summons rugs accidentally.","Generates FOMO in nearby wallets.",
  "Resistant to bear markets.","Master of \"wen?\"","Detects free mints instantly.",
  "Can summon FOMO at will.","Generates engagement from thin air.",
  "Sees rugs before they happen... too late.","Immune to bad vibes.",
  "Converts coffee into memes.","Respawns after liquidation.",
  "Can explain NFTs to grandparents.","Never misses a GM.",
  "Farms XP in every Discord.","Unlocks hidden alpha by accident.",
  "Survives on screenshots alone.","Has unlimited browser tabs.",
  "Speaks fluent meme.","Predicts pumps... after they happen.",
  "Turns panic into punchlines.","Finds memes before they go viral.",
  "Survives impossible gas wars.","Can smell fake alpha instantly.",
  "Speaks fluent CT slang.","Escapes rugs with cinematic timing.",
  "Creates memes at lightspeed.","Summons engagement with one reply.",
  "Wins every GIF battle.","Converts losses into lore.",
  "Never runs out of reaction images.",
];

const WEAKNESSES = [
  "Selling too early.","Selling too late.","Grass.","Gas fees.",
  "Green candles.","Red candles.","Reality.","Sleep.","Touching grass.",
  "DYOR.","Impulse buys.","\"Limited supply.\"","Mint countdowns.",
  "Wallet balance.","Notifications.","Shiny JPEGs.","Group chats.","FOMO.",
  "\"Trust me bro.\"","Surprise maintenance.","Wallet approvals.",
  "Fake countdown timers.","Empty coffee cups.","Captchas.",
  "Internet outages.","Low battery.","Paper hands.","Emotional trading.",
  "Monday mornings.",
];

const RATING_TAGS = [
  "Terminally Online","Unbothered","Down Bad","Built Different",
  "Locked In","Cooked","Goated (Allegedly)","Mid But Confident",
];

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function pickTwo<T>(arr: T[]): T[] { const a = [...arr].sort(() => Math.random() - 0.5); return [a[0], a[1]]; }

type Roast = {
  status: string; about: string; powers: string[]; weakness: string;
  rating: string; ratingTag: string; rarity: typeof RARITIES[number]; cardNo: string;
};

function generateRoast(): Roast {
  return {
    status: pick(STATUSES), about: pick(ABOUTS), powers: pickTwo(POWERS),
    weakness: pick(WEAKNESSES), rating: (Math.random() * 8.4 + 1.5).toFixed(1),
    ratingTag: pick(RATING_TAGS), rarity: pick(RARITIES),
    cardNo: String(Math.floor(Math.random() * 9999)).padStart(4, "0"),
  };
}

const STORAGE_KEY = "gome_roast_v1";
const COOLDOWN_MS = 24 * 60 * 60 * 1000;
const marker = "'Permanent Marker', cursive";
const mono = "'Space Mono', monospace";

function loadSaved(): { roast: Roast; ts: number } | null {
  try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null; } catch { return null; }
}
function saveRoast(roast: Roast) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ roast, ts: Date.now() })); } catch {}
}
function formatCountdown(ms: number) {
  const m = Math.max(0, Math.ceil(ms / 60000));
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

export default function MemeMe() {
  const { t } = useLanguage();
  const [roast, setRoast] = useState<Roast | null>(null);
  const [visible, setVisible] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const saved = loadSaved();
    if (saved && saved.ts + COOLDOWN_MS > Date.now()) {
      setRoast(saved.roast); setCooldownUntil(saved.ts + COOLDOWN_MS);
    }
  }, []);

  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);

  const onCooldown = cooldownUntil !== null && now < cooldownUntil;

  const generateFresh = () => {
    const r = generateRoast();
    setRoast(r); saveRoast(r); setCooldownUntil(Date.now() + COOLDOWN_MS); setVisible(true);
  };

  const shareText = roast
    ? `Just got roasted by GOME 💀\n\nSTATUS: ${roast.status}\nRATING: ${roast.rating}/10 — ${roast.ratingTag}\nRARITY: ${roast.rarity.tier} ("${roast.rarity.tag}")\n\n@GomeJpeg`
    : "";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
      <style>{`
        @keyframes gome-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes card-shine { 0% { transform: translateX(-120%) rotate(20deg); } 100% { transform: translateX(220%) rotate(20deg); } }
        @keyframes cta-pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(61,220,82,0.5); } 50% { box-shadow: 0 0 0 10px rgba(61,220,82,0); } }
      `}</style>

      {!visible && (
        <button onClick={() => onCooldown && roast ? setVisible(true) : generateFresh()}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: mono, fontSize: 13, fontWeight: 700, color: "#000", background: "#3ddc52", border: "none", borderRadius: 30, padding: "14px 26px", cursor: "pointer", animation: onCooldown ? "none" : "cta-pulse 2.4s ease-in-out infinite" }}>
          <Sparkles size={16} /> {onCooldown ? t("roastCard.viewMine") : t("roastCard.cta")}
        </button>
      )}
      {!visible && onCooldown && cooldownUntil && (
        <p style={{ fontFamily: mono, fontSize: 11, color: "rgba(255,255,255,0.4)", margin: 0 }}>
          {t("roastCard.nextIn", { time: formatCountdown(cooldownUntil - now) })}
        </p>
      )}

      <AnimatePresence>
        {visible && roast && (
          <motion.div key={roast.cardNo} initial={{ opacity: 0, scale: 0.92, y: 14 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ type: "spring", stiffness: 260, damping: 22 }}
            style={{ width: "100%", maxWidth: 380, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            <div style={{ position: "relative", width: "100%", borderRadius: 24, padding: 28, background: `radial-gradient(circle at 30% 0%, ${roast.rarity.color}14, #0c0c0c 60%)`, border: `2px solid ${roast.rarity.color}`, fontFamily: mono, color: "#fff", boxShadow: `0 0 50px ${roast.rarity.color}33`, overflow: "hidden" }}>
              <button onClick={() => setVisible(false)} style={{ position: "absolute", top: 10, left: 10, zIndex: 2, width: 24, height: 24, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.25)", background: "rgba(0,0,0,0.4)", color: "rgba(255,255,255,0.7)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, padding: 0 }}>✕</button>
              <div style={{ position: "absolute", top: "-50%", left: 0, width: "30%", height: "220%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)", animation: "card-shine 5s ease-in-out infinite", pointerEvents: "none" }} />
              <div style={{ position: "absolute", top: 14, right: -34, transform: "rotate(40deg)", background: roast.rarity.color, color: "#000", fontWeight: 800, fontSize: 10, letterSpacing: "0.08em", padding: "4px 38px" }}>{roast.rarity.tier.toUpperCase()}</div>
              <h3 style={{ margin: "0 0 4px", fontFamily: marker, fontSize: 28, textAlign: "center", background: `linear-gradient(90deg, ${roast.rarity.color}, #ffffff, ${roast.rarity.color})`, backgroundSize: "200% auto", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", animation: "gome-shimmer 2.8s linear infinite", position: "relative", zIndex: 1 }}>G.O.M.E</h3>
              <p style={{ margin: "0 0 14px", textAlign: "center", fontSize: 10, letterSpacing: "0.15em", color: "rgba(255,255,255,0.3)" }}>#{roast.cardNo}</p>
              <div style={{ borderTop: "1px dashed rgba(255,255,255,0.2)", margin: "0 0 16px" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, position: "relative", zIndex: 1 }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", padding: 2, background: roast.rarity.color, flexShrink: 0 }}>
                  <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#1a1a1a", border: "2px solid #0c0c0c", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🎭</div>
                </div>
                <span style={{ fontSize: 13, color: "#fff" }}>Anonymous Degen</span>
              </div>
              <Row icon={<Activity size={13} />} label={t("roastCard.status")} value={roast.status} valueColor={roast.rarity.color} bold />
              <Row icon={<Info size={13} />} label={t("roastCard.about")} value={roast.about} />
              <Row icon={<Zap size={13} />} label={t("roastCard.power")} value={roast.powers.join("\n")} />
              <Row icon={<AlertTriangle size={13} />} label={t("roastCard.weakness")} value={roast.weakness} />
              <Row icon={<Star size={13} />} label={t("roastCard.rating")} value={`${roast.rating}/10 ${roast.ratingTag}`} />
              <div style={{ marginTop: 4, padding: "10px 14px", borderRadius: 12, background: `${roast.rarity.color}1a`, border: `1px solid ${roast.rarity.color}55`, textAlign: "center", fontSize: 12, color: roast.rarity.color, fontWeight: 700, position: "relative", zIndex: 1 }}>"{roast.rarity.tag}"</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", gap: 10 }}>
                {!onCooldown && <button onClick={generateFresh} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: mono, fontSize: 13, fontWeight: 700, color: "#fff", background: "transparent", border: "2px solid rgba(255,255,255,0.25)", borderRadius: 30, padding: "14px 24px", cursor: "pointer" }}><RefreshCw size={14} /> {t("roastCard.reroll")}</button>}
                <button onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank")} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: mono, fontSize: 13, fontWeight: 700, color: "#000", background: "#3ddc52", border: "none", borderRadius: 30, padding: "14px 26px", cursor: "pointer" }}><Share2 size={14} /> {t("roastCard.shareX")}</button>
              </div>
              {onCooldown && cooldownUntil && <p style={{ fontFamily: mono, fontSize: 11, color: "rgba(255,255,255,0.4)", margin: 0 }}>{t("roastCard.cooldownHint", { time: formatCountdown(cooldownUntil - now) })}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Row({ icon, label, value, valueColor, bold }: { icon: React.ReactNode; label: string; value: string; valueColor?: string; bold?: boolean }) {
  return (
    <div style={{ marginBottom: 14, position: "relative", zIndex: 1 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, color: "rgba(255,255,255,0.4)" }}>{icon}<p style={{ margin: 0, fontSize: 10, letterSpacing: "0.12em" }}>{label}</p></div>
      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-line", color: valueColor || "#fff", fontWeight: bold ? 700 : 400 }}>{value}</p>
    </div>
  );
}
