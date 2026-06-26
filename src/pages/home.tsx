import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

/* ── Assets ── */
const LOGO = "/GOME-LOGO.png";
const HERO_IMG = "/GOME-HERO.png";
const LORE_IMG = "/GOME-LORE.jpg";

/* ── Links ── */
const X_URL = "https://x.com/gomememes";
const PINNED_TWEET = "https://x.com/gomememes/status/1234567890";

/* ── Fonts ── */
const FONT_LINK =
  "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Fredoka:wght@400;500;600;700&display=swap";

const display = "'Fredoka', sans-serif";
const body = "'Space Grotesk', 'Segoe UI', sans-serif";

/* ── Palette ── */
const P = {
  bg: "#070707",
  bgElevated: "#0e0e0e",
  surface: "#141414",
  border: "rgba(255,255,255,0.06)",
  gold: "#C9A84C",
  goldDim: "rgba(201,168,76,0.15)",
  goldGlow: "rgba(201,168,76,0.25)",
  text: "#f5f5f5",
  muted: "rgba(255,255,255,0.4)",
  dim: "rgba(255,255,255,0.15)",
  pepe: "#3ddc52",
  bonk: "#f97316",
  brett: "#3b82f6",
  error: "#ef4444",
};

const LS_KEY = "gome_whitelist_done";

/* ── Validation ── */
const isValidEvm = (a: string) => /^0x[0-9a-fA-F]{40}$/.test(a.trim());
const isValidUrl = (u: string) => {
  try {
    return new URL(u.trim()).protocol === "https:";
  } catch {
    return false;
  }
};

/* ── Scroll Reveal ── */
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          o.unobserve(el);
        }
      },
      { threshold }
    );
    o.observe(el);
    return () => o.disconnect();
  }, [threshold]);
  return { ref, on };
}

/* ── Safe Image ── */
function SafeImage({
  src,
  alt,
  style,
  fallback,
}: {
  src: string;
  alt: string;
  style?: React.CSSProperties;
  fallback?: React.ReactNode;
}) {
  const [err, setErr] = useState(false);
  if (err && fallback) return <>{fallback}</>;
  return (
    <img
      src={src}
      alt={alt}
      style={style}
      onError={() => setErr(true)}
    />
  );
}

/* ════════════════════════════════════════
   WHITELIST — SIDEBAR STEPPER
   ════════════════════════════════════════ */
function Whitelist({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [twitter, setTwitter] = useState("");
  const [quoteUrl, setQuoteUrl] = useState("");
  const [wallet, setWallet] = useState("");
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [finished, setFinished] = useState(false);

  const steps = [
    { id: "follow", label: "Follow", sub: "@gomememes" },
    { id: "like", label: "Like & Repost", sub: "Pinned tweet" },
    { id: "quote", label: "Quote", sub: "Paste link" },
    { id: "wallet", label: "Wallet", sub: "EVM address" },
  ];

  const go = (url: string, key: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
    setTimeout(() => setDone((p) => ({ ...p, [key]: true })), 1000);
  };

  const canAdvance = () => {
    if (step === 0) return done.follow && twitter.trim().length > 1;
    if (step === 1) return done.like;
    if (step === 2) return isValidUrl(quoteUrl);
    if (step === 3) return isValidEvm(wallet);
    return false;
  };

  const submit = async () => {
    if (!canAdvance()) return;
    setErr("");
    setBusy(true);
    try {
      const { error } = await supabase.from("gome").insert({
        x_username: twitter.trim().replace(/^@/, ""),
        wallet: wallet.trim().toLowerCase(),
        quote_url: quoteUrl.trim(),
        follow_done: done.follow,
        like_done: done.like,
      });
      if (error) throw error;
      localStorage.setItem(LS_KEY, "1");
      setFinished(true);
    } catch (e: any) {
      const msg = e?.message || "";
      if (msg.includes("gome_wallet_idx"))
        setErr("This wallet is already on the list.");
      else if (msg.includes("gome_x_username_idx"))
        setErr("This X handle is already on the list.");
      else setErr(msg || "Submission failed. Try again.");
    } finally {
      setBusy(false);
    }
  };

  if (finished) {
    return (
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          textAlign: "center",
          animation: "fadeIn 0.5s ease",
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: `conic-gradient(${P.gold} 0%, ${P.goldDim} 100%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}
        >
          <svg width="32" height="24" viewBox="0 0 24 18" fill="none">
            <path
              d="M2 9l7 7 13-13"
              stroke="#070707"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3
          style={{
            fontFamily: display,
            fontSize: 28,
            color: P.text,
            marginBottom: 8,
            fontWeight: 600,
          }}
        >
          You're in.
        </h3>
        <p
          style={{
            fontFamily: body,
            fontSize: 14,
            color: P.muted,
            lineHeight: 1.7,
            marginBottom: 28,
          }}
        >
          Whitelist spot secured. Selected wallets will be notified before
          mint opens.
        </p>
        <button
          onClick={onClose}
          style={{
            fontFamily: body,
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#000",
            background: P.gold,
            border: "none",
            borderRadius: 10,
            padding: "14px 32px",
            cursor: "pointer",
          }}
        >
          Back to Gallery
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        gap: 0,
        width: "100%",
        maxWidth: 720,
        maxHeight: "90vh",
        background: P.surface,
        borderRadius: 24,
        border: `1px solid ${P.border}`,
        overflow: "hidden",
        animation: "scaleIn 0.35s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: 220,
          background: "rgba(0,0,0,0.35)",
          padding: "36px 28px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          flexShrink: 0,
        }}
      >
        <p
          style={{
            fontFamily: body,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: P.gold,
            marginBottom: 28,
          }}
        >
          Whitelist
        </p>
        {steps.map((s, i) => {
          const active = i === step;
          const complete =
            i < step ||
            (i === 0 && done.follow && twitter) ||
            (i === 1 && done.like) ||
            (i === 2 && isValidUrl(quoteUrl)) ||
            (i === 3 && isValidEvm(wallet));
          return (
            <div
              key={s.id}
              onClick={() => {
                if (complete || i === step) setStep(i);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 0",
                cursor: complete || i === step ? "pointer" : "default",
                opacity: i > step && !complete ? 0.35 : 1,
                transition: "opacity 0.2s",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: display,
                  fontSize: 12,
                  fontWeight: 700,
                  border: `2px solid ${
                    complete ? P.gold : active ? P.gold : P.dim
                  }`,
                  background: complete ? P.gold : "transparent",
                  color: complete ? "#000" : active ? P.gold : P.dim,
                  transition: "all 0.3s ease",
                  flexShrink: 0,
                }}
              >
                {complete ? (
                  <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                    <path
                      d="M1 4.5l3.5 3.5 6-7"
                      stroke="#000"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <div>
                <p
                  style={{
                    margin: 0,
                    fontFamily: display,
                    fontSize: 14,
                    fontWeight: 600,
                    color: active ? P.text : P.muted,
                    lineHeight: 1.2,
                  }}
                >
                  {s.label}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontFamily: body,
                    fontSize: 11,
                    color: P.dim,
                    fontWeight: 500,
                    letterSpacing: "0.04em",
                  }}
                >
                  {s.sub}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          padding: "40px 36px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflowY: "auto",
        }}
      >
        {step === 0 && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <h4
              style={{
                fontFamily: display,
                fontSize: 22,
                color: P.text,
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              Follow @gomememes
            </h4>
            <p
              style={{
                fontFamily: body,
                fontSize: 14,
                color: P.muted,
                marginBottom: 28,
                lineHeight: 1.6,
              }}
            >
              Join the community on X to stay updated on mint announcements.
            </p>
            <button
              onClick={() => go(X_URL, "follow")}
              style={{
                width: "100%",
                padding: "14px",
                background: done.follow
                  ? P.goldDim
                  : "rgba(255,255,255,0.04)",
                border: `1px solid ${
                  done.follow ? P.gold : P.border
                }`,
                borderRadius: 12,
                color: done.follow ? P.gold : P.text,
                fontFamily: body,
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                letterSpacing: "0.04em",
                marginBottom: 20,
                transition: "all 0.2s",
              }}
            >
              {done.follow ? "Following Confirmed" : "Open X & Follow"}
            </button>
            <div style={{ marginBottom: 8 }}>
              <label
                style={{
                  fontFamily: body,
                  fontSize: 11,
                  fontWeight: 700,
                  color: P.dim,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                Your X Handle
              </label>
              <input
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="@yourhandle"
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${P.border}`,
                  borderRadius: 10,
                  padding: "12px 14px",
                  color: P.text,
                  fontFamily: body,
                  fontSize: 14,
                  outline: "none",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = P.gold)
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = P.border)
                }
              />
            </div>
            <button
              disabled={!done.follow || !twitter.trim()}
              onClick={() => setStep(1)}
              style={{
                marginTop: 12,
                padding: "12px 28px",
                background:
                  done.follow && twitter.trim()
                    ? P.gold
                    : "rgba(255,255,255,0.04)",
                border: "none",
                borderRadius: 10,
                color:
                  done.follow && twitter.trim() ? "#000" : P.dim,
                fontFamily: body,
                fontWeight: 800,
                fontSize: 12,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor:
                  done.follow && twitter.trim()
                    ? "pointer"
                    : "not-allowed",
                transition: "all 0.2s",
              }}
            >
              Continue
            </button>
          </div>
        )}

        {step === 1 && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <h4
              style={{
                fontFamily: display,
                fontSize: 22,
                color: P.text,
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              Like & Repost
            </h4>
            <p
              style={{
                fontFamily: body,
                fontSize: 14,
                color: P.muted,
                marginBottom: 28,
                lineHeight: 1.6,
              }}
            >
              Engage with the pinned tweet to boost visibility.
            </p>
            <button
              onClick={() => go(PINNED_TWEET, "like")}
              style={{
                width: "100%",
                padding: "14px",
                background: done.like
                  ? P.goldDim
                  : "rgba(255,255,255,0.04)",
                border: `1px solid ${
                  done.like ? P.gold : P.border
                }`,
                borderRadius: 12,
                color: done.like ? P.gold : P.text,
                fontFamily: body,
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                letterSpacing: "0.04em",
                marginBottom: 20,
                transition: "all 0.2s",
              }}
            >
              {done.like ? "Engagement Recorded" : "Open Pinned Tweet"}
            </button>
            <div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "space-between",
              }}
            >
              <button
                onClick={() => setStep(0)}
                style={{
                  padding: "12px 24px",
                  background: "transparent",
                  border: `1px solid ${P.border}`,
                  borderRadius: 10,
                  color: P.muted,
                  fontFamily: body,
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: "pointer",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                Back
              </button>
              <button
                disabled={!done.like}
                onClick={() => setStep(2)}
                style={{
                  padding: "12px 28px",
                  background: done.like
                    ? P.gold
                    : "rgba(255,255,255,0.04)",
                  border: "none",
                  borderRadius: 10,
                  color: done.like ? "#000" : P.dim,
                  fontFamily: body,
                  fontWeight: 800,
                  fontSize: 12,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  cursor: done.like ? "pointer" : "not-allowed",
                  transition: "all 0.2s",
                }}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <h4
              style={{
                fontFamily: display,
                fontSize: 22,
                color: P.text,
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              Quote the Post
            </h4>
            <p
              style={{
                fontFamily: body,
                fontSize: 14,
                color: P.muted,
                marginBottom: 28,
                lineHeight: 1.6,
              }}
            >
              Quote the pinned tweet with your thoughts and paste the link
              below.
            </p>
            <button
              onClick={() => window.open(PINNED_TWEET, "_blank")}
              style={{
                width: "100%",
                padding: "12px",
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${P.border}`,
                borderRadius: 10,
                color: P.muted,
                fontFamily: body,
                fontWeight: 700,
                fontSize: 12,
                cursor: "pointer",
                letterSpacing: "0.04em",
                marginBottom: 20,
              }}
            >
              Open Tweet to Quote
            </button>
            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  fontFamily: body,
                  fontSize: 11,
                  fontWeight: 700,
                  color: P.dim,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                Quote Link
              </label>
              <input
                value={quoteUrl}
                onChange={(e) => setQuoteUrl(e.target.value)}
                placeholder="https://x.com/..."
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${
                    quoteUrl && !isValidUrl(quoteUrl)
                      ? P.error
                      : P.border
                  }`,
                  borderRadius: 10,
                  padding: "12px 14px",
                  color: P.text,
                  fontFamily: body,
                  fontSize: 14,
                  outline: "none",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = P.gold)
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = P.border)
                }
              />
              {quoteUrl && !isValidUrl(quoteUrl) && (
                <p
                  style={{
                    fontFamily: body,
                    fontSize: 12,
                    color: P.error,
                    marginTop: 6,
                  }}
                >
                  Enter a valid URL
                </p>
              )}
            </div>
            <div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "space-between",
              }}
            >
              <button
                onClick={() => setStep(1)}
                style={{
                  padding: "12px 24px",
                  background: "transparent",
                  border: `1px solid ${P.border}`,
                  borderRadius: 10,
                  color: P.muted,
                  fontFamily: body,
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: "pointer",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                Back
              </button>
              <button
                disabled={!isValidUrl(quoteUrl)}
                onClick={() => setStep(3)}
                style={{
                  padding: "12px 28px",
                  background: isValidUrl(quoteUrl)
                    ? P.gold
                    : "rgba(255,255,255,0.04)",
                  border: "none",
                  borderRadius: 10,
                  color: isValidUrl(quoteUrl) ? "#000" : P.dim,
                  fontFamily: body,
                  fontWeight: 800,
                  fontSize: 12,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  cursor: isValidUrl(quoteUrl)
                    ? "pointer"
                    : "not-allowed",
                  transition: "all 0.2s",
                }}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <h4
              style={{
                fontFamily: display,
                fontSize: 22,
                color: P.text,
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              Drop Your Wallet
            </h4>
            <p
              style={{
                fontFamily: body,
                fontSize: 14,
                color: P.muted,
                marginBottom: 28,
                lineHeight: 1.6,
              }}
            >
              This is where your GOME NFT will be sent. Double-check before
              submitting.
            </p>
            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  fontFamily: body,
                  fontSize: 11,
                  fontWeight: 700,
                  color: P.dim,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                EVM Address
              </label>
              <input
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                placeholder="0x..."
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${
                    wallet && !isValidEvm(wallet)
                      ? P.error
                      : P.border
                  }`,
                  borderRadius: 10,
                  padding: "12px 14px",
                  color: P.text,
                  fontFamily: "monospace",
                  fontSize: 14,
                  outline: "none",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = P.gold)
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = P.border)
                }
              />
              {wallet && !isValidEvm(wallet) && (
                <p
                  style={{
                    fontFamily: body,
                    fontSize: 12,
                    color: P.error,
                    marginTop: 6,
                  }}
                >
                  Invalid EVM address
                </p>
              )}
            </div>
            {err && (
              <p
                style={{
                  fontFamily: body,
                  fontSize: 13,
                  color: P.error,
                  marginBottom: 16,
                  fontWeight: 500,
                }}
              >
                {err}
              </p>
            )}
            <div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "space-between",
              }}
            >
              <button
                onClick={() => setStep(2)}
                style={{
                  padding: "12px 24px",
                  background: "transparent",
                  border: `1px solid ${P.border}`,
                  borderRadius: 10,
                  color: P.muted,
                  fontFamily: body,
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: "pointer",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                Back
              </button>
              <button
                disabled={!isValidEvm(wallet) || busy}
                onClick={submit}
                style={{
                  padding: "12px 32px",
                  background: isValidEvm(wallet)
                    ? P.gold
                    : "rgba(255,255,255,0.04)",
                  border: "none",
                  borderRadius: 10,
                  color: isValidEvm(wallet) ? "#000" : P.dim,
                  fontFamily: body,
                  fontWeight: 800,
                  fontSize: 12,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  cursor: isValidEvm(wallet) && !busy
                    ? "pointer"
                    : "not-allowed",
                  transition: "all 0.2s",
                }}
              >
                {busy ? "Submitting..." : "Secure My Spot"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   COIN CARD
   ════════════════════════════════════════ */
function CoinCard({
  coin,
  index,
}: {
  coin: {
    id: string;
    name: string;
    img: string;
    color: string;
    tagline: string;
    desc: string;
  };
  index: number;
}) {
  const { ref, on } = useReveal();
  return (
    <div
      ref={ref}
      style={{
        background: P.surface,
        border: `1px solid ${P.border}`,
        borderRadius: 20,
        padding: 0,
        overflow: "hidden",
        opacity: on ? 1 : 0,
        transform: on ? "translateY(0)" : "translateY(40px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
        transitionDelay: `${index * 100}ms`,
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${coin.color}30`;
        e.currentTarget.style.transform = "translateY(-6px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = P.border;
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div
        style={{
          height: 220,
          background: `linear-gradient(135deg, ${coin.color}08, transparent)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at 50% 120%, ${coin.color}15, transparent 60%)`,
          }}
        />
        <SafeImage
          src={coin.img}
          alt={coin.name}
          style={{
            height: "80%",
            width: "auto",
            objectFit: "contain",
            position: "relative",
            zIndex: 1,
            filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.5))",
          }}
          fallback={
            <span
              style={{
                fontFamily: display,
                fontSize: 48,
                color: coin.color,
                opacity: 0.5,
              }}
            >
              {coin.name[0]}
            </span>
          }
        />
      </div>
      <div style={{ padding: "28px 24px" }}>
        <h3
          style={{
            fontFamily: display,
            fontSize: "clamp(1.6rem, 3vw, 2rem)",
            color: coin.color,
            margin: "0 0 6px",
            fontWeight: 600,
            letterSpacing: "0.02em",
          }}
        >
          {coin.name}
        </h3>
        <p
          style={{
            fontFamily: display,
            fontSize: 15,
            color: P.text,
            margin: "0 0 12px",
            fontWeight: 500,
          }}
        >
          {coin.tagline}
        </p>
        <p
          style={{
            fontFamily: body,
            fontSize: 14,
            color: P.muted,
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          {coin.desc}
        </p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════ */
export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [already, setAlready] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(LS_KEY) === "1") setAlready(true);
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = FONT_LINK;
    document.head.appendChild(l);
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const coins = [
    {
      id: "pepe",
      name: "PEPE",
      img: "/PEPE.PNG",
      color: P.pepe,
      tagline: "The original meme. The eternal vibe.",
      desc: "The face of internet culture. Green, unserious, and completely iconic. Every collection needs a PEPE.",
    },
    {
      id: "bonk",
      name: "BONK",
      img: "/BONK.PNG",
      color: P.bonk,
      tagline: "Bonk first. Ask questions never.",
      desc: "Raw, chaotic energy. The bat swings and the timeline reacts. Maximum chaos, minimum regret.",
    },
    {
      id: "brett",
      name: "BRETT",
      img: "/BRETT.PNG",
      color: P.brett,
      tagline: "Just a guy. With all the vibes.",
      desc: "The laid-back king. Doesn't try hard, somehow wins anyway. Chill personified, now on-chain.",
    },
  ];

  return (
    <div
      style={{
        background: P.bg,
        minHeight: "100vh",
        color: P.text,
        fontFamily: body,
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('${FONT_LINK}');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: ${P.bg}; }
        ::selection { background: ${P.gold}; color: #000; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${P.bg}; }
        ::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.2); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(201,168,76,0.35); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes heroImg { from { opacity: 0; transform: translateY(20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>

      {/* ── Nav ── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: 72,
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: scrolled
            ? "rgba(7,7,7,0.92)"
            : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled
            ? `1px solid ${P.border}`
            : "1px solid transparent",
          transition: "all 0.4s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <SafeImage
            src={LOGO}
            alt="GOME"
            style={{
              height: 34,
              width: 34,
              objectFit: "contain",
              filter: "brightness(1.1)",
            }}
            fallback={
              <span
                style={{
                  fontFamily: display,
                  fontSize: 24,
                  color: P.gold,
                }}
              >
                G
              </span>
            }
          />
          <span
            style={{
              fontFamily: display,
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: "0.06em",
              color: P.text,
            }}
          >
            GOME
          </span>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          style={{
            fontFamily: body,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#000",
            background: P.gold,
            border: "none",
            borderRadius: 10,
            padding: "10px 24px",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#e0c160";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = P.gold;
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Whitelist
        </button>
      </nav>

      {/* ── Hero ── */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          padding: "0 24px 0",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(201,168,76,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            maxWidth: 1200,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 40,
            paddingBottom: 80,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              flex: "1 1 400px",
              paddingBottom: 60,
              animation:
                "slideUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s both",
            }}
          >
            <p
              style={{
                fontFamily: body,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: P.gold,
                marginBottom: 20,
              }}
            >
              Gallery of Memes
            </p>
            <h1
              style={{
                fontFamily: display,
                fontSize: "clamp(4rem, 12vw, 8rem)",
                fontWeight: 600,
                lineHeight: 0.95,
                color: P.text,
                marginBottom: 24,
                letterSpacing: "-0.03em",
              }}
            >
              4,004
              <br />
              <span style={{ color: P.gold }}>Memes</span>
            </h1>
            <p
              style={{
                fontFamily: body,
                fontSize: 16,
                color: P.muted,
                lineHeight: 1.7,
                maxWidth: 420,
                marginBottom: 36,
              }}
            >
              PEPE, BONK, and BRETT — hand-crafted characters built for the
              culture. One collection. Ethereum. Zero apologies.
            </p>
            <div
              style={{ display: "flex", gap: 14, flexWrap: "wrap" }}
            >
              <button
                onClick={() => setModalOpen(true)}
                style={{
                  fontFamily: body,
                  fontSize: 13,
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#000",
                  background: P.gold,
                  border: "none",
                  borderRadius: 12,
                  padding: "16px 36px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: `0 4px 24px ${P.goldGlow}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#e0c160";
                  e.currentTarget.style.transform =
                    "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 32px rgba(201,168,76,0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = P.gold;
                  e.currentTarget.style.transform =
                    "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 24px rgba(201,168,76,0.15)";
                }}
              >
                Apply for Whitelist
              </button>
              <a
                href="#collection"
                style={{
                  fontFamily: body,
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: P.muted,
                  border: `1px solid ${P.border}`,
                  borderRadius: 12,
                  padding: "16px 36px",
                  textDecoration: "none",
                  display: "inline-block",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = P.gold;
                  e.currentTarget.style.color = P.text;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = P.border;
                  e.currentTarget.style.color = P.muted;
                }}
              >
                Explore
              </a>
            </div>
          </div>

          <div
            style={{
              flex: "1 1 400px",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-end",
              position: "relative",
              animation:
                "heroImg 1s cubic-bezier(0.16,1,0.3,1) 0.3s both",
            }}
          >
            <SafeImage
              src={HERO_IMG}
              alt="GOME Hero"
              style={{
                maxWidth: "100%",
                height: "auto",
                maxHeight: "70vh",
                objectFit: "contain",
                filter: "drop-shadow(0 40px 60px rgba(0,0,0,0.6))",
                display: "block",
              }}
              fallback={
                <div
                  style={{
                    width: 300,
                    height: 300,
                    borderRadius: 20,
                    background: P.surface,
                    border: `1px solid ${P.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: display,
                      fontSize: 64,
                      color: P.gold,
                    }}
                  >
                    GO
                  </span>
                </div>
              }
            />
          </div>
        </div>
      </section>

      {/* ── Collection ── */}
      <section
        id="collection"
        style={{
          padding: "120px 24px",
          background: P.bg,
          position: "relative",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div
            style={{
              textAlign: "center",
              marginBottom: 64,
              animation: "slideUp 0.7s ease both",
            }}
          >
            <p
              style={{
                fontFamily: body,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: P.gold,
                marginBottom: 14,
              }}
            >
              The Collection
            </p>
            <h2
              style={{
                fontFamily: display,
                fontSize: "clamp(2rem, 5vw, 3.2rem)",
                fontWeight: 600,
                color: P.text,
                letterSpacing: "-0.02em",
                marginBottom: 12,
              }}
            >
              Meet the <span style={{ color: P.gold }}>Legends</span>
            </h2>
            <p
              style={{
                fontFamily: body,
                fontSize: 16,
                color: P.muted,
                maxWidth: 480,
                margin: "0 auto",
                lineHeight: 1.7,
              }}
            >
              Three icons. One gallery. Hand-crafted for the culture.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 20,
            }}
          >
            {coins.map((c, i) => (
              <CoinCard key={c.id} coin={c} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Mint Info ── */}
      <section
        style={{
          padding: "100px 24px",
          background: P.bgElevated,
          borderTop: `1px solid ${P.border}`,
          borderBottom: `1px solid ${P.border}`,
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div
            style={{
              textAlign: "center",
              marginBottom: 48,
              animation: "slideUp 0.7s ease both",
            }}
          >
            <p
              style={{
                fontFamily: body,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: P.gold,
                marginBottom: 14,
              }}
            >
              Mint Details
            </p>
            <h2
              style={{
                fontFamily: display,
                fontSize: "clamp(2rem, 5vw, 3.2rem)",
                fontWeight: 600,
                color: P.text,
                letterSpacing: "-0.02em",
              }}
            >
              The <span style={{ color: P.gold }}>Specs</span>
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 1,
              background: P.border,
              borderRadius: 16,
              overflow: "hidden",
              border: `1px solid ${P.border}`,
            }}
          >
            {[
              { label: "Collection Size", value: "4,004" },
              { label: "Mint Price", value: "0.0009 ETH" },
              { label: "Blockchain", value: "Ethereum" },
              { label: "Marketplace", value: "OpenSea" },
              { label: "Characters", value: "PEPE · BONK · BRETT" },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  background: P.surface,
                  padding: "32px 20px",
                  textAlign: "center",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "rgba(255,255,255,0.03)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = P.surface;
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontFamily: display,
                    fontSize: "clamp(1.3rem, 3vw, 1.8rem)",
                    color: P.gold,
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                    marginBottom: 6,
                  }}
                >
                  {item.value}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontFamily: body,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: P.dim,
                  }}
                >
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Lore ── */}
      <section
        style={{
          padding: 0,
          background: P.bg,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            minHeight: "70vh",
          }}
        >
          <div
            style={{
              flex: "1 1 500px",
              padding: "80px 24px 80px 48px",
              position: "relative",
              zIndex: 2,
            }}
          >
            <p
              style={{
                fontFamily: body,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: P.gold,
                marginBottom: 16,
              }}
            >
              The Lore
            </p>
            <h2
              style={{
                fontFamily: display,
                fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
                fontWeight: 600,
                color: P.text,
                lineHeight: 1.1,
                marginBottom: 24,
                letterSpacing: "-0.02em",
              }}
            >
              From the trenches
              <br />
              to the <span style={{ color: P.gold }}>chain.</span>
            </h2>
            <p
              style={{
                fontFamily: body,
                fontSize: 16,
                color: P.muted,
                lineHeight: 1.8,
                marginBottom: 16,
                maxWidth: 440,
              }}
            >
              GOME started as a joke in a group chat. Three meme coins, three
              communities, one question: what if we put them all in one place?
            </p>
            <p
              style={{
                fontFamily: body,
                fontSize: 16,
                color: P.muted,
                lineHeight: 1.8,
                maxWidth: 440,
              }}
            >
              Now it's a 4,004-piece collection on Ethereum. No roadmap
              promises. No utility fluff. Just art, culture, and the memes that
              got us here.
            </p>
          </div>
          <div
            style={{
              flex: "1 1 400px",
              position: "relative",
              minHeight: "60vh",
            }}
          >
            <SafeImage
              src={LORE_IMG}
              alt="GOME Lore"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.7,
                maskImage:
                  "linear-gradient(to right, transparent, black 20%)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent, black 20%)",
              }}
              fallback={
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: P.surface,
                  }}
                />
              }
            />
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        style={{
          padding: "120px 24px",
          textAlign: "center",
          background: P.bg,
          borderTop: `1px solid ${P.border}`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            height: 300,
            borderRadius: "50%",
            background: `radial-gradient(ellipse, ${P.goldDim} 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 500,
            margin: "0 auto",
            animation: "slideUp 0.7s ease both",
          }}
        >
          <h2
            style={{
              fontFamily: display,
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              fontWeight: 600,
              color: P.text,
              marginBottom: 16,
              letterSpacing: "-0.02em",
            }}
          >
            Ready for the{" "}
            <span style={{ color: P.gold }}>gallery?</span>
          </h2>
          <p
            style={{
              fontFamily: body,
              fontSize: 16,
              color: P.muted,
              lineHeight: 1.7,
              marginBottom: 32,
            }}
          >
            Spots are limited. Complete the whitelist to secure your place.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            style={{
              fontFamily: body,
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#000",
              background: P.gold,
              border: "none",
              borderRadius: 14,
              padding: "18px 48px",
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: `0 4px 24px ${P.goldGlow}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#e0c160";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 8px 32px rgba(201,168,76,0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = P.gold;
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 24px rgba(201,168,76,0.15)";
            }}
          >
            Join the Gallery
          </button>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: "80px 24px", background: P.bgElevated }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: display,
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 600,
              color: P.text,
              marginBottom: 40,
              letterSpacing: "-0.02em",
              textAlign: "center",
            }}
          >
            FAQ
          </h2>
          {[
            [
              "What is GOME?",
              "Gallery of Memes — a 4,004 supply NFT collection featuring PEPE, BONK, and BRETT characters on Ethereum.",
            ],
            [
              "What's the mint price?",
              "0.0009 ETH per NFT.",
            ],
            [
              "Where do I mint?",
              "On OpenSea.",
            ],
            [
              "What is the whitelist?",
              "Completing the missions (follow, like, repost, quote + wallet) enters you into review for early access.",
            ],
            [
              "How many NFTs are there?",
              "4,004 total across all three characters.",
            ],
            [
              "Is this financial advice?",
              "No. This is a meme NFT collection. DYOR. NFA.",
            ],
          ].map(([q, a], i) => (
            <FaqItem key={i} q={q} a={a} />
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          padding: "60px 24px 40px",
          textAlign: "center",
          background: "#050505",
          borderTop: `1px solid ${P.border}`,
        }}
      >
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <SafeImage
              src={LOGO}
              alt="GOME"
              style={{
                height: 30,
                width: 30,
                objectFit: "contain",
              }}
              fallback={
                <span
                  style={{
                    fontFamily: display,
                    fontSize: 20,
                    color: P.gold,
                  }}
                >
                  G
                </span>
              }
            />
            <span
              style={{
                fontFamily: display,
                fontSize: 18,
                fontWeight: 600,
                letterSpacing: "0.08em",
                color: P.text,
              }}
            >
              GOME
            </span>
          </div>
          <p
            style={{
              fontFamily: body,
              fontSize: 14,
              color: P.muted,
              marginBottom: 28,
              lineHeight: 1.6,
            }}
          >
            Gallery of Memes. 4,004 NFTs. Ethereum.
            <br />
            PEPE · BONK · BRETT
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 28,
              marginBottom: 36,
              flexWrap: "wrap",
            }}
          >
            {[
              ["X / Twitter", X_URL],
              ["Whitelist", "#home"],
              ["Collection", "#collection"],
            ].map(([l, h]) => (
              <a
                key={l}
                href={h}
                target={h.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                style={{
                  fontFamily: body,
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(201,168,76,0.5)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = P.text)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color =
                    "rgba(201,168,76,0.5)")
                }
              >
                {l}
              </a>
            ))}
          </div>
          <p
            style={{
              fontFamily: body,
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(201,168,76,0.2)",
            }}
          >
            GOME — Gallery of Memes
          </p>
        </div>
      </footer>

      {/* ── Modal ── */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(0,0,0,0.88)",
            backdropFilter: "blur(16px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            overflowY: "auto",
            animation: "fadeIn 0.3s ease",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          {already ? (
            <div
              style={{
                width: "100%",
                maxWidth: 440,
                textAlign: "center",
                background: P.surface,
                border: `1px solid ${P.border}`,
                borderRadius: 24,
                padding: "48px 32px",
                animation: "scaleIn 0.4s ease",
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: P.goldDim,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  border: `1px solid ${P.gold}44`,
                }}
              >
                <svg
                  width="24"
                  height="18"
                  viewBox="0 0 24 18"
                  fill="none"
                >
                  <path
                    d="M2 9l7 7 13-13"
                    stroke={P.gold}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3
                style={{
                  fontFamily: display,
                  fontSize: 24,
                  color: P.text,
                  marginBottom: 8,
                  fontWeight: 600,
                }}
              >
                Already in.
              </h3>
              <p
                style={{
                  fontFamily: body,
                  fontSize: 14,
                  color: P.muted,
                  lineHeight: 1.6,
                }}
              >
                Your whitelist spot is locked. No need to apply again.
              </p>
            </div>
          ) : (
            <Whitelist onClose={() => setModalOpen(false)} />
          )}
        </div>
      )}
    </div>
  );
}

/* ── FAQ Item ── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${P.border}` }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "20px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <span
          style={{
            fontFamily: body,
            fontSize: 15,
            fontWeight: 600,
            color: open ? P.text : P.muted,
            textAlign: "left",
            transition: "color 0.2s",
            letterSpacing: "-0.01em",
          }}
        >
          {q}
        </span>
        <span
          style={{
            color: P.gold,
            fontSize: 18,
            fontFamily: display,
            flexShrink: 0,
            transition: "transform 0.25s",
            transform: open ? "rotate(45deg)" : "rotate(0)",
          }}
        >
          +
        </span>
      </button>
      {open && (
        <p
          style={{
            fontFamily: body,
            fontSize: 14,
            color: P.muted,
            padding: "0 0 20px",
            margin: 0,
            lineHeight: 1.7,
            animation: "fadeIn 0.2s ease",
          }}
        >
          {a}
        </p>
      )}
    </div>
  );
}
