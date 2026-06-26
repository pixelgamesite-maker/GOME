import { useState, useEffect, useRef, useCallback } from "react";

/* ── Backend ── */
const SHEET_URL = import.meta.env.VITE_SHEET_URL ?? "";

/* ── Assets ── */
const LOGO = "/GOME-LOGO.png";
const HERO_IMG = "/GOME-HERO.png";
const LORE_IMG = "/GOME-LORE.jpg";

/* ── Links ── */
const X_URL = "https://x.com/gomememes";
const PINNED_TWEET = "https://x.com/gomememes/status/1234567890";

/* ── Fonts ── */
const FONT_LINK =
  "https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap";

const display = "'Fredoka', sans-serif";
const body = "'Inter', 'Segoe UI', Arial, sans-serif";

/* ── Palette ── */
const C = {
  bg: "#050505",
  bgElevated: "#0a0a0a",
  card: "#111111",
  cardBorder: "rgba(255,255,255,0.06)",
  accent: "#D4A853",
  accentLight: "rgba(212,168,83,0.12)",
  accentGlow: "rgba(212,168,83,0.25)",
  text: "#ffffff",
  textMuted: "rgba(255,255,255,0.5)",
  textDim: "rgba(255,255,255,0.2)",
  success: "#22c55e",
  error: "#ef4444",
  pepe: "#3ddc52",
  bonk: "#f97316",
  brett: "#3b82f6",
};

/* ── Coin Data ── */
const COINS = [
  {
    id: "pepe",
    name: "PEPE",
    img: "/PEPE.PNG",
    color: "#3ddc52",
    tagline: "The original meme. The eternal vibe.",
    desc: "PEPE is the face of internet culture. 4,004 unique characters, each rarer than the next. No two frens alike.",
  },
  {
    id: "bonk",
    name: "BONK",
    img: "/BONK.PNG",
    color: "#f97316",
    tagline: "Bonk first. Ask questions never.",
    desc: "BONK energy is raw, chaotic, and unstoppable. 4,004 characters armed and ready. High energy. Maximum chaos.",
  },
  {
    id: "brett",
    name: "BRETT",
    img: "/BRETT.PNG",
    color: "#3b82f6",
    tagline: "Just a guy. With all the vibes.",
    desc: "Brett doesn't try hard. Brett just exists. 4,004 editions, each one chillin harder than the last. The king of Base.",
  },
];

const MINT_INFO = [
  { label: "Total Supply", value: "12,012" },
  { label: "Mint Price", value: "0.0009 ETH" },
  { label: "Blockchain", value: "Ethereum" },
  { label: "Marketplace", value: "OpenSea" },
  { label: "Launch", value: "TBA" },
];

/* ── Helpers ── */
function isValidEvm(a: string) {
  return /^0x[0-9a-fA-F]{40}$/.test(a.trim());
}
function isValidUrl(u: string) {
  try {
    const url = new URL(u.trim());
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

/* ── Scroll Reveal ── */
function useScrollReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ── Particle Canvas ── */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    let animId: number;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
    }

    const particles: Particle[] = [];
    const count = Math.min(80, Math.floor((w * h) / 15000));

    for (let i = 0; i < count; i++) {
      const isGold = Math.random() > 0.6;
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
        color: isGold ? C.accent : Math.random() > 0.5 ? "#6B3FA0" : "#ffffff",
      });
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = p.color;
        ctx!.globalAlpha = p.alpha;
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.strokeStyle = "rgba(212,168,83,0.08)";
            ctx!.lineWidth = 0.5;
            ctx!.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    }

    draw();

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}

/* ── Global Styles ── */
const globalStyles = `
  @import url('${FONT_LINK}');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: ${C.bg}; }
  ::selection { background: ${C.accent}; color: #000; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: ${C.bg}; }
  ::-webkit-scrollbar-thumb { background: rgba(212,168,83,0.25); border-radius: 10px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(212,168,83,0.4); }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.95); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(212,168,83,0.15); }
    50% { box-shadow: 0 0 40px rgba(212,168,83,0.3); }
  }

  .slide-up { animation: slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }
  .fade-in { animation: fadeIn 0.6s ease both; }
  .scale-in { animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }

  input:focus, textarea:focus {
    outline: none;
    border-color: ${C.accent} !important;
    box-shadow: 0 0 0 3px rgba(212,168,83,0.1) !important;
  }

  .btn-primary {
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    overflow: hidden;
  }
  .btn-primary::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    background-size: 200% 100%;
    opacity: 0;
    transition: opacity 0.3s;
  }
  .btn-primary:hover::after {
    opacity: 1;
    animation: shimmer 1.5s infinite;
  }
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(212,168,83,0.3);
  }

  .btn-task {
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .btn-task:hover {
    background: rgba(212,168,83,0.15) !important;
    border-color: ${C.accent} !important;
    transform: translateY(-1px);
  }

  .task-card {
    animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
`;

/* ── Field ── */
function Field({
  label,
  value,
  onChange,
  placeholder,
  error,
  as = "input",
  rows = 3,
  onBlur,
  onKeyDown,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  as?: "input" | "textarea";
  rows?: number;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}) {
  const shared: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.03)",
    border: `1px solid ${error ? C.error : "rgba(255,255,255,0.08)"}`,
    borderRadius: 10,
    color: "#fff",
    fontSize: 14,
    padding: "13px 16px",
    fontFamily: body,
    resize: "none",
    display: "block",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  return (
    <div style={{ marginBottom: 4 }}>
      <label
        style={{
          display: "block",
          fontSize: 11,
          fontWeight: 700,
          color: C.textMuted,
          marginBottom: 8,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontFamily: body,
        }}
      >
        {label}
      </label>
      {as === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          style={shared}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={shared}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
        />
      )}
      {error && (
        <p
          style={{
            color: C.error,
            fontSize: 12,
            marginTop: 6,
            fontWeight: 500,
            fontFamily: body,
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

/* ── Done Badge ── */
function DoneBadge() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: C.accentLight,
        border: `1px solid rgba(212,168,83,0.25)`,
        borderRadius: 8,
        padding: "5px 12px",
        fontSize: 10,
        fontWeight: 800,
        color: C.accent,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        fontFamily: body,
      }}
    >
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
        <path
          d="M2 6l3 3 5-5"
          stroke={C.accent}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      COMPLETED
    </span>
  );
}

/* ── Task Card ── */
function TaskCard({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <div
      className="task-card"
      style={{
        animationDelay: `${delay}ms`,
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${C.cardBorder}`,
        borderRadius: 16,
        padding: "24px 26px",
        backdropFilter: "blur(10px)",
      }}
    >
      {children}
    </div>
  );
}

/* ── Task Header ── */
function TaskHeader({
  num,
  title,
  subtitle,
  done,
}: {
  num: string;
  title: string;
  subtitle: string;
  done: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: done ? 0 : 18,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: done ? C.accentLight : "rgba(255,255,255,0.03)",
            border: `1px solid ${done ? "rgba(212,168,83,0.3)" : "rgba(255,255,255,0.08)"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 800,
            color: done ? C.accent : C.textDim,
            flexShrink: 0,
            transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            fontFamily: display,
          }}
        >
          {done ? (
            <svg
              width="14"
              height="14"
              viewBox="0 0 12 12"
              fill="none"
            >
              <path
                d="M2 6l3 3 5-5"
                stroke={C.accent}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            num
          )}
        </div>
        <div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: done ? C.accent : "#fff",
              transition: "color 0.3s",
              fontFamily: display,
              letterSpacing: "0.02em",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 12,
              color: C.textDim,
              marginTop: 2,
              fontWeight: 400,
              fontFamily: body,
            }}
          >
            {subtitle}
          </div>
        </div>
      </div>
      {done && <DoneBadge />}
    </div>
  );
}

/* ── Whitelist Modal ── */
function WhitelistModal({ onClose }: { onClose: () => void }) {
  const [twitter, setTwitter] = useState("");
  const [quoteUrl, setQuoteUrl] = useState("");
  const [wallet, setWallet] = useState("");
  const [tasks, setTasks] = useState<Record<string, boolean>>({});
  const [twitterConfirmed, setTwitterConfirmed] = useState(false);
  const [quoteConfirmed, setQuoteConfirmed] = useState(false);
  const [walletConfirmed, setWalletConfirmed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const c1 = twitterConfirmed && twitter.trim().length > 1;
  const c2 = !!tasks["follow"];
  const c3 = !!tasks["like"];
  const c4 = quoteConfirmed && isValidUrl(quoteUrl);
  const c5 = walletConfirmed && isValidEvm(wallet);
  const allDone = c1 && c2 && c3 && c4 && c5;

  const openAndMark = (url: string, onDone: () => void) => {
    window.open(url, "_blank", "noopener,noreferrer");
    setTimeout(onDone, 1200);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!twitter.trim()) e.twitter = "Enter your X handle.";
    if (!c2) e.follow = "Follow @gomememes first.";
    if (!c3) e.like = "Like and repost the pinned tweet first.";
    if (!quoteUrl.trim()) e.quoteUrl = "Paste your quote link.";
    else if (!isValidUrl(quoteUrl)) e.quoteUrl = "Enter a valid URL.";
    if (!wallet.trim()) e.wallet = "Enter your EVM wallet address.";
    else if (!isValidEvm(wallet)) e.wallet = "Invalid address — must be 0x + 40 hex chars.";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const res = await fetch(SHEET_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          wallet: wallet.trim(),
          twitter: twitter.trim().replace(/^@/, ""),
          quote_url: quoteUrl.trim(),
          timestamp: new Date().toISOString(),
        }),
      });
      const json = await res.json();
      if (json.result === "success") {
        setSubmitted(true);
        localStorage.setItem("gome_submitted", "true");
      } else {
        throw new Error("Sheet error");
      }
    } catch {
      setErrors({ submit: "Something went wrong. Try again." });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div
        className="scale-in"
        style={{
          background: C.card,
          borderRadius: 20,
          border: `1px solid ${C.cardBorder}`,
          padding: "40px 32px",
          textAlign: "center",
          maxWidth: 440,
          width: "100%",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 18,
            background: C.accentLight,
            border: `1px solid rgba(212,168,83,0.25)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            fontSize: 28,
            fontFamily: display,
            color: C.accent,
          }}
        >
          GO
        </div>
        <h3
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#fff",
            marginBottom: 8,
            fontFamily: display,
            letterSpacing: "0.02em",
          }}
        >
          Welcome to the gallery.
        </h3>
        <p
          style={{
            fontSize: 14,
            color: C.textMuted,
            lineHeight: 1.7,
            fontFamily: body,
          }}
        >
          Your whitelist spot is secured. Selected wallets will be notified before
          mint opens.
        </p>
      </div>
    );
  }

  return (
    <div
      className="scale-in"
      style={{
        background: C.card,
        borderRadius: 20,
        border: `1px solid ${C.cardBorder}`,
        padding: "32px 28px",
        maxWidth: 520,
        width: "100%",
        maxHeight: "85vh",
        overflowY: "auto",
        position: "relative",
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          background: "transparent",
          border: "none",
          color: C.textDim,
          fontSize: 22,
          cursor: "pointer",
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
          transition: "all 0.2s",
          fontFamily: body,
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(255,255,255,0.05)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "transparent")
        }
      >
        ✕
      </button>

      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: C.accent,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: 10,
            fontFamily: body,
          }}
        >
          Whitelist Application
        </p>
        <h2
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: "#fff",
            marginBottom: 6,
            fontFamily: display,
            letterSpacing: "0.02em",
          }}
        >
          Join the Gallery
        </h2>
        <p
          style={{
            fontSize: 13,
            color: C.textMuted,
            lineHeight: 1.6,
            fontFamily: body,
          }}
        >
          Complete each step below. The next unlocks when you finish the last.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Step 1 */}
        <TaskCard delay={0}>
          <TaskHeader
            num="01"
            title="Your X Handle"
            subtitle="So we know who you are"
            done={c1}
          />
          {!c1 && (
            <Field
              label=""
              value={twitter}
              onChange={(v) => {
                setTwitter(v);
                setErrors((e) => ({ ...e, twitter: "" }));
              }}
              placeholder="@yourhandle"
              error={errors.twitter}
              onBlur={() => {
                if (twitter.trim()) setTwitterConfirmed(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && twitter.trim())
                  setTwitterConfirmed(true);
              }}
            />
          )}
        </TaskCard>

        {/* Step 2 */}
        {c1 && (
          <TaskCard delay={60}>
            <TaskHeader
              num="02"
              title="Follow @gomememes"
              subtitle="Join the crew"
              done={c2}
            />
            {!c2 && (
              <>
                <button
                  className="btn-task"
                  onClick={() =>
                    openAndMark(X_URL, () =>
                      setTasks((p) => ({ ...p, follow: true }))
                    )
                  }
                  style={{
                    width: "100%",
                    padding: "12px 0",
                    background: C.accentLight,
                    border: `1px solid rgba(212,168,83,0.25)`,
                    borderRadius: 10,
                    color: C.accent,
                    fontFamily: body,
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                    letterSpacing: "0.04em",
                  }}
                >
                  Follow on X →
                </button>
                {errors.follow && (
                  <p
                    style={{
                      color: C.error,
                      fontSize: 12,
                      marginTop: 8,
                      fontFamily: body,
                    }}
                  >
                    {errors.follow}
                  </p>
                )}
              </>
            )}
          </TaskCard>
        )}

        {/* Step 3 */}
        {c2 && (
          <TaskCard delay={60}>
            <TaskHeader
              num="03"
              title="Like & Repost"
              subtitle="Show some love"
              done={c3}
            />
            {!c3 && (
              <>
                <button
                  className="btn-task"
                  onClick={() =>
                    openAndMark(PINNED_TWEET, () =>
                      setTasks((p) => ({ ...p, like: true }))
                    )
                  }
                  style={{
                    width: "100%",
                    padding: "12px 0",
                    marginBottom: 14,
                    background: C.accentLight,
                    border: `1px solid rgba(212,168,83,0.25)`,
                    borderRadius: 10,
                    color: C.accent,
                    fontFamily: body,
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                    letterSpacing: "0.04em",
                  }}
                >
                  View Pinned Tweet →
                </button>
                {errors.like && (
                  <p
                    style={{
                      color: C.error,
                      fontSize: 12,
                      marginTop: 8,
                      fontFamily: body,
                    }}
                  >
                    {errors.like}
                  </p>
                )}
              </>
            )}
          </TaskCard>
        )}

        {/* Step 4 */}
        {c3 && (
          <TaskCard delay={60}>
            <TaskHeader
              num="04"
              title="Quote the Post"
              subtitle="Spread the word"
              done={c4}
            />
            <Field
              label="Paste your quote link"
              value={quoteUrl}
              onChange={(v) => {
                setQuoteUrl(v);
                setErrors((e) => ({ ...e, quoteUrl: "" }));
              }}
              placeholder="https://x.com/..."
              error={errors.quoteUrl}
              onBlur={() => {
                if (isValidUrl(quoteUrl)) setQuoteConfirmed(true);
              }}
            />
            {!c4 && isValidUrl(quoteUrl) && (
              <button
                onClick={() => setQuoteConfirmed(true)}
                style={{
                  marginTop: 8,
                  width: "100%",
                  background: C.accent,
                  color: "#000",
                  border: "none",
                  borderRadius: 6,
                  padding: "7px",
                  fontFamily: body,
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Verify
              </button>
            )}
          </TaskCard>
        )}

        {/* Step 5 */}
        {c4 && (
          <TaskCard delay={60}>
            <TaskHeader
              num="05"
              title="Wallet Address"
              subtitle="Where your meme lands"
              done={c5}
            />
            <Field
              label=""
              value={wallet}
              onChange={(v) => {
                setWallet(v);
                setErrors((e) => ({ ...e, wallet: "" }));
              }}
              placeholder="0x..."
              error={errors.wallet}
              onBlur={() => {
                if (isValidEvm(wallet)) setWalletConfirmed(true);
              }}
            />
            {!c5 && isValidEvm(wallet) && (
              <button
                onClick={() => setWalletConfirmed(true)}
                style={{
                  marginTop: 8,
                  width: "100%",
                  background: C.accent,
                  color: "#000",
                  border: "none",
                  borderRadius: 6,
                  padding: "7px",
                  fontFamily: body,
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Confirm Wallet
              </button>
            )}
          </TaskCard>
        )}

        {/* Submit */}
        {c4 && (
          <div
            className="task-card"
            style={{ animationDelay: "80ms", marginTop: 4 }}
          >
            {errors.submit && (
              <p
                style={{
                  color: C.error,
                  fontSize: 13,
                  marginBottom: 14,
                  textAlign: "center",
                  fontWeight: 500,
                  fontFamily: body,
                }}
              >
                {errors.submit}
              </p>
            )}
            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={submitting || !allDone}
              style={{
                width: "100%",
                padding: "16px",
                background: allDone ? C.accent : "rgba(255,255,255,0.04)",
                borderRadius: 12,
                border: "none",
                color: allDone ? "#000" : "rgba(255,255,255,0.18)",
                fontFamily: body,
                fontWeight: 800,
                fontSize: 14,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor:
                  allDone && !submitting ? "pointer" : "not-allowed",
                boxShadow: allDone
                  ? "0 4px 24px rgba(212,168,83,0.25)"
                  : "none",
                opacity: submitting ? 0.6 : 1,
                transition: "all 0.3s ease",
              }}
            >
              {submitting
                ? "Securing your spot..."
                : "Secure My Spot"}
            </button>
            <p
              style={{
                textAlign: "center",
                fontSize: 11,
                color: C.textDim,
                marginTop: 12,
                fontFamily: body,
              }}
            >
              Double-check your wallet before submitting.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Coin Card ── */
function CoinCard({
  coin,
  index,
}: {
  coin: (typeof COINS)[0];
  index: number;
}) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      style={{
        background: "rgba(255,255,255,0.015)",
        border: `1px solid ${C.cardBorder}`,
        borderRadius: 20,
        padding: "32px 28px",
        textAlign: "center",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${coin.color}33`;
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = `0 20px 50px ${coin.color}11`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = C.cardBorder;
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${coin.color}10 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          width: "160px",
          height: "160px",
          margin: "0 auto 24px",
          borderRadius: "20px",
          background: `${coin.color}10`,
          border: `2px solid ${coin.color}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          position: "relative",
          zIndex: 1,
        }}
      >
        <img
          src={coin.img}
          alt={coin.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            padding: "16px",
          }}
        />
      </div>
      <h3
        style={{
          fontFamily: display,
          fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
          color: coin.color,
          marginBottom: 8,
          letterSpacing: "0.04em",
          position: "relative",
          zIndex: 1,
        }}
      >
        {coin.name}
      </h3>
      <p
        style={{
          fontFamily: display,
          fontSize: "1rem",
          color: "#fff",
          marginBottom: 12,
          position: "relative",
          zIndex: 1,
          fontWeight: 600,
        }}
      >
        {coin.tagline}
      </p>
      <p
        style={{
          fontFamily: body,
          fontSize: "0.9rem",
          color: C.textMuted,
          lineHeight: 1.7,
          position: "relative",
          zIndex: 1,
        }}
      >
        {coin.desc}
      </p>
    </div>
  );
}

/* ── FAQ Item ── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${C.cardBorder}` }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "18px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <span
          style={{
            fontFamily: body,
            fontSize: "1rem",
            fontWeight: 700,
            color: open ? "#fff" : C.textMuted,
            textAlign: "left",
            transition: "color 0.2s",
          }}
        >
          {q}
        </span>
        <span
          style={{
            color: C.accent,
            fontSize: "1.2rem",
            flexShrink: 0,
            transition: "transform 0.25s",
            transform: open ? "rotate(45deg)" : "rotate(0)",
            fontFamily: display,
          }}
        >
          +
        </span>
      </button>
      {open && (
        <p
          style={{
            fontFamily: body,
            fontSize: "0.9rem",
            color: C.textMuted,
            padding: "0 0 18px",
            margin: 0,
            lineHeight: 1.7,
            fontWeight: 400,
          }}
        >
          {a}
        </p>
      )}
    </div>
  );
}

/* ════════════════════ MAIN ════════════════════ */
export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("gome_submitted") === "true")
      setAlreadySubmitted(true);

    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = FONT_LINK;
    document.head.appendChild(l);

    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      style={{
        background: C.bg,
        minHeight: "100vh",
        color: "#fff",
        overflowX: "hidden",
        fontFamily: body,
      }}
    >
      <style>{globalStyles}</style>

      {/* ── Navigation ── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: scrolled ? "rgba(5,5,5,0.9)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled
            ? `1px solid ${C.cardBorder}`
            : "1px solid transparent",
          padding: "0 32px",
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
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
          <img
            src={LOGO}
            alt="GOME"
            style={{ height: 36, width: 36, objectFit: "contain" }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <span
            style={{
              fontFamily: display,
              fontWeight: 700,
              fontSize: 22,
              letterSpacing: "0.08em",
              color: "#fff",
            }}
          >
            GOME
          </span>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "120px 24px 80px",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <ParticleCanvas />

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "40%",
            background: "linear-gradient(to top, #050505, transparent)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        <div
          style={{ position: "relative", zIndex: 3, maxWidth: 640 }}
        >
          <div
            className="slide-up"
            style={{
              width: 260,
              height: 260,
              margin: "0 auto 32px",
              borderRadius: 24,
              background: `linear-gradient(135deg, rgba(107,63,160,0.15), rgba(212,168,83,0.1))`,
              border: `1px solid rgba(255,255,255,0.06)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(212,168,83,0.08)",
              animationDelay: "0ms",
            }}
          >
            <img
              src={HERO_IMG}
              alt="GOME Hero"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 24,
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
                const parent = (e.target as HTMLImageElement)
                  .parentElement;
                if (parent)
                  parent.innerHTML =
                    '<span style="font-family:Fredoka,sans-serif;font-size:64px;color:#D4A853;">GO</span>';
              }}
            />
          </div>

          <div
            className="slide-up"
            style={{ animationDelay: "150ms" }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: C.accent,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: 16,
                fontFamily: body,
              }}
            >
              Gallery of Memes — 12,012 NFTs on Ethereum
            </p>
          </div>

          <h1
            className="slide-up"
            style={{
              fontFamily: display,
              fontSize: "clamp(3.5rem, 10vw, 6rem)",
              fontWeight: 700,
              lineHeight: 1.05,
              color: "#fff",
              marginBottom: 20,
              letterSpacing: "-0.02em",
              animationDelay: "250ms",
            }}
          >
            GOME
          </h1>

          <p
            className="slide-up"
            style={{
              fontSize: 16,
              color: C.textMuted,
              lineHeight: 1.75,
              maxWidth: 480,
              margin: "0 auto 36px",
              animationDelay: "350ms",
              fontFamily: body,
            }}
          >
            The meme coins you love — now as NFTs. Pepe, Bonk, and Brett.
            4,004 each. One collection. Zero apologies.
          </p>

          <div
            className="slide-up"
            style={{ animationDelay: "450ms" }}
          >
            <button
              className="btn-primary"
              onClick={() => setModalOpen(true)}
              style={{
                padding: "16px 48px",
                background: C.accent,
                borderRadius: 14,
                border: "none",
                color: "#000",
                fontFamily: body,
                fontWeight: 800,
                fontSize: 15,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                cursor: "pointer",
                boxShadow: "0 4px 24px rgba(212,168,83,0.25)",
              }}
            >
              Apply for Whitelist
            </button>
          </div>
        </div>

        {/* Scroll hint */}
        <div
          className="fade-in"
          style={{
            position: "absolute",
            bottom: 32,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 3,
            animationDelay: "1s",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            opacity: 0.4,
          }}
        >
          <span
            style={{
              fontFamily: body,
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: C.accent,
              fontWeight: 700,
            }}
          >
            Scroll
          </span>
          <div
            style={{
              width: 1,
              height: 28,
              background: `linear-gradient(180deg, ${C.accent}, transparent)`,
            }}
          />
        </div>
      </section>

      {/* ── The Memes ── */}
      <section
        style={{
          padding: "100px 24px",
          background: "linear-gradient(180deg, #050505 0%, #0a0a0a 50%, #050505 100%)",
          position: "relative",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div
            className="slide-up"
            style={{ textAlign: "center", marginBottom: 60 }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: C.accent,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: 14,
                fontFamily: body,
              }}
            >
              The Collection
            </p>
            <h2
              style={{
                fontFamily: display,
                fontSize: "clamp(2rem, 5vw, 3rem)",
                fontWeight: 700,
                color: "#fff",
                marginBottom: 16,
                letterSpacing: "-0.02em",
              }}
            >
              Meet the{" "}
              <span style={{ color: C.accent }}>Memes</span>
            </h2>
            <p
              style={{
                fontSize: 16,
                color: C.textMuted,
                lineHeight: 1.8,
                maxWidth: 520,
                margin: "0 auto",
                fontFamily: body,
              }}
            >
              Three legends. One gallery. Hand-crafted characters built
              for the culture.
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
            {COINS.map((coin, i) => (
              <CoinCard key={coin.id} coin={coin} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Mint Info ── */}
      <section
        style={{
          padding: "100px 24px",
          background: C.bg,
          borderTop: `1px solid ${C.cardBorder}`,
          borderBottom: `1px solid ${C.cardBorder}`,
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div
            className="slide-up"
            style={{ textAlign: "center", marginBottom: 48 }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: C.accent,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: 14,
                fontFamily: body,
              }}
            >
              Mint Details
            </p>
            <h2
              style={{
                fontFamily: display,
                fontSize: "clamp(2rem, 5vw, 3rem)",
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "-0.02em",
              }}
            >
              The{" "}
              <span style={{ color: C.accent }}>Specs</span>
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 16,
            }}
          >
            {MINT_INFO.map((item, i) => (
              <div
                key={i}
                className="slide-up"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: `1px solid ${C.cardBorder}`,
                  borderRadius: 16,
                  padding: "28px 20px",
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  animationDelay: `${i * 100}ms`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor =
                    "rgba(212,168,83,0.2)";
                  e.currentTarget.style.transform =
                    "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = C.cardBorder;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontFamily: display,
                    fontSize: "1.5rem",
                    color: C.accent,
                    letterSpacing: "0.04em",
                    marginBottom: 8,
                  }}
                >
                  {item.value}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontFamily: body,
                    fontSize: "0.65rem",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: C.textDim,
                    fontWeight: 700,
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
          padding: "100px 24px",
          background: C.bgElevated,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            maxWidth: 1000,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: 60,
            flexWrap: "wrap",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              flex: "1 1 300px",
              borderRadius: 20,
              overflow: "hidden",
              border: `1px solid ${C.cardBorder}`,
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
          >
            <img
              src={LORE_IMG}
              alt="GOME Lore"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
          <div style={{ flex: "1 1 400px" }}>
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: C.accent,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: 14,
                fontFamily: body,
              }}
            >
              The Lore
            </p>
            <h2
              style={{
                fontFamily: display,
                fontSize: "clamp(2rem, 5vw, 3rem)",
                fontWeight: 700,
                color: "#fff",
                marginBottom: 20,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              From the trenches to the{" "}
              <span style={{ color: C.accent }}>chain.</span>
            </h2>
            <p
              style={{
                fontSize: 16,
                color: C.textMuted,
                lineHeight: 1.8,
                marginBottom: 16,
                fontFamily: body,
              }}
            >
              GOME started as a joke in a group chat. Three meme coins,
              three communities, one question: what if we put them all in
              one place?
            </p>
            <p
              style={{
                fontSize: 16,
                color: C.textMuted,
                lineHeight: 1.8,
                fontFamily: body,
              }}
            >
              Now it's a 12,012-piece collection on Ethereum. No roadmap
              promises. No utility fluff. Just art, culture, and the
              memes that got us here.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        style={{
          padding: "100px 24px",
          textAlign: "center",
          background: C.bg,
          borderTop: `1px solid ${C.cardBorder}`,
        }}
      >
        <div
          className="slide-up"
          style={{ maxWidth: 500, margin: "0 auto" }}
        >
          <h2
            style={{
              fontFamily: display,
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 700,
              color: "#fff",
              marginBottom: 14,
              letterSpacing: "-0.02em",
            }}
          >
            Ready to join the{" "}
            <span style={{ color: C.accent }}>gallery?</span>
          </h2>
          <p
            style={{
              fontSize: 16,
              color: C.textMuted,
              lineHeight: 1.7,
              marginBottom: 28,
              fontFamily: body,
            }}
          >
            Spots are limited. Complete the whitelist missions to secure
            your place.
          </p>
          <button
            className="btn-primary"
            onClick={() => setModalOpen(true)}
            style={{
              padding: "16px 48px",
              background: C.accent,
              borderRadius: 14,
              border: "none",
              color: "#000",
              fontFamily: body,
              fontWeight: 800,
              fontSize: 15,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              cursor: "pointer",
              boxShadow: "0 4px 24px rgba(212,168,83,0.25)",
            }}
          >
            Join the Gallery
          </button>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ background: C.bg, padding: "80px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: display,
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 700,
              color: "#fff",
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
              "Gallery of Memes — a 12,012 supply NFT collection featuring Pepe, Bonk, and Brett characters on Ethereum.",
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
              "12,012 total — 4,004 for each meme character.",
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
          background: "#060606",
          borderTop: `1px solid ${C.cardBorder}`,
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
            <img
              src={LOGO}
              alt="GOME"
              style={{ height: 32, width: 32, objectFit: "contain" }}
            />
            <span
              style={{
                fontFamily: display,
                fontWeight: 700,
                fontSize: 20,
                letterSpacing: "0.1em",
                color: "#fff",
              }}
            >
              GOME
            </span>
          </div>
          <p
            style={{
              fontSize: 14,
              color: C.textMuted,
              marginBottom: 28,
              fontFamily: body,
              lineHeight: 1.7,
            }}
          >
            Gallery of Memes. 12,012 NFTs. Ethereum.
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
              ["PEPE", "#pepe"],
              ["BONK", "#bonk"],
              ["BRETT", "#brett"],
            ].map(([l, h]) => (
              <a
                key={l}
                href={h}
                target={h.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                style={{
                  fontFamily: body,
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(212,168,83,0.5)",
                  transition: "color 0.2s",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "#fff")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color =
                    "rgba(212,168,83,0.5)")
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
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "rgba(212,168,83,0.25)",
            }}
          >
            GOME — Gallery of Memes
          </p>
        </div>
      </footer>

      {/* ── Modal ── */}
      {modalOpen && (
        <div
          className="fade-in"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            overflowY: "auto",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          {alreadySubmitted ? (
            <div
              className="scale-in"
              style={{
                background: C.card,
                borderRadius: 20,
                border: `1px solid ${C.cardBorder}`,
                padding: "40px 32px",
                textAlign: "center",
                maxWidth: 440,
                width: "100%",
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 18,
                  background: C.accentLight,
                  border: `1px solid rgba(212,168,83,0.25)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  fontSize: 28,
                  fontFamily: display,
                  color: C.accent,
                }}
              >
                GO
              </div>
              <h3
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#fff",
                  marginBottom: 8,
                  fontFamily: display,
                }}
              >
                Already in the gallery.
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: C.textMuted,
                  lineHeight: 1.7,
                  fontFamily: body,
                }}
              >
                You've already secured your whitelist spot. No need to
                submit again.
              </p>
            </div>
          ) : (
            <WhitelistModal onClose={() => setModalOpen(false)} />
          )}
        </div>
      )}
    </div>
  );
}
