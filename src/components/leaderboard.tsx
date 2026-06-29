import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Leaderboard from "@/components/Leaderboard";
import { useLanguage } from "@/lib/i18n";

const P = { bg: "#070707", text: "#f5f5f5", muted: "rgba(255,255,255,0.45)" };
const pixel = "'Press Start 2P', monospace";
const mono = "'Space Mono', monospace";

export default function LeaderboardPage() {
  const { t } = useLanguage();

  return (
    <div style={{ background: P.bg, minHeight: "100vh", color: P.text, fontFamily: mono }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Space+Mono:wght@400;700&display=swap');`}</style>
      <Header />

      <main style={{ maxWidth: 700, margin: "0 auto", padding: "40px 24px 72px", textAlign: "center" }}>
        <p style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", color: P.muted, margin: "0 0 10px" }}>
          {t("leaderboard.eyebrow")}
        </p>
        <h1 style={{ fontFamily: pixel, fontSize: 24, color: "#fff", margin: "0 0 32px" }}>{t("leaderboard.title")}</h1>
        <Leaderboard limit={100} />
      </main>

      <Footer />
    </div>
  );
}
