import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { CheckCircle2 } from "lucide-react";

/**
 * TasksPanel — GOME Tasks section.
 * Numbered task list: click GO → opens X in a new tab + starts a 20s
 * countdown on the button → Claim unlocks when timer hits 0.
 * Points are enforced server-side (unique constraint on user_id + task_type),
 * so each task can only be claimed once regardless of UI tricks.
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

const GOME_TASKS = [
  { id: "follow",  num: 1, label: "Follow @GomeJpeg on X",   points: 50,  url: "https://x.com/GomeJpeg", color: "#3ddc52" },
  { id: "like",    num: 2, label: "Like pinned post",         points: 10,  url: TWEET_URL,                color: "#3b82f6" },
  { id: "retweet", num: 3, label: "Repost pinned post",       points: 20,  url: TWEET_URL,                color: "#f97316" },
  { id: "comment", num: 4, label: "Comment & tag 3 frens",    points: 20,  url: TWEET_URL,                color: "#3ddc52" },
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
    const { data, error } = await supabase
      .from("points_log")
      .select("task_type,points")
      .eq("user_id", user.id);
    if (error) { console.error("[TasksPanel] fetchPoints:", error.message); return; }
    const set = new Set((data || []).map((d: TaskLog) => d.task_type));
    const pts = (data || []).reduce((a: number, b: TaskLog) => a + b.points, 0);
    setClaimed(set);
    onPointsChange?.(pts);
  };

  const go = (task: typeof GOME_TASKS[0]) => {
    window.open(task.url, "_blank", "noopener");
    setReadyAt((prev) => ({ ...prev, [task.id]: Date.now() + COUNTDOWN * 1000 }));
  };

  const claim = async (task: typeof GOME_TASKS[0]) => {
    if (!user || claimed.has(task.id) || busyId) return;
    setBusyId(task.id);
    const { error } = await supabase.from("points_log").insert({
      user_id: user.id, task_type: task.id, points: task.points,
    });
    if (error) {
      console.error("[TasksPanel] claim failed:", error.message);
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

  return (
    <div style={{ fontFamily: mono }}>
      {/* Section header */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ margin: "0 0 8px", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: P.muted }}>
          GOME
        </p>
        <h2 style={{ margin: 0, fontFamily: pixel, fontSize: 16, lineHeight: 1.6, color: "#fff" }}>
          TASKS
        </h2>
      </div>

      {/* Task list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {GOME_TASKS.map((task, i) => {
          const isClaimed = claimed.has(task.id);
          const secs = secsLeft(task.id);
          const counting = secs !== null && secs > 0;
          const ready = secs === 0;

          return (
            <div
              key={task.id}
              style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "16px 18px",
                background: isClaimed ? `${task.color}0d` : P.surface,
                borderTop: i === 0 ? `1px solid ${P.border}` : "none",
                borderBottom: `1px solid ${P.border}`,
                borderLeft: `3px solid ${isClaimed ? task.color : "transparent"}`,
                transition: "all 0.2s",
              }}
            >
              {/* Step number / claimed check */}
              <div style={{
                width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: isClaimed ? task.color : "rgba(255,255,255,0.06)",
                border: isClaimed ? "none" : `1px solid ${P.border}`,
              }}>
                {isClaimed
                  ? <CheckCircle2 size={16} color="#000" />
                  : <span style={{ fontFamily: pixel, fontSize: 10, color: P.muted }}>{task.num}</span>
                }
              </div>

              {/* Label + points */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: isClaimed ? P.muted : P.text, lineHeight: 1.4 }}>
                  {task.label}
                </p>
                <p style={{ margin: "3px 0 0", fontFamily: pixel, fontSize: 9, color: task.color, lineHeight: 1.4 }}>
                  +{task.points} pts
                </p>
              </div>

              {/* Action */}
              <div style={{ flexShrink: 0 }}>
                {isClaimed ? (
                  <span style={{ fontFamily: pixel, fontSize: 9, color: task.color, lineHeight: 1.4 }}>DONE</span>
                ) : counting ? (
                  // Countdown ring button
                  <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="52" height="52" style={{ transform: "rotate(-90deg)" }}>
                      <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                      <circle
                        cx="26" cy="26" r="22" fill="none"
                        stroke={task.color} strokeWidth="3"
                        strokeDasharray={`${2 * Math.PI * 22}`}
                        strokeDashoffset={`${2 * Math.PI * 22 * (1 - secs! / COUNTDOWN)}`}
                        style={{ transition: "stroke-dashoffset 0.25s linear" }}
                      />
                    </svg>
                    <span style={{
                      position: "absolute", fontFamily: pixel, fontSize: 10,
                      color: task.color, lineHeight: 1,
                    }}>{secs}</span>
                  </div>
                ) : ready ? (
                  // Claim button
                  <button
                    onClick={() => claim(task)}
                    disabled={!!busyId}
                    style={{
                      fontFamily: pixel, fontSize: 9, lineHeight: 1.4,
                      background: task.color, color: "#000", border: "none",
                      padding: "8px 14px", cursor: busyId ? "default" : "pointer",
                      opacity: busyId ? 0.6 : 1,
                    }}
                  >
                    CLAIM
                  </button>
                ) : (
                  // Go button
                  <button
                    onClick={() => go(task)}
                    style={{
                      fontFamily: pixel, fontSize: 9, lineHeight: 1.4,
                      background: "rgba(255,255,255,0.06)", color: P.text, border: `1px solid ${P.border}`,
                      padding: "8px 14px", cursor: "pointer",
                    }}
                  >
                    GO
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
