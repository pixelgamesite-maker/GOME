import { createContext, useContext, useEffect, useState } from "react";

/**
 * Lightweight i18n — no external library, just a context + dictionary.
 * Wrap your app root with <LanguageProvider> (see App.tsx snippet),
 * then call useLanguage() anywhere to get { lang, setLang, t }.
 *
 * NOTE ON TRANSLATION QUALITY: these zh/ko strings were machine-translated
 * by Claude, not reviewed by a native speaker. They should read fine for
 * UI labels, but get a native speaker to pass over the copy (especially
 * the character blurbs and whitelist/legal-adjacent text) before this
 * goes live publicly.
 */

export type Lang = "en" | "zh" | "ko";
export const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
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

  ko: {
    nav: { out: "로그아웃", pts: "포인트" },
    hero: {
      status: "OpenSea에서 민팅 중",
      subtitle: "밈 갤러리",
      tagline: "인터넷에서 가장 상징적인 밈들을 모은 갤러리 — 아는 사람들을 위해 만들었습니다.",
    },
    stat: { mintPrice: "민팅 가격", supply: "발행량", chain: "체인", launchpad: "런치패드", tba: "미정" },
    cta: { gallery: "갤러리", collab: "콜라보", whitelist: "화이트리스트" },
    explore: {
      eyebrow: "탐험하기",
      title: "갤러리로 들어가기",
      desc: "Pepe, Brett, Bonk, 세계관 설정 등 GOME의 모든 것을 한곳에서 만나보세요.",
      button: "갤러리로 들어가기 →",
    },
    collection: {
      eyebrow: "컬렉션",
      title: "멤버들을 소개합니다",
      captionSuffix: "발행량 · 더 많은 콘텐츠가 곧 공개됩니다",
    },
    character: {
      pepe: "인터넷 문화의 상징. 수많은 표정으로 밈의 공통 언어가 된 이 개구리는 만화 컷에서 인터넷에서 가장 알아보기 쉬운 아이콘 중 하나로 발전했습니다.",
      bonk: "암호화폐 역사에 뛰어든 시바견 마스코트. 커뮤니티, 즐거움, 그리고 탈중앙화 인터넷 문화의 장난스러운 정신을 담고 있습니다.",
      brett: "인터넷의 느긋한 친구. 차분한 성격과 시그니처 블루 컬러로 알려진 Brett은 밈 문화의 여유로운 면을 대표하며, Web3 커뮤니티에서 많은 충성 팬을 보유하고 있습니다.",
    },
    roast: { eyebrow: "자비 없음", title: "나를 놀려줘", desc: "당신의 프로필을 가져와서 그 자리에서 놀려드립니다." },
    leaderboard: { eyebrow: "상위 100명", title: "리더보드" },
    tasks: {
      eyebrow: "포인트 획득", title: "포인트 모으기",
      desc: "아래 작업을 완료하고 리더보드 순위를 올려보세요.",
      followJoin: "팔로우 & 참여", tweetEngagement: "트윗 참여",
      followDesc: "드롭, 알파 정보, 공지사항을 위해 X에서 GOME을 팔로우하세요.",
      openOnX: "X에서 열기", claimed: "수령 완료",
      open: "열기 →", wait: "{s}초 대기…",
      like: "좋아요", retweet: "리트윗", commentTag: "댓글 & 태그",
      postId: "게시물 #{id}",
    },
    lb: {
      yourRank: "내 순위:", with: "포인트",
      empty: "아직 순위가 없습니다 — 첫 포인트를 획득해보세요.",
      rank: "순위", user: "사용자", stars: "포인트", joined: "{date} 가입",
      viewAll: "전체 리더보드 보기 →",
    },
    wl: {
      confirmTitle: "화이트리스트 신청",
      confirmDesc: "간단한 작업 몇 가지와 지갑 주소만 있으면 확정 민팅 자리 추첨에 참여할 수 있습니다.",
      notNow: "나중에", letsGo: "시작하기 →",
      formTitle: "화이트리스트 신청서", applyingAs: "신청자: @{handle}",
      completeTasks: "작업 완료하기",
      follow: "@GomeJpeg 팔로우", retweet: "고정 게시물 리트윗", quote: "고정 게시물 인용 트윗",
      quotePlaceholder: "인용 트윗 링크를 붙여넣으세요", done: "완료 ✓", go: "이동 →",
      walletLabel: "EVM 지갑 주소",
      walletRequired: "지갑 주소를 입력해주세요.",
      walletInvalid: "유효한 EVM 주소(0x…)가 아닌 것 같습니다.",
      quoteRequired: "인용 트윗 링크를 붙여넣어 주세요.",
      submitFailed: "제출에 실패했습니다. 다시 시도해주세요.",
      submitting: "제출 중…", submit: "신청서 제출 →",
      successAlready: "대기 목록에 등록되었습니다", successNew: "신청이 접수되었습니다",
      successDesc: "모든 신청은 수동으로 검토됩니다. 선정 결과는 @GomeJpeg를 확인해주세요.",
      close: "닫기",
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
      if (saved && (saved === "en" || saved === "zh" || saved === "ko")) return saved;
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
