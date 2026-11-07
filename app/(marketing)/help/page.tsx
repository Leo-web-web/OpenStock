import { Metadata } from 'next';
import { BookOpen, ChevronDown, Github, MessageCircle } from 'lucide-react';
import PageHero from '@/components/marketing/PageHero';
import SectionHead from '@/components/marketing/SectionHead';
import IconCard from '@/components/marketing/IconCard';
import { DISCORD_URL, REPO_URL } from '@/lib/constants';

export const metadata: Metadata = {
    title: '帮助 | OpenStock',
    description: 'OpenStock 的社区驱动支持。没有付费墙，只有帮助。',
};

const FAQS = [
    {
        question: 'OpenStock 真的免费吗？',
        answer: '是的。我们靠赞助者与社区贡献运转。图表、自选与研究保持免费。OpenStock Cloud 即将推出，每月 5 美元，增加实时行情与邮件价格提醒。自部署则两者都包含。',
    },
    {
        question: '如何把股票加入自选？',
        answer: '按 ⌘K（或侧边栏中的“搜索股票”），打开公司页面，然后按“加入自选”。它会出现在你的自选与侧边栏中。',
    },
    {
        question: '市场数据来自哪里？',
        answer: '图表实时来自 TradingView。行情、自选价格与提醒来自 Finnhub；本站每小时刷新一次，每条价格都会显示最后交易时间。',
    },
    {
        question: '支持哪些市场？',
        answer: '美股、加密货币与外汇为实时；加拿大与澳大利亚为延迟；沙特阿拉伯经 Yahoo Finance 为延迟；印度（经 BSE）与德国为日终。提醒适用于美股与加密货币。',
    },
    {
        question: '我的提醒没有触发。',
        answer: '价格提醒属于 OpenStock Cloud（或实时模式下的自部署实例）。在那里每五分钟检查一次，价格越过目标时发送邮件到你的账号邮箱。请在自选页面查看提醒状态。',
    },
    {
        question: '我可以贡献代码或设计吗？',
        answer: '当然可以。标注为“good first issue”的议题是不错的起点。设计师、开发者与作者都欢迎。',
    },
];

export default function HelpPage() {
    return (
        <>
            <PageHero kicker="帮助" title="我们能帮什么忙？" sub="由社区驱动、面向所有人的支持。" />

            <section className="mx-auto mt-14 grid max-w-[1200px] gap-3 px-5 md:grid-cols-3">
                <IconCard icon={BookOpen} title="工作原理" footer={<a href="/api-docs" className="btn btn-ghost w-full">阅读架构说明</a>}>
                    数据源、后台任务与邮件背后的 AI。
                </IconCard>
                <IconCard icon={MessageCircle} title="社区聊天" footer={<a href={DISCORD_URL} target="_blank" rel="noreferrer" className="btn btn-ghost w-full">加入 Discord</a>}>
                    从其他用户与维护者那里获得答案。
                </IconCard>
                <IconCard icon={Github} title="报告问题" footer={<a href={`${REPO_URL}/issues`} target="_blank" rel="noreferrer" className="btn btn-ghost w-full">新建 issue</a>}>
                    发现问题？请在 GitHub 上告诉我们。
                </IconCard>
            </section>

            <section className="mx-auto mt-24 max-w-[1200px] px-5">
                <SectionHead kicker="常见问题" title="常见问题。" />
                <div className="hatch">
                    <div className="card row-list overflow-hidden">
                        {FAQS.map(({ question, answer }) => (
                            <details key={question} className="group">
                                {/* Padding lives on the summary so the whole row is the click target, in every browser */}
                                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-foreground transition-colors hover:bg-hover/40 [&::-webkit-details-marker]:hidden">
                                    {question}
                                    <ChevronDown className="size-4 flex-none text-faint transition-transform duration-200 group-open:rotate-180" />
                                </summary>
                                <p className="max-w-3xl px-5 pb-5 text-[15px] leading-relaxed text-muted-foreground">{answer}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto mt-24 max-w-[1200px] px-5">
                <div className="hatch">
                    <div className="card flex flex-col items-start justify-between gap-5 p-8 md:flex-row md:items-center">
                        <div>
                            <h2 className="text-[22px] font-bold tracking-[-0.03em]">还是卡住了？</h2>
                            <p className="mt-1 text-muted-foreground">我们的团队与社区会免费回复邮件。</p>
                        </div>
                        <a href="mailto:opendevsociety@gmail.com" className="btn btn-primary h-11 px-5 text-[15px]">邮件联系支持</a>
                    </div>
                </div>
            </section>
        </>
    );
}
