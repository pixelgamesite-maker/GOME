import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

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
const serif = "'Playfair Display', serif";
const body = "'Space Grotesk', sans-serif";

const TWEET_URL = "https://x.com/i/status/2070602933767389663";

const TASKS = [
  { key: "follow", label: "Follow @GomeJpeg", url: "https://x.com/GomeJpeg" },
  { key: "retweet", label: "Retweet pinned post", url: TWEET_URL },
  { key: "quote", label: "Quote tweet pinned post", url: TWEET_URL, needsInput: true, placeholder: "Paste your quote tweet link" },
];

type Step = "idle" | "confirm" | "form" | "success";

export default function WhitelistApp({
  triggerLabel = "Whitelist",
  triggerStyle,
}: { triggerLabel?: string; triggerStyle?: React.CSSProperties }) {
  const { user } = useAuth();
  const [step, setStep] = useState<Step>("idle");
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [checked, setChecked] = useState(false);
  const [wallet, setWallet] = useState("");
  const [quoteUrl, setQuoteUrl] = useState("");
  const [done, setDone] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const meta = user?.user_metadata || {};
  const handle = meta.preferred_username || meta.user_name || "anon";

  useEffect(() => { checkExisting(); }, [user]);
  const checkExisting = async () => {
    if (!user) return;
    const { data } = await supabase.from("whitelist_apps").select("id").eq("user_id", user.id).maybeSingle();
    setAlreadyApplied(!!data);
    setChecked(true);
  };

  const openTask = (t: typeof TASKS[0]) => {
    window.open(t.url, "_blank", "noopener");
    setDone((prev) => new Set([...prev, t.key]));
  };

  const submit = async () => {
    if (!user) return;
    if (!wallet.trim()) { setError("Wallet address is required."); return; }
    if (!/^0x[a-fA-F0-9]{40}$/.test(wallet.trim())) { setError("That doesn't look like a valid EVM address (0x…)."); return; }
    if (done.has("quote") && !quoteUrl.trim()) { setError("Paste your quote tweet link."); return; }

    setSubmitting(true);
    setError("");
    const { error: dbError } = await supabase.from("whitelist_apps").insert({
      user_id: user.id,
      twitter_handle: handle,
      wallet: wallet.trim(),
      quote_url: quoteUrl.trim() || null,
    });
    setSubmitting(false);

    if (dbError) { setError("Submission failed. Try again."); return; }
    setAlreadyApplied(true);
    setStep("success");
  };

  const openModal = () => setStep(alreadyApplied ? "success" : "confirm");

  return (
    <>
      <button onClick={openModal} style={triggerStyle || defaultTriggerStyle}>
        {triggerLabel}
      </button>

      {step === "confirm" && (
        <Overlay onClose={() => setStep("idle")}>
          <h2 style={{ fontFamily: serif, fontSize: 26, margin: "0 0 10px", color: P.text }}>
            Apply for the Whitelist
          </h2>
          <p style={{ color: P.muted, fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
            A few quick tasks, your wallet, and you're in the running for a guaranteed mint spot.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setStep("idle")} style={ghostBtn}>Not now</button>
            <button onClick={() => setStep("form")} style={solidBtn(P.brett)}>Let's go →</button>
          </div>
        </Overlay>
      )}

      {step === "form" && (
        <Overlay onClose={() => setStep("idle")}>
          <h2 style={{ fontFamily: serif, fontSize: 24, margin: "0 0 4px", color: P.text }}>
            Whitelist Application
          </h2>
          <p style={{ color: P.muted, fontSize: 12, marginBottom: 22 }}>Applying as @{handle}</p>

          <p style={label}>Complete tasks</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 22 }}>
            {TASKS.map((t) => {
              const isDone = done.has(t.key);
              return (
                <div key={t.key}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                    borderRadius: 12, background: isDone ? `${P.pepe}1a` : P.surface,
                    border: `1px solid ${isDone ? P.pepe : P.border}`,
                  }}>
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: P.text }}>{t.label}</span>
                    <button onClick={() => openTask(t)} style={{
                      fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 8,
                      border: "none", cursor: "pointer",
                      background: isDone ? "transparent" : P.text,
                      color: isDone ? P.pepe : "#000",
                    }}>{isDone ? "Done ✓" : "Go →"}</button>
                  </div>
                  {t.needsInput && isDone && (
                    <input
                      value={quoteUrl} onChange={(e) => setQuoteUrl(e.target.value)}
                      placeholder={t.placeholder} style={{ ...inputStyle, marginTop: 6 }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <p style={label}>EVM Wallet Address</p>
          <input value={wallet} onChange={(e) => setWallet(e.target.value)} placeholder="0x…" style={inputStyle} />

          {error && <p style={{ color: "#ff6b6b", fontSize: 12, marginTop: 10 }}>{error}</p>}

          <button onClick={submit} disabled={submitting} style={{ ...solidBtn(P.brett), width: "100%", marginTop: 20, opacity: submitting ? 0.6 : 1 }}>
            {submitting ? "Submitting…" : "Submit Application →"}
          </button>
        </Overlay>
      )}

      {step === "success" && (
        <Overlay onClose={() => setStep("idle")}>
          <h2 style={{ fontFamily: serif, fontSize: 26, margin: "0 0 10px", color: P.pepe }}>
            {alreadyApplied ? "You're In The Queue" : "Application Received"}
          </h2>
          <p style={{ color: P.muted, fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
            We review applications manually. Keep an eye on @GomeJpeg for selection updates.
          </p>
          <button onClick={() => setStep("idle")} style={ghostBtn}>Close</button>
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
