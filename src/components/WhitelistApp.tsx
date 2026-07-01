import { useState } from "react";
import { createPortal } from "react-dom";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/lib/i18n";
import { X, CheckCircle2 } from "lucide-react";

const LS_KEY = "gome_wl_submitted";

const P = {
  bg: "#070707", surface: "#141414", border: "rgba(255,255,255,0.1)",
  text: "#f5f5f5", muted: "rgba(255,255,255,0.45)",
  pepe: "#3ddc52", brett: "#3b82f6", bonk: "#f97316",
};
const pixel = "'Press Start 2P', monospace";
const mono = "'Space Mono', monospace";
const TWEET_URL = "https://x.com/i/status/2070602933767389663";

function alreadySubmitted() {
  try { return !!localStorage.getItem(LS_KEY); } catch { return false; }
}
function markSubmitted() {
  try { localStorage.setItem(LS_KEY, "1"); } catch {}
}

export default function WhitelistApp({
  triggerLabel,
  triggerStyle,
}: {
  triggerLabel: string;
  triggerStyle?: React.CSSProperties;
}) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [wallet, setWallet] = useState("");
  const [quoteUrl, setQuoteUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(alreadySubmitted);

  const close = () => { setOpen(false); setError(null); };

  const submit = async () => {
    setError(null);
    if (!wallet.trim()) { setError("Please enter your wallet address."); return; }
    if (!/^0x[a-fA-F0-9]{40}$/.test(wallet.trim())) { setError("Doesn't look like a valid EVM address (0x…)."); return; }
    if (!quoteUrl.trim()) { setError("Please paste your quote tweet link."); return; }

    setSubmitting(true);
    const { error: dbErr } = await supabase.from("whitelist_apps").insert({
      wallet: wallet.trim(),
      quote_url: quoteUrl.trim(),
    });

    if (dbErr) {
      if (dbErr.code === "23505") {
        // Wallet already in DB from another browser
        markSubmitted();
        setDone(true);
        close();
      } else {
        setError("Submission failed — please try again.");
      }
      setSubmitting(false);
      return;
    }

    markSubmitted();
    setDone(true);
    setSubmitting(false);
    close();
  };

  return (
    <>
      <button onClick={() => setOpen(true)} style={triggerStyle}>
        {done ? "✓ " : ""}{triggerLabel}
      </button>

      {open && createPortal(
        <>
          <div onClick={close} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", zIndex: 1000 }} />
          <div style={{
            position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
            zIndex: 1001, width: "min(420px, 92vw)", maxHeight: "85vh", overflowY: "auto",
            background: P.bg, border: `2px solid ${P.brett}`, padding: 28, fontFamily: mono, color: P.text,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <p style={{ margin: 0, fontFamily: pixel, fontSize: 11, lineHeight: 1.6, color: P.brett }}>WHITELIST</p>
              <button onClick={close} style={{ background: "none", border: "none", color: P.muted, cursor: "pointer" }}><X size={18} /></button>
            </div>

            {done ? (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <CheckCircle2 size={40} color={P.pepe} style={{ margin: "0 auto 16px", display: "block" }} />
                <p style={{ fontFamily: pixel, fontSize: 11, lineHeight: 1.8, color: P.pepe, margin: "0 0 10px" }}>APPLICATION RECEIVED</p>
                <p style={{ fontSize: 13, color: P.muted, lineHeight: 1.6 }}>All applications are reviewed manually. Check @GomeJpeg for results.</p>
                <button onClick={close} style={{ marginTop: 20, fontFamily: mono, fontSize: 12, fontWeight: 700, color: P.text, background: "rgba(255,255,255,0.06)", border: `1px solid ${P.border}`, padding: "10px 24px", cursor: "pointer" }}>Close</button>
              </div>
            ) : (
              <>
                <p style={{ margin: "0 0 24px", fontSize: 13, color: P.muted, lineHeight: 1.6 }}>
                  Complete the tasks on X, then submit your wallet to enter the draw.
                </p>

                {/* Task checklist */}
                <div style={{ marginBottom: 24, display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { label: "Follow @GomeJpeg", url: "https://x.com/GomeJpeg" },
                    { label: "Repost pinned post", url: TWEET_URL },
                    { label: "Quote & tag 2 frens", url: TWEET_URL },
                  ].map((task) => (
                    <a key={task.label} href={task.url} target="_blank" rel="noopener noreferrer" style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
                      background: P.surface, border: `1px solid ${P.border}`,
                      textDecoration: "none", color: P.text, fontSize: 13,
                    }}>
                      <span style={{ width: 14, height: 14, border: `1px solid ${P.muted}`, flexShrink: 0 }} />
                      {task.label}
                      <span style={{ marginLeft: "auto", fontSize: 11, color: P.muted }}>→</span>
                    </a>
                  ))}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <Field label="EVM wallet address" placeholder="0x..." value={wallet} onChange={setWallet} />
                  <Field label="Quote tweet link" placeholder="https://x.com/yourhandle/status/..." value={quoteUrl} onChange={setQuoteUrl} />
                </div>

                {error && <p style={{ margin: "12px 0 0", fontSize: 12, color: "#ef4444" }}>{error}</p>}

                <button onClick={submit} disabled={submitting} style={{
                  marginTop: 20, width: "100%", fontFamily: pixel, fontSize: 10, lineHeight: 1.8,
                  color: "#000", background: submitting ? "rgba(61,220,82,0.5)" : P.pepe,
                  border: "none", padding: "14px 0", cursor: submitting ? "default" : "pointer",
                }}>
                  {submitting ? "SUBMITTING..." : "SUBMIT →"}
                </button>

                <p style={{ margin: "12px 0 0", fontSize: 11, color: "rgba(255,255,255,0.25)", textAlign: "center" }}>
                  One entry per wallet. Reviewed manually.
                </p>
              </>
            )}
          </div>
        </>,
        document.body
      )}
    </>
  );
}

function Field({ label, placeholder, value, onChange }: {
  label: string; placeholder: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <p style={{ margin: "0 0 6px", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>{label}</p>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: "100%", boxSizing: "border-box", fontFamily: mono, fontSize: 13, color: "#fff", background: "#141414", border: "1px solid rgba(255,255,255,0.12)", padding: "10px 12px", outline: "none" }}
      />
    </div>
  );
}
