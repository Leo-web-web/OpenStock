import { Metadata } from 'next';
import { AlertTriangle, Check, X } from 'lucide-react';
import PageHero from '@/components/marketing/PageHero';
import SectionHead from '@/components/marketing/SectionHead';

export const metadata: Metadata = {
    title: '服务条款 | OpenStock',
    description: '为社区制定的公平、透明、开放的条款。',
};

const PROMISES = [
    '核心功能将永远免费。',
    '我们绝不会出售你的个人数据。',
    '条款变更将公开讨论。',
    '你的自选与分析归你所有。',
];

const RULES = {
    do: ['自由分享知识', '将 API 用于个人项目', '尊重其他成员'],
    dont: ['不要过度抓取数据', '不要分享 API 密钥', '不要用 OpenStock 做高频交易'],
};

export default function TermsPage() {
    return (
        <>
            <PageHero
                kicker="服务条款 · 最后更新于 2025 年 10 月"
                title="服务条款"
                sub="建立在信任、透明与社区价值之上。没有隐藏陷阱，只有明确的规则。"
            />

            <section className="mx-auto mt-14 max-w-[1200px] px-5">
                <div className="hatch">
                    <div className="card flex gap-4 p-6 shadow-[inset_0_0_0_1px_oklch(0.76_0.119_70/0.35)]">
                        <AlertTriangle className="mt-0.5 size-5 flex-none text-warn" />
                        <div>
                            <h2 className="font-bold text-warn">投资免责声明</h2>
                            <p className="mt-2 max-w-3xl leading-relaxed text-muted-foreground">
                                <strong className="text-foreground">OpenStock 是教育与分析工具，不是财务顾问。</strong>{' '}
                                数据按原样提供，仅供参考。永远不要投入你无法承受损失的资金。做出财务决策前，请务必自行
                                研究或咨询持证专业人士。
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto mt-20 max-w-[1200px] px-5">
                <SectionHead kicker="我们的承诺" title="你可以信赖的承诺。" />
                <div className="grid gap-3 sm:grid-cols-2">
                    {PROMISES.map((promise) => (
                        <div key={promise} className="hatch">
                            <div className="card flex h-full items-center gap-3 p-5">
                                <span className="bento-ico bg-brand-soft text-brand-ink"><Check /></span>
                                <span className="font-semibold">{promise}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mx-auto mt-20 max-w-[1200px] px-5">
                <SectionHead kicker="社区规则" title="该做与不该做的事。" />
                <div className="grid gap-3 md:grid-cols-2">
                    {([['该做', RULES.do, Check, 'text-up'], ['不该做', RULES.dont, X, 'text-down']] as const).map(([title, items, Icon, tone]) => (
                        <div key={title} className="hatch">
                            <div className="card h-full p-5">
                                <h3 className="kicker">{title}</h3>
                                <ul className="mt-3 flex flex-col gap-2.5">
                                    {items.map((item) => (
                                        <li key={item} className="flex items-center gap-2.5">
                                            <Icon className={`size-4 flex-none ${tone}`} />
                                            <span className="text-muted-foreground">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
                <p className="mt-8 text-muted-foreground">
                    对这些条款有疑问？请发邮件至 <a href="mailto:opendevsociety@gmail.com" className="font-semibold text-brand-ink hover:underline">opendevsociety@gmail.com</a>.
                </p>
            </section>
        </>
    );
}
