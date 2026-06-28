import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { SafeImage } from "@/components/SafeImage";
import MemeMe from "@/components/MemeMe";
import Leaderboard from "@/components/Leaderboard";
import WhitelistApp from "@/components/WhitelistApp";
import { Twitter, Heart, Repeat2, MessageCircle, ExternalLink, CheckCircle2 } from "lucide-react";

const P = {
  bg: "#070707", surface: "#141414", border: "rgba(255,255,255,0.08)",
  text: "#f5f5f5", muted: "rgba(255,255,255,0.45)", dim: "rgba(255,255,255,0.18)",
  pepe: "#3ddc52", brett: "#3b82f6", bonk: "#f97316",
};

const marker = "'Permanent Marker', cursive";
const cursive = "'Caveat', cursive";
const mono = "'Space Mono', monospace";
const body = "'Space Grotesk', sans-serif";

const SUPPLY = "4,404";
const TWEET_ID = "2070602933767389663";
const TWEET_URL = `https://x.com/i/status/${TWEET_ID}`;

// Real collection preview assets — /1.jpg through /20.jpg in public/
const COLLECTION_IMAGES = Array.from({ length: 20 }, (_, i) => `/${i + 1}.jpg`);

const TASKS = [
  { id: "follow", label: "Follow @GomeJpeg", points: 50, url: "https://x.com/GomeJpeg", color: P.pepe },
  { id: "like", label: "Like", points: 10, url: TWEET_URL, color: P.brett, icon: Heart },
  { id: "retweet", label: "Retweet", points: 20, url: TWEET_URL, color: P.bonk, icon: Repeat2 },
  { id: "comment", label: "Comment & Tag", points: 20, url: TWEET_URL, color: P.pepe, icon: MessageCircle },
];

type TaskLog = { task_type: string; points: number };

export default function Home() {
  const { user, loading, signOut } = useAuth();
  const [, navigate] = useLocation();
  const [claimed, setClaimed] = useState<Set<string>>(new Set());
  const [totalPoints, setTotalPoints] = useState(0);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/");
    if (user) fetchPoints();
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!document.getElementById("twitter-widget-script")) {
      const script = document.createElement("script");
      script.id = "twitter-widget-script";
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      document.body.appendChild(script);
    } else {
      (window as any).twttr?.widgets?.load();
    }
  }, []);

  const fetchPoints = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("points_log")
      .select("task_type,points")
      .eq("user_id", user.id);

    if (error) console.error("[GOME] fetchPoints failed:", error.message, error);

    const set = new Set((data || []).map((d: TaskLog) => d.task_type));
    const pts = (data || []).reduce((a: number, b: TaskLog) => a + (b.points || 0), 0);
    setClaimed(set);
    setTotalPoints(pts);
  };

  // NOTE: if claiming silently does nothing, it's almost certainly an RLS
  // policy missing on points_log / profiles in Supabase — see console for
  // the actual error this now logs.
  const claim = async (task: typeof TASKS[0]) => {
    if (!user || claimed.has(task.id) || busy) return;
    setBusy(true);
    const { error } = await supabase.from("points_log").insert({
      user_id: user.id,
      task_type: task.id,
      points: task.points,
    });
    if (error) {
      console.error("[GOME] claim insert failed:", error.message, error);
    } else {
      const { error: rpcError } = await supabase.rpc("increment_points", { p_user_id: user.id, p_amount: task.points });
      if (rpcError) console.error("[GOME] increment_points failed:", rpcError.message, rpcError);
      await fetchPoints();
    }
    setBusy(false);
  };

  if (loading || !user) return null;

  const meta = user.user_metadata || {};
  const avatar = meta.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.id}`;
  const ringGradient = `conic-gradient(${P.pepe}, ${P.brett}, ${P.bonk}, ${P.pepe})`;

  const followTask = TASKS.find((t) => t.id === "follow")!;
  const tweetTasks = TASKS.filter((t) => t.id !== "follow");

  return (
    <div style={{ background: P.bg, minHeight: "100vh", color: P.text, fontFamily: body }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Caveat:wght@400;700&family=Space+Mono:wght@400;700&display=swap');
        @keyframes gome-pulse {
          0%, 100% { text-shadow: 0 0 22px rgba(255,255,255,0.3); }
          50% { text-shadow: 0 0 44px rgba(255,255,255,0.65); }
        }
      `}</style>

      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50, height: 72,
        padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(7,7,7,0.92)", backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${P.border}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <SafeImage src="/GOME-LOGO.png" alt="GOME" style={{ height: 30, width: 30 }} />
          <span style={{ fontFamily: marker, fontSize: 18 }}>GOME</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{
            fontFamily: mono, fontSize: 12, color: P.text, background: P.surface,
            border: `1px solid ${P.border}`, padding: "6px 14px", borderRadius: 20,
          }}>
            {totalPoints} pts
          </span>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: ringGradient, padding: 2 }}>
            <img src={avatar} alt="avatar" style={{ width: "100%", height: "100%", borderRadius: "50%", display: "block", border: `2px solid ${P.bg}` }} />
          </div>
          <button onClick={signOut} style={{
            fontFamily: mono, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
            color: P.muted, background: "transparent", border: "none", cursor: "pointer",
          }}>Out</button>
        </div>
      </nav>

      {/* HERO — headline, stats, CTAs all in one block */}
      <section style={{ position: "relative", padding: "56px 24px 48px", overflow: "hidden" }}>
        <WireframeDecor />

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, fontFamily: mono, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: P.muted }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: P.pepe, flexShrink: 0 }} />
          Minting on OpenSea · @GomeJpeg
        </div>

        <h1 style={{
          fontFamily: marker, fontSize: "clamp(46px, 13vw, 88px)", color: "#fff",
          lineHeight: 1, margin: "0 0 2px", animation: "gome-pulse 2.6s ease-in-out infinite",
        }}>
          GOME
        </h1>
        <h2 style={{ fontFamily: marker, fontSize: "clamp(26px, 7vw, 46px)", color: P.pepe, lineHeight: 1, margin: "0 0 20px" }}>
          GALLERY OF MEME
        </h2>

        <p style={{ fontFamily: cursive, fontSize: 20, color: "rgba(255,255,255,0.78)", maxWidth: 400, margin: "0 0 32px", lineHeight: 1.5 }}>
          A gallery of the internet's most iconic memes — built for the ones who get it.
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 32 }}>
          <StatBox label="Mint Price" value="TBA" />
          <StatBox label="Supply" value={SUPPLY} />
          <StatBox label="Chain" value="Ethereum" />
          <StatBox label="Launchpad" value="OpenSea" />
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={() => navigate("/gallery")} style={outlinePill(P.pepe)}>Gallery</button>
          <button onClick={() => navigate("/collab")} style={outlinePill(P.bonk)}>Collab</button>
          <WhitelistApp triggerLabel="Whitelist" triggerStyle={solidPill(P.brett)} />
        </div>
      </section>

      {/* STEP INTO THE GALLERY — big bold CTA */}
      <section style={{ padding: "16px 24px 64px", textAlign: "center" }}>
        <p style={eyebrow}>Explore</p>
        <h2 style={{ fontFamily: marker, fontSize: 32, color: "#fff", margin: "0 0 14px" }}>Step Into The Gallery</h2>
        <p style={{ fontFamily: cursive, fontSize: 18, color: P.muted, maxWidth: 420, margin: "0 auto 30px", lineHeight: 1.5 }}>
          Pepe, Brett, Bonk, the lore, and everything else GOME has to show off — all in one place.
        </p>
        <button
          onClick={() => navigate("/gallery")}
          style={{
            fontFamily: mono, fontWeight: 700, fontSize: 14, textTransform: "uppercase", letterSpacing: "0.06em",
            background: P.pepe, color: "#000", border: "none", borderRadius: 14,
            padding: "18px 40px", cursor: "pointer", boxShadow: `0 0 34px ${P.pepe}55`,
          }}
        >
          Step Into The Gallery →
        </button>
      </section>

      {/* COLLECTION — infinite scrolling marquee */}
      <CollectionMarquee images={COLLECTION_IMAGES} supply={SUPPLY} />

      {/* CHARACTER SECTIONS */}
      <CharacterSection
        bg={P.pepe} name="PEPE" img="/PEPE.PNG"
        blurb="The face of internet culture. A legendary frog whose countless expressions became the language of memes, evolving from comic panels into one of the internet's most recognizable icons."
      />
      <CharacterSection
        bg={`linear-gradient(160deg, ${P.bonk}, #ec4899)`} name="BONK" img="/BONK.PNG"
        blurb="The dog that bonked its way into crypto history. A cheerful Shiba Inu mascot that embodies community, fun, and the playful spirit of decentralized internet culture."
      />
      <CharacterSection
        bg={P.brett} name="BRETT" img="/BRETT.PNG"
        blurb="The internet's laid-back best friend. Known for his calm attitude and signature blue look, Brett represents the easygoing side of meme culture, earning a devoted following across Web3 communities."
      />

      {/* MEME ME */}
      <section style={{ padding: "64px 24px", textAlign: "center" }}>
        <p style={eyebrow}>No Mercy</p>
        <h2 style={{ fontFamily: marker, fontSize: 30, color: "#fff", margin: "0 0 12px" }}>Roast Me</h2>
        <p style={{ fontFamily: cursive, fontSize: 17, color: P.muted, maxWidth: 380, margin: "0 auto 32px" }}>
          We'll pull your profile and roast you on the spot.
        </p>
        <MemeMe />
      </section>

      {/* TASKS */}
      <main style={{ maxWidth: 700, margin: "0 auto", padding: "8px 24px 72px" }}>
        <p style={eyebrow}>Earn Points</p>
        <h2 style={{ fontFamily: marker, fontSize: 30, color: "#fff", margin: "0 0 10px" }}>Collect Points</h2>
        <p style={{ fontFamily: cursive, fontSize: 17, color: P.muted, margin: "0 0 32px" }}>
          Complete the tasks below to climb the leaderboard.
        </p>

        <p style={{ fontFamily: mono, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: P.muted, marginBottom: 14 }}>
          Follow & Join
        </p>
        <div style={{
          display: "flex", alignItems: "center", gap: 16, padding: 20, borderRadius: 18,
          border: `1px solid ${P.border}`, background: P.surface, marginBottom: 36,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, background: `${followTask.color}1a`,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <Twitter size={20} color={followTask.color} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>X / Twitter</span>
              <span style={{ fontFamily: mono, fontSize: 12, color: followTask.color }}>@GomeJpeg</span>
            </div>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: P.muted }}>
              Follow GOME on X for drops, alpha, and announcements.
            </p>
          </div>
          <TaskClaimButton task={followTask} claimed={claimed.has(followTask.id)} busy={busy} onClaim={() => claim(followTask)} />
        </div>

        <p style={{ fontFamily: mono, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: P.muted, marginBottom: 14 }}>
          Tweet Engagement
        </p>
        <div style={{ borderRadius: 18, border: `1px solid ${P.border}`, background: P.surface, overflow: "hidden" }}>
          <div style={{ padding: 16, borderBottom: `1px solid ${P.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
              <Twitter size={14} color={P.brett} />
              <span style={{ fontSize: 11, color: P.muted, fontFamily: mono }}>Post #{TWEET_ID}</span>
              <a href={TWEET_URL} target="_blank" rel="noreferrer" style={{
                marginLeft: "auto", display: "flex", alignItems: "center", gap: 4,
                fontSize: 10, color: P.muted, textDecoration: "none",
              }}>
                <ExternalLink size={12} /> Open on X
              </a>
            </div>
            <blockquote className="twitter-tweet" data-theme="dark">
              <a href={TWEET_URL}>View Tweet</a>
            </blockquote>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
            {tweetTasks.map((t, i) => {
              const Icon = t.icon!;
              const isClaimed = claimed.has(t.id);
              return (
                <div key={t.id} style={{
                  padding: "18px 8px", textAlign: "center",
                  borderRight: i < tweetTasks.length - 1 ? `1px solid ${P.border}` : "none",
                }}>
                  <Icon size={18} color={t.color} style={{ marginBottom: 6 }} />
                  <p style={{ margin: "0 0 2px", fontSize: 12, fontWeight: 700 }}>{t.label}</p>
                  <p style={{ margin: "0 0 10px", fontFamily: mono, fontSize: 11, fontWeight: 700, color: t.color }}>+{t.points}</p>
                  <button
                    disabled={isClaimed || busy}
                    onClick={() => claim(t)}
                    style={{
                      width: "100%", padding: "8px 0", borderRadius: 8, border: "none",
                      background: isClaimed ? "rgba(255,255,255,0.06)" : t.color,
                      color: isClaimed ? P.muted : "#fff", fontFamily: mono, fontWeight: 700, fontSize: 11,
                      cursor: isClaimed ? "default" : "pointer", textTransform: "uppercase", letterSpacing: "0.04em",
                    }}
                  >
                    {isClaimed ? "Claimed" : "Claim"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* LEADERBOARD */}
      <section style={{ padding: "16px 24px 80px", textAlign: "center" }}>
        <p style={eyebrow}>Top 100</p>
        <h2 style={{ fontFamily: marker, fontSize: 30, color: "#fff", margin: "0 0 32px" }}>Leaderboard</h2>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <Leaderboard limit={10} showViewAll />
        </div>
      </section>
    </div>
  );
}

/* Infinite horizontal scroll of numbered collection pieces, rotated like scattered photos */
function CollectionMarquee({ images, supply }: { images: string[]; supply: string }) {
  const [paused, setPaused] = useState(false);
  const rotations = [-3, 2, -1.5, 3, -2, 1, -3.5, 2.5, -1, 1.5];

  return (
    <section style={{ padding: "8px 0 56px", overflow: "hidden" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px", textAlign: "center", marginBottom: 4 }}>
        <p style={eyebrow}>The Collection</p>
        <h2 style={{ fontFamily: marker, fontSize: 30, color: "#fff", margin: "0 0 8px" }}>Some Of The Crew</h2>
      </div>

      <div style={{ overflow: "hidden", cursor: "grab" }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <motion.div
          style={{ display: "flex", gap: 18, padding: "28px 24px" }}
          animate={{ x: paused ? undefined : [0, -(images.length * 150)] }}
          transition={{ duration: 26, repeat: Infinity, ease: "linear", repeatType: "loop" }}
        >
          {[...images, ...images].map((src, i) => (
            <div key={i} style={{
              flexShrink: 0, width: 130, transform: `rotate(${rotations[i % rotations.length]}deg)`,
              background: "#fff", border: "3px solid #000", borderRadius: 6, padding: 6,
              boxShadow: "4px 4px 0 rgba(0,0,0,0.6)",
            }}>
              <img
                src={src} alt={`GOME #${(i % images.length) + 1}`}
                style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block", borderRadius: 2 }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>
          ))}
        </motion.div>
      </div>

      <p style={{ textAlign: "center", fontFamily: mono, fontSize: 11, letterSpacing: "0.1em", color: P.muted, textTransform: "uppercase" }}>
        {supply} Supply · More Revealed Soon
      </p>
    </section>
  );
}

function CharacterSection({ bg, name, blurb, img }: { bg: string; name: string; blurb: string; img: string }) {
  return (
    <section style={{ background: bg, padding: "56px 24px 64px", textAlign: "center" }}>
      <h2 style={{ fontFamily: marker, fontSize: 38, color: "#fff", margin: "0 0 14px", textShadow: "0 3px 0 rgba(0,0,0,0.2)" }}>
        {name}
      </h2>
      <p style={{ color: "rgba(255,255,255,0.95)", fontSize: 15, lineHeight: 1.7, maxWidth: 420, margin: "0 auto 28px" }}>
        {blurb}
      </p>
      <div style={{ display: "inline-block", background: "#fff", borderRadius: 28, padding: 18, boxShadow: "0 14px 34px rgba(0,0,0,0.25)" }}>
        <SafeImage src={img} alt={name} style={{ height: 200, display: "block", objectFit: "contain" }} />
      </div>
    </section>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: P.surface, border: `1px solid ${P.border}`, borderRadius: 14, padding: "12px 18px", minWidth: 108 }}>
      <p style={{ margin: "0 0 4px", fontFamily: mono, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: P.muted }}>{label}</p>
      <p style={{ margin: 0, fontFamily: mono, fontWeight: 700, fontSize: 16, color: "#fff" }}>{value}</p>
    </div>
  );
}

function TaskClaimButton({ task, claimed, busy, onClaim }: { task: typeof TASKS[0]; claimed: boolean; busy: boolean; onClaim: () => void }) {
  if (claimed) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: mono, fontSize: 12, fontWeight: 700, color: P.pepe, flexShrink: 0 }}>
        <CheckCircle2 size={16} /> Claimed
      </div>
    );
  }
  return (
    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
      <a href={task.url} target="_blank" rel="noreferrer" style={{
        padding: "8px 14px", borderRadius: 10, border: `1px solid ${P.border}`,
        color: P.text, textDecoration: "none", fontFamily: mono, fontSize: 11, fontWeight: 700,
      }}>Open</a>
      <button
        disabled={busy}
        onClick={onClaim}
        style={{
          padding: "8px 14px", borderRadius: 10, border: "none", background: task.color,
          color: "#fff", fontFamily: mono, fontWeight: 700, fontSize: 11, cursor: "pointer",
          textTransform: "uppercase", letterSpacing: "0.04em",
        }}
      >
        Claim +{task.points}
      </button>
    </div>
  );
}

/* Faint wireframe shapes for hero atmosphere */
function WireframeDecor() {
  return (
    <svg style={{ position: "absolute", top: 0, right: 0, width: 220, height: 220, opacity: 0.18, pointerEvents: "none" }} viewBox="0 0 200 200">
      <polygon points="100,10 180,60 180,140 100,190 20,140 20,60" fill="none" stroke="#fff" strokeWidth="1" />
      <polygon points="100,40 150,70 150,130 100,160 50,130 50,70" fill="none" stroke="#fff" strokeWidth="1" />
      <line x1="100" y1="10" x2="100" y2="190" stroke="#fff" strokeWidth="0.5" />
    </svg>
  );
}

const eyebrow: React.CSSProperties = {
  fontFamily: mono, fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase",
  color: P.muted, margin: "0 0 10px",
};

function outlinePill(color: string): React.CSSProperties {
  return {
    fontFamily: mono, fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase",
    color, background: "transparent", border: `1.5px solid ${color}`, borderRadius: 30,
    padding: "10px 20px", cursor: "pointer",
  };
}
function solidPill(color: string): React.CSSProperties {
  return {
    ...outlinePill(color), background: color, color: "#fff", border: "none", boxShadow: `0 0 24px ${color}55`,
  };
}
