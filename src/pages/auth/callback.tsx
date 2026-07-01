import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const [, navigate] = useLocation();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let handled = false;

    const processAuth = async (session: any) => {
      if (handled || !session) return;
      handled = true;

      const u = session.user;
      const meta = u.user_metadata || {};
      const username = meta.preferred_username || meta.user_name || meta.screen_name || null;
      const displayName = meta.name || meta.full_name || username || null;
      const avatarUrl = meta.avatar_url || meta.profile_image_url || null;
      const twitterId = meta.provider_id || meta.sub || null;

      // Check if profile already exists — if so, only update metadata, never touch points_total
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", u.id)
        .maybeSingle();

      if (existing) {
        // Returning user — just refresh their X metadata
        await supabase.from("profiles").update({
          twitter_id: twitterId,
          username,
          display_name: displayName,
          avatar_url: avatarUrl,
        }).eq("id", u.id);
      } else {
        // New user — insert with 0 points
        const { error } = await supabase.from("profiles").insert({
          id: u.id,
          twitter_id: twitterId,
          username,
          display_name: displayName,
          avatar_url: avatarUrl,
          points_total: 0,
        });
        if (error) {
          console.error("Profile insert failed:", error.message, error);
          setFailed(true);
          return;
        }
      }

      navigate("/home");
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          await processAuth(session);
        }
      }
    );

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) processAuth(data.session);
    });

    const timeout = setTimeout(() => {
      if (!handled) setFailed(true);
    }, 15000);

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (failed) return (
    <div style={{
      minHeight: "100dvh", background: "#070707",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16,
    }}>
      <p style={{ fontFamily: "'Space Mono', monospace", color: "#ef4444", fontSize: 13, letterSpacing: "0.1em" }}>
        AUTH FAILED
      </p>
      <button
        onClick={() => navigate("/")}
        style={{
          fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "0.1em",
          color: "#f97316", background: "transparent",
          border: "1px solid rgba(249,115,22,0.4)", padding: "10px 24px", cursor: "pointer",
        }}
      >
        Return
      </button>
    </div>
  );

  return (
    <div style={{
      minHeight: "100dvh", background: "#070707",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <p style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: 12, color: "#f97316", letterSpacing: "0.2em", textTransform: "uppercase",
      }}>
        Entering the Gallery...
      </p>
    </div>
  );
}
