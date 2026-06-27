import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { SafeImage } from "@/components/SafeImage";
import MemeMe from "@/components/MemeMe";
import { Twitter, Heart, Repeat2, MessageCircle, ExternalLink, CheckCircle2 } from "lucide-react";

const P = {
  pepe: "#3ddc52", brett: "#3b82f6", bonk: "#f97316",
  ink: "#15161a", muted: "#6b6f76", border: "#ececec", paper: "#ffffff", soft: "#f7f7f8",
};

const display = "'Fredoka', sans-serif";
const body = "'Space Grotesk', sans-serif";

const TWEET_ID = "2070602933767389663";
const TWEET_URL = `https://x.com/i/status/${TWEET_ID}`;

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
  const [rank, setRank] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/");
    if (user) fetchPoints();
  }, [user, loading, navigate]);

  // Load the Twitter widget script once, for the embedded tweet preview
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
    const { data } = await supabase
      .from("points_log")
      .select("task_type,points")
      .eq("user_id", user.id);

    const set = new Set((data || []).map((d: TaskLog) => d.task_type));
    const pts = (data || []).reduce((a: number, b: TaskLog) => a + (b.points || 0), 0);
    setClaimed(set);
    setTotalPoints(pts);

    const { count } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gt("points_total", pts);
    setRank((count || 0) + 1);
  };

  const claim = async (task: typeof TASKS[0]) => {
    if (!user || claimed.has(task.id) || busy) return;
    setBusy(true);
    const { error } = await supabase.from("points_log").insert({
      user_id: user.id,
      task_type: task.id,
      points: task.points,
    });
    if (!error) {
      await supabase.rpc("increment_points", { p_user_id: user.id, p_amount: task.points });
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
    <div style={{ background: P.paper, minHeight: "100vh", color: P.ink, fontFamily: body }}>
      <style>{`
        @keyframes gome-pulse {
          0%, 100% { text-shadow: 0 0 18px rgba(255,255,255,0.55), 0 4px 0 rgba(0,0,0,0.15); }
          50% { text-shadow: 0 0 34px rgba(255,255,255,0.92), 0 4px 0 rgba(0,0,0,0.15); }
        }
      `}</style>

      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50, height: 72,
        padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${P.border}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <SafeImage src="/GOME-LOGO.png" alt="GOME" style={{ height: 30, width: 30 }} />
          <span style={{ fontFamily: display, fontSize: 18, fontWeight: 600 }}>GOME</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{
            fontFamily: display, fontSize: 14, color: P.ink,
            background: P.soft, border: `1px solid ${P.border}`,
            padding: "6px 14px", borderRadius: 20,
          }}>
            {totalPoints} pts
          </span>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: ringGradient, padding: 2 }}>
            <img src={avatar} alt="avatar" style={{ width: "100%", height: "100%", borderRadius: "50%", display: "block", border: `2px solid ${P.paper}` }} />
          </div>
          <button onClick={signOut} style={{
            fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
            color: P.muted, background: "transparent", border: "none", cursor: "pointer",
          }}>Out</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        background: `linear-gradient(135deg, ${P.pepe}, ${P.brett} 55%, ${P.bonk})`,
        padding: "56px 24px 64px", textAlign: "center", color: "#fff",
      }}>
        <SafeImage src="/GOME-HERO.png" alt="GOME" style={{ height: 170, margin: "0 auto 12px", display: "block" }} />
        <h1 style={{
          fontFamily: display, fontSize: "clamp(48px, 11vw, 76px)", fontWeight: 700,
          margin: "0 0 6px", lineHeight: 1, color: "#fff",
          animation: "gome-pulse 2.4s ease-in-out infinite",
        }}>
          GOME
        </h1>
        <p style={{ fontFamily: display, fontSize: 20, fontWeight: 600, margin: "0 0 10px", opacity: 0.95 }}>
          Gallery Of Meme
        </p>
        <p style={{ fontSize: 14, opacity: 0.85, maxWidth: 380, margin: "0 auto 28px" }}>
          A gallery of internet's most iconic memes.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
          <button onClick={() => navigate("/gallery")} style={pillBtn(P.pepe)}>Gallery</button>
          <button onClick={() => navigate("/leaderboard")} style={pillBtn(P.brett)}>Leaderboard</button>
          <button onClick={() => navigate("/collab")} style={pillBtn(P.bonk)}>Collab</button>
        </div>
      </section>

      {/* COLLECTION DETAILS */}
      <section style={{ background: P.soft, padding: "44px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: display, fontSize: 24, margin: "0 0 22px" }}>Collection Details</h2>
        <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap", maxWidth: 640, margin: "0 auto" }}>
          <StatChip label="Supply" value="4,004" color={P.pepe} />
          <StatChip label="Platform" value="OpenSea" color={P.brett} />
          <StatChip label="Chain" value="Ethereum" color={P.bonk} />
          <StatChip label="Mint Price" value="TBA" color={P.pepe} />
        </div>
      </section>

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
      <section style={{ background: "#0c0c0c", padding: "56px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: display, fontSize: 28, color: "#fff", margin: "0 0 10px" }}>Roast Me</h2>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, maxWidth: 380, margin: "0 auto 32px" }}>
          We'll pull your profile and roast you on the spot. No mercy.
        </p>
        <MemeMe />
      </section>

      {/* TASKS */}
      <main style={{ maxWidth: 700, margin: "0 auto", padding: "56px 24px" }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: P.muted, margin: "0 0 6px" }}>
          Earn Points
        </p>
        <h2 style={{ fontFamily: display, fontSize: 28, margin: "0 0 8px" }}>Collect Points</h2>
        <p style={{ color: P.muted, fontSize: 13, margin: "0 0 32px" }}>
          Rank <strong style={{ color: P.ink }}>#{rank ?? "—"}</strong> · Top 1000 get GTD mint
        </p>

        {/* Follow & Join */}
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: P.muted, marginBottom: 14 }}>
          Follow & Join
        </p>
        <div style={{
          display: "flex", alignItems: "center", gap: 16, padding: 20, borderRadius: 18,
          border: `1px solid ${P.border}`, background: P.paper, marginBottom: 36,
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
              <span style={{ fontSize: 12, color: followTask.color, fontWeight: 600 }}>@GomeJpeg</span>
            </div>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: P.muted }}>
              Follow GOME on X for drops, alpha, and announcements.
            </p>
          </div>
          <TaskClaimButton task={followTask} claimed={claimed.has(followTask.id)} busy={busy} onClaim={() => claim(followTask)} />
        </div>

        {/* Tweet Engagement */}
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: P.muted, marginBottom: 14 }}>
          Tweet Engagement
        </p>
        <div style={{ borderRadius: 18, border: `1px solid ${P.border}`, background: P.paper, overflow: "hidden", marginBottom: 40 }}>
          <div style={{ padding: 16, borderBottom: `1px solid ${P.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
              <Twitter size={14} color={P.brett} />
              <span style={{ fontSize: 11, color: P.muted, fontFamily: "monospace" }}>Post #{TWEET_ID}</span>
              <a href={TWEET_URL} target="_blank" rel="noreferrer" style={{
                marginLeft: "auto", display: "flex", alignItems: "center", gap: 4,
                fontSize: 10, color: P.muted, textDecoration: "none",
              }}>
                <ExternalLink size={12} /> Open on X
              </a>
            </div>
            <blockquote className="twitter-tweet" data-theme="light">
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
                  <p style={{ margin: "0 0 10px", fontSize: 11, fontWeight: 700, color: t.color }}>+{t.points}</p>
                  <button
                    disabled={isClaimed || busy}
                    onClick={() => claim(t)}
                    style={{
                      width: "100%", padding: "8px 0", borderRadius: 8, border: "none",
                      background: isClaimed ? P.soft : t.color,
                      color: isClaimed ? P.muted : "#fff", fontWeight: 700, fontSize: 11,
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

        {/* Progress */}
        <div style={{ background: P.paper, border: `1px solid ${P.border}`, borderRadius: 16, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: P.muted }}>Your Progress</span>
            <span style={{ fontSize: 13, color: P.ink, fontWeight: 700 }}>{totalPoints} / 100 pts</span>
          </div>
          <div style={{ height: 8, background: P.soft, borderRadius: 10, overflow: "hidden" }}>
            <div style={{
              width: `${Math.min((totalPoints / 100) * 100, 100)}%`,
              height: "100%", background: `linear-gradient(90deg, ${P.pepe}, ${P.brett}, ${P.bonk})`,
              borderRadius: 10, transition: "width 0.5s ease",
            }} />
          </div>
          <p style={{ fontSize: 12, color: P.muted, marginTop: 10 }}>
            Complete all tasks to maximize your rank. Top 1000 wallets are guaranteed mint.
          </p>
        </div>
      </main>
    </div>
  );
}

/* Full-bleed colorful character block */
function CharacterSection({ bg, name, blurb, img }: { bg: string; name: string; blurb: string; img: string }) {
  return (
    <section style={{ background: bg, padding: "56px 24px 64px", textAlign: "center" }}>
      <h2 style={{
        fontFamily: display, fontSize: 38, color: "#fff", margin: "0 0 14px",
        textShadow: "0 3px 0 rgba(0,0,0,0.15)",
      }}>{name}</h2>
      <p style={{ color: "rgba(255,255,255,0.95)", fontSize: 15, lineHeight: 1.7, maxWidth: 420, margin: "0 auto 28px" }}>
        {blurb}
      </p>
      <div style={{
        display: "inline-block", background: "#fff", borderRadius: 28, padding: 18,
        boxShadow: "0 14px 34px rgba(0,0,0,0.2)",
      }}>
        <SafeImage src={img} alt={name} style={{ height: 200, display: "block", objectFit: "contain" }} />
      </div>
    </section>
  );
}

function StatChip({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{
      background: P.paper, border: `1px solid ${P.border}`, borderTop: `3px solid ${color}`,
      borderRadius: 14, padding: "14px 22px", minWidth: 120,
    }}>
      <p style={{ margin: "0 0 4px", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: P.muted }}>{label}</p>
      <p style={{ margin: 0, fontFamily: display, fontSize: 17, fontWeight: 600 }}>{value}</p>
    </div>
  );
}

function TaskClaimButton({ task, claimed, busy, onClaim }: { task: typeof TASKS[0]; claimed: boolean; busy: boolean; onClaim: () => void }) {
  if (claimed) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: P.pepe, flexShrink: 0 }}>
        <CheckCircle2 size={16} /> Claimed
      </div>
    );
  }
  return (
    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
      <a href={task.url} target="_blank" rel="noreferrer" style={{
        padding: "8px 14px", borderRadius: 10, border: `1px solid ${P.border}`,
        color: P.ink, textDecoration: "none", fontSize: 11, fontWeight: 700,
      }}>Open</a>
      <button
        disabled={busy}
        onClick={onClaim}
        style={{
          padding: "8px 14px", borderRadius: 10, border: "none", background: task.color,
          color: "#fff", fontWeight: 700, fontSize: 11, cursor: "pointer",
          textTransform: "uppercase", letterSpacing: "0.04em",
        }}
      >
        Claim +{task.points}
      </button>
    </div>
  );
}

function pillBtn(color: string): React.CSSProperties {
  return {
    fontFamily: body, fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase",
    color, background: "#fff", border: "none", borderRadius: 30,
    padding: "11px 20px", cursor: "pointer",
  };
}
