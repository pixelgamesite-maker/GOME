import { LANGS, useLanguage } from "@/lib/i18n";

/**
 * LanguageSwitcher — pill group for the header, EN / 中文 / 한국어.
 * Matches the Bubble Buns style: rounded pill row, active language
 * filled with a solid color, the rest plain.
 */

const ACTIVE_COLOR = "#3ddc52";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 4, background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 3,
    }}>
      {LANGS.map((l) => {
        const active = l.code === lang;
        return (
          <button
            key={l.code}
            onClick={() => setLang(l.code)}
            aria-label={l.label}
            title={l.label}
            style={{
              fontSize: 16, lineHeight: 1,
              padding: "5px 9px", borderRadius: 16, border: "none", cursor: "pointer",
              background: active ? ACTIVE_COLOR : "transparent",
              filter: active ? "none" : "grayscale(0.6) opacity(0.6)",
              transition: "all 0.15s",
            }}
          >
            {l.flag}
          </button>
        );
      })}
    </div>
  );
}
