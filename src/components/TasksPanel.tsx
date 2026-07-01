import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Twitter, CheckCircle2 } from "lucide-react";

/**
 * TasksPanel — GOME Tasks.
 * Follow task gets its own prominent card (no tweet preview).
 * Engagement tasks (Like, Repost, Comment) are a numbered list below.
 * Clicking GO opens X in a new tab and starts a 20-second countdown
 * ring on the button — Claim unlocks when it hits 0.
 */

const P = {
  bg: "#070707", surface: "#141414", border: "rgba(255,255,255,0.1)",
  text: "#f5f5f5", muted: "rgba(255,255,255,0.45)",
  pepe: "#3ddc52", brett: "#3b82f6", bonk: "#f97316",
};
const pixel = "'Press Start 2P', monospace";
const mono = "'Space Mono', monospace";
const TWEET_URL = "https://x.com/i/status/2070602933767389663";
const COUNTDOWN = 20;

const FOLLOW_TASK = { id: "follow", label: "Follow @GomeJpeg on X", points: 50, url: "https://x.com/GomeJpeg", color: P.pepe };

const ENGAGEMENT_TASKS = [
  { id: "like",    num: 1, label: "Like pinned post",      points: 10, url: TWEET_URL, color: P.brett },
  { id: "retweet", num: 2, label: "Repost pinned post",    points: 20, url: TWEET_URL, color: P.bonk  },
  { id: "comment", num: 3, label: "Comment & tag 3 frens", points: 20, url: TWEET_URL, color: P.pepe  },
];

type TaskLog = { task_type: string; points: number };

export default function TasksPanel({ onPointsChange }: { onPointsChange?: (total: number) => void }) {
  const { user } = useAuth();
  const [claimed, setClaimed] = useState<Set<string>>(new Set());
  const [busyId, setBusyId] = useState<string | null>(null);
  const [readyAt, setReadyAt] = useState<Record<string, number>>({});
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);

  useEffect(() => { if (user) fetchPoints(); }, [user]);

  const fetchPoints = async () => {
    if (!user) return;
    const { data, error } = await supabase.from("points_log").select("task_type,points").eq("user_id", user.id);
    if (error) { console.error("[TasksPanel] fetchPoints:", error.message); return; }
    const set = new Set((data || []).map((d: TaskLog) => d.task_type));
    const pts = (data || []).reduce((a: number, b: TaskLog) => a + b.points, 0);
    setClaimed(set);
    onPointsChange?.(pts);
  };

  const go = (task: { id: string; url: string }) => {
    window.open(task.url, "_blank", "noopener");
    setReadyAt((prev) => ({ ...prev, [task.id]: Date.now() + COUNTDOWN * 1000 }));
  };

  const claim = async (task: { id: string; points: number }) => {
    if (!user || claimed.has(task.id) || busyId) return;
    setBusyId(task.id);
    const { error } = await supabase.from("points_log").insert({ user_id: user.id, task_type: task.id, points: task.points });
    if (error) {
      console.error("[TasksPanel] claim:", error.message);
    } else {
      const { error: rpc } = await supabase.rpc("increment_points", { p_user_id: user.id, p_amount: task.points });
      if (rpc) console.error("[TasksPanel] increment_points:", rpc.message);
      await fetchPoints();
    }
    setBusyId(null);
  };

  const secsLeft = (id: string) => {
    const at = readyAt[id];
    if (!at) return null;
    const s = Math.ceil((at - now) / 1000);
    return s > 0 ? s : 0;
  };

  const allEngagementClaimed = ENGAGEMENT_TASKS.every((t) => claimed.has(t.id));

  return (
    <div style={{ fontFamily: mono }}>

      {/* ── Follow & Join ── */}
      <p style={sectionLabel}>Follow & Join</p>
      <div style={{
        display: "flex", alignItems: "center", gap: 16, padding: 18,
        background: P.surface, border: `1px solid ${P.border}`,
        borderLeft: `3px solid ${FOLLOW_TASK.color}`, marginBottom: 32,
      }}>
        <div style={{
          width: 42, height: 42, borderRadius: 10, background: `${FOLLOW_TASK.color}1a`,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Twitter size={20} color={FOLLOW_TASK.color} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 700, color: P.text }}>{FOLLOW_TASK.label}</p>
          <p style={{ margin: 0, fontFamily: pixel, fontSize: 9, lineHeight: 1.4, color: FOLLOW_TASK.color }}>
            +{FOLLOW_TASK.points} pts
          </p>
        </div>
        <ActionButton task={FOLLOW_TASK} claimed={claimed.has(FOLLOW_TASK.id)} busy={!!busyId} secs={secsLeft(FOLLOW_TASK.id)} onGo={() => go(FOLLOW_TASK)} onClaim={() => claim(FOLLOW_TASK)} countdown={COUNTDOWN} />
      </div>

      {/* ── GOME Engagement ── */}
      <p style={sectionLabel}>GOME Engagement</p>
      <div>
        {ENGAGEMENT_TASKS.map((task, i) => {
          const isClaimed = claimed.has(task.id);
          const secs = secsLeft(task.id);
          return (
            <div
              key={task.id}
              style={{
                display: "flex", alignItems: "center", gap: 14, padding: "16px 18px",
                background: isClaimed ? `${task.color}0d` : P.surface,
                borderTop: i === 0 ? `1px solid ${P.border}` : "none",
                borderBottom: `1px solid ${P.border}`,
                borderLeft: `3px solid ${isClaimed ? task.color : "transparent"}`,
              }}
            >
              {/* Step circle */}
              <div style={{
                width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: isClaimed ? task.color : "rgba(255,255,255,0.06)",
                border: isClaimed ? "none" : `1px solid ${P.border}`,
              }}>
                {isClaimed
                  ? <CheckCircle2 size={15} color="#000" />
                  : <span style={{ fontFamily: pixel, fontSize: 9, color: P.muted }}>{task.num}</span>
                }
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: "0 0 3px", fontSize: 13, fontWeight: 700, color: isClaimed ? P.muted : P.text }}>{task.label}</p>
                <p style={{ margin: 0, fontFamily: pixel, fontSize: 9, lineHeight: 1.4, color: task.color }}>+{task.points} pts</p>
              </div>
              <ActionButton task={task} claimed={isClaimed} busy={!!busyId} secs={secs} onGo={() => go(task)} onClaim={() => claim(task)} countdown={COUNTDOWN} />
            </div>
          );
        })}
      </div>

      {/* All engagement done hint */}
      {allEngagementClaimed && (
        <p style={{ marginTop: 16, fontFamily: pixel, fontSize: 9, lineHeight: 1.6, color: P.pepe, textAlign: "center" }}>
          ALL GOME TASKS COMPLETE
        </p>
      )}
    </div>
  );
}

function ActionButton({ task, claimed, busy, secs, onGo, onClaim, countdown }: {
  task: { color: string }; claimed: boolean; busy: boolean;
  secs: number | null; onGo: () => void; onClaim: () => void; countdown: number;
}) {
  if (claimed) return (
    <p style={{ flexShrink: 0, fontFamily: pixel, fontSize: 9, lineHeight: 1.4, color: task.color }}>DONE</p>
  );

  if (secs === null) return (
    <button onClick={onGo} style={{
      flexShrink: 0, fontFamily: pixel, fontSize: 9, lineHeight: 1.4, color: P.text,
      background: "rgba(255,255,255,0.06)", border: `1px solid ${P.border}`,
      padding: "8px 14px", cursor: "pointer",
    }}>GO</button>
  );

  if (secs > 0) return (
    <div style={{ flexShrink: 0, position: "relative", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="44" height="44" style={{ position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" }}>
        <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
        <circle cx="22" cy="22" r="18" fill="none" stroke={task.color} strokeWidth="3"
          strokeDasharray={`${2 * Math.PI * 18}`}
          strokeDashoffset={`${2 * Math.PI * 18 * (1 - secs / countdown)}`}
          style={{ transition: "stroke-dashoffset 0.25s linear" }}
        />
      </svg>
      <span style={{ fontFamily: pixel, fontSize: 9, color: task.color, lineHeight: 1 }}>{secs}</span>
    </div>
  );

  return (
    <button onClick={onClaim} disabled={busy} style={{
      flexShrink: 0, fontFamily: pixel, fontSize: 9, lineHeight: 1.4, color: "#000",
      background: task.color, border: "none", padding: "8px 14px",
      cursor: busy ? "default" : "pointer", opacity: busy ? 0.6 : 1,
    }}>CLAIM</button>
  );
}

const P_outer = { text: "#f5f5f5", muted: "rgba(255,255,255,0.45)" };
const sectionLabel: React.CSSProperties = {
  fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700,
  letterSpacing: "0.15em", textTransform: "uppercase", color: P_outer.muted,
  margin: "0 0 12px",
};
