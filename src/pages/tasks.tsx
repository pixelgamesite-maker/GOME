import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TasksPanel from "@/components/TasksPanel";
import { useLanguage } from "@/lib/i18n";

const P = { bg: "#070707", text: "#f5f5f5" };
const mono = "'Space Mono', monospace";

export default function Tasks() {
  const { t } = useLanguage();

  return (
    <div style={{ background: P.bg, minHeight: "100vh", color: P.text, fontFamily: mono }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Space+Mono:wght@400;700&display=swap');`}</style>
      <Header />
      <main style={{ maxWidth: 700, margin: "0 auto", padding: "40px 24px 72px" }}>
        <TasksPanel onPointsChange={() => {}} />
      </main>
      <Footer />
    </div>
  );
}
