import { BarChart2, Clock, Mail, UserX } from 'lucide-react';
import PageHero from '@/components/marketing/PageHero';
import SectionHead from '@/components/marketing/SectionHead';
import IconCard from '@/components/marketing/IconCard';
import { REPO_URL } from '@/lib/constants';

export const metadata = {
    title: '架构 | OpenStock',
    description: 'OpenStock 如何运作：市场数据、后台任务与邮件背后的 AI。',
};

const DATA_MODES = [
    { name: '缓存模式', cadence: '每小时', body: '公开站点的默认模式。行情每小时拉取一次、由所有用户共享，因此成本随标的数量增长，而非用户数。' },
    { name: '实时模式', cadence: '每 15 秒', body: '面向 OpenStock Cloud 与自部署。设置 NEXT_PUBLIC_OPENSTOCK_DATA_MODE=realtime 后，屏幕上的价格实时刷新，邮件价格提醒随之开启。' },
];

const COVERAGE = [
    ['美股、加密货币', '实时', 'Yes'],
    ['外汇', '实时', 'No'],
    ['加拿大、澳大利亚', '延迟', 'No'],
    ['沙特阿拉伯（Yahoo Finance）', '延迟', 'No'],
    ['印度（BSE）、德国', '日终', 'No'],
];

const FLOW = ['用户注册，或定时任务触发', 'Inngest 运行函数', 'Gemini 撰写文本', 'Gemini 失败时由 MiniMax 接手', '邮件发出'];

const JOBS = [
    { icon: Mail, title: '欢迎邮件', trigger: '注册时', body: '根据注册时选择的国家、目标、风险与行业量身定制的 AI 撰写介绍。' },
    { icon: BarChart2, title: '每周新闻', trigger: '周一 09:00', body: '汇总一周市场新闻，以 Kit 广播形式发送。' },
    { icon: Clock, title: '价格提醒', trigger: '每 5 分钟', body: '将每个生效提醒与 Finnhub 行情比对，触发时邮件通知所有者。仅实时模式可用。' },
    { icon: UserX, title: '唤回邮件', trigger: '每天 10:00', body: '找出沉寂账号并发送温和提醒。' },
];

const STACK = [
    ['Finnhub', '行情、公司资料、搜索与新闻。多个密钥组成的密钥池，按请求轮换。', 'https://finnhub.io'],
    ['TradingView', '图表、热力图、技术指标与市场挂件，实时嵌入。', 'https://www.tradingview.com/widget/'],
    ['Inngest', '后台任务与定时调度，支持重试。', 'https://www.inngest.com'],
    ['Better Auth', '邮箱、Google 与 GitHub 登录，MongoDB 会话。', 'https://www.better-auth.com'],
    ['MongoDB Atlas', '用户、自选与提醒。', 'https://www.mongodb.com/atlas'],
    ['Kit', '每周摘要的 Newsletter 广播。', 'https://kit.com'],
];

export default function ArchitecturePage() {
    return (
        <>
            <PageHero
                kicker="架构"
                title="OpenStock 是如何运作的。"
                sub="透明呈现支撑你的市场数据与邮件的事件驱动、多服务商系统。"
            >
                <span className="pill h-8 px-3">v1.0.0</span>
                <span className="pill h-8 px-3">Gemini，MiniMax 兜底</span>
                <span className="pill h-8 px-3">开源 · AGPL-3.0</span>
            </PageHero>

            <section className="mx-auto mt-20 max-w-[1200px] px-5">
                <SectionHead kicker="市场数据" title="两种数据模式，一个缓存。" sub="图表始终从 TradingView 实时流式传输。我们自行定价的一切都经过带超时的共享缓存，因此服务商变慢也不会拖垮页面。" />
                <div className="grid gap-3 md:grid-cols-2">
                    {DATA_MODES.map(({ name, cadence, body }) => (
                        <div key={name} className="hatch">
                            <div className="card flex h-full flex-col gap-2 p-5">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-[16px] font-bold">{name}</h3>
                                    <span className="pill is-brand">{cadence}</span>
                                </div>
                                <p className="text-[14px] leading-relaxed text-muted-foreground">{body}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="hatch mt-3">
                    <div className="card overflow-x-auto">
                        <table className="data-table">
                            <thead><tr><th>市场</th><th>图表</th><th>我们的行情与提醒</th></tr></thead>
                            <tbody>
                                {COVERAGE.map(([market, charts, quotes]) => (
                                    <tr key={market}>
                                        <td className="font-semibold text-foreground">{market}</td>
                                        <td className="text-muted-foreground">{charts}</td>
                                        <td><span className={quotes === 'Yes' ? 'pill is-up' : 'pill'}>{quotes}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <a href={`${REPO_URL}/blob/main/MARKET_SUPPORT.md`} target="_blank" rel="noreferrer" className="btn btn-ghost mt-4">完整市场支持说明</a>
            </section>

            <section className="mx-auto mt-24 grid max-w-[1200px] items-start gap-10 px-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <div>
                    <SectionHead kicker="AI" title="邮件不会随某个服务商一起宕机。" sub="欢迎邮件与新闻摘要由 Gemini 2.5 Flash-Lite 撰写。若失败，请求默认会在 MiniMax-M3.1-Flash 上重试。将 MINIMAX_MODEL 设为 MiniMax-M3，或保留你配置的模型覆盖。" />
                </div>
                <div className="hatch">
                    <ol className="card flex flex-col gap-1 p-4">
                        {FLOW.map((step, i) => (
                            <li key={step} className="flex items-center gap-3 rounded-[10px] px-2 py-2.5">
                                <span className="mono grid size-7 flex-none place-items-center rounded-full bg-page text-[12px] text-brand-ink shadow-[inset_0_0_0_1px_var(--line)]">{i + 1}</span>
                                <span className="font-semibold">{step}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            <section className="mx-auto mt-24 max-w-[1200px] px-5">
                <SectionHead kicker="后台任务" title="四个任务让一切运转起来。" />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {JOBS.map(({ icon, title, trigger, body }) => (
                        <IconCard key={title} icon={icon} title={title} footer={<span className="pill mono">{trigger}</span>}>{body}</IconCard>
                    ))}
                </div>
            </section>

            <section className="mx-auto mt-24 max-w-[1200px] px-5">
                <SectionHead kicker="技术栈" title="基于可查验的服务构建。" />
                <div className="hatch">
                    <div className="card row-list">
                        {STACK.map(([name, body, url]) => (
                            <a key={name} href={url} target="_blank" rel="noreferrer" className="group flex flex-col gap-1 px-5 py-4 transition-colors hover:bg-hover/40 sm:flex-row sm:items-center sm:gap-6">
                                <span className="w-40 flex-none font-bold text-foreground group-hover:text-brand-ink">{name}</span>
                                <span className="text-muted-foreground">{body}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
