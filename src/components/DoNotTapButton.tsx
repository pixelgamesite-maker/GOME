import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowDown } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

/**
 * DoNotTapButton — the "second gallery button," repurposed.
 * idle (bait button) → caught (guilt-trip text + Proceed) →
 * quiz (3 options, all wrong) → result (rickroll + Go Home).
 */

type Step = "idle" | "caught" | "quiz" | "result";

const pixel = "'Press Start 2P', monospace";
const mono = "'Space Mono', monospace";

export default function DoNotTapButton() {
  const [step, setStep] = useState<Step>("idle");
  const [, navigate] = useLocation();
  const { t } = useLanguage();

  const goHome = () => {
    setStep("idle");
    navigate("/home");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, maxWidth: 360, margin: "0 auto" }}>
      <style>{`
        @keyframes bounce-down { 0%, 100% { transform: translateY(0); opacity: 0.5; } 50% { transform: translateY(6px); opacity: 1; } }
      `}</style>

      {step === "idle" && (
        <>
          <div style={{ display: "flex", gap: 8 }}>
            {[0, 1, 2].map((i) => (
              <ArrowDown key={i} size={20} color="#f97316" style={{ animation: `bounce-down 1.1s ${i * 0.15}s infinite` }} />
            ))}
          </div>
          <button onClick={() => setStep("caught")} style={pixelBtn}>
            {t("prank.doNotTap")}
          </button>
        </>
      )}

      {step === "caught" && (
        <div style={card}>
          <p style={cardText}>{t("prank.caught1")}</p>
          <p style={{ ...cardText, marginTop: 10 }}>{t("prank.caught2")}</p>
          <button onClick={() => setStep("quiz")} style={{ ...pixelBtn, marginTop: 20 }}>
            {t("prank.proceed")}
          </button>
        </div>
      )}

      {step === "quiz" && (
        <div style={card}>
          <p style={cardText}>{t("prank.question")}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16, width: "100%" }}>
            <button onClick={() => setStep("result")} style={optionBtn}>{t("prank.optA")}</button>
            <button onClick={() => setStep("result")} style={optionBtn}>{t("prank.optB")}</button>
            <button onClick={() => setStep("result")} style={optionBtn}>{t("prank.optC")}</button>
          </div>
        </div>
      )}

      {step === "result" && (
        <div style={card}>
          <p style={cardText}>{t("prank.wrong")}</p>
          <img
            src="/rickroll-roll.gif" alt=""
            style={{ width: "100%", display: "block", marginTop: 14, border: "2px solid #f97316" }}
          />
          <button onClick={goHome} style={{ ...pixelBtn, marginTop: 18 }}>
            {t("prank.goHome")}
          </button>
        </div>
      )}
    </div>
  );
}

const pixelBtn: React.CSSProperties = {
  fontFamily: pixel, fontSize: 11, lineHeight: 1.6, color: "#000",
  background: "#f97316", border: "2px solid #000", borderRadius: 0,
  padding: "14px 20px", cursor: "pointer", textAlign: "center",
};
const card: React.CSSProperties = {
  width: "100%", background: "#141414", border: "2px solid #f97316",
  padding: 22, textAlign: "center",
};
const cardText: React.CSSProperties = {
  margin: 0, fontFamily: mono, fontSize: 14, color: "#fff", lineHeight: 1.6,
};
const optionBtn: React.CSSProperties = {
  fontFamily: mono, fontSize: 13, fontWeight: 700, color: "#fff",
  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 0, padding: "12px 14px", cursor: "pointer", textAlign: "left",
};
