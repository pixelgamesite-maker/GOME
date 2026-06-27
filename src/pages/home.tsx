import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { SafeImage } from "@/components/SafeImage";

const P = {
  bg: "#070707", bgElevated: "#0e0e0e", surface: "#141414",
  border: "rgba(255,255,255,0.06)",
  text: "#f5f5f5", muted: "rgba(255,255,255,0.4)", dim: "rgba(255,255,255,0.15)",
  pepe: "#3ddc52", brett: "#3b82f6", bonk: "#f97316",
};

const display = "'Fredoka', sans-serif";
const body = "'Space Grotesk', sans-serif";
const ringGradient = `conic-gradient(${P.pepe}, ${P.brett}, ${P.bonk}, ${P.pepe})`;
const brandGradientText: React.CSSProperties = {
  background: `linear-gradient(90deg, ${P.pepe}, ${P.brett}, ${P.bonk})`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
};

const TASKS = [
  { id: "follow", label: "Follow @GomeJpeg", points: 50, url: "https://x.com/GomeJpeg", color: P.pepe },
  { id: "like", label: "Like Pinned Tweet", points: 10, url: "https://x.com/i/status/2070602933767389663", color: P.brett },
  { id: "retweet", label: "Retweet Pinned Tweet", points: 20, url: "https://x.com/i/status/2070602933767389663", color: P.bonk },
  { id: "comment", label: "Comment & Tag 2 Frens", points: 20, url: "https://x.com/i/status/2070602933767389663", color: P.pepe },
];

/* ── Types ── */
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

    // Approximate rank (count of users with more points)
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
  const handle = meta.preferred_username || meta.user_name || "anon";

  return (
    <div style={{ background: P.bg, minHeight: "100vh", color: P.text, fontFamily: body, overflowX: "hidden" }}>
      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50, height: 72,
        padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(7,7,7,0.92)", backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${P.border}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <SafeImage src="/GOME-LOGO.png" alt="GOME" style={{ height: 30, width: 30 }} />
          <span style={{ fontFamily: display, fontSize: 18, fontWeight: 600 }}>GOME</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{
            fontFamily: display, fontSize: 14, color: P.text,
            background: "rgba(255,255,255,0.06)", border: `1px solid ${P.border}`,
            padding: "6px 14px", borderRadius: 20,
          }}>
            {totalPoints} pts
          </span>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: ringGradient, padding: 2 }}>
            <img src={avatar} alt="avatar" style={{ width: "100%", height: "100%", borderRadius: "50%", display: "block", border: `2px solid ${P.bg}` }} />
          </div>
          <button onClick={signOut} style={{
            fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
            color: P.muted, background: "transparent", border: "none", cursor: "pointer",
          }}>Out</button>
        </div>
      </nav>

      {/* ───────── HERO ───────── */}
      <section style={{
        position: "relative", padding: "64px 24px 56px", textAlign: "center",
        overflow: "hidden", isolation: "isolate",
      }}>
        {/* ambient color blobs */}
        <div style={{ position: "absolute", top: -80, left: "8%", width: 260, height: 260, borderRadius: "50%", background: P.pepe, opacity: 0.16, filter: "blur(70px)", zIndex: -1 }} />
        <div style={{ position: "absolute", top: -40, right: "10%", width: 220, height: 220, borderRadius: "50%", background: P.brett, opacity: 0.18, filter: "blur(70px)", zIndex: -1 }} />
        <div style={{ position: "absolute", bottom: -60, left: "40%", width: 240, height: 240, borderRadius: "50%", background: P.bonk, opacity: 0.14, filter: "blur(70px)", zIndex: -1 }} />

        <SafeImage src="/GOME-HERO.png" alt="GOME" style={{ height: 180, margin: "0 auto 8px", display: "block" }} />

        <h1 style={{
          ...brandGradientText, fontFamily: display, fontSize: "clamp(40px, 8vw, 64px)",
          fontWeight: 700, margin: "0 0 10px", lineHeight: 1,
        }}>
          BASE CAMP
        </h1>
        <p style={{ color: P.muted, fontSize: 15, maxWidth: 480, margin: "0 auto 28px" }}>
          Where the GOME crew links up, knocks out quests, and climbs the ranks toward mint day.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
          <button onClick={() => navigate("/gallery")} style={navBtn(P.pepe)}>Gallery</button>
          <button onClick={() => navigate("/leaderboard")} style={navBtn(P.brett)}>Leaderboard</button>
          <button onClick={() => navigate("/collab")} style={navBtn(P.bonk)}>Collab</button>
        </div>

        <div style={{
          display: "inline-flex", alignItems: "center", gap: 14, background: P.surface,
          border: `1px solid ${P.border}`, borderRadius: 40, padding: "10px 20px 10px 10px",
        }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: ringGradient, padding: 2 }}>
            <img src={avatar} style={{ width: "100%", height: "100%", borderRadius: "50%", display: "block", border: `2px solid ${P.surface}` }} alt="" />
          </div>
          <div style={{ textAlign: "left" }}>
            <p style={{ margin: 0, fontFamily: display, fontSize: 14 }}>@{handle}</p>
            <p style={{ margin: 0, fontSize: 12, color: P.muted }}>
              Rank <strong style={{ ...brandGradientText, fontWeight: 700 }}>#{rank ?? "—"}</strong> · Top 1000 get GTD mint
            </p>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px 24px" }}>

        {/* ───────── MEET THE CREW ───────── */}
        <p style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase",
          color: P.dim, textAlign: "center", margin: "8px 0 6px",
        }}>Meet the Crew</p>
        <h2 style={{ fontFamily: display, fontSize: 28, textAlign: "center", margin: "0 0 36px" }}>
          Three faces. One pack.
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 48 }}>
          <MascotPanel
            color={P.pepe} name="PEPE" tag="The OG"
            blurb="Green energy, infinite vibes. Pepe's been here since before it was cool, and he's not leaving now."
            img="/PEPE.PNG" thumbs={["/pepe-1.jpg"]}
          />
          <MascotPanel
            color={P.brett} name="BRETT" tag="The Face"
            blurb="Blue blood, big plans. Brett's the reason the chart never sleeps."
            img="/BRETT.PNG" thumbs={["/brett-1.jpg", "/brett-2.jpg", "/brett-3.jpg"]}
            reverse
          />
          <MascotPanel
            color={P.bonk} name="BONK" tag="The Wildcard"
            blurb="Orange and unpredictable. Bonk shows up, stirs the pot, and vanishes before the screenshots."
            img="/BONK.PNG"
          />
        </div>

        {/* ───────── TASKS ───────── */}
        <h3 style={{ fontFamily: display, fontSize: 20, marginBottom: 16 }}>Collect Points</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 40 }}>
          {TASKS.map((t) => {
            const isClaimed = claimed.has(t.id);
            return (
              <div key={t.id} style={{
                background: P.surface, border: `1px solid ${P.border}`, borderRadius: 16,
                padding: 24, borderTop: `3px solid ${t.color}`, transition: "all 0.2s",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontFamily: display, fontSize: 16, fontWeight: 600 }}>{t.label}</span>
                  <span style={{
                    fontSize: 12, fontWeight: 700, color: "#000", background: t.color,
                    padding: "4px 10px", borderRadius: 20,
                  }}>+{t.points}</span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <a href={t.url} target="_blank" rel="noreferrer" style={{
                    flex: 1, textAlign: "center", padding: "10px 0", borderRadius: 10,
                    border: `1px solid ${P.border}`, color: P.text, textDecoration: "none", fontSize: 12, fontWeight: 700,
                  }}>Open X</a>
                  <button
                    disabled={isClaimed || busy}
                    onClick={() => claim(t)}
                    style={{
                      flex: 1, padding: "10px 0", borderRadius: 10, border: "none",
                      background: isClaimed ? "rgba(255,255,255,0.06)" : t.color,
                      color: isClaimed ? P.dim : "#000", fontWeight: 800, fontSize: 12,
                      cursor: isClaimed ? "default" : "pointer", textTransform: "uppercase", letterSpacing: "0.06em",
                    }}
                  >
                    {isClaimed ? "Claimed" : "Claim"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ───────── PROGRESS ───────── */}
        <div style={{ background: P.surface, border: `1px solid ${P.border}`, borderRadius: 16, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: P.muted }}>Your Progress</span>
            <span style={{ fontSize: 13, fontWeight: 700, ...brandGradientText }}>{totalPoints} / 100 pts</span>
          </div>
          <div style={{ height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 10, overflow: "hidden" }}>
            <div style={{
              width: `${Math.min((totalPoints / 100) * 100, 100)}%`,
              height: "100%", background: `linear-gradient(90deg, ${P.pepe}, ${P.brett}, ${P.bonk})`,
              borderRadius: 10, transition: "width 0.5s ease",
            }} />
          </div>
          <p style={{ fontSize: 12, color: P.dim, marginTop: 10 }}>
            Complete all tasks to maximize your rank. Top 1000 wallets are guaranteed mint.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Mascot panel: alternating image / copy block, themed per character ── */
function MascotPanel({
  color, name, tag, blurb, img, thumbs, reverse,
}: {
  color: string; name: string; tag: string; blurb: string; img: string;
  thumbs?: string[]; reverse?: boolean;
}) {
  return (
    <div style={{
      display: "flex", flexWrap: "wrap", alignItems: "center", gap: 28,
      flexDirection: reverse ? "row-reverse" : "row",
      background: `linear-gradient(${reverse ? 165 : 195}deg, ${color}1a, ${P.surface} 65%)`,
      border: `1px solid ${P.border}`, borderRadius: 28, padding: 28, position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", width: 220, height: 220, borderRadius: "50%", background: color,
        opacity: 0.18, filter: "blur(60px)", top: "50%", left: reverse ? "auto" : "8%", right: reverse ? "8%" : "auto",
        transform: "translateY(-50%)", zIndex: 0,
      }} />

      <div style={{ flex: "1 1 220px", display: "flex", justifyContent: "center", position: "relative", zIndex: 1 }}>
        <SafeImage src={img} alt={name} style={{ height: 180, objectFit: "contain" }} />
      </div>

      <div style={{ flex: "1 1 260px", position: "relative", zIndex: 1 }}>
        <span style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
          color, background: `${color}1f`, border: `1px solid ${color}55`, borderRadius: 20, padding: "4px 12px",
        }}>{tag}</span>
        <h3 style={{ fontFamily: display, fontSize: 30, color, margin: "12px 0 8px" }}>{name}</h3>
        <p style={{ color: P.muted, fontSize: 14, lineHeight: 1.6, margin: 0 }}>{blurb}</p>

        {thumbs && thumbs.length > 0 && (
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            {thumbs.map((src) => (
              <div key={src} style={{
                width: 60, height: 60, borderRadius: 12, overflow: "hidden",
                border: `1px solid ${color}55`, flexShrink: 0,
              }}>
                <SafeImage src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function navBtn(color: string) {
  return {
    fontFamily: body, fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" as const,
    color: "#000", background: color, border: "none", borderRadius: 10,
    padding: "10px 18px", cursor: "pointer", transition: "all 0.2s",
  };
}
