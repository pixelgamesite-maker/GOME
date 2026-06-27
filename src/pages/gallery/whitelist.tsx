import { useState, useEffect } from "react";
import GalleryLayout from "@/components/GalleryLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

const P = {
  surface: "#141414", border: "rgba(255,255,255,0.06)",
  gold: "#C9A84C", goldDim: "rgba(201,168,76,0.15)",
  text: "#f5f5f5", muted: "rgba(255,255,255,0.4)", dim: "rgba(255,255,255,0.15)",
  error: "#ef4444", pepe: "#3ddc52", brett: "#3b82f6", bonk: "#f97316",
};

const display = "'Fredoka', sans-serif";
const body = "'Space Grotesk', sans-serif";

const PINNED_TWEET = "https://x.com/i/status/2070602933767389663";
const X_URL = "https://x.com/GomeJpeg";

const isValidEvm = (a: string) => /^0x[0-9a-fA-F]{40}$/.test(a.trim());
const isValidUrl = (u: string) => {
  try { return new URL(u.trim()).protocol === "https:"; } catch { return false; }
};

export default function GalleryWhitelist() {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [quoteUrl, setQuoteUrl] = useState("");
  const [wallet, setWallet] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [finished, setFinished] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  const handle = user?.user_metadata?.preferred_username || user?.user_metadata?.user_name || "you";

  useEffect(() => {
    checkExisting();
  }, []);

  const checkExisting = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("whitelist_apps")
      .select("id")
      .eq("user_id", user.id)
      .single();
    if (data) setAlreadySubmitted(true);
  };

  const go = (url: string, key: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
    setTimeout(() => setDone((p) => ({ ...p, [key]: true })), 800);
  };

  const submit = async () => {
    if (!user || !isValidEvm(wallet) || !isValidUrl(quoteUrl)) return;
    setErr(""); setBusy(true);

    const { error } = await supabase.from("whitelist_apps").insert({
      user_id: user.id,
      twitter_handle: handle,
      wallet: wallet.trim().toLowerCase(),
      quote_url: quoteUrl.trim(),
    });

    if (error) {
      if (error.message.includes("whitelist_apps_user_id_key")) {
        setErr("You already submitted.");
      } else {
        setErr(error.message || "Submission failed.");
      }
    } else {
      setFinished(true);
    }
    setBusy(false);
  };

  if (alreadySubmitted || finished) {
    return (
      <GalleryLayout pageId="whitelist">
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%", background: P.goldDim,
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px",
          }}>
            <svg width="28" height="20" viewBox="0 0 24 18" fill="none">
              <path d="M2 9l7 7 13-13" stroke={P.gold} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 style={{ fontFamily: display, fontSize: 24, color: P.text, marginBottom: 8 }}>You're in.</h3>
          <p style={{ color: P.muted, fontSize: 14, lineHeight: 1.6 }}>
            @{handle}, your whitelist spot is secured. We'll notify you before mint opens.
          </p>
        </div>
      </GalleryLayout>
    );
  }

  const steps = [
    { id: "follow", label: "Follow", sub: "@GomeJpeg" },
    { id: "like", label: "Like & Repost", sub: "Pinned tweet" },
    { id: "quote", label: "Quote", sub: "Paste link" },
    { id: "wallet", label: "Wallet", sub: "EVM address" },
  ];

  const canAdvance = () => {
    if (step === 0) return done.follow;
    if (step === 1) return done.like;
    if (step === 2) return isValidUrl(quoteUrl);
    if (step === 3) return isValidEvm(wallet);
    return false;
  };

  return (
    <GalleryLayout pageId="whitelist">
      <div style={{ display: "flex", gap: 0, width: "100%", maxWidth: 680, margin: "0 auto", background: P.surface, borderRadius: 20, border: `1px solid ${P.border}`, overflow: "hidden" }}>
        {/* Sidebar */}
        <div style={{ width: 200, background: "rgba(0,0,0,0.3)", padding: "32px 20px", flexShrink: 0 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: P.gold, marginBottom: 24 }}>Whitelist</p>
          {steps.map((s, i) => {
            const active = i === step;
            const complete = i < step || (i === 0 && done.follow) || (i === 1 && done.like) || (i === 2 && isValidUrl(quoteUrl)) || (i === 3 && isValidEvm(wallet));
            return (
              <div key={s.id} onClick={() => { if (complete || i === step) setStep(i); }} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
                cursor: complete || i === step ? "pointer" : "default", opacity: i > step && !complete ? 0.35 : 1,
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: display, fontSize: 11, fontWeight: 700,
                  border: `2px solid ${complete ? P.gold : active ? P.gold : P.dim}`,
                  background: complete ? P.gold : "transparent",
                  color: complete ? "#000" : active ? P.gold : P.dim,
                }}>
                  {complete ? "✓" : i + 1}
                </div>
                <div>
                  <p style={{ margin: 0, fontFamily: display, fontSize: 13, fontWeight: 600, color: active ? P.text : P.muted }}>{s.label}</p>
                  <p style={{ margin: 0, fontSize: 10, color: P.dim, fontWeight: 500 }}>{s.sub}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: "36px 28px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {step === 0 && (
            <div>
              <h4 style={{ fontFamily: display, fontSize: 20, color: P.text, marginBottom: 8 }}>Follow @GomeJpeg</h4>
              <p style={{ color: P.muted, fontSize: 14, marginBottom: 24 }}>Join the community on X for mint announcements.</p>
              <button onClick={() => go(X_URL, "follow")} style={btnStyle(done.follow ? P.goldDim : "rgba(255,255,255,0.04)", done.follow ? P.gold : P.text, done.follow ? `1px solid ${P.gold}` : `1px solid ${P.border}`)}>
                {done.follow ? "Following Confirmed" : "Open X & Follow"}
              </button>
              <button disabled={!done.follow} onClick={() => setStep(1)} style={btnCta(!done.follow)}>Continue</button>
            </div>
          )}

          {step === 1 && (
            <div>
              <h4 style={{ fontFamily: display, fontSize: 20, color: P.text, marginBottom: 8 }}>Like & Repost</h4>
              <p style={{ color: P.muted, fontSize: 14, marginBottom: 24 }}>Engage with the pinned tweet to boost visibility.</p>
              <button onClick={() => go(PINNED_TWEET, "like")} style={btnStyle(done.like ? P.goldDim : "rgba(255,255,255,0.04)", done.like ? P.gold : P.text, done.like ? `1px solid ${P.gold}` : `1px solid ${P.border}`)}>
                {done.like ? "Engagement Recorded" : "Open Pinned Tweet"}
              </button>
              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                <button onClick={() => setStep(0)} style={btnGhost}>Back</button>
                <button disabled={!done.like} onClick={() => setStep(2)} style={btnCta(!done.like)}>Continue</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h4 style={{ fontFamily: display, fontSize: 20, color: P.text, marginBottom: 8 }}>Quote the Post</h4>
              <p style={{ color: P.muted, fontSize: 14, marginBottom: 24 }}>Quote the pinned tweet and paste the link below.</p>
              <button onClick={() => window.open(PINNED_TWEET, "_blank")} style={btnStyle("rgba(255,255,255,0.04)", P.muted, `1px solid ${P.border}`)}>Open Tweet to Quote</button>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: P.dim, letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Quote Link</label>
                <input value={quoteUrl} onChange={(e) => setQuoteUrl(e.target.value)} placeholder="https://x.com/..." style={inputStyle(quoteUrl && !isValidUrl(quoteUrl))} />
                {quoteUrl && !isValidUrl(quoteUrl) && <p style={{ fontSize: 12, color: P.error, marginTop: 6 }}>Enter a valid URL</p>}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setStep(1)} style={btnGhost}>Back</button>
                <button disabled={!isValidUrl(quoteUrl)} onClick={() => setStep(3)} style={btnCta(!isValidUrl(quoteUrl))}>Continue</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h4 style={{ fontFamily: display, fontSize: 20, color: P.text, marginBottom: 8 }}>Drop Your Wallet</h4>
              <p style={{ color: P.muted, fontSize: 14, marginBottom: 24 }}>This is where your GOME NFT will be sent.</p>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: P.dim, letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>EVM Address</label>
                <input value={wallet} onChange={(e) => setWallet(e.target.value)} placeholder="0x..." style={{ ...inputStyle(wallet && !isValidEvm(wallet)), fontFamily: "monospace" }} />
                {wallet && !isValidEvm(wallet) && <p style={{ fontSize: 12, color: P.error, marginTop: 6 }}>Invalid EVM address</p>}
              </div>
              {err && <p style={{ fontSize: 13, color: P.error, marginBottom: 14 }}>{err}</p>}
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setStep(2)} style={btnGhost}>Back</button>
                <button disabled={!isValidEvm(wallet) || busy} onClick={submit} style={btnCta(!isValidEvm(wallet) || busy)}>
                  {busy ? "Submitting..." : "Secure My Spot"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </GalleryLayout>
  );
}

function btnStyle(bg: string, color: string, border: string) {
  return {
    width: "100%", padding: 12, background: bg, border, borderRadius: 10,
    color, fontFamily: body, fontWeight: 700, fontSize: 12, cursor: "pointer", letterSpacing: "0.04em", marginBottom: 16,
  };
}
function btnCta(disabled: boolean) {
  return {
    padding: "10px 24px", background: disabled ? "rgba(255,255,255,0.04)" : P.gold,
    border: "none", borderRadius: 10, color: disabled ? P.dim : "#000",
    fontFamily: body, fontWeight: 800, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" as const,
    cursor: disabled ? "not-allowed" : "pointer",
  };
}
function btnGhost() {
  return {
    padding: "10px 20px", background: "transparent", border: `1px solid ${P.border}`,
    borderRadius: 10, color: P.muted, fontFamily: body, fontWeight: 700, fontSize: 11, cursor: "pointer",
  };
}
function inputStyle(error: boolean) {
  return {
    width: "100%", background: "rgba(255,255,255,0.03)", border: `1px solid ${error ? P.error : P.border}`,
    borderRadius: 10, padding: "12px 14px", color: P.text, fontFamily: body, fontSize: 14, outline: "none",
  };
}
