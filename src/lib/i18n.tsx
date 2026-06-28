import { createContext, useContext, useEffect, useState } from "react";

/**
 * Lightweight i18n — no external library, just a context + dictionary.
 * Wrap your app root with <LanguageProvider> (see App.tsx snippet),
 * then call useLanguage() anywhere to get { lang, setLang, t }.
 *
 * NOTE ON TRANSLATION QUALITY: these zh/ja strings were machine-translated
 * by Claude, not reviewed by a native speaker. They should read fine for
 * UI labels, but get a native speaker to pass over the copy (especially
 * the character blurbs and whitelist/legal-adjacent text) before this
 * goes live publicly.
 */

export type Lang = "en" | "zh" | "ja";
export const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "zh", label: "中文" },
  { code: "ja", label: "日本語" },
];

const dict: Record<Lang, Record<string, any>> = {
  en: {
    nav: { out: "Out", pts: "pts" },
    hero: {
      status: "Minting on OpenSea",
      subtitle: "Gallery Of Meme",
      tagline: "A gallery of the internet's most iconic memes — built for the ones who get it.",
    },
    stat: { mintPrice: "Mint Price", supply: "Supply", chain: "Chain", launchpad: "Launchpad", tba: "TBA" },
    cta: { gallery: "Gallery", collab: "Collab", whitelist: "Whitelist" },
    explore: {
      eyebrow: "Explore",
      title: "Step Into The Gallery",
      desc: "Pepe, Brett, Bonk, the lore, and everything else GOME has to show off — all in one place.",
      button: "Step Into The Gallery →",
    },
    collection: {
      eyebrow: "The Collection",
      title: "Some Of The Crew",
      captionSuffix: "Supply · More Revealed Soon",
    },
    character: {
      pepe: "The face of internet culture. A legendary frog whose countless expressions became the language of memes, evolving from comic panels into one of the internet's most recognizable icons.",
      bonk: "The dog that bonked its way into crypto history. A cheerful Shiba Inu mascot that embodies community, fun, and the playful spirit of decentralized internet culture.",
      brett: "The internet's laid-back best friend. Known for his calm attitude and signature blue look, Brett represents the easygoing side of meme culture, earning a devoted following across Web3 communities.",
    },
    roast: { eyebrow: "No Mercy", title: "Roast Me", desc: "We'll pull your profile and roast you on the spot." },
    leaderboard: { eyebrow: "Top 100", title: "Leaderboard" },
    tasks: {
      eyebrow: "Earn Points", title: "Collect Points",
      desc: "Complete the tasks below to climb the leaderboard.",
      followJoin: "Follow & Join", tweetEngagement: "Tweet Engagement",
      followDesc: "Follow GOME on X for drops, alpha, and announcements.",
      openOnX: "Open on X", claimed: "Claimed",
      open: "Open →", wait: "Wait {s}s…",
      like: "Like", retweet: "Retweet", commentTag: "Comment & Tag",
      postId: "Post #{id}",
    },
    lb: {
      yourRank: "Your rank:", with: "with",
      empty: "No rankings yet — be the first to earn points.",
      rank: "Rank", user: "User", stars: "Stars", joined: "Joined {date}",
      viewAll: "View Full Leaderboard →",
    },
    wl: {
      confirmTitle: "Apply for the Whitelist",
      confirmDesc: "A few quick tasks, your wallet, and you're in the running for a guaranteed mint spot.",
      notNow: "Not now", letsGo: "Let's go →",
      formTitle: "Whitelist Application", applyingAs: "Applying as @{handle}",
      completeTasks: "Complete tasks",
      follow: "Follow @GomeJpeg", retweet: "Retweet pinned post", quote: "Quote tweet pinned post",
      quotePlaceholder: "Paste your quote tweet link", done: "Done ✓", go: "Go →",
      walletLabel: "EVM Wallet Address",
      walletRequired: "Wallet address is required.",
      walletInvalid: "That doesn't look like a valid EVM address (0x…).",
      quoteRequired: "Paste your quote tweet link.",
      submitFailed: "Submission failed. Try again.",
      submitting: "Submitting…", submit: "Submit Application →",
      successAlready: "You're In The Queue", successNew: "Application Received",
      successDesc: "We review applications manually. Keep an eye on @GomeJpeg for selection updates.",
      close: "Close",
    },
  },

  zh: {
    nav: { out: "退出", pts: "积分" },
    hero: {
      status: "正在 OpenSea 上铸造",
      subtitle: "表情包画廊",
      tagline: "汇集互联网最具代表性的表情包 —— 专为懂的人打造。",
    },
    stat: { mintPrice: "铸造价格", supply: "供应量", chain: "链", launchpad: "发行平台", tba: "待定" },
    cta: { gallery: "图库", collab: "合作", whitelist: "白名单" },
    explore: {
      eyebrow: "探索",
      title: "进入图库",
      desc: "Pepe、Brett、Bonk、世界观设定，以及 GOME 的一切精彩内容，都在这里。",
      button: "进入图库 →",
    },
    collection: {
      eyebrow: "收藏集",
      title: "认识这群伙伴",
      captionSuffix: "供应量 · 更多内容即将揭晓",
    },
    character: {
      pepe: "互联网文化的代表形象。这只青蛙凭借千变万化的表情成为表情包的通用语言，从漫画分镜演变为互联网最具辨识度的图标之一。",
      bonk: "用一只柴犬的形象闯入加密世界历史的狗子。它是社区精神、乐趣与去中心化互联网文化的欢乐化身。",
      brett: "互联网上最随性的好朋友。以淡定的态度和标志性的蓝色形象著称，Brett 代表着表情包文化中轻松自在的一面，在 Web3 社区中拥有大批忠实粉丝。",
    },
    roast: { eyebrow: "毫不留情", title: "吐槽我", desc: "我们会调取你的资料，当场吐槽你。" },
    leaderboard: { eyebrow: "前 100 名", title: "排行榜" },
    tasks: {
      eyebrow: "赚取积分", title: "收集积分",
      desc: "完成以下任务，提升你的排行榜排名。",
      followJoin: "关注 & 加入", tweetEngagement: "推文互动",
      followDesc: "在 X 上关注 GOME，获取空投、内幕消息和公告。",
      openOnX: "在 X 上打开", claimed: "已领取",
      open: "打开 →", wait: "等待 {s} 秒…",
      like: "点赞", retweet: "转推", commentTag: "评论 & 标记好友",
      postId: "推文 #{id}",
    },
    lb: {
      yourRank: "你的排名：", with: "积分",
      empty: "暂无排名 —— 快来赚取第一份积分吧。",
      rank: "排名", user: "用户", stars: "积分", joined: "加入于 {date}",
      viewAll: "查看完整排行榜 →",
    },
    wl: {
      confirmTitle: "申请白名单",
      confirmDesc: "完成几个简单任务并提交钱包地址，即可争取保底铸造资格。",
      notNow: "暂不申请", letsGo: "开始 →",
      formTitle: "白名单申请", applyingAs: "申请人：@{handle}",
      completeTasks: "完成任务",
      follow: "关注 @GomeJpeg", retweet: "转推置顶推文", quote: "引用置顶推文",
      quotePlaceholder: "粘贴你的引用推文链接", done: "已完成 ✓", go: "前往 →",
      walletLabel: "EVM 钱包地址",
      walletRequired: "请填写钱包地址。",
      walletInvalid: "这看起来不是有效的 EVM 地址（0x…）。",
      quoteRequired: "请粘贴你的引用推文链接。",
      submitFailed: "提交失败，请重试。",
      submitting: "提交中…", submit: "提交申请 →",
      successAlready: "你已在候选队列中", successNew: "申请已收到",
      successDesc: "我们会人工审核所有申请，请关注 @GomeJpeg 获取筛选结果。",
      close: "关闭",
    },
  },

  ja: {
    nav: { out: "ログアウト", pts: "pt" },
    hero: {
      status: "OpenSeaでミント中",
      subtitle: "ミームギャラリー",
      tagline: "インターネットで最も象徴的なミームを集めたギャラリー —— わかる人のために。",
    },
    stat: { mintPrice: "ミント価格", supply: "供給量", chain: "チェーン", launchpad: "ローンチパッド", tba: "未定" },
    cta: { gallery: "ギャラリー", collab: "コラボ", whitelist: "ホワイトリスト" },
    explore: {
      eyebrow: "探索する",
      title: "ギャラリーへ進む",
      desc: "Pepe、Brett、Bonk、世界観設定など、GOMEのすべてがここに。",
      button: "ギャラリーへ進む →",
    },
    collection: {
      eyebrow: "コレクション",
      title: "メンバーを紹介",
      captionSuffix: "供給量 · 続報をお楽しみに",
    },
    character: {
      pepe: "インターネット文化の象徴。無数の表情でミームの共通言語となったこのカエルは、コマ漫画からインターネットで最も認知度の高いアイコンの一つへと進化した。",
      bonk: "暗号資産の歴史に飛び込んだ柴犬のマスコット。コミュニティ、楽しさ、そして分散型インターネット文化の遊び心を体現している。",
      brett: "インターネットの気楽な相棒。落ち着いた性格と特徴的なブルーの見た目で知られ、Web3コミュニティで多くの熱心なファンを持つ、ミーム文化のリラックスした側面を代表する存在。",
    },
    roast: { eyebrow: "容赦なし", title: "ロースト・ミー", desc: "あなたのプロフィールを取得して、その場でローストします。" },
    leaderboard: { eyebrow: "トップ100", title: "リーダーボード" },
    tasks: {
      eyebrow: "ポイントを獲得", title: "ポイントを集める",
      desc: "以下のタスクを完了してリーダーボードを上げよう。",
      followJoin: "フォロー & 参加", tweetEngagement: "ツイートエンゲージメント",
      followDesc: "ドロップ・アルファ情報・告知のためGOMEをXでフォロー。",
      openOnX: "Xで開く", claimed: "獲得済み",
      open: "開く →", wait: "{s}秒待つ…",
      like: "いいね", retweet: "リツイート", commentTag: "コメント & タグ付け",
      postId: "投稿 #{id}",
    },
    lb: {
      yourRank: "あなたの順位：", with: "ポイント",
      empty: "まだランキングがありません —— 最初のポイントを獲得しよう。",
      rank: "順位", user: "ユーザー", stars: "ポイント", joined: "{date} に参加",
      viewAll: "全ランキングを見る →",
    },
    wl: {
      confirmTitle: "ホワイトリストに申請",
      confirmDesc: "簡単なタスクとウォレットアドレスで、確定ミント枠の抽選に参加できます。",
      notNow: "今はしない", letsGo: "進む →",
      formTitle: "ホワイトリスト申請", applyingAs: "申請者：@{handle}",
      completeTasks: "タスクを完了",
      follow: "@GomeJpegをフォロー", retweet: "固定ポストをリツイート", quote: "固定ポストを引用ツイート",
      quotePlaceholder: "引用ツイートのリンクを貼り付け", done: "完了 ✓", go: "進む →",
      walletLabel: "EVMウォレットアドレス",
      walletRequired: "ウォレットアドレスは必須です。",
      walletInvalid: "有効なEVMアドレス（0x…）ではないようです。",
      quoteRequired: "引用ツイートのリンクを貼り付けてください。",
      submitFailed: "送信に失敗しました。再度お試しください。",
      submitting: "送信中…", submit: "申請を送信 →",
      successAlready: "選考待ちリストに入りました", successNew: "申請を受け付けました",
      successDesc: "申請は人力で審査します。選考結果は@GomeJpegをご確認ください。",
      close: "閉じる",
    },
  },
};

function getPath(obj: any, path: string) {
  return path.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);
}

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: string, vars?: Record<string, string | number>) => string };
const LanguageContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "gome_lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (saved && (saved === "en" || saved === "zh" || saved === "ja")) return saved;
    } catch { /* noop */ }
    return "en";
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch { /* noop */ }
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);

  const t = (key: string, vars?: Record<string, string | number>) => {
    let val = getPath(dict[lang], key);
    if (val === undefined) val = getPath(dict.en, key); // fallback to English
    if (typeof val !== "string") return key;
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => { val = val.replace(`{${k}}`, String(v)); });
    }
    return val;
  };

  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage() must be used inside <LanguageProvider>");
  return ctx;
}
