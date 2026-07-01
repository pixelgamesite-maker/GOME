import { Twitter, ExternalLink } from "lucide-react";

/**
 * TasksPanel — no auth, no claiming. Just clean task cards
 * that open X links. Points tracking removed entirely.
 */

const ACCENT = "#3ddc52";
const P = {
  card: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.08)",
  text: "#f5f5f5", muted: "rgba(255,255,255,0.4)",
};
const mono = "'Space Mono', monospace";
const TWEET_URL = "https://x.com/i/status/2070602933767389663";

const FOLLOW_TASK = {
  label: "Follow @GomeJpeg on X",
  desc: "Follow GOME on X for drops, alpha, and announcements.",
  url: "https://x.com/GomeJpeg",
};

const ENGAGEMENT_TASKS = [
  { num: 1, label: "Repost pinned post",    desc: "Repost the pinned post to spread the word.",                   url: TWEET_URL },
  { num: 2, label: "Quote & tag 2 frens",   desc: "Quote the pinned post and tag 2 frens who need to know GOME.", url: TWEET_URL },
];

export default function TasksPanel() {
  return (
    <div style={{ fontFamily: mono }}>

      <p style={sectionLbl}>Follow & Join</p>
      <div style={{ marginBottom: 32, background: P.card, border: `1px solid ${P.border}`, display: "flex", alignItems: "center", gap: 14, padding: "16px 18px" }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: `${ACCENT}15`, border: `1px solid ${ACCENT}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Twitter size={20} color={ACCENT} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: P.text }}>X / Twitter</span>
            <span style={{ fontSize: 12, color: ACCENT }}>@GomeJpeg</span>
          </div>
          <p style={{ margin: "4px 0 0", fontSize: 12, color: P.muted, lineHeight: 1.5 }}>{FOLLOW_TASK.desc}</p>
        </div>
        <a href={FOLLOW_TASK.url} target="_blank" rel="noopener noreferrer" style={{ flexShrink: 0, fontFamily: mono, fontSize: 12, fontWeight: 700, color: "#fff", background: "rgba(255,255,255,0.08)", border: `1px solid ${P.border}`, padding: "8px 16px", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
          Follow <ExternalLink size={12} />
        </a>
      </div>

      <p style={sectionLbl}>GOME Engagement</p>
      <div style={{ border: `1px solid ${P.border}`, overflow: "hidden" }}>
        {ENGAGEMENT_TASKS.map((task, i) => (
          <div key={task.num} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", background: P.card, borderBottom: i < ENGAGEMENT_TASKS.length - 1 ? `1px solid ${P.border}` : "none" }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.06)", border: `1px solid ${P.border}` }}>
              <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: P.muted }}>{task.num}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: "0 0 3px", fontSize: 13, fontWeight: 700, color: P.text }}>{task.label}</p>
              <p style={{ margin: 0, fontSize: 11, color: P.muted, lineHeight: 1.5 }}>{task.desc}</p>
            </div>
            <a href={task.url} target="_blank" rel="noopener noreferrer" style={{ flexShrink: 0, fontFamily: mono, fontSize: 12, fontWeight: 700, color: "#fff", background: "rgba(255,255,255,0.08)", border: `1px solid ${P.border}`, padding: "8px 16px", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
              Open <ExternalLink size={12} />
            </a>
          </div>
        ))}
      </div>

      <p style={{ marginTop: 16, fontSize: 11, color: "rgba(255,255,255,0.2)", textAlign: "center" }}>
        More tasks coming soon.
      </p>
    </div>
  );
}

const sectionLbl: React.CSSProperties = {
  fontFamily: mono, fontSize: 10, fontWeight: 700,
  letterSpacing: "0.2em", textTransform: "uppercase",
  color: "rgba(255,255,255,0.4)", margin: "0 0 12px",
};
