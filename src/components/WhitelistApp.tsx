import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/lib/i18n";

/**
 * WhitelistApp — self-contained trigger button + application modal flow.
 * Writes to the `whitelist_apps` table (one row per user, enforced by
 * the unique constraint on user_id). X handle is pulled from the
 * existing session — no need to ask for it again.
 *
 * Usage:
 *   <WhitelistApp triggerLabel="Whitelist" triggerStyle={pillBtn(P.brett)} />
 */

const P = {
  bg: "#070707", surface: "#141414", border: "rgba(255,255,255,0.1)",
  text: "#f5f5f5", muted: "rgba(255,255,255,0.45)",
  pepe: "#3ddc52", brett: "#3b82f6", bonk: "#f97316",
};
const serif = "'Permanent Marker', cursive";
const body = "'Space Mono', monospace";

const TWEET_URL = "https://x.com/i/status/2070602933767389663";

type Step = "idle" | "confirm" | "form" | "success";

export default function WhitelistApp({
  triggerLabel,
  triggerStyle,
}: { triggerLabel?: string; triggerStyle?: React.CSSProperties }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [step, setStep] = useState<Step>("idle");
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [wallet, setWallet] = useState("");
  const [quoteUrl, setQuoteUrl] = useState("");
  const [done, setDone] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const meta = user?.user_metadata || {};
  const handle = meta.preferred_username || meta.user_name || "anon";

  const TASKS = [
    { key: "follow", label: t("wl.follow"), url: "https://x.com/GomeJpeg" },
    { key: "retweet", label: t("wl.retweet"), url: TWEET_URL },
    { key: "quote", label: t("wl.quote"), url: TWEET_URL, needsInput: true, placeholder: t("wl.quotePlaceholder") },
  ];

  useEffect(() => { checkExisting(); }, [user]);
  const checkExisting = async () => {
    if (!user) return;
    const { data } = await supabase.from("whitelist_apps").select("id").eq("user_id", user.id).maybeSingle();
    setAlreadyApplied(!!data);
  };

  const openTask = (tk: typeof TASKS[0]) => {
    window.open(tk.url, "_blank", "noopener");
    setDone((prev) => new Set([...prev, tk.key]));
  };

  const submit = async () => {
    if (!user) return;
    if (!wallet.trim()) { setError(t("wl.walletRequired")); return; }
    if (!/^0x[a-fA-F0-9]{40}$/.test(wallet.trim())) { setError(t("wl.walletInvalid")); return; }
    if (done.has("quote") && !quoteUrl.trim()) { setError(t("wl.quoteRequired")); return; }

    setSubmitting(true);
    setError("");
    const { error: dbError } = await supabase.from("whitelist_apps").insert({
      user_id: user.id,
      twitter_handle: handle,
      wallet: wallet.trim(),
      quote_url: quoteUrl.trim() || null,
    });
    setSubmitting(false);

    if (dbError) { setError(t("wl.submitFailed")); return; }
    setAlreadyApplied(true);
    setStep("success");
  };

  const openModal = () => setStep(alreadyApplied ? "success" : "confirm");

  return (
    <>
      <button onClick={openModal} style={triggerStyle || defaultTriggerStyle}>
        {triggerLabel || t("cta.whitelist")}
      </button>

      {step === "confirm" && (
        <Overlay onClose={() => setStep("idle")}>
          <h2 style={{ fontFamily: serif, fontSize: 26, margin: "0 0 10px", color: P.text }}>
            {t("wl.confirmTitle")}
          </h2>
          <p style={{ color: P.muted, fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
            {t("wl.confirmDesc")}
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setStep("idle")} style={ghostBtn}>{t("wl.notNow")}</button>
            <button onClick={() => setStep("form")} style={solidBtn(P.brett)}>{t("wl.letsGo")}</button>
          </div>
        </Overlay>
      )}

      {step === "form" && (
        <Overlay onClose={() => setStep("idle")}>
          <h2 style={{ fontFamily: serif, fontSize: 24, margin: "0 0 4px", color: P.text }}>
            {t("wl.formTitle")}
          </h2>
          <p style={{ color: P.muted, fontSize: 12, marginBottom: 22 }}>{t("wl.applyingAs", { handle })}</p>

          <p style={label}>{t("wl.completeTasks")}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 22 }}>
            {TASKS.map((tk) => {
              const isDone = done.has(tk.key);
              return (
                <div key={tk.key}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                    borderRadius: 12, background: isDone ? `${P.pepe}1a` : P.surface,
                    border: `1px solid ${isDone ? P.pepe : P.border}`,
                  }}>
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: P.text }}>{tk.label}</span>
                    <button onClick={() => openTask(tk)} style={{
                      fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 8,
                      border: "none", cursor: "pointer",
                      background: isDone ? "transparent" : P.text,
                      color: isDone ? P.pepe : "#000",
                    }}>{isDone ? t("wl.done") : t("wl.go")}</button>
                  </div>
                  {tk.needsInput && isDone && (
                    <input
                      value={quoteUrl} onChange={(e) => setQuoteUrl(e.target.value)}
                      placeholder={tk.placeholder} style={{ ...inputStyle, marginTop: 6 }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <p style={label}>{t("wl.walletLabel")}</p>
          <input value={wallet} onChange={(e) => setWallet(e.target.value)} placeholder="0x…" style={inputStyle} />

          {error && <p style={{ color: "#ff6b6b", fontSize: 12, marginTop: 10 }}>{error}</p>}

          <button onClick={submit} disabled={submitting} style={{ ...solidBtn(P.brett), width: "100%", marginTop: 20, opacity: submitting ? 0.6 : 1 }}>
            {submitting ? t("wl.submitting") : t("wl.submit")}
          </button>
        </Overlay>
      )}

      {step === "success" && (
        <Overlay onClose={() => setStep("idle")}>
          <h2 style={{ fontFamily: serif, fontSize: 26, margin: "0 0 10px", color: P.pepe }}>
            {alreadyApplied ? t("wl.successAlready") : t("wl.successNew")}
          </h2>
          <p style={{ color: P.muted, fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
            {t("wl.successDesc")}
          </p>
          <button onClick={() => setStep("idle")} style={ghostBtn}>{t("wl.close")}</button>
        </Overlay>
      )}
    </>
  );
}

function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)",
        zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: P.bg, border: `1px solid ${P.border}`, borderRadius: 24,
          padding: 28, width: "100%", maxWidth: 420, maxHeight: "85vh", overflowY: "auto",
          fontFamily: body, color: P.text,
        }}
      >
        {children}
      </div>
    </div>
  );
}

const label: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
  color: P.muted, marginBottom: 8,
};
const inputStyle: React.CSSProperties = {
  width: "100%", background: P.surface, border: `1px solid ${P.border}`, borderRadius: 10,
  color: P.text, fontSize: 13, padding: "10px 12px", outline: "none", boxSizing: "border-box",
  fontFamily: body,
};
const ghostBtn: React.CSSProperties = {
  flex: 1, background: "transparent", border: `1px solid ${P.border}`, color: P.text,
  borderRadius: 10, padding: "12px 0", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: body,
};
function solidBtn(color: string): React.CSSProperties {
  return {
    flex: 2, background: color, border: "none", color: "#fff",
    borderRadius: 10, padding: "12px 0", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: body,
  };
}
const defaultTriggerStyle: React.CSSProperties = {
  fontFamily: body, fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase",
  color: "#fff", background: P.brett, border: "none", borderRadius: 30, padding: "11px 20px", cursor: "pointer",
};
