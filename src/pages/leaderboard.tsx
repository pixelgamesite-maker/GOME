import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Leaderboard from "@/components/Leaderboard";
import { useLanguage } from "@/lib/i18n";

const P = { bg: "#070707", text: "#f5f5f5", muted: "rgba(255,255,255,0.45)" };
const pixel = "'Press Start 2P', monospace";
const mono = "'Space Mono', monospace";

export default function LeaderboardPage() {
  const { t } = useLanguage();
  const [, navigate] = useLocation();

  return (
    <div style={{ background: P.bg, minHeight: "100vh", color: P.text, fontFamily: mono }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Space+Mono:wght@400;700&display=swap');`}</style>
      <Header />

      <main style={{ maxWidth: 700, margin: "0 auto", padding: "36px 24px 72px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32, gap: 16 }}>
          <div style={{ textAlign: "left" }}>
            <p style={{ margin: "0 0 8px", fontFamily: mono, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: P.muted }}>
              {t("leaderboard.eyebrow")}
            </p>
            <h1 style={{ margin: 0, fontFamily: pixel, fontSize: 18, lineHeight: 1.6, color: "#fff" }}>
              {t("leaderboard.title").toUpperCase()}
            </h1>
          </div>
          <button
            onClick={() => navigate("/tasks")}
            style={{
              fontFamily: pixel, fontSize: 9, lineHeight: 1.6, color: "#3ddc52",
              background: "rgba(61,220,82,0.1)", border: "1px solid rgba(61,220,82,0.4)",
              padding: "10px 14px", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
            }}
          >
            TASKS
          </button>
        </div>

        <Leaderboard limit={100} />
      </main>

      <Footer />
    </div>
  );
}
