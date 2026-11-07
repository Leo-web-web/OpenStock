import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import JsonLd from '@/components/seo/JsonLd';
import SignUpCta from '@/components/seo/SignUpCta';
import TradingViewEmbed from '@/components/seo/TradingViewEmbed';
import { getSession } from '@/lib/better-auth/auth';
import { CANDLE_CHART_WIDGET_CONFIG, symbolInfoConfig } from '@/lib/constants';
import { companyBrowseUrl, formatFilingDate, getEdgarCompany, type EdgarFiling } from '@/lib/seo/edgar';
import { GUIDES } from '@/lib/seo/comparisons';
import { siteUrl } from '@/lib/seo/site';
import { adjacentTickers, findTicker, relatedTickers, sectorAnchor, tickerIntro, tickerPath, type UsTicker } from '@/lib/seo/tickers';
import { formatSymbolForTradingView, tradingViewSymbolUrl } from '@/lib/utils';

const WIDGET = 'https://s3.tradingview.com/external-embedding/embed-widget-';

// Public company page. Charts are TradingView widgets. Facts are SEC EDGAR submissions.
// The signed-in stock page (/stocks/[symbol]) is a different route and is unchanged.
export const dynamic = 'force-dynamic';

type Params = { ticker: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
    const { ticker: raw } = await params;
    const ticker = findTicker(raw);
    if (!ticker) return { title: '未找到股票 | OpenStock', robots: { index: false, follow: false } };

    const title = `${ticker.name} (${ticker.symbol}) 股票图表与 SEC 备案文件 | OpenStock`;
    const description = tickerIntro(ticker);
    const url = `${siteUrl()}${tickerPath(ticker.symbol)}`;
    return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: { title, description, url, siteName: 'OpenStock', type: 'website' },
        twitter: { card: 'summary', title, description },
        robots: { index: true, follow: true },
    };
}

function FilingRow({ label, filing }: { label: string; filing: EdgarFiling | null }) {
    return (
        <div className="flex flex-col gap-1">
            <dt className="kicker">{label}</dt>
            <dd className="text-[15px]">
                {filing ? (
                    <a href={filing.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground underline decoration-[var(--line)] underline-offset-4 hover:decoration-foreground">
                        {filing.form} 提交于 {formatFilingDate(filing.filed)}
                    </a>
                ) : (
                    <span className="text-muted-foreground">不在最近的 EDGAR 索引中</span>
                )}
            </dd>
        </div>
    );
}

export default async function PublicTickerPage({ params }: { params: Promise<Params> }) {
    const { ticker: raw } = await params;
    const ticker = findTicker(raw);
    if (!ticker) notFound();

    const [edgar, session] = await Promise.all([
        getEdgarCompany(ticker.cik),
        getSession(),
    ]);

    const origin = siteUrl();
    const path = tickerPath(ticker.symbol);
    const url = `${origin}${path}`;
    const tvSymbol = formatSymbolForTradingView(ticker.symbol);
    const tvHref = tradingViewSymbolUrl(tvSymbol);
    const signedIn = !!session?.user;
    const peers = relatedTickers(ticker);
    const { prev, next } = adjacentTickers(ticker);
    const title = `${ticker.name} (${ticker.symbol}) 股票图表与 SEC 备案文件`;
    const filingsUrl = edgar?.filingsUrl ?? (ticker.cik ? companyBrowseUrl(ticker.cik) : 'https://www.sec.gov/edgar/search/');

    return (
        <article className="mx-auto max-w-[1200px] px-5 pt-10 pb-4">
            <JsonLd data={structuredData({ ticker, origin, url, title, description: tickerIntro(ticker) })} />

            <nav aria-label="面包屑导航" className="flex flex-wrap items-center gap-x-2 text-[13px] font-semibold text-muted-foreground">
                <Link href="/" className="hover:text-foreground">OpenStock</Link>
                <span aria-hidden>/</span>
                <Link href="/s" className="hover:text-foreground">美股</Link>
                <span aria-hidden>/</span>
                <Link href={`/s#${sectorAnchor(ticker.sector)}`} className="hover:text-foreground">{ticker.sector}</Link>
                <span aria-hidden>/</span>
                <span className="text-foreground">{ticker.symbol}</span>
            </nav>

            <header className="mt-6 max-w-3xl">
                <p className="kicker text-brand-ink">{ticker.exchange || 'US'} · {ticker.symbol}</p>
                <h1 className="mt-2 text-[36px] font-bold leading-[1.05] tracking-[-0.045em] md:text-[48px]">{ticker.name}</h1>
                <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground">{tickerIntro(ticker)}</p>
            </header>

            <div className="mt-8 flex flex-wrap gap-2">
                <Link href={signedIn ? `/stocks/${encodeURIComponent(ticker.symbol)}` : '/sign-up'} className="btn btn-primary h-11 px-5 text-[15px]">
                    {signedIn ? `在应用中打开 ${ticker.symbol}` : `免费追踪 ${ticker.symbol}`}
                </Link>
                <a href={tvHref} target="_blank" rel="noopener nofollow" className="btn btn-ghost h-11 px-5 text-[15px]">在 TradingView 上查看</a>
            </div>

            <div className="mt-8 flex flex-col gap-3">
                <section className="hatch">
                    <div className="card p-1">
                        <TradingViewEmbed
                            scriptUrl={`${WIDGET}symbol-info.js`}
                            config={symbolInfoConfig(tvSymbol)}
                            height={180}
                            creditHref={tvHref}
                            creditLabel={`${ticker.symbol} 行情由 TradingView 提供`}
                        />
                    </div>
                </section>
                <section className="hatch">
                    <div className="card p-1">
                        <TradingViewEmbed
                            scriptUrl={`${WIDGET}advanced-chart.js`}
                            config={CANDLE_CHART_WIDGET_CONFIG(tvSymbol)}
                            height={560}
                            creditHref={tvHref}
                            creditLabel={`${ticker.symbol} 图表由 TradingView 提供`}
                        />
                    </div>
                </section>
            </div>

            <section className="mt-10">
                <h2 className="text-[28px] font-bold tracking-[-0.04em]">SEC 备案文件</h2>
                <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                    行业代码、财年与备案日期来自 SEC 的 EDGAR 申报数据，CIK 为 {ticker.cik}.
                    年报是 10-K 表格，外国发行人则是 20-F 或 40-F 表格。季报是 10-Q 表格（若该公司有提交）。
                </p>
                <div className="hatch mt-5">
                    <div className="card p-6">
                        {edgar ? (
                            <dl className="grid gap-6 sm:grid-cols-2">
                                <div>
                                    <dt className="kicker">SIC</dt>
                                    <dd className="mt-1 text-[15px]">{[edgar.sic, edgar.sicDescription].filter(Boolean).join(' · ') || '未列出'}</dd>
                                </div>
                                <div>
                                    <dt className="kicker">财年结束</dt>
                                    <dd className="mt-1 text-[15px]">{edgar.fiscalYearEnd || '未列出'}</dd>
                                </div>
                                <div>
                                    <dt className="kicker">注册地</dt>
                                    <dd className="mt-1 text-[15px]">{edgar.stateOfIncorporation || '未列出'}</dd>
                                </div>
                                <FilingRow label="最新年报" filing={edgar.annual} />
                                <FilingRow label="最新季报" filing={edgar.quarterly} />
                                <div>
                                    <dt className="kicker">全部备案文件</dt>
                                    <dd className="mt-1 text-[15px]">
                                        <a href={edgar.filingsUrl} target="_blank" rel="noopener noreferrer" className="font-semibold underline decoration-[var(--line)] underline-offset-4 hover:decoration-foreground">
                                            {ticker.name} 在 EDGAR 上
                                        </a>
                                    </dd>
                                </div>
                            </dl>
                        ) : (
                            <p className="text-[15px] leading-relaxed text-muted-foreground">
                                EDGAR 刚刚没有返回这家公司的数据。上方图表不受影响。{' '}
                                <a href={filingsUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground underline decoration-[var(--line)] underline-offset-4">
                                    在 EDGAR 上打开 {ticker.symbol}
                                </a>
                                .
                            </p>
                        )}
                    </div>
                </div>
            </section>

            <section className="mt-12">
                <h2 className="text-[22px] font-bold tracking-[-0.03em]">同属 {ticker.sector} 的更多公司</h2>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    {peers.map((peer) => (
                        <li key={peer.symbol}>
                            <Link href={tickerPath(peer.symbol)} className="card flex items-baseline justify-between gap-3 px-3 py-2 hover:bg-hover/40">
                                <span className="truncate text-[14px]">{peer.name}</span>
                                <span className="mono shrink-0 text-[12px] text-faint">{peer.symbol}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
                <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[13px] font-semibold text-muted-foreground">
                    {prev && <Link href={tickerPath(prev.symbol)} className="hover:text-foreground">上一只：{prev.symbol}</Link>}
                    {next && <Link href={tickerPath(next.symbol)} className="hover:text-foreground">下一只：{next.symbol}</Link>}
                    <Link href="/s" className="hover:text-foreground">全部美股</Link>
                </p>
            </section>

            <section className="mt-12">
                <h2 className="text-[22px] font-bold tracking-[-0.03em]">关于追踪 {ticker.symbol} 的问题</h2>
                <div className="hatch mt-4">
                    <div className="card row-list overflow-hidden">
                        <details className="group">
                            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold [&::-webkit-details-marker]:hidden">
                                本页显示实时价格吗？
                                <ChevronDown className="size-4 flex-none text-faint transition-transform group-open:rotate-180" />
                            </summary>
                            <p className="max-w-3xl px-5 pb-5 text-[15px] leading-relaxed text-muted-foreground">
                                图表中的数字由你浏览器中的 TradingView 挂件渲染。OpenStock 不在本页自行发布报价。免费账号可将 {ticker.symbol} 加入自选；邮件提醒（若该部署支持）在应用内运行。
                            </p>
                        </details>
                        <details className="group">
                            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold [&::-webkit-details-marker]:hidden">
                                备案日期来自哪里？
                                <ChevronDown className="size-4 flex-none text-faint transition-transform group-open:rotate-180" />
                            </summary>
                            <p className="max-w-3xl px-5 pb-5 text-[15px] leading-relaxed text-muted-foreground">
                                来自 SEC 的 EDGAR 申报数据，CIK 为 {ticker.cik || '这家公司'}。链接会在 sec.gov 上打开备案文件。OpenStock 与 SEC 没有关联。
                            </p>
                        </details>
                    </div>
                </div>
            </section>

            <nav aria-label="相关指南" className="mt-10 flex flex-wrap gap-x-4 gap-y-2 text-[13px] font-semibold text-muted-foreground">
                {GUIDES.slice(0, 4).map((guide) => (
                    <Link key={guide.slug} href={`/compare/${guide.slug}`} className="hover:text-foreground">{guide.title}</Link>
                ))}
            </nav>

            <div className="mt-10">
                <SignUpCta
                    title={`在 OpenStock 上免费追踪 ${ticker.symbol}`}
                    body="把它存入自选，在标签页中保持图表打开，并在一个地方阅读备案文件。OpenStock 不是券商，这里没有任何内容构成投资建议。"
                    href={signedIn ? `/stocks/${encodeURIComponent(ticker.symbol)}` : '/sign-up'}
                    label={signedIn ? `打开 ${ticker.symbol}` : `免费追踪 ${ticker.symbol}`}
                />
            </div>
        </article>
    );
}

function structuredData({ ticker, origin, url, title, description }: { ticker: UsTicker; origin: string; url: string; title: string; description: string }) {
    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'OpenStock', item: `${origin}/` },
                    { '@type': 'ListItem', position: 2, name: '美股', item: `${origin}/s` },
                    { '@type': 'ListItem', position: 3, name: ticker.sector, item: `${origin}/s#${sectorAnchor(ticker.sector)}` },
                    { '@type': 'ListItem', position: 4, name: `${ticker.name} (${ticker.symbol})`, item: url },
                ],
            },
            {
                '@type': 'Corporation',
                name: ticker.name,
                tickerSymbol: ticker.symbol,
                url: ticker.cik ? companyBrowseUrl(ticker.cik) : url,
                ...(ticker.sector ? { industry: ticker.sector } : {}),
            },
            {
                '@type': 'WebPage',
                name: title,
                description,
                url,
                isPartOf: { '@type': 'WebSite', name: 'OpenStock', url: origin },
            },
        ],
    };
}
