// Everything sponsor-related lives here: edit this file when someone starts or stops sponsoring.
// Perks only name placements the code actually renders (README, sponsor wall, site footer,
// landing page, in-app sidebar), so the page never promises something the site doesn't do.

export type Sponsor = {
    name: string;
    url: string;
    logo?: string;       // white/transparent logo in /public, shown on dark surfaces
    iconOnly?: boolean;  // logo is a mark without the name, so the name is shown beside it
    banner?: string;     // sponsor-supplied banner, shown whole in the sponsor band instead of the logo
    blurb?: string;      // one line for the floating banner on the landing page
    tier?: SponsorTierId;
    period?: string;     // e.g. "2026"
};

export type SponsorTierId = 'backer' | 'supporter' | 'company' | 'partner';

// One border colour per tier, shared by the tier cards on /sponsor and the sponsor band.
export const TIER_COLOR: Record<SponsorTierId, string> = {
    backer: 'oklch(0.72 0.11 50)',
    supporter: 'oklch(0.72 0.12 250)',
    company: 'oklch(0.8 0.13 176)',
    partner: 'oklch(0.72 0.14 300)',
};
export const tierBorder = (tier: SponsorTierId) => `color-mix(in oklch, ${TIER_COLOR[tier]} 55%, transparent)`;

// Registered accounts on the hosted app (13K+ as of September 2026). Update from the user collection count.
export const REGISTERED_USERS = '13,000+';

// Partners share the app sidebar; the Partner tier sells exactly this many slots.
export const SIDEBAR_SPONSOR_SLOTS = 3;

export const SPONSOR_TIERS: {
    id: SponsorTierId;
    name: string;
    monthly: number;
    blurb: string;
    perks: string[];
    slots?: number;
    featured?: boolean;
}[] = [
    {
        id: 'backer', name: '支持者', monthly: 5,
        blurb: '适合使用 OpenStock 并希望它保持免费的人。',
        perks: ['你的名字出现在 README 赞助名单中', '我们每月的感谢'],
    },
    {
        id: 'supporter', name: '赞助者', monthly: 25,
        blurb: '适合希望公开支持开源的常客。',
        perks: ['包含支持者档的全部权益', '名字与头像展示在赞助墙上', '列在本页面上'],
    },
    {
        id: 'company', name: '企业', monthly: 100, featured: true,
        blurb: '适合面向开发者与投资者的团队与产品。',
        perks: ['Logo 展示在每个公开页面的页脚', 'Logo 展示在 README 中', 'Logo 展示在本页面，并链接到你的网站'],
    },
    {
        id: 'partner', name: '合作伙伴', monthly: 500, slots: SIDEBAR_SPONSOR_SLOTS,
        blurb: 'OpenStock 中最显眼的位置，仅限三席。',
        perks: ['包含企业档的全部权益', `应用侧边栏三席赞助位之一，${REGISTERED_USERS} 名注册用户可见`, 'Logo 展示在着陆页上'],
    },
];

export const ACTIVE_SPONSORS: Sponsor[] = [
    { name: 'Orbit', url: 'https://github.com/diip3sh/orbit', logo: '/assets/icons/orbit.png', iconOnly: true, tier: 'partner', blurb: '免费开源的 macOS 录屏与视频编辑器。' },
    { name: 'RapidProxy', url: 'https://www.rapidproxy.io/?ref=openstock', logo: '/assets/icons/rapidproxy.png', banner: '/assets/images/rapidproxy-banner.png', tier: 'company' },
];

export const PREVIOUS_SPONSORS: Sponsor[] = [
    { name: 'Atlas Cloud', url: 'https://www.atlascloud.ai', logo: '/assets/icons/atlascloud.svg', tier: 'partner' },
    { name: 'Siray.ai', url: 'https://www.siray.ai', logo: '/assets/icons/siray.svg', tier: 'partner', period: '2026' },
];

// People who sponsored publicly on GitHub (private sponsors stay anonymous). Avatars come from GitHub.
export const SUPPORTERS: { name: string; login: string }[] = [
    { name: 'Jonas Gunklach', login: 'jonasgunklach' },
    { name: 'Dan Sellars', login: 'xlab-nyc' },
    { name: 'Mangolito', login: 'Mangolito' },
];

// Counted from GitHub Sponsors; individual sponsors stay anonymous unless they sponsor publicly.
export const SPONSOR_GOAL = { label: '月度赞助者', target: 1000, current: 1 };

export const SPONSOR_CONTACT_EMAIL = 'opendevsociety@gmail.com';

// Who receives sponsorships today (GitHub Sponsors is on the founder's personal account).
export const SPONSOR_RECIPIENT = { name: 'Ravi Pratap Singh', handle: 'ravixalgorithm', role: 'Open Dev Society 创始人' };

// Where sponsorship money goes. Add `monthly` (USD) to a line once the real bill is known;
// the page then shows amounts and each line's share. Lines without it never show a figure.
export const FUNDING_USES: { label: string; detail: string; monthly?: number }[] = [
    { label: '托管', detail: 'Vercel 托管应用与网站，我们的流量已超出免费套餐。' },
    { label: '市场数据', detail: 'Finnhub 密钥，让所有人的行情保持快速，并让 OpenStock Cloud 得以上线。' },
    { label: '数据库', detail: 'MongoDB Atlas，用于账号、自选与提醒。' },
    { label: 'AI 与邮件', detail: 'Gemini 用于欢迎邮件与每周摘要，另加邮件发送服务。' },
    { label: '维护', detail: '用于评审社区 Pull Request、修复缺陷与发布新功能的时间。' },
];

export const sidebarSponsors = () => ACTIVE_SPONSORS.filter((s) => s.tier === 'partner').slice(0, SIDEBAR_SPONSOR_SLOTS);
