import { Router as WouterRouter, Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/lib/i18n";

/* ── Pages ── */
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Leaderboard from "@/pages/leaderboard";
import Collab from "@/pages/collab";
import Tasks from "@/pages/tasks";
import AuthCallback from "@/pages/auth/callback";

/* ── Gallery ── */
import GalleryLayout from "@/components/GalleryLayout";
import GalleryPepe from "@/pages/gallery/pepe";
import GalleryBrett from "@/pages/gallery/brett";
import GalleryBonk from "@/pages/gallery/bonk";
import GalleryLore from "@/pages/gallery/lore";
import GalleryWhitelist from "@/pages/gallery/whitelist";
import GalleryMemeGenerator from "@/pages/gallery/memegenerator";
import GalleryMuseum from "@/pages/gallery/museum";

const P = { bg: "#070707", gold: "#C9A84C", text: "#f5f5f5" };

function App() {
  return (
    <div className="dark">
      {/* LanguageProvider wraps everything so the EN/中文/한국어 choice
          persists across every route, not just Home */}
      <LanguageProvider>
        <TooltipProvider>
          <WouterRouter>
            <Switch>
              {/* Public */}
              <Route path="/" component={Landing} />
              <Route path="/auth/callback" component={AuthCallback} />
              <Route path="/collab" component={Collab} />

              {/* Protected-ish (components gate themselves) */}
              <Route path="/home" component={Home} />
              <Route path="/leaderboard" component={Leaderboard} />
              <Route path="/tasks" component={Tasks} />

              {/* Gallery vertical routes */}
              <Route path="/gallery">{() => <GalleryLayout />}</Route>
              <Route path="/gallery/pepe" component={GalleryPepe} />
              <Route path="/gallery/brett" component={GalleryBrett} />
              <Route path="/gallery/bonk" component={GalleryBonk} />
              <Route path="/gallery/lore" component={GalleryLore} />
              <Route path="/gallery/whitelist" component={GalleryWhitelist} />
              <Route path="/gallery/memegenerator" component={GalleryMemeGenerator} />
              <Route path="/gallery/museum" component={GalleryMuseum} />

              <Route>
                <div style={{
                  background: P.bg, width: "100vw", height: "100vh",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Fredoka', sans-serif", fontWeight: 700,
                  fontSize: "2rem", color: P.gold,
                }}>
                  404 — NOT FOUND
                </div>
              </Route>
            </Switch>
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </LanguageProvider>
    </div>
  );
}

export default App;
