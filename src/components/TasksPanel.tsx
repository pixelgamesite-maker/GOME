import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/lib/i18n";
import { Twitter, Heart, Repeat2, MessageCircle, ExternalLink, CheckCircle2 } from "lucide-react";

/**
 * TasksPanel — the "Collect Points" section, on its own so tasks can be
 * edited without touching Home.tsx.
 *
 * Claiming requires clicking "Open" first and waiting out a short
 * countdown before "Claim" unlocks — this doesn't verify the action
 * really happened (that needs the X API), but it closes the
 * one-click-claim-with-zero-friction hole.
 *
 * Usage:
 *   <TasksPanel onPointsChange={(total) => setTotalPoints(total)} />
 */

const P = {
  surface: "#141414", border: "rgba(255,255,255,0.08)",
  text: "#f5f5f5", muted: "rgba(255,255,255,0.45)",
  pepe: "#3ddc52", brett: "#3b82f6", bonk: "#f97316",
};
const marker = "'Permanent Marker', cursive";
const cursive = "'Caveat', cursive";
const mono = "'Space Mono', monospace";

const COUNTDOWN_SECONDS = 15;
const TWEET_ID = "2070602933767389663";
const TWEET_URL = `https://x.com/i/status/${TWEET_ID}`;

type TaskLog = { task_type: string; points: number };

export default function TasksPanel({ onPointsChange }: { onPointsChange?: (total: number) => void }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [claimed, setClaimed] = useState<Set<string>>(new Set());
  const [busyId, setBusyId] = useState<string | null>(null);
  const [readyAt, setReadyAt] = useState<Record<string, number>>({});
  const [now, setNow] = useState(Date.now());

  const TASKS = [
    { id: "follow", label: t("wl.follow"), points: 50, url: "https://x.com/GomeJpeg", color: P.pepe },
    { id: "like", label: t("tasks.like"), points: 10, url: TWEET_URL, color: P.brett, icon: Heart },
    { id: "retweet", label: t("tasks.retweet"), points: 20, url: TWEET_URL, color: P.bonk, icon: Repeat2 },
    { id: "comment", label: t("tasks.commentTag"), points: 20, url: TWEET_URL, color: P.pepe, icon: MessageCircle },
  ];

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, []);

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

  useEffect(() => { if (user) fetchPoints(); }, [user]);

  const fetchPoints = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("points_log")
      .select("task_type,points")
      .eq("user_id", user.id);

    if (error) { console.error("[TasksPanel] fetchPoints failed:", error.message, error); return; }

    const set = new Set((data || []).map((d: TaskLog) => d.task_type));
    const pts = (data || []).reduce((a: number, b: TaskLog) => a + (b.points || 0), 0);
    setClaimed(set);
    onPointsChange?.(pts);
  };

  const openTask = (task: typeof TASKS[0]) => {
    window.open(task.url, "_blank", "noopener");
    setReadyAt((prev) => ({ ...prev, [task.id]: Date.now() + COUNTDOWN_SECONDS * 1000 }));
  };

  const claim = async (task: typeof TASKS[0]) => {
    if (!user || claimed.has(task.id) || busyId) return;
    setBusyId(task.id);
    const { error } = await supabase.from("points_log").insert({
      user_id: user.id, task_type: task.id, points: task.points,
    });
    if (error) {
      console.error("[TasksPanel] claim insert failed:", error.message, error);
    } else {
      const { error: rpcError } = await supabase.rpc("increment_points", { p_user_id: user.id, p_amount: task.points });
      if (rpcError) console.error("[TasksPanel] increment_points failed:", rpcError.message, rpcError);
      await fetchPoints();
    }
    setBusyId(null);
  };

  const secondsLeft = (id: string) => {
    const tAt = readyAt[id];
    if (!tAt) return null;
    const s = Math.ceil((tAt - now) / 1000);
    return s > 0 ? s : 0;
  };

  const followTask = TASKS.find((x) => x.id === "follow")!;
  const tweetTasks = TASKS.filter((x) => x.id !== "follow");

  const eyebrow: React.CSSProperties = {
    fontFamily: mono, fontSize: 11, fontWeight: 700, letterSpacing: "0.25em",
    textTransform: "uppercase", color: P.muted, margin: "0 0 10px",
  };

  return (
    <div>
      <p style={eyebrow}>{t("tasks.eyebrow")}</p>
      <h2 style={{ fontFamily: marker, fontSize: 30, color: "#fff", margin: "0 0 10px" }}>{t("tasks.title")}</h2>
      <p style={{ fontFamily: cursive, fontSize: 17, color: P.muted, margin: "0 0 32px" }}>{t("tasks.desc")}</p>

      <p style={{ ...eyebrow, fontSize: 11, letterSpacing: "0.15em", marginBottom: 14 }}>{t("tasks.followJoin")}</p>
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
          <p style={{ margin: "4px 0 0", fontSize: 12, color: P.muted }}>{t("tasks.followDesc")}</p>
        </div>
        <TaskClaimControl
          task={followTask} claimed={claimed.has(followTask.id)} busy={busyId === followTask.id}
          secondsLeft={secondsLeft(followTask.id)} t={t}
          onOpen={() => openTask(followTask)} onClaim={() => claim(followTask)}
        />
      </div>

      <p style={{ ...eyebrow, fontSize: 11, letterSpacing: "0.15em", marginBottom: 14 }}>{t("tasks.tweetEngagement")}</p>
      <div style={{ borderRadius: 18, border: `1px solid ${P.border}`, background: P.surface, overflow: "hidden" }}>
        <div style={{ padding: 16, borderBottom: `1px solid ${P.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <Twitter size={14} color={P.brett} />
            <span style={{ fontSize: 11, color: P.muted, fontFamily: mono }}>{t("tasks.postId", { id: TWEET_ID })}</span>
            <a href={TWEET_URL} target="_blank" rel="noreferrer" style={{
              marginLeft: "auto", display: "flex", alignItems: "center", gap: 4,
              fontSize: 10, color: P.muted, textDecoration: "none",
            }}>
              <ExternalLink size={12} /> {t("tasks.openOnX")}
            </a>
          </div>
          <blockquote className="twitter-tweet" data-theme="dark">
            <a href={TWEET_URL}>View Tweet</a>
          </blockquote>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
          {tweetTasks.map((tk, i) => {
            const Icon = tk.icon!;
            const isClaimed = claimed.has(tk.id);
            const left = secondsLeft(tk.id);
            return (
              <div key={tk.id} style={{
                padding: "18px 8px", textAlign: "center",
                borderRight: i < tweetTasks.length - 1 ? `1px solid ${P.border}` : "none",
              }}>
                <Icon size={18} color={tk.color} style={{ marginBottom: 6 }} />
                <p style={{ margin: "0 0 2px", fontSize: 12, fontWeight: 700 }}>{tk.label}</p>
                <p style={{ margin: "0 0 10px", fontFamily: mono, fontSize: 11, fontWeight: 700, color: tk.color }}>+{tk.points}</p>
                <TaskClaimControl
                  compact task={tk} claimed={isClaimed} busy={busyId === tk.id} secondsLeft={left} t={t}
                  onOpen={() => openTask(tk)} onClaim={() => claim(tk)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TaskClaimControl({
  task, claimed, busy, secondsLeft, onOpen, onClaim, compact, t,
}: {
  task: { id: string; points: number; url: string; color: string };
  claimed: boolean; busy: boolean; secondsLeft: number | null;
  onOpen: () => void; onClaim: () => void; compact?: boolean;
  t: (key: string, vars?: Record<string, string | number>) => string;
}) {
  if (claimed) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: compact ? "center" : "flex-start",
        gap: 6, fontFamily: mono, fontSize: 12, fontWeight: 700, color: P.pepe, flexShrink: 0,
        width: compact ? "100%" : undefined,
      }}>
        <CheckCircle2 size={16} /> {t("tasks.claimed")}
      </div>
    );
  }

  const baseBtn: React.CSSProperties = {
    fontFamily: mono, fontWeight: 700, fontSize: 11,
    textTransform: "uppercase", letterSpacing: "0.04em", borderRadius: compact ? 8 : 10,
    border: "none", cursor: "pointer", padding: compact ? "8px 0" : "8px 14px",
    width: compact ? "100%" : undefined,
  };

  if (secondsLeft === null) {
    return (
      <div style={{ display: "flex", gap: 8, flexShrink: 0, width: compact ? "100%" : undefined }}>
        {!compact && (
          <a href={task.url} target="_blank" rel="noreferrer" onClick={onOpen} style={{
            padding: "8px 14px", borderRadius: 10, border: `1px solid ${P.border}`,
            color: P.text, textDecoration: "none", fontFamily: mono, fontSize: 11, fontWeight: 700,
          }}>{t("tasks.open").replace(" →", "")}</a>
        )}
        <button onClick={onOpen} style={{ ...baseBtn, background: task.color, color: "#fff" }}>
          {compact ? t("tasks.open") : `${t("tasks.open").replace(" →", "")} +${task.points}`}
        </button>
      </div>
    );
  }

  if (secondsLeft > 0) {
    return (
      <button disabled style={{ ...baseBtn, background: "rgba(255,255,255,0.06)", color: P.muted, cursor: "default" }}>
        {t("tasks.wait", { s: secondsLeft })}
      </button>
    );
  }

  return (
    <button disabled={busy} onClick={onClaim} style={{ ...baseBtn, background: task.color, color: "#fff", opacity: busy ? 0.6 : 1 }}>
      +{task.points}
    </button>
  );
}
