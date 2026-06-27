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

      // Upsert into profiles (GOME table)
      const { error: upsertError } = await supabase.from("profiles").upsert({
        id: u.id,
        twitter_id: twitterId,
        username: username,
        display_name: displayName,
        avatar_url: avatarUrl,
        points_total: 0,
      }, { onConflict: "id", ignoreDuplicates: false });

      if (upsertError) {
        console.error("Profile upsert failed:", upsertError.message);
        setFailed(true);
        return;
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
    <div className="min-h-[100dvh] bg-[#070707] flex flex-col items-center justify-center gap-4">
      <p style={{ fontFamily: "'Fredoka', sans-serif", color: "#ef4444", fontSize: 14 }}>
        AUTH FAILED
      </p>
      <button onClick={() => navigate("/")}
        className="px-6 py-2 rounded-lg border border-[#C9A84C]/30 text-[#C9A84C] text-xs font-bold uppercase tracking-widest hover:bg-[#C9A84C]/10">
        Return
      </button>
    </div>
  );

  return (
    <div className="min-h-[100dvh] bg-[#070707] flex items-center justify-center">
      <p style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 12, color: "#C9A84C", letterSpacing: "0.2em", textTransform: "uppercase"
      }}>
        Entering the Gallery...
      </p>
    </div>
  );
}
