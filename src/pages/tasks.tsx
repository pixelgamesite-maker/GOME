import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TasksPanel from "@/components/TasksPanel";

const P = { bg: "#070707", text: "#f5f5f5", muted: "rgba(255,255,255,0.45)", border: "rgba(255,255,255,0.08)" };
const pixel = "'Press Start 2P', monospace";
const mono = "'Space Mono', monospace";

export default function Tasks() {
  const [, navigate] = useLocation();

  return (
    <div style={{ background: P.bg, minHeight: "100vh", color: P.text, fontFamily: mono }}>
      <Header />

      <main style={{ maxWidth: 700, margin: "0 auto", padding: "36px 24px 72px" }}>
        {/* Page header + leaderboard shortcut */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32, gap: 16 }}>
          <div>
            <p style={{ margin: "0 0 8px", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: P.muted }}>
              Earn Points
            </p>
            <h1 style={{ margin: 0, fontFamily: pixel, fontSize: 18, lineHeight: 1.6, color: "#fff" }}>
              GOME TASKS
            </h1>
          </div>
          <button
            onClick={() => navigate("/leaderboard")}
            style={{
              fontFamily: pixel, fontSize: 9, lineHeight: 1.6, color: "#f97316",
              background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.4)",
              padding: "10px 14px", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
            }}
          >
            LEADERBOARD
          </button>
        </div>

        <TasksPanel />

        {/* Placeholder for future community task sections */}
        <div style={{
          marginTop: 36, padding: "20px 18px",
          border: `1px dashed ${P.border}`, textAlign: "center",
        }}>
          <p style={{ margin: 0, fontFamily: pixel, fontSize: 9, lineHeight: 1.8, color: P.muted }}>
            MORE TASKS COMING SOON
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
