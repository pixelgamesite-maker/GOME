import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

const P = {
  bg: "#070707", surface: "#141414", border: "rgba(255,255,255,0.06)",
  gold: "#C9A84C", text: "#f5f5f5", muted: "rgba(255,255,255,0.4)",
  pepe: "#3ddc52", brett: "#3b82f6", bonk: "#f97316",
};

const display = "'Fredoka', sans-serif";
const body = "'Space Grotesk', sans-serif";

type Leader = {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  points_total: number;
};

export default function Leaderboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [myRank, setMyRank] = useState<number | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("id,username,display_name,avatar_url,points_total")
      .order("points_total", { ascending: false })
      .limit(1000);

    const list = (data || []) as Leader[];
    setLeaders(list);

    if (user) {
      const idx = list.findIndex((l) => l.id === user.id);
      setMyRank(idx !== -1 ? idx + 1 : null);
    }
  };

  return (
    <div style={{ background: P.bg, minHeight: "100vh", color: P.text, fontFamily: body }}>
      <nav style={{
        height: 72, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(7,7,7,0.92)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${P.border}`,
      }}>
        <button onClick={() => navigate("/home")} style={{
          fontFamily: display, fontSize: 16, color: P.gold, background: "transparent", border: "none", cursor: "pointer",
        }}>‹ Back</button>
        <span style={{ fontFamily: display, fontSize: 18, fontWeight: 600 }}>Leaderboard</span>
        <div style={{ width: 60 }} />
      </nav>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px" }}>
        {myRank && (
          <div style={{
            background: `linear-gradient(135deg, ${P.gold}15, transparent)`, border: `1px solid ${P.gold}30`,
            borderRadius: 16, padding: 20, marginBottom: 24, textAlign: "center",
          }}>
            <p style={{ margin: 0, fontSize: 13, color: P.muted }}>Your Rank</p>
            <p style={{ margin: "4px 0 0", fontFamily: display, fontSize: 32, color: P.gold, fontWeight: 600 }}>
              #{myRank}
            </p>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {leaders.map((l, i) => {
            const isMe = user?.id === l.id;
            const rankColor = i === 0 ? P.gold : i === 1 ? "#c0c0c0" : i === 2 ? "#cd7f32" : P.dim;
            return (
              <div key={l.id} style={{
                display: "flex", alignItems: "center", gap: 14,
                background: isMe ? "rgba(61,220,82,0.08)" : P.surface,
                border: `1px solid ${isMe ? `${P.pepe}30` : P.border}`,
                borderRadius: 14, padding: "14px 18px", transition: "all 0.2s",
              }}>
                <span style={{
                  fontFamily: display, fontSize: 16, fontWeight: 700, color: rankColor, width: 32, textAlign: "center",
                }}>{i + 1}</span>
                <img src={l.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${l.id}`} alt="" style={{
                  width: 36, height: 36, borderRadius: "50%", border: `2px solid ${i < 3 ? rankColor : P.border}`,
                }} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: isMe ? P.pepe : P.text }}>
                    @{l.username || "anon"}
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: P.dim }}>{l.display_name || ""}</p>
                </div>
                <span style={{ fontFamily: display, fontSize: 16, color: P.gold, fontWeight: 600 }}>
                  {l.points_total.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
