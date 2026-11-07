import { Suspense } from "react";
import { cookies } from "next/headers";
import TradingViewWidget from "@/components/TradingViewWidget";
import Panel from "@/components/Panel";
import IndexPulse, { PulseSkeleton } from "@/components/IndexPulse";
import DataFreshness from "@/components/DataFreshness";
import MarketSwitcher from "@/components/MarketSwitcher";
import SaudiQuotesTable, { SaudiMovers } from "@/components/SaudiQuotes";
import {
    CRYPTO_HEATMAP_CONFIG,
    STOCK_HEATMAP_CONFIG,
    marketOverviewConfig,
    marketQuotesConfig,
    timelineConfig,
} from "@/lib/constants";
import { MARKETS, MARKET_COOKIE, getMarket, isMarketOpen, marketForCountry } from "@/lib/markets";
import { getSession } from "@/lib/better-auth/auth";

const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

// Widgets come from TradingView (live, no Finnhub quota) and render immediately; the tiles stream in.
export default async function Dashboard({ searchParams }: { searchParams: Promise<{ market?: string }> }) {
    const { market: requested } = await searchParams;
    // Explicit choice, then the remembered one, then the market of the user's country
    const saved = (await cookies()).get(MARKET_COOKIE)?.value;
    const market = getMarket(requested ?? saved ?? marketForCountry((await getSession())?.user.country));
    const open = isMarketOpen(market);
    const native = market.pulse.some((p) => p.finnhub);
    const pulseSub = native ? '通过 Finnhub 获取的共享行情' : market.yahoo ? '通过 Yahoo Finance 获取的延迟行情' : `通过 TradingView 获取的 ${market.feed} 行情`;
    const heatmap = market.heatmap === 'stocks'
        ? { script: 'stock-heatmap.js', config: STOCK_HEATMAP_CONFIG, title: '标普 500 热力图' }
        : market.heatmap === 'crypto'
            ? { script: 'crypto-coins-heatmap.js', config: CRYPTO_HEATMAP_CONFIG, title: '加密货币热力图' }
            : null;

    return (
        <>
            <header className="page-head">
                <div>
                    <h1 className="page-title">市场</h1>
                    <p className="page-sub">{market.name} · {open ? '开盘中' : '已收盘'} · {market.feed.toLowerCase()} 数据</p>
                </div>
            </header>

            <MarketSwitcher active={market.id} openIds={MARKETS.filter((m) => isMarketOpen(m)).map((m) => m.id)} />

            <section className="hatch">
                <div className="section-head">
                    <div>
                        <h2 className="section-title">市场脉动</h2>
                        <p className="section-sub">{pulseSub}</p>
                    </div>
                    {native && <DataFreshness />}
                </div>
                {/* Keyed so switching markets swaps the tiles instead of reusing old widgets */}
                <Suspense key={market.id} fallback={<PulseSkeleton />}>
                    <IndexPulse market={market} />
                </Suspense>
            </section>

            <div key={market.id} className="flex flex-col gap-3">
                <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
                    {market.yahoo ? (
                        <Panel title="异动股" sub="今日涨跌幅最大的股票">
                            <SaudiMovers market={market} />
                        </Panel>
                    ) : (
                        <Panel title="领涨股" sub="按板块划分的 12 个月走势">
                            <TradingViewWidget scriptUrl={`${scriptUrl}market-overview.js`} config={marketOverviewConfig(market.groups)} height={560} />
                        </Panel>
                    )}
                    {heatmap ? (
                        <Panel title={heatmap.title} sub="按市值缩放，按今日涨跌着色">
                            <TradingViewWidget scriptUrl={`${scriptUrl}${heatmap.script}`} config={heatmap.config} height={560} allowExpand />
                        </Panel>
                    ) : (
                        <Panel title="行情" sub={`${market.name} 各板块龙头`}>
                            {market.yahoo
                                ? <SaudiQuotesTable market={market} />
                                : <TradingViewWidget scriptUrl={`${scriptUrl}market-quotes.js`} config={marketQuotesConfig(market.groups)} height={560} />}
                        </Panel>
                    )}
                </div>

                <div className="grid gap-3 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                    {heatmap && (
                        <Panel title="行情" sub={`${market.name} 各板块龙头`}>
                            <TradingViewWidget scriptUrl={`${scriptUrl}market-quotes.js`} config={marketQuotesConfig(market.groups)} height={560} />
                        </Panel>
                    )}
                    <Panel title="热门新闻" sub="最新优先" className={heatmap ? '' : 'xl:col-span-2'}>
                        <TradingViewWidget scriptUrl={`${scriptUrl}timeline.js`} config={timelineConfig(market.news)} height={560} />
                    </Panel>
                </div>
            </div>
        </>
    );
}
