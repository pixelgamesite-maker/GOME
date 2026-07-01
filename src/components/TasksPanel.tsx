import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Twitter, CheckCircle2, Timer } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * TasksPanel — GOME Tasks.
 * Styled after Earnity's social quests: clean dark cards, consistent
 * accent color, no rainbow-per-task. Follow & Join gets its own section,
 * engagement tasks are a clean numbered list below. No tweet embed.
 * GO opens X → 20-second countdown → CLAIM unlocks.
 */

const ACCENT = "#3ddc52"; // GOME green — one consistent accent
const P = {
  bg: "#0c0c0c",
  card: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
  text: "#f5f5f5",
  muted: "rgba(255,255,255,0.4)",
  dim: "rgba(255,255,255,0.2)",
};
const mono = "'Space Mono', monospace";
const pixel = "'Press Start 2P', monospace";
const TWEET_URL = "https://x.com/i/status/2070602933767389663";
const COUNTDOWN = 20;

const FOLLOW_TASK = {
  id: "follow",
  label: "Follow @GomeJpeg on X",
  desc: "Follow GOME on X for drops, alpha, and announcements.",
  points: 50,
  url: "https://x.com/GomeJpeg",
};

const ENGAGEMENT_TASKS = [
  { id: "like",    num: 1, label: "Like pinned post",      desc: "Like the pinned post on the GOME X account.",          points: 10, url: TWEET_URL },
  { id: "retweet", num: 2, label: "Repost pinned post",    desc: "Repost the pinned post to spread the word.",           points: 20, url: TWEET_URL },
  { id: "comment", num: 3, label: "Comment & tag 3 frens", desc: "Drop a comment and tag 3 frens who need to know GOME.", points: 20, url: TWEET_URL },
];

type TaskLog = { task_type: string; points: number };

export default function TasksPanel({ onPointsChange }: { onPointsChange?: (total: number) => void }) {
  const { user } = useAuth();
  const [claimed, setClaimed] = useState<Set<string>>(new Set());
  const [busyId, setBusyId] = useState<string | null>(null);
  const [readyAt, setReadyAt] = useState<Record<string, number>>({});
  const [now, setNow] = useState(Date.now());
  const [sessionPts, setSessionPts] = useState(0);

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

  const go = (id: string, url: string) => {
    window.open(url, "_blank", "noopener");
    setReadyAt((prev) => ({ ...prev, [id]: Date.now() + COUNTDOWN * 1000 }));
  };

  const claim = async (id: string, points: number) => {
    if (!user || claimed.has(id) || busyId) return;
    setBusyId(id);
    const { error } = await supabase.from("points_log").insert({ user_id: user.id, task_type: id, points });
    if (error) {
      console.error("[TasksPanel] claim:", error.message);
    } else {
      const { error: rpc } = await supabase.rpc("increment_points", { p_user_id: user.id, p_amount: points });
      if (rpc) console.error("[TasksPanel] rpc:", rpc.message);
      setSessionPts((p) => p + points);
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

  const allDone = [...ENGAGEMENT_TASKS].every((t) => claimed.has(t.id)) && claimed.has(FOLLOW_TASK.id);

  return (
    <div style={{ fontFamily: mono }}>

      {/* Session banner */}
      <AnimatePresence>
        {sessionPts > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24,
              padding: "8px 16px", background: `${ACCENT}18`, border: `1px solid ${ACCENT}40`,
              color: ACCENT, fontSize: 13, fontWeight: 700,
            }}
          >
            <CheckCircle2 size={15} /> +{sessionPts} pts earned this session
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Follow & Join ── */}
      <p style={sectionLbl}>Follow & Join</p>
      <div style={{ marginBottom: 32 }}>
        <motion.div
          initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05, type: "spring", damping: 22 }}
          style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "16px 18px",
            background: P.card, border: `1px solid ${P.border}`,
            borderRadius: 0,
          }}
        >
          <div style={{
            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
            background: `${ACCENT}15`, border: `1px solid ${ACCENT}30`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Twitter size={20} color={ACCENT} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: P.text }}>X / Twitter</span>
              <span style={{ fontSize: 12, color: ACCENT }}>@GomeJpeg</span>
            </div>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: P.muted, lineHeight: 1.5 }}>{FOLLOW_TASK.desc}</p>
          </div>
          <RowAction
            id={FOLLOW_TASK.id} points={FOLLOW_TASK.points}
            claimed={claimed.has(FOLLOW_TASK.id)} busy={!!busyId}
            secs={secsLeft(FOLLOW_TASK.id)} countdown={COUNTDOWN}
            onGo={() => go(FOLLOW_TASK.id, FOLLOW_TASK.url)}
            onClaim={() => claim(FOLLOW_TASK.id, FOLLOW_TASK.points)}
          />
        </motion.div>
      </div>

      {/* ── GOME Engagement ── */}
      <p style={sectionLbl}>GOME Engagement</p>
      <div style={{ border: `1px solid ${P.border}`, overflow: "hidden" }}>
        {ENGAGEMENT_TASKS.map((task, i) => {
          const isClaimed = claimed.has(task.id);
          const secs = secsLeft(task.id);
          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.07, type: "spring", damping: 22 }}
              style={{
                display: "flex", alignItems: "center", gap: 14, padding: "16px 18px",
                background: isClaimed ? `${ACCENT}08` : P.card,
                borderBottom: i < ENGAGEMENT_TASKS.length - 1 ? `1px solid ${P.border}` : "none",
              }}
            >
              {/* Number / check */}
              <div style={{
                width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: isClaimed ? ACCENT : "rgba(255,255,255,0.06)",
                border: isClaimed ? "none" : `1px solid ${P.border}`,
              }}>
                {isClaimed
                  ? <CheckCircle2 size={16} color="#000" />
                  : <span style={{ fontFamily: pixel, fontSize: 9, color: P.dim }}>{task.num}</span>}
              </div>

              {/* Label + desc */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: "0 0 3px", fontSize: 13, fontWeight: 700, color: isClaimed ? P.muted : P.text }}>
                  {task.label}
                </p>
                <p style={{ margin: 0, fontSize: 11, color: P.muted, lineHeight: 1.5 }}>{task.desc}</p>
              </div>

              {/* Points badge */}
              <span style={{
                flexShrink: 0, fontFamily: mono, fontSize: 12, fontWeight: 700,
                color: isClaimed ? P.muted : ACCENT, marginRight: 10,
              }}>+{task.points}</span>

              <RowAction
                id={task.id} points={task.points}
                claimed={isClaimed} busy={!!busyId}
                secs={secs} countdown={COUNTDOWN}
                onGo={() => go(task.id, task.url)}
                onClaim={() => claim(task.id, task.points)}
              />
            </motion.div>
          );
        })}
      </div>

      {/* All done */}
      {allDone && (
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ marginTop: 18, fontFamily: pixel, fontSize: 9, lineHeight: 1.6, color: ACCENT, textAlign: "center" }}
        >
          ALL GOME TASKS COMPLETE
        </motion.p>
      )}

      {/* Hint */}
      <p style={{ marginTop: 16, fontSize: 11, color: "rgba(255,255,255,0.2)", textAlign: "center" }}>
        Each task is one-time only and persists across sessions.
      </p>
    </div>
  );
}

/* ── Shared row-level action control ── */
function RowAction({ id, points, claimed, busy, secs, countdown, onGo, onClaim }: {
  id: string; points: number; claimed: boolean; busy: boolean;
  secs: number | null; countdown: number;
  onGo: () => void; onClaim: () => void;
}) {
  if (claimed) return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: `${ACCENT}10`, border: `1px solid ${ACCENT}20`, color: ACCENT, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
      <CheckCircle2 size={14} /> Done
    </div>
  );

  if (secs === null) return (
    <button onClick={onGo} style={{
      flexShrink: 0, fontFamily: mono, fontSize: 12, fontWeight: 700,
      color: P.text, background: "rgba(255,255,255,0.08)", border: `1px solid ${P.border}`,
      padding: "8px 16px", cursor: "pointer",
    }}>
      Go → +{points}
    </button>
  );

  if (secs > 0) return (
    <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: "rgba(255,200,0,0.08)", border: "1px solid rgba(255,200,0,0.2)", color: "#fbbf24", fontSize: 12, fontWeight: 700 }}>
      <Timer size={14} style={{ animation: "pulse 1s infinite" }} /> {secs}s
    </div>
  );

  return (
    <button onClick={onClaim} disabled={busy} style={{
      flexShrink: 0, fontFamily: mono, fontSize: 12, fontWeight: 700,
      color: "#000", background: ACCENT, border: "none",
      padding: "8px 16px", cursor: busy ? "default" : "pointer", opacity: busy ? 0.6 : 1,
    }}>
      Claim
    </button>
  );
}

const sectionLbl: React.CSSProperties = {
  fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700,
  letterSpacing: "0.2em", textTransform: "uppercase",
  color: "rgba(255,255,255,0.4)", margin: "0 0 12px",
};
