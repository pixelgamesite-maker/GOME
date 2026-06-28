import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

/**
 * Leaderboard — Aurelia-style ranking panel.
 * Shows the signed-in user's own rank up top (so it's visible even if
 * they're outside the visible list), then a top-3 podium, then a ranked
 * table. Pass `limit` to control how many rows load — use a small limit
 * for a homepage preview, 100 for the full /leaderboard page.
 *
 * Usage:
 *   <Leaderboard limit={10} showViewAll />   // homepage preview
 *   <Leaderboard limit={100} />              // full leaderboard page
 */

const P = {
  bg: "#070707", surface: "#141414", border: "rgba(255,255,255,0.08)",
  text: "#f5f5f5", muted: "rgba(255,255,255,0.45)", dim: "rgba(255,255,255,0.18)",
  gold: "#C9A84C", silver: "#9ca3af", bronze: "#cd7f32",
};
const serif = "'Permanent Marker', cursive";
const body = "'Space Mono', monospace";

type Row = { id: string; username: string | null; avatar_url: string | null; points_total: number; created_at: string };

export default function Leaderboard({ limit = 100, showViewAll = false }: { limit?: number; showViewAll?: boolean }) {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [rows, setRows] = useState<Row[]>([]);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [myPoints, setMyPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, [limit]);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("id, username, avatar_url, points_total, created_at")
      .order("points_total", { ascending: false })
      .limit(limit);
    setRows(data || []);

    if (user) {
      const { data: me } = await supabase
        .from("profiles").select("points_total").eq("id", user.id).maybeSingle();
      const pts = me?.points_total || 0;
      setMyPoints(pts);
      const { count } = await supabase
        .from("profiles").select("*", { count: "exact", head: true })
        .gt("points_total", pts);
      setMyRank((count || 0) + 1);
    }
    setLoading(false);
  };

  const podium = [rows[1], rows[0], rows[2]]; // silver, gold, bronze visual order
  const rest = rows.slice(3);

  const fmtDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
    } catch { return ""; }
  };

  return (
    <div style={{ fontFamily: body, color: P.text }}>
      {/* Your rank — always visible, even outside the visible list */}
      {user && (
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 10, margin: "0 auto 28px",
          background: P.surface, border: `1px solid ${P.border}`, borderRadius: 30,
          padding: "10px 20px",
        }}>
          <span style={{ fontSize: 13, color: P.muted }}>Your rank:</span>
          <span style={{ fontFamily: serif, fontSize: 16, color: P.gold, fontWeight: 700 }}>
            #{myRank ?? "—"}
          </span>
          <span style={{ fontSize: 13, color: P.muted }}>with</span>
          <span style={{ fontWeight: 700 }}>{myPoints}</span>
          <span style={{ color: P.gold }}>★</span>
        </div>
      )}

      {!loading && rows.length === 0 && (
        <p style={{ color: P.muted, fontSize: 13 }}>No rankings yet — be the first to earn points.</p>
      )}

      {/* Podium — top 3 */}
      {rows.length > 0 && (
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 12, marginBottom: 36 }}>
          {podium.map((r, i) => {
            if (!r) return <div key={i} style={{ width: 110 }} />;
            const place = i === 1 ? 1 : i === 0 ? 2 : 3;
            const height = place === 1 ? 200 : place === 2 ? 160 : 140;
            const color = place === 1 ? P.gold : place === 2 ? P.silver : P.bronze;
            return (
              <div key={r.id} style={{ width: 110, textAlign: "center" }}>
                <img
                  src={r.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${r.id}`}
                  alt="" style={{ width: 46, height: 46, borderRadius: "50%", border: `2px solid ${color}`, marginBottom: 6 }}
                />
                <p style={{ fontSize: 12, fontWeight: 700, margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  @{r.username || "anon"}
                </p>
                <p style={{ fontSize: 12, color, fontWeight: 700, margin: "0 0 8px" }}>{r.points_total} ★</p>
                <div style={{
                  height, borderRadius: "12px 12px 0 0", background: `${color}26`,
                  border: `1px solid ${color}55`, position: "relative",
                  display: "flex", justifyContent: "center", paddingTop: 10,
                }}>
                  <span style={{
                    width: 26, height: 26, borderRadius: "50%", background: color,
                    color: "#000", fontWeight: 800, fontSize: 13,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>{place}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ranked table */}
      {rest.length > 0 && (
        <div style={{ borderRadius: 16, border: `1px solid ${P.border}`, overflow: "hidden" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "56px 1fr 70px", padding: "10px 16px",
            fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: P.muted,
            borderBottom: `1px solid ${P.border}`,
          }}>
            <span>Rank</span><span>User</span><span style={{ textAlign: "right" }}>Stars</span>
          </div>
          {rest.map((r, i) => (
            <div key={r.id} style={{
              display: "grid", gridTemplateColumns: "56px 1fr 70px", alignItems: "center",
              padding: "10px 16px", borderBottom: i < rest.length - 1 ? `1px solid ${P.border}` : "none",
              background: P.surface,
            }}>
              <span style={{ fontFamily: serif, color: P.muted, fontSize: 14 }}>#{i + 4}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                <img src={r.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${r.id}`} alt=""
                  style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    @{r.username || "anon"}
                  </p>
                  <p style={{ margin: 0, fontSize: 11, color: P.muted }}>Joined {fmtDate(r.created_at)}</p>
                </div>
              </div>
              <span style={{ textAlign: "right", fontWeight: 700, color: P.gold }}>{r.points_total} ★</span>
            </div>
          ))}
        </div>
      )}

      {showViewAll && (
        <button
          onClick={() => navigate("/leaderboard")}
          style={{
            display: "block", margin: "24px auto 0", background: "transparent",
            border: `1px solid ${P.border}`, color: P.text, borderRadius: 30,
            padding: "10px 22px", fontSize: 13, fontWeight: 700, cursor: "pointer",
          }}
        >
          View Full Leaderboard →
        </button>
      )}
    </div>
  );
}
