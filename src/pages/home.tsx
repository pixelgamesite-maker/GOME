import { useState, useEffect, useRef } from "react";

/* ── Google Apps Script Web App URL ── */
/* Paste your deployed Apps Script URL here after setup */
const SHEET_URL = import.meta.env.VITE_SHEET_URL ?? "";

/* ── Fonts ── */
const FONT_LINK =
  "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Bangers&display=swap";

const display = "'Bangers', cursive";
const body    = "'Nunito', 'Segoe UI', Arial, sans-serif";

/* ── Links ── */
const X_URL          = "https://x.com/gomememes";
const PINNED_TWEET   = "https://x.com/gomememes/status/1234567890";

/* ── Meme coin data ── */
const COINS = [
  {
    id: "pepe",
    name: "PEPE",
    img: "/PEPE.png",
    bg: "#1a3a1a",
    accent: "#3ddc52",
    accentDark: "#2ab83f",
    textOnAccent: "#0a1a0a",
    tagline: "The original meme. The eternal vibe.",
    desc: [
      "PEPE is the face of internet culture — green, eternal, and completely unserious.",
      "Born from the deepest corners of the web, PEPE transcended meme-dom to become a cultural icon traded on-chain.",
      "4,004 unique Pepe characters. Each one rarer than the next. No two frens alike.",
    ],
    stats: [["4,004","Supply"],["0.0009 ETH","Mint Price"],["ETH","Chain"],["OpenSea","Marketplace"]],
    badge: "🐸 Rare Frens",
    emoji: "🐸",
  },
  {
    id: "bonk",
    name: "BONK",
    img: "/BONK.png",
    bg: "#2e1800",
    accent: "#f97316",
    accentDark: "#ea6700",
    textOnAccent: "#1a0800",
    tagline: "Bonk first. Ask questions never.",
    desc: [
      "BONK energy is raw, chaotic, and completely unstoppable. The bat swings and the market follows.",
      "Born on Solana, adopted everywhere — BONK is the meme that punched its way into the top tier.",
      "4,004 Bonk characters armed and ready. High energy. Low IQ. Maximum chaos.",
    ],
    stats: [["4,004","Supply"],["0.0009 ETH","Mint Price"],["ETH","Chain"],["OpenSea","Marketplace"]],
    badge: "🏏 Maximum Chaos",
    emoji: "🏏",
  },
  {
    id: "brett",
    name: "BRETT",
    img: "/BRETT.png",
    bg: "#0d1a2e",
    accent: "#3b82f6",
    accentDark: "#2563eb",
    textOnAccent: "#ffffff",
    tagline: "Just a guy. With all the vibes.",
    desc: [
      "Brett doesn't try hard. Brett just exists — and somehow that's enough to move markets.",
      "The laid-back king of Base chain. Simple design, massive community, zero apologies.",
      "4,004 Brett editions. Each one chillin harder than the last.",
    ],
    stats: [["4,004","Supply"],["0.0009 ETH","Mint Price"],["ETH","Chain"],["OpenSea","Marketplace"]],
    badge: "😎 Chill Gang",
    emoji: "😎",
  },
];

/* ── Helpers ── */
function isValidEvm(a: string) { return /^0x[0-9a-fA-F]{40}$/.test(a.trim()); }
function isValidUrl(u: string) {
  try {
    const url = new URL(u.trim());
    return url.protocol === "https:" || url.protocol === "http:";
  } catch { return false; }
}

/* ── Scroll reveal ── */
function useScrollReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ── Floating emoji particle ── */
function FloatingEmojis({ emojis, color }: { emojis: string[]; color: string }) {
  const items = Array.from({ length: 12 }, (_, i) => ({
    emoji: emojis[i % emojis.length],
    left: `${Math.random() * 90 + 5}%`,
    delay: `${Math.random() * 6}s`,
    duration: `${6 + Math.random() * 6}s`,
    size: `${1 + Math.random() * 1.2}rem`,
    opacity: 0.12 + Math.random() * 0.15,
  }));

  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none", zIndex:0 }}>
      {items.map((p, i) => (
        <span key={i} style={{
          position:"absolute", bottom:"-40px", left: p.left,
          fontSize: p.size, opacity: p.opacity,
          animation: `floatUp ${p.duration} ${p.delay} linear infinite`,
          color,
        }}>{p.emoji}</span>
      ))}
    </div>
  );
}

/* ── Coin section ── */
function CoinSection({ coin, index }: { coin: typeof COINS[0]; index: number }) {
  const { ref, visible } = useScrollReveal();
  const isEven = index % 2 === 0;

  return (
    <section
      id={coin.id}
      ref={ref}
      style={{
        background: coin.bg,
        padding: "100px 0",
        position: "relative",
        overflow: "hidden",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(50px)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
      }}
    >
      <FloatingEmojis emojis={[coin.emoji, "✨", "💫"]} color={coin.accent} />

      {/* Glow blob */}
      <div style={{
        position:"absolute", top:"50%", [isEven ? "left" : "right"]:"10%",
        transform:"translateY(-50%)",
        width:"400px", height:"400px", borderRadius:"50%",
        background:`radial-gradient(circle,${coin.accent}18 0%,transparent 70%)`,
        pointerEvents:"none", zIndex:0,
      }} />

      <div style={{
        maxWidth:"1000px", margin:"0 auto", padding:"0 24px",
        display:"flex", flexDirection: isEven ? "row" : "row-reverse",
        alignItems:"center", gap:"60px", position:"relative", zIndex:1,
        flexWrap:"wrap",
      }}>
        {/* Image */}
        <div style={{ flex:"0 0 280px", display:"flex", justifyContent:"center" }}>
          <div style={{
            width:"260px", height:"260px", borderRadius:"24px",
            background:`${coin.accent}15`,
            border:`3px solid ${coin.accent}55`,
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:`0 0 60px ${coin.accent}33, 0 20px 60px rgba(0,0,0,0.5)`,
            animation:"coinBob 3s ease-in-out infinite",
            overflow:"hidden",
          }}>
            <img src={coin.img} alt={coin.name}
              style={{ width:"100%", height:"100%", objectFit:"contain", padding:"20px" }}
            />
          </div>
        </div>

        {/* Content */}
        <div style={{ flex:1, minWidth:"280px" }}>
          <div style={{
            display:"inline-block", background:`${coin.accent}22`,
            border:`1px solid ${coin.accent}55`, borderRadius:"999px",
            padding:"4px 14px", marginBottom:"16px",
          }}>
            <span style={{ fontFamily:body, fontSize:"0.72rem", fontWeight:700,
              letterSpacing:"0.12em", textTransform:"uppercase", color:coin.accent }}>
              {coin.badge}
            </span>
          </div>

          <h2 style={{
            fontFamily:display, fontSize:"clamp(4rem,10vw,7rem)",
            color:coin.accent, margin:"0 0 8px", letterSpacing:"0.05em",
            textShadow:`0 0 40px ${coin.accent}66`,
            lineHeight:1,
          }}>
            {coin.name}
          </h2>

          <p style={{
            fontFamily:body, fontWeight:800, fontSize:"clamp(1rem,2.5vw,1.25rem)",
            color:"rgba(255,255,255,0.85)", margin:"0 0 24px", lineHeight:1.4,
          }}>
            {coin.tagline}
          </p>

          <div style={{ display:"flex", flexDirection:"column", gap:"12px", marginBottom:"32px" }}>
            {coin.desc.map((d, i) => (
              <p key={i} style={{
                fontFamily:body, fontSize:"0.95rem", color:"rgba(255,255,255,0.55)",
                margin:0, lineHeight:1.7,
                paddingLeft:"16px",
                borderLeft:`3px solid ${coin.accent}44`,
              }}>{d}</p>
            ))}
          </div>

          {/* Stats */}
          <div style={{
            display:"grid", gridTemplateColumns:"repeat(4,1fr)",
            border:`1px solid ${coin.accent}22`, borderRadius:"12px",
            overflow:"hidden", background:"rgba(0,0,0,0.25)",
            backdropFilter:"blur(8px)",
          }}>
            {coin.stats.map(([val, lbl], i) => (
              <div key={i} style={{
                padding:"14px 10px", textAlign:"center",
                borderLeft: i > 0 ? `1px solid ${coin.accent}18` : "none",
              }}>
                <p style={{ margin:0, fontFamily:display, fontSize:"1.1rem",
                  color:coin.accent, letterSpacing:"0.04em" }}>{val}</p>
                <p style={{ margin:"3px 0 0", fontFamily:body, fontSize:"0.52rem",
                  letterSpacing:"0.16em", textTransform:"uppercase",
                  color:"rgba(255,255,255,0.28)", fontWeight:700 }}>{lbl}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Flip card (reused from original, adapted) ── */
function FlipCard({ index, icon, title, subtitle, done, locked, children, onFlip }: {
  index: number; icon: string; title: string; subtitle: string;
  done: boolean; locked: boolean; children?: React.ReactNode; onFlip?: () => void;
}) {
  const [flipped, setFlipped] = useState(false);
  useEffect(() => { if (done) setFlipped(true); }, [done]);

  function handleClick() {
    if (locked || flipped) return;
    setFlipped(true); onFlip?.();
  }

  const accent = "#f59e0b";

  return (
    <div onClick={handleClick} style={{
      perspective: "1000px",
      cursor: locked ? "not-allowed" : flipped ? "default" : "pointer",
    }}>
      <div style={{
        position: "relative", transformStyle: "preserve-3d",
        transition: "transform 0.6s cubic-bezier(0.23,1,0.32,1)",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0)",
      }}>
        {/* FRONT */}
        <div style={{
          backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
          position: flipped ? "absolute" : "relative", inset: 0,
          background: "rgba(255,255,255,0.06)",
          border: `2px solid ${done ? accent + "66" : locked ? "rgba(255,255,255,0.06)" : accent + "33"}`,
          borderRadius: "14px", padding: "18px 14px",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: "8px", minHeight: "130px", opacity: locked ? 0.4 : 1,
        }}>
          <span style={{ fontSize: "1.6rem" }}>{locked ? "🔒" : icon}</span>
          <p style={{ margin: 0, fontFamily: body, fontSize: "0.88rem", fontWeight: 800,
            color: locked ? "rgba(255,255,255,0.2)" : "#fff", textAlign: "center" }}>{title}</p>
          {!locked && <p style={{ margin: 0, fontFamily: body, fontSize: "0.6rem",
            color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Tap to open
          </p>}
        </div>

        {/* BACK */}
        <div style={{
          backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          position: flipped ? "relative" : "absolute", inset: 0,
          background: done ? "rgba(245,158,11,0.08)" : "rgba(255,255,255,0.06)",
          border: `2px solid ${done ? accent + "55" : accent + "22"}`,
          borderRadius: "14px", padding: "14px 12px", minHeight: "130px",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <div>
              <p style={{ margin: 0, fontFamily: body, fontSize: "0.85rem", fontWeight: 800, color: "#fff" }}>{title}</p>
              <p style={{ margin: "1px 0 0", fontFamily: body, fontSize: "0.58rem",
                color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{subtitle}</p>
            </div>
            {done && (
              <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: accent,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════ MAIN ════════════════════ */
export default function Home() {
  const [modalOpen,         setModalOpen]         = useState(false);
  const [twitter,           setTwitter]           = useState("");
  const [wallet,            setWallet]            = useState("");
  const [quoteUrl,          setQuoteUrl]          = useState("");
  const [tasks,             setTasks]             = useState<Record<string, boolean>>({});
  const [sending,           setSending]           = useState(false);
  const [success,           setSuccess]           = useState(false);
  const [err,               setErr]               = useState("");
  const [ready,             setReady]             = useState(false);
  const [alreadySubmitted,  setAlreadySubmitted]  = useState(false);
  const [twitterConfirmed,  setTwitterConfirmed]  = useState(false);
  const [quoteConfirmed,    setQuoteConfirmed]    = useState(false);
  const [walletConfirmed,   setWalletConfirmed]   = useState(false);

  const c1 = twitterConfirmed && twitter.trim().length > 1;
  const c2 = !!tasks["like"];
  const c3 = quoteConfirmed && isValidUrl(quoteUrl);
  const c4 = walletConfirmed && isValidEvm(wallet);
  const allDone = c1 && c2 && c3 && c4;

  const accent = "#f59e0b";
  const accentLight = "#fbbf24";

  useEffect(() => {
    const l = document.createElement("link"); l.rel = "stylesheet"; l.href = FONT_LINK;
    document.head.appendChild(l);
    try {
      const s = localStorage.getItem("gome_v1");
      if (s) {
        const p = JSON.parse(s);
        setTasks(p.tasks ?? {});
        setWallet(p.wallet ?? "");
        setTwitter(p.twitter ?? "");
        setQuoteUrl(p.quoteUrl ?? "");
      }
      if (localStorage.getItem("gome_submitted") === "true") setAlreadySubmitted(true);
    } catch {}
    setTimeout(() => setReady(true), 80);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem("gome_v1", JSON.stringify({ tasks, wallet, twitter, quoteUrl }));
  }, [tasks, wallet, twitter, quoteUrl, ready]);

  async function submit() {
    if (!allDone) { setErr("Complete all missions first."); return; }
    if (alreadySubmitted) { setErr("You already applied!"); return; }
    if (!SHEET_URL) { setErr("Sheet URL not configured — check VITE_SHEET_URL."); return; }
    setErr(""); setSending(true);
    try {
      const res = await fetch(SHEET_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          wallet:    wallet.trim(),
          twitter:   twitter.trim(),
          quote_url: quoteUrl.trim(),
          timestamp: new Date().toISOString(),
        }),
      });
      const json = await res.json();
      if (json.result === "success") {
        setSuccess(true);
        localStorage.setItem("gome_submitted", "true");
        setAlreadySubmitted(true);
      } else {
        setErr("Something went wrong. Try again.");
      }
    } catch {
      setErr("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  }

  function closeModal() {
    setModalOpen(false);
    if (!alreadySubmitted) { setSuccess(false); setErr(""); }
  }

  const inp: React.CSSProperties = {
    width: "100%", background: "rgba(0,0,0,0.4)",
    border: `2px solid ${accent}33`, borderRadius: "8px",
    padding: "9px 11px", fontSize: "0.82rem", color: "#fff",
    fontFamily: body, outline: "none", transition: "border 0.2s", boxSizing: "border-box",
  };

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#fff", overflowX: "hidden", fontFamily: body }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Bangers&display=swap');

        @keyframes floatUp {
          0%   { transform: translateY(0) rotate(0deg); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.8; }
          100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
        }
        @keyframes coinBob {
          0%,100% { transform: translateY(0) rotate(-2deg); }
          50%     { transform: translateY(-14px) rotate(2deg); }
        }
        @keyframes heroFloat {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-10px); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes modalIn {
          from { opacity:0; transform:scale(0.95) translateY(12px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes stamp {
          0%   { transform:scale(0) rotate(-15deg); opacity:0; }
          70%  { transform:scale(1.15) rotate(3deg); }
          100% { transform:scale(1) rotate(0); opacity:1; }
        }
        @keyframes wiggle {
          0%,100% { transform:rotate(-3deg); }
          50%     { transform:rotate(3deg); }
        }
        @keyframes pulseBtn {
          0%,100% { box-shadow:0 0 0 0 rgba(245,158,11,0.5), 0 8px 30px rgba(245,158,11,0.35); }
          50%     { box-shadow:0 0 20px 6px rgba(245,158,11,0.3), 0 8px 30px rgba(245,158,11,0.35); }
        }
        * { box-sizing:border-box; }
        ::placeholder { color:rgba(255,255,255,0.2); }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:rgba(245,158,11,0.3); border-radius:4px; }
        html { scroll-behavior:smooth; }
        a { color:inherit; text-decoration:none; }
      `}</style>

      {/* ══════════ HEADER ══════════ */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        height: "64px", padding: "0 28px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(10,10,10,0.88)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}>
        <a href="#home" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "1.6rem", animation: "wiggle 2s ease-in-out infinite" }}>🎭</span>
          <span style={{ fontFamily: display, fontSize: "1.5rem", letterSpacing: "0.1em", color: "#fff" }}>GOME</span>
        </a>

        <nav style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {(COINS.map(c => [c.name, `#${c.id}`]) as [string, string][]).map(([l, h]) => (
            <a key={l} href={h} style={{
              fontFamily: body, fontSize: "0.7rem", fontWeight: 700,
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.5)", padding: "7px 12px", borderRadius: "8px",
              transition: "all 0.2s",
            }}
              onMouseEnter={e => { const el = e.currentTarget; el.style.color = "#fff"; el.style.background = "rgba(255,255,255,0.06)"; }}
              onMouseLeave={e => { const el = e.currentTarget; el.style.color = "rgba(255,255,255,0.5)"; el.style.background = "transparent"; }}
            >{l}</a>
          ))}
          <div style={{ width: "1px", height: "18px", background: "rgba(255,255,255,0.1)", margin: "0 6px" }} />
          <button onClick={() => setModalOpen(true)} style={{
            fontFamily: body, fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.12em",
            textTransform: "uppercase", color: "#000", background: accent,
            border: "none", borderRadius: "8px", padding: "8px 18px", cursor: "pointer",
            transition: "all 0.2s",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = accentLight; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = accent; }}
          >Apply</button>
        </nav>
      </header>

      {/* ══════════ HERO ══════════ */}
      <div id="home" style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "100px 24px 80px", textAlign: "center",
        background: "linear-gradient(180deg,#0a0a0a 0%,#111108 100%)",
        position: "relative", overflow: "hidden",
      }}>
        {/* BG noise/glow */}
        <div style={{
          position:"absolute", top:"40%", left:"50%", transform:"translate(-50%,-50%)",
          width:"700px", height:"700px", borderRadius:"50%",
          background:"radial-gradient(circle,rgba(245,158,11,0.07) 0%,transparent 68%)",
          pointerEvents:"none",
        }} />

        <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", alignItems:"center" }}>
          {/* Coin trio floating */}
          <div style={{
            display:"flex", gap:"16px", marginBottom:"32px",
            animation: ready ? "fadeUp 0.7s ease 0.05s both" : "none", opacity: ready ? undefined : 0,
          }}>
            {COINS.map((c, i) => (
              <div key={c.id} style={{
                width:"80px", height:"80px", borderRadius:"16px",
                background:`${c.accent}18`,
                border:`2px solid ${c.accent}44`,
                display:"flex", alignItems:"center", justifyContent:"center",
                animation:`heroFloat ${2.5 + i * 0.5}s ease-in-out ${i * 0.3}s infinite`,
                boxShadow:`0 8px 30px ${c.accent}22`,
              }}>
                <img src={c.img} alt={c.name} style={{ width:"56px", height:"56px", objectFit:"contain" }} />
              </div>
            ))}
          </div>

          <div style={{ marginBottom:"16px", animation: ready ? "fadeUp 0.7s ease 0.1s both" : "none", opacity: ready ? undefined : 0 }}>
            <span style={{
              fontFamily:body, fontSize:"0.65rem", letterSpacing:"0.28em", textTransform:"uppercase",
              color:accent, border:`1px solid ${accent}44`, borderRadius:"999px", padding:"5px 18px",
            }}>
              Gallery of Memes — 4,004 NFTs on ETH
            </span>
          </div>

          <h1 style={{
            fontFamily:display, fontSize:"clamp(5rem,20vw,10rem)",
            color:"#fff", margin:"0 0 6px", letterSpacing:"0.06em", lineHeight:0.9,
            animation: ready ? "fadeUp 0.7s ease 0.16s both" : "none", opacity: ready ? undefined : 0,
            textShadow:`0 0 60px ${accent}33`,
          }}>
            GOME
          </h1>

          <p style={{
            fontFamily:body, fontWeight:800, fontSize:"clamp(1rem,3vw,1.3rem)",
            color:"rgba(255,255,255,0.6)", margin:"16px 0 36px", maxWidth:"480px", lineHeight:1.5,
            animation: ready ? "fadeUp 0.7s ease 0.22s both" : "none", opacity: ready ? undefined : 0,
          }}>
            The meme coins you love — now as NFTs.<br/>
            Pepe. Bonk. Brett. 4,004 each. One collection.
          </p>

          <div style={{
            display:"flex", gap:"12px", flexWrap:"wrap", justifyContent:"center",
            animation: ready ? "fadeUp 0.7s ease 0.28s both" : "none", opacity: ready ? undefined : 0,
          }}>
            <button onClick={() => setModalOpen(true)} style={{
              fontFamily:body, fontSize:"0.78rem", fontWeight:800, letterSpacing:"0.16em",
              textTransform:"uppercase", color:"#000", background:accent,
              border:"none", borderRadius:"12px", padding:"16px 36px",
              cursor:"pointer", transition:"all 0.2s",
              animation:"pulseBtn 2.5s ease-in-out infinite",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = accentLight; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = accent; (e.currentTarget as HTMLButtonElement).style.transform = ""; }}
            >
              🎟️ Apply for Whitelist
            </button>
            <a href="#pepe" style={{
              fontFamily:body, fontSize:"0.78rem", fontWeight:700, letterSpacing:"0.14em",
              textTransform:"uppercase", color:"rgba(255,255,255,0.55)",
              border:"2px solid rgba(255,255,255,0.12)", borderRadius:"12px",
              padding:"16px 36px", display:"block", transition:"all 0.2s",
            }}
              onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = `${accent}55`; el.style.color = "#fff"; }}
              onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = "rgba(255,255,255,0.12)"; el.style.color = "rgba(255,255,255,0.55)"; }}
            >
              Explore Collection ↓
            </a>
          </div>

          <div style={{
            marginTop:"52px",
            display:"flex", gap:"0",
            border:`1px solid rgba(245,158,11,0.15)`, borderRadius:"12px",
            overflow:"hidden", background:"rgba(255,255,255,0.02)",
            animation: ready ? "fadeUp 0.7s ease 0.36s both" : "none", opacity: ready ? undefined : 0,
          }}>
            {[["🐸 PEPE","#pepe"],["🏏 BONK","#bonk"],["😎 BRETT","#brett"],["0.0009 ETH","Mint Price"]].map(([val, href], i) => (
              href.startsWith("#") ? (
                <a key={i} href={href} style={{
                  padding:"16px 22px", borderLeft: i > 0 ? "1px solid rgba(245,158,11,0.1)" : "none",
                  textAlign:"center", transition:"background 0.2s",
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(245,158,11,0.05)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
                >
                  <p style={{ margin:0, fontFamily:display, fontSize:"1.1rem", color:accent, letterSpacing:"0.04em" }}>{val}</p>
                  <p style={{ margin:"2px 0 0", fontFamily:body, fontSize:"0.5rem", letterSpacing:"0.16em", textTransform:"uppercase", color:"rgba(255,255,255,0.25)", fontWeight:700 }}>View</p>
                </a>
              ) : (
                <div key={i} style={{
                  padding:"16px 22px", borderLeft: i > 0 ? "1px solid rgba(245,158,11,0.1)" : "none",
                  textAlign:"center",
                }}>
                  <p style={{ margin:0, fontFamily:display, fontSize:"1.1rem", color:accent, letterSpacing:"0.04em" }}>{val}</p>
                  <p style={{ margin:"2px 0 0", fontFamily:body, fontSize:"0.5rem", letterSpacing:"0.16em", textTransform:"uppercase", color:"rgba(255,255,255,0.25)", fontWeight:700 }}>Mint Price</p>
                </div>
              )
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{ position:"absolute", bottom:"32px", left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:"6px", opacity:0.3 }}>
          <span style={{ fontFamily:body, fontSize:"0.48rem", letterSpacing:"0.3em", textTransform:"uppercase", color:accent }}>Scroll</span>
          <div style={{ width:"1px", height:"28px", background:`linear-gradient(180deg,${accent},transparent)` }} />
        </div>
      </div>

      {/* ══════════ COIN SECTIONS ══════════ */}
      {COINS.map((coin, i) => <CoinSection key={coin.id} coin={coin} index={i} />)}

      {/* ══════════ WHITELIST CTA BAND ══════════ */}
      <section id="whitelist" style={{
        background:"linear-gradient(135deg,#1a1100 0%,#0d0d0d 50%,#1a1100 100%)",
        padding:"100px 0", textAlign:"center", position:"relative", overflow:"hidden",
      }}>
        <div style={{
          position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
          width:"600px", height:"300px", borderRadius:"50%",
          background:"radial-gradient(ellipse,rgba(245,158,11,0.1) 0%,transparent 70%)",
          pointerEvents:"none",
        }} />
        <div style={{ maxWidth:"600px", margin:"0 auto", padding:"0 24px", position:"relative", zIndex:1 }}>
          <div style={{ fontSize:"3rem", marginBottom:"20px", animation:"coinBob 2s ease-in-out infinite" }}>🎟️</div>
          <h2 style={{ fontFamily:display, fontSize:"clamp(2.5rem,8vw,4.5rem)", color:"#fff", margin:"0 0 16px", letterSpacing:"0.05em" }}>
            Get On The List
          </h2>
          <p style={{ fontFamily:body, fontSize:"1rem", fontWeight:600, color:"rgba(255,255,255,0.5)", margin:"0 0 36px", lineHeight:1.7, maxWidth:"440px", marginLeft:"auto", marginRight:"auto" }}>
            Follow, like, repost — and drop your wallet.<br/>
            Selected addresses get early access to mint.
          </p>
          <button onClick={() => setModalOpen(true)} style={{
            fontFamily:body, fontSize:"0.82rem", fontWeight:800, letterSpacing:"0.16em",
            textTransform:"uppercase", color:"#000", background:accent,
            border:"none", borderRadius:"14px", padding:"18px 48px",
            cursor:"pointer", transition:"all 0.2s",
            boxShadow:`0 12px 40px ${accent}44`,
          }}
            onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = accentLight; b.style.transform = "translateY(-3px)"; b.style.boxShadow = `0 20px 50px ${accent}55`; }}
            onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = accent; b.style.transform = ""; b.style.boxShadow = `0 12px 40px ${accent}44`; }}
          >
            🎟️ Apply Now — It's Free
          </button>
          <p style={{ fontFamily:body, fontSize:"0.65rem", color:"rgba(255,255,255,0.2)", marginTop:"16px", letterSpacing:"0.08em" }}>
            No cost to apply. Mint price 0.0009 ETH per NFT.
          </p>
        </div>
      </section>

      {/* ══════════ FAQ ══════════ */}
      <section style={{ background:"#0a0a0a", padding:"80px 0" }}>
        <div style={{ maxWidth:"640px", margin:"0 auto", padding:"0 24px" }}>
          <h2 style={{ fontFamily:display, fontSize:"clamp(2rem,7vw,3.5rem)", color:"#fff", margin:"0 0 40px", letterSpacing:"0.05em", textAlign:"center" }}>
            FAQ
          </h2>
          {[
            ["What is GOME?","Gallery of Memes — a 4,004 supply NFT collection featuring Pepe, Bonk, and Brett characters on Ethereum."],
            ["What's the mint price?","0.0009 ETH per NFT."],
            ["Where do I mint?","On OpenSea."],
            ["What is the whitelist?","Completing the missions (follow, like, repost + wallet) enters you into review for early access."],
            ["How many NFTs are there?","4,004 total across all three meme characters."],
            ["Is this financial advice?","No. This is a meme NFT collection. DYOR. NFA."],
          ].map(([q, a], i) => (
            <FaqItem key={i} q={q} a={a} />
          ))}
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer style={{ padding:"60px 24px 40px", textAlign:"center", background:"#060606", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ fontSize:"2.5rem", marginBottom:"12px" }}>🎭</div>
        <h3 style={{ fontFamily:display, fontSize:"2rem", color:"#fff", margin:"0 0 8px", letterSpacing:"0.1em" }}>GOME</h3>
        <p style={{ fontFamily:body, fontSize:"0.88rem", color:"rgba(255,255,255,0.3)", margin:"0 0 28px", lineHeight:1.7 }}>
          Gallery of Memes. 4,004 NFTs. Ethereum.<br/>
          🐸 PEPE &nbsp;•&nbsp; 🏏 BONK &nbsp;•&nbsp; 😎 BRETT
        </p>
        <div style={{ display:"flex", gap:"28px", justifyContent:"center", marginBottom:"36px", flexWrap:"wrap" }}>
          {[["X / Twitter", X_URL],["Whitelist","#whitelist"],["PEPE","#pepe"],["BONK","#bonk"],["BRETT","#brett"]].map(([l, h]) => (
            <a key={l} href={h} target={h.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
              style={{ fontFamily:body, fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(245,158,11,0.5)", transition:"color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,158,11,0.5)")}
            >{l}</a>
          ))}
        </div>
        <p style={{ fontFamily:body, fontSize:"0.55rem", letterSpacing:"0.24em", textTransform:"uppercase", color:"rgba(245,158,11,0.25)" }}>
          © 2025 GOME — Gallery of Memes
        </p>
      </footer>

      {/* ══════════ WHITELIST MODAL ══════════ */}
      {modalOpen && (
        <div onClick={e => { if (e.target === e.currentTarget) closeModal(); }} style={{
          position:"fixed", inset:0, zIndex:200,
          background:"rgba(0,0,0,0.9)", backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)",
          display:"flex", alignItems:"center", justifyContent:"center", padding:"16px",
        }}>
          <div style={{
            width:"100%", maxWidth:"480px", maxHeight:"94vh", overflowY:"auto",
            background:"#111", border:`2px solid ${accent}33`, borderRadius:"20px",
            padding:"28px 22px 24px", animation:"modalIn 0.3s ease both", position:"relative",
            boxShadow:`0 40px 80px rgba(0,0,0,0.9), 0 0 80px ${accent}10`,
          }}>
            <button onClick={closeModal} style={{
              position:"absolute", top:"14px", right:"16px",
              background:"none", border:"none", cursor:"pointer",
              color:"rgba(255,255,255,0.3)", fontSize:"1.2rem", lineHeight:1,
            }}>✕</button>

            {alreadySubmitted ? (
              <div style={{ textAlign:"center", padding:"36px 0" }}>
                <div style={{ fontSize:"3rem", marginBottom:"16px" }}>🎟️</div>
                <p style={{ fontFamily:body, fontSize:"0.6rem", letterSpacing:"0.24em", textTransform:"uppercase", color:accent, margin:"0 0 6px", fontWeight:700 }}>Already Applied</p>
                <h2 style={{ fontFamily:display, fontSize:"2rem", color:"#fff", margin:"0 0 10px", letterSpacing:"0.05em" }}>You're In The Queue.</h2>
                <p style={{ fontFamily:body, fontSize:"0.9rem", color:"rgba(255,255,255,0.4)", margin:0, lineHeight:1.6 }}>
                  Selected wallets will be notified before mint opens.
                </p>
                <button onClick={closeModal} style={{
                  marginTop:"24px", fontFamily:body, fontSize:"0.72rem", fontWeight:800,
                  letterSpacing:"0.14em", textTransform:"uppercase", color:"#000",
                  background:accent, border:"none", borderRadius:"10px", padding:"12px 28px", cursor:"pointer",
                }}>Back to GOME</button>
              </div>
            ) : success ? (
              <div style={{ textAlign:"center", padding:"36px 0" }}>
                <div style={{
                  width:"60px", height:"60px", borderRadius:"50%", background:accent,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  margin:"0 auto 16px", animation:"stamp 0.5s cubic-bezier(0.23,1,0.32,1) both",
                  boxShadow:`0 8px 30px ${accent}55`,
                }}>
                  <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
                    <path d="M2 10L8.5 17L22 2" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p style={{ fontFamily:body, fontSize:"0.6rem", letterSpacing:"0.24em", textTransform:"uppercase", color:accent, margin:"0 0 6px", fontWeight:700 }}>Application Sent</p>
                <h2 style={{ fontFamily:display, fontSize:"2rem", color:"#fff", margin:"0 0 10px", letterSpacing:"0.05em" }}>You're In.</h2>
                <p style={{ fontFamily:body, fontSize:"0.9rem", color:"rgba(255,255,255,0.4)", margin:0, lineHeight:1.6 }}>
                  Selected wallets get minted first. Stay tuned on X.
                </p>
                <button onClick={closeModal} style={{
                  marginTop:"24px", fontFamily:body, fontSize:"0.72rem", fontWeight:800,
                  letterSpacing:"0.14em", textTransform:"uppercase", color:"#000",
                  background:accent, border:"none", borderRadius:"10px", padding:"12px 28px", cursor:"pointer",
                }}>Back to GOME</button>
              </div>
            ) : (
              <>
                <div style={{ textAlign:"center", marginBottom:"22px" }}>
                  <div style={{ fontSize:"2rem", marginBottom:"8px" }}>🎟️</div>
                  <p style={{ fontFamily:body, fontSize:"0.58rem", letterSpacing:"0.24em", textTransform:"uppercase", color:accent, margin:"0 0 4px", fontWeight:700 }}>GOME Whitelist</p>
                  <h2 style={{ fontFamily:display, fontSize:"1.8rem", color:"#fff", margin:"0 0 4px", letterSpacing:"0.04em" }}>Claim Your Spot</h2>
                  <p style={{ fontFamily:body, fontSize:"0.82rem", color:"rgba(255,255,255,0.35)", margin:"0 0 14px", lineHeight:1.5 }}>
                    Complete all 4 missions and drop your wallet.
                  </p>
                  {/* Progress bar */}
                  <div style={{ height:"4px", background:"rgba(255,255,255,0.06)", borderRadius:"4px", overflow:"hidden" }}>
                    <div style={{
                      height:"100%", borderRadius:"4px",
                      background:`linear-gradient(90deg,${accent},${accentLight})`,
                      width:`${([c1,c2,c3,c4].filter(Boolean).length / 4) * 100}%`,
                      transition:"width 0.4s ease",
                    }} />
                  </div>
                  <p style={{ fontFamily:body, fontSize:"0.62rem", color:`${accent}77`, margin:"6px 0 0", fontWeight:700 }}>
                    {[c1,c2,c3,c4].filter(Boolean).length} of 4 done
                  </p>
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", marginBottom:"16px" }}>

                  {/* Card 1 — Follow */}
                  <FlipCard index={0} icon="🐦" title="Follow on X" subtitle="Mission 01 / 04" done={c1} locked={false}
                    onFlip={() => window.open(X_URL, "_blank")}>
                    <p style={{ fontFamily:body, fontSize:"0.75rem", color:"rgba(255,255,255,0.45)", margin:"0 0 8px", lineHeight:1.5 }}>
                      {c1 ? "✅ Following confirmed!" : "Follow @gomememes on X, then enter your handle."}
                    </p>
                    {!c1 && (
                      <>
                        <p style={{ margin:"0 0 4px", fontFamily:body, fontSize:"0.6rem", color:`${accent}88`, letterSpacing:"0.1em", textTransform:"uppercase", fontWeight:700 }}>Your X handle</p>
                        <input type="text" placeholder="@yourhandle" value={twitter}
                          onChange={e => setTwitter(e.target.value)}
                          onClick={e => e.stopPropagation()} style={inp}
                          onFocus={e => e.target.style.borderColor = `${accent}77`}
                          onBlur={e => e.target.style.borderColor = `${accent}33`}
                        />
                        {!c1 && twitter.trim().length > 1 && (
                          <button onClick={e => { e.stopPropagation(); setTwitterConfirmed(true); }}
                            style={{ marginTop:"8px", width:"100%", background:accent, color:"#000", border:"none", borderRadius:"6px", padding:"7px", fontFamily:body, fontSize:"0.65rem", fontWeight:800, letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer" }}>
                            Confirm
                          </button>
                        )}
                      </>
                    )}
                  </FlipCard>

                  {/* Card 2 — Like & Retweet */}
                  <FlipCard index={1} icon="❤️" title="Like & Retweet" subtitle="Mission 02 / 04" done={c2} locked={!c1}
                    onFlip={() => { window.open(PINNED_TWEET, "_blank"); setTimeout(() => setTasks(p => ({ ...p, like: true })), 900); }}>
                    <p style={{ fontFamily:body, fontSize:"0.75rem", color:"rgba(255,255,255,0.45)", margin:0, lineHeight:1.5 }}>
                      {c2 ? "✅ Like & retweet done!" : "Like and retweet the pinned post. Opens automatically."}
                    </p>
                  </FlipCard>

                  {/* Card 3 — Quote tweet */}
                  <FlipCard index={2} icon="🔁" title="Quote Post" subtitle="Mission 03 / 04" done={c3} locked={!c2}
                    onFlip={() => window.open(PINNED_TWEET, "_blank")}>
                    {!c3 ? (
                      <>
                        <p style={{ fontFamily:body, fontSize:"0.75rem", color:"rgba(255,255,255,0.45)", margin:"0 0 8px", lineHeight:1.5 }}>
                          Quote the pinned post with "GOME 🎭" and paste your link.
                        </p>
                        <input type="url" placeholder="https://x.com/..." value={quoteUrl}
                          onChange={e => setQuoteUrl(e.target.value)}
                          onClick={e => e.stopPropagation()} style={inp}
                          onFocus={e => e.target.style.borderColor = `${accent}77`}
                          onBlur={e => e.target.style.borderColor = `${accent}33`}
                        />
                        {quoteUrl && !isValidUrl(quoteUrl) && (
                          <p style={{ fontFamily:body, fontSize:"0.6rem", color:"#ef4444", margin:"4px 0 0" }}>Needs a valid URL</p>
                        )}
                        {isValidUrl(quoteUrl) && (
                          <button onClick={e => { e.stopPropagation(); setQuoteConfirmed(true); }}
                            style={{ marginTop:"8px", width:"100%", background:accent, color:"#000", border:"none", borderRadius:"6px", padding:"7px", fontFamily:body, fontSize:"0.65rem", fontWeight:800, letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer" }}>
                            Verify
                          </button>
                        )}
                      </>
                    ) : (
                      <p style={{ fontFamily:body, fontSize:"0.75rem", color:accent, margin:0, fontWeight:700 }}>✅ Quote verified!</p>
                    )}
                  </FlipCard>

                  {/* Card 4 — Wallet */}
                  <FlipCard index={3} icon="👛" title="Drop Wallet" subtitle="Mission 04 / 04" done={c4} locked={!c3}>
                    <p style={{ margin:"0 0 6px", fontFamily:body, fontSize:"0.6rem", color:`${accent}88`, letterSpacing:"0.1em", textTransform:"uppercase", fontWeight:700 }}>EVM address</p>
                    <input type="text" placeholder="0x..." value={wallet}
                      onChange={e => setWallet(e.target.value)}
                      onClick={e => e.stopPropagation()} style={inp}
                      onFocus={e => e.target.style.borderColor = `${accent}77`}
                      onBlur={e => e.target.style.borderColor = `${accent}33`}
                    />
                    {wallet && !isValidEvm(wallet) && (
                      <p style={{ fontFamily:body, fontSize:"0.6rem", color:"#ef4444", margin:"4px 0 0" }}>Invalid EVM address</p>
                    )}
                    {!c4 && isValidEvm(wallet) && (
                      <button onClick={e => { e.stopPropagation(); setWalletConfirmed(true); }}
                        style={{ marginTop:"8px", width:"100%", background:accent, color:"#000", border:"none", borderRadius:"6px", padding:"7px", fontFamily:body, fontSize:"0.65rem", fontWeight:800, letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer" }}>
                        Confirm Wallet
                      </button>
                    )}
                    {c4 && <p style={{ fontFamily:body, fontSize:"0.7rem", color:accent, margin:"4px 0 0", fontWeight:700 }}>✅ Wallet confirmed!</p>}
                    <p style={{ fontFamily:body, fontSize:"0.55rem", color:"rgba(255,255,255,0.15)", margin:"6px 0 0", lineHeight:1.4 }}>Never share seed phrases.</p>
                  </FlipCard>

                </div>

                {err && <p style={{ fontFamily:body, fontSize:"0.78rem", color:"#ef4444", margin:"0 0 10px", fontWeight:700 }}>{err}</p>}

                <button onClick={submit} disabled={sending || !allDone} style={{
                  width:"100%",
                  background: allDone ? accent : "rgba(255,255,255,0.04)",
                  color: allDone ? "#000" : "rgba(255,255,255,0.18)",
                  border: `2px solid ${allDone ? accent : "rgba(255,255,255,0.06)"}`,
                  borderRadius:"12px", padding:"16px",
                  fontFamily:body, fontSize:"0.78rem", fontWeight:800, letterSpacing:"0.16em", textTransform:"uppercase",
                  cursor: allDone && !sending ? "pointer" : "not-allowed",
                  transition:"all 0.3s ease",
                  boxShadow: allDone ? `0 8px 30px ${accent}44` : "none",
                }}
                  onMouseEnter={e => { if (allDone) (e.currentTarget as HTMLButtonElement).style.background = accentLight; }}
                  onMouseLeave={e => { if (allDone) (e.currentTarget as HTMLButtonElement).style.background = accent; }}
                >
                  {sending ? "Submitting..." : allDone ? "🎟️ Submit Application" : "Complete all missions to unlock"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── FAQ item ── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width:"100%", background:"none", border:"none", cursor:"pointer",
        padding:"18px 0", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"12px",
      }}>
        <span style={{ fontFamily:"'Nunito', sans-serif", fontSize:"1rem", fontWeight:800, color: open ? "#fff" : "rgba(255,255,255,0.7)", textAlign:"left" }}>{q}</span>
        <span style={{ color:"#f59e0b", fontSize:"1.2rem", flexShrink:0, transition:"transform 0.25s", transform: open ? "rotate(45deg)" : "rotate(0)" }}>+</span>
      </button>
      {open && (
        <p style={{ fontFamily:"'Nunito', sans-serif", fontSize:"0.9rem", color:"rgba(255,255,255,0.45)", padding:"0 0 18px", margin:0, lineHeight:1.7, fontWeight:500 }}>{a}</p>
      )}
    </div>
  );
}
