import Link from "next/link";
import { ArrowUpRight, Bell, CandlestickChart, Command, GitPullRequest, Github, Grid3x3, HeartHandshake, MailOpen, MessagesSquare, Star } from "lucide-react";
import { MarketDial, MarketStatus } from "@/components/landing/MarketClock";
import ProductPreview from "@/components/landing/ProductPreview";
import SectionHead from "@/components/marketing/SectionHead";
import IconCard from "@/components/marketing/IconCard";
import { getSession } from "@/lib/better-auth/auth";
import { formatCount, getRepoStats } from "@/lib/github";
import { cn } from "@/lib/utils";
import { sidebarSponsors } from "@/lib/sponsors";
import { DISCORD_URL, GOOD_FIRST_ISSUES_URL, REPO_URL } from "@/lib/constants";

const FEATURES = [
    { icon: CandlestickChart, title: '会动的图表', body: '任意上市公司的 TradingView 蜡烛图、技术指标与财务数据，需要空间时可全屏。' },
    { icon: Bell, title: '邮件提醒', body: '使用 OpenStock Cloud，在价格上方或下方设定目标。我们每五分钟检查一次，越过目标时发邮件通知。' },
    { icon: MessagesSquare, title: '一眼看情绪', body: '来自 Reddit、X.com、新闻与 Polymarket 的热度与看涨情绪，每只股票并排呈现。' },
    { icon: Grid3x3, title: '整个市场', body: '开盘前，在一个屏幕上看到板块热力图、异动股与头条新闻。' },
    { icon: Command, title: '用 ⌘K 找任何东西', body: '搜索 Finnhub 覆盖的每个交易所，像浏览器一样把股票作为标签页打开。' },
    { icon: MailOpen, title: '周一摘要', body: '为你关注的股票提供的简短 AI 撰写的一周新闻摘要。' },
];

const TIERS = [
    {
        name: '社区版', price: '免费', cadence: '每小时', perHour: 1,
        body: '就是本站。行情每小时刷新一次，由所有人共享。图表保持实时。',
        cta: { label: '开始使用', href: '/sign-up' },
    },
    {
        name: 'OpenStock Cloud', price: '$5', per: '/月', tag: '即将推出', cadence: '每 15 秒', perHour: 240,
        body: '同一个应用，拥有实时行情与邮件价格提醒，托管在市场数据密钥池上。无需任何设置。',
        cta: { label: '在 Discord 上获取通知', href: DISCORD_URL },
    },
    {
        name: '自部署', price: '免费', cadence: '由你决定', perHour: 240,
        body: '用你自己的 Finnhub 密钥在你自己的服务器上运行：为你与你的团队提供实时行情与提醒。',
        cta: { label: '部署指南', href: '#self-host' },
    },
];

const SUPPORT = [
    {
        icon: HeartHandshake, title: '赞助', primary: true,
        body: '每月 5 美元起的档位、一次性捐赠或定制合作。赞助者会展示在本站、应用内与 README 中。',
        cta: { label: '查看赞助档位', href: '/sponsor' },
    },
    {
        icon: GitPullRequest, title: '贡献',
        body: '挑选一个 good first issue、改进文档或设计一个界面。每次合并的拉取请求都让 OpenStock 继续前进。',
        cta: { label: 'Good first issues', href: GOOD_FIRST_ISSUES_URL },
    },
    {
        icon: Star, title: '口口相传',
        body: '给仓库点星，并分享给那个为几乎不用的终端付费的人。',
        cta: { label: '在 GitHub 上点星', href: REPO_URL },
    },
];

// 60 minutes of updates drawn as ticks: one line per refresh.
const CadenceRail = ({ perHour }: { perHour: number }) => (
    <div
        className="h-7 rounded-md bg-page shadow-[inset_0_0_0_1px_var(--line)]"
        style={{
            backgroundImage: perHour > 1
                ? `repeating-linear-gradient(90deg, var(--brand) 0 1px, transparent 1px calc(100% / ${perHour}))`
                : 'linear-gradient(90deg, var(--brand) 0 2px, transparent 2px)',
        }}
        aria-hidden
    />
);

// Floats in the empty gutter beside the 1200px column, so it only shows on screens wide enough to have one.
const SponsorBanner = () => {
    const [sponsor] = sidebarSponsors();
    if (!sponsor) return null;
    return (
        <aside aria-label="赞助者" className="fixed top-[130px] z-30 hidden w-[200px] right-[calc((100vw-1200px)/4-100px)] min-[1680px]:block">
            <a href={sponsor.url} target="_blank" rel="noreferrer" className="hatch group">
                <div className="card flex flex-col gap-4 p-5">
                    <p className="kicker flex items-center gap-1.5 text-brand-ink"><span className="live-dot" /> 赞助</p>
                    {sponsor.logo && <img src={sponsor.logo} alt={sponsor.iconOnly ? '' : sponsor.name} className="h-14 w-auto self-start" />}
                    <div>
                        <p className="text-[17px] font-bold tracking-[-0.02em]">{sponsor.name}</p>
                        {sponsor.blurb && <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{sponsor.blurb}</p>}
                    </div>
                    <span className="btn btn-ghost h-9 text-[13px] group-hover:bg-[var(--hover)] group-hover:text-foreground">访问 {sponsor.name} <ArrowUpRight /></span>
                </div>
            </a>
        </aside>
    );
};

export default async function LandingPage() {
    const [session, repo] = await Promise.all([getSession(), getRepoStats()]);
    const start = session?.user ? { href: '/dashboard', label: '打开仪表盘' } : { href: '/sign-up', label: '免费开始使用' };

    return (
        <>
            <SponsorBanner />
            <section className="mx-auto grid max-w-[1200px] items-center gap-12 px-5 pt-14 md:pt-20 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div>
                    <MarketStatus />
                    <h1 className="mt-6 text-[44px] font-bold leading-[1.02] tracking-[-0.05em] md:text-[68px]">
                        市场资讯，<br />不再有付费墙。
                    </h1>
                    <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-muted-foreground">
                        OpenStock 是昂贵市场平台的开源替代品。追踪价格、关注整个市场、深入挖掘
                        公司洞察，公开构建、面向所有人。
                    </p>
                    <div className="mt-8 flex flex-wrap items-center gap-2">
                        <Link href={start.href} className="btn btn-primary h-11 px-5 text-[15px]">{start.label}</Link>
                        <a href={REPO_URL} target="_blank" rel="noreferrer" className="btn btn-ghost h-11 px-5 text-[15px]">
                            <Github /> 自行部署
                            {repo && <span className="num text-faint">{formatCount(repo.stars)} 颗星</span>}
                        </a>
                    </div>
                </div>
                <div className="hatch">
                    <div className="card px-6 pb-5 pt-6"><MarketDial /></div>
                </div>
            </section>

            <section className="mx-auto mt-16 max-w-[1200px] px-5">
                <ProductPreview />
            </section>

            <section id="inside" className="mx-auto mt-28 max-w-[1200px] scroll-mt-24 px-5">
                <SectionHead kicker="包含什么" title="为不在银行工作的人准备的终端。" sub="跟随市场所需的一切，都在一个地方，无需订阅。" />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {FEATURES.map(({ icon, title, body }) => (
                        <IconCard key={title} icon={icon} title={title}>{body}</IconCard>
                    ))}
                </div>
            </section>

            <section id="data" className="mx-auto mt-28 max-w-[1200px] scroll-mt-24 px-5">
                <SectionHead
                    kicker="数据"
                    title="选择数据的保鲜程度。"
                    sub="图表始终从 TradingView 实时流式传输。行情、自选与提醒来自 Finnhub，更新频率如下。"
                />
                <div className="grid gap-3 lg:grid-cols-3">
                    {TIERS.map((tier) => (
                        <div key={tier.name} className="hatch">
                            <div className="card flex h-full flex-col gap-4 p-5">
                                <div className="flex items-center justify-between gap-3">
                                    <h3 className="text-[18px] font-bold tracking-[-0.02em]">{tier.name}</h3>
                                    {tier.tag && <span className="pill is-brand">{tier.tag}</span>}
                                </div>
                                <p className="bento-value text-[30px]">{tier.price}{tier.per && <small className="text-faint"> {tier.per}</small>}</p>
                                <p className="text-[14px] leading-relaxed text-muted-foreground">{tier.body}</p>
                                <div className="mt-auto flex flex-col gap-2">
                                    <CadenceRail perHour={tier.perHour} />
                                    <p className="num flex justify-between text-[12px] text-faint">
                                        <span>{tier.cadence}</span>
                                        <span>{tier.perHour} {tier.perHour === 1 ? '次更新' : '次更新'} / 小时</span>
                                    </p>
                                </div>
                                <Link
                                    href={tier.cta.href}
                                    className={cn('btn', tier.name === 'Community' ? 'btn-primary' : 'btn-ghost')}
                                    {...(tier.cta.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                                >
                                    {tier.cta.label}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section id="self-host" className="mx-auto mt-28 grid max-w-[1200px] scroll-mt-24 items-start gap-10 px-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
                <div>
                    <SectionHead
                        kicker="自部署"
                        title="你的服务器、你的密钥、实时行情。"
                        sub="想加多少免费 Finnhub 密钥都可以：每个密钥每分钟增加 60 次请求。把数据模式切换为 realtime，价格每 15 秒刷新一次。"
                    />
                    <a href={`${REPO_URL}#docker-setup`} target="_blank" rel="noreferrer" className="btn btn-ghost">完整部署指南见 README</a>
                </div>
                <div className="hatch">
                    <pre className="card mono overflow-x-auto p-5 text-[13px] leading-7 text-muted-foreground">
                        <span className="text-faint">$ </span><span className="text-foreground">git clone {REPO_URL}.git</span>{'\n'}
                        <span className="text-faint">$ </span><span className="text-foreground">cd OpenStock</span>{'\n\n'}
                        <span className="text-faint"># .env（所有变量都在 README 中）</span>{'\n'}
                        <span className="text-brand-ink">FINNHUB_API_KEYS</span>=key_one,key_two,key_three{'\n'}
                        <span className="text-brand-ink">NEXT_PUBLIC_OPENSTOCK_DATA_MODE</span>=realtime{'\n\n'}
                        <span className="text-faint">$ </span><span className="text-foreground">docker compose up -d --build</span>
                    </pre>
                </div>
            </section>

            <section id="sponsor" className="mx-auto mt-28 max-w-[1200px] scroll-mt-24 px-5">
                <SectionHead
                    kicker="支持"
                    title="OpenStock 欢迎赞助。"
                    sub="它保持免费，是因为有个人与公司的支持。量力而行，或用时间来贡献。"
                />
                <div className="grid gap-3 lg:grid-cols-3">
                    {SUPPORT.map(({ icon, title, body, cta, primary }) => (
                        <IconCard
                            key={title}
                            icon={icon}
                            title={title}
                            footer={
                                <a href={cta.href} {...(cta.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})} className={cn('btn w-full', primary ? 'btn-primary' : 'btn-ghost')}>
                                    {cta.label}
                                </a>
                            }
                        >
                            {body}
                        </IconCard>
                    ))}
                </div>
            </section>

            <section className="mx-auto mt-28 max-w-[1200px] px-5">
                <div className="hatch">
                    <div className="card grid gap-10 p-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:p-12">
                        <div>
                            <p className="kicker text-brand-ink">Open Dev Society</p>
                            <blockquote className="mt-4 text-[26px] font-semibold leading-snug tracking-[-0.03em] md:text-[30px]">
                                技术应属于每一个人。知识应当开放、自由、触手可及。
                            </blockquote>
                            <div className="mt-8 flex flex-wrap gap-2">
                                <Link href={start.href} className="btn btn-primary h-11 px-5 text-[15px]">{start.label}</Link>
                                <Link href="/about" className="btn btn-ghost h-11 px-5 text-[15px]">阅读宣言</Link>
                            </div>
                        </div>
                        {repo && (
                            <dl className="grid grid-cols-2 content-end gap-3">
                                {[
                                    ['星标', formatCount(repo.stars)],
                                    ['复刻', formatCount(repo.forks)],
                                    ['许可证', repo.license ?? 'AGPL-3.0'],
                                    ['开发语言', 'TypeScript'],
                                ].map(([label, value]) => (
                                    <div key={label} className="bento-tile col-span-1 bg-page">
                                        <dt className="kicker">{label}</dt>
                                        <dd className="bento-value text-[26px]">{value}</dd>
                                    </div>
                                ))}
                            </dl>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}
