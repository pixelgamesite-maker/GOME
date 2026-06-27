import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { SafeImage } from "@/components/SafeImage";

const P = {
  bg: "#070707", bgElevated: "#0e0e0e", surface: "#141414",
  border: "rgba(255,255,255,0.06)", gold: "#C9A84C", goldDim: "rgba(201,168,76,0.15)",
  text: "#f5f5f5", muted: "rgba(255,255,255,0.4)", dim: "rgba(255,255,255,0.15)",
  pepe: "#3ddc52", brett: "#3b82f6", bonk: "#f97316",
};

const display = "'Fredoka', sans-serif";
const body = "'Space Grotesk', sans-serif";

const TASKS = [
  { id: "follow", label: "Follow @GomeJpeg", points: 50, url: "https://x.com/GomeJpeg", color: P.pepe },
  { id: "like", label: "Like Pinned Tweet", points: 10, url: "https://x.com/i/status/2070602933767389663", color: P.brett },
  { id: "retweet", label: "Retweet Pinned Tweet", points: 20, url: "https://x.com/i/status/2070602933767389663", color: P.bonk },
  { id: "comment", label: "Comment & Tag 2 Frens", points: 20, url: "https://x.com/i/status/2070602933767389663", color: P.gold },
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
    <div style={{ background: P.bg, minHeight: "100vh", color: P.text, fontFamily: body }}>
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
            fontFamily: display, fontSize: 14, color: P.gold,
            background: P.goldDim, padding: "6px 14px", borderRadius: 20,
          }}>
            {totalPoints} pts
          </span>
          <img src={avatar} alt="avatar" style={{ width: 32, height: 32, borderRadius: "50%", border: `2px solid ${P.gold}` }} />
          <button onClick={signOut} style={{
            fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
            color: P.muted, background: "transparent", border: "none", cursor: "pointer",
          }}>Out</button>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
        {/* Welcome */}
        <div style={{
          background: P.surface, border: `1px solid ${P.border}`, borderRadius: 20,
          padding: 28, marginBottom: 32, display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap",
        }}>
          <img src={avatar} style={{ width: 64, height: 64, borderRadius: "50%", border: `3px solid ${P.gold}` }} alt="" />
          <div>
            <h2 style={{ fontFamily: display, fontSize: 22, margin: "0 0 4px" }}>Welcome, @{handle}</h2>
            <p style={{ margin: 0, color: P.muted, fontSize: 14 }}>
              Rank <strong style={{ color: P.gold }}>#{rank ?? "—"}</strong> · Top 1000 get GTD mint
            </p>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
            <button onClick={() => navigate("/gallery")} style={navBtn(P.pepe)}>Gallery</button>
            <button onClick={() => navigate("/leaderboard")} style={navBtn(P.brett)}>Leaderboard</button>
            <button onClick={() => navigate("/collab")} style={navBtn(P.bonk)}>Collab</button>
          </div>
        </div>

        {/* Tasks */}
        <h3 style={{ fontFamily: display, fontSize: 20, marginBottom: 16 }}>Collect Points</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 40 }}>
          {TASKS.map((t) => {
            const isClaimed = claimed.has(t.id);
            return (
              <div key={t.id} style={{
                background: P.surface, border: `1px solid ${P.border}`, borderRadius: 16,
                padding: 24, transition: "all 0.2s",
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

        {/* Progress */}
        <div style={{ background: P.surface, border: `1px solid ${P.border}`, borderRadius: 16, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: P.muted }}>Your Progress</span>
            <span style={{ fontSize: 13, color: P.gold, fontWeight: 700 }}>{totalPoints} / 100 pts</span>
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

function navBtn(color: string) {
  return {
    fontFamily: body, fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" as const,
    color: "#000", background: color, border: "none", borderRadius: 10,
    padding: "10px 18px", cursor: "pointer", transition: "all 0.2s",
  };
}
