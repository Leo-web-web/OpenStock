import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import Panel from "@/components/Panel";
import { splitBrief } from "@/lib/brief-split";

const BRIEF_URL =
    "https://raw.githubusercontent.com/Leo-web-web/daily_stock_analysis/main/reports/latest.md";
const ACTIONS_URL =
    "https://github.com/Leo-web-web/daily_stock_analysis/actions";

// 当天日期（北京时间），用于判断简报是不是今天的
function todayInShanghai(): string {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Shanghai",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(new Date());
}

function formatZh(dateStr: string): string {
    const [year, month, day] = dateStr.split("-");
    return `${year}年${Number(month)}月${Number(day)}日`;
}

// 站内排版的 Markdown 渲染：.brief-prose（见 globals.css 末尾）
function BriefMarkdown({ children }: { children: string }) {
    return (
        <div className="overflow-x-auto">
            <article className="brief-prose">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
            </article>
        </div>
    );
}

export default async function BriefPage() {
    let markdown: string | null = null;

    try {
        const res = await fetch(BRIEF_URL, { next: { revalidate: 3600 } });
        if (res.ok) markdown = await res.text();
    } catch {
        markdown = null;
    }

    // 日期只认 latest.md 第一行的标记（由 DSA 发布步骤写入），不认"今天"
    const dateMatch = markdown?.match(/^# 每日简报 · (\d{4}-\d{2}-\d{2})/m);
    const reportDate = dateMatch?.[1] ?? null;
    const isToday = reportDate === todayInShanghai();
    // 渲染时去掉第一行标记（标题已在页头显示，避免重复）
    const body = markdown?.replace(/^# 每日简报 · \d{4}-\d{2}-\d{2}\s*/m, "") ?? "";
    const split = splitBrief(body);

    return (
        <>
            <header className="page-head">
                <div>
                    <h1 className="page-title">每日简报</h1>
                    <p className="page-sub num">
                        {reportDate
                            ? `${formatZh(reportDate)} · 数据截至 18:00`
                            : "每日 18:00（北京时间）自动生成"}
                    </p>
                </div>
            </header>

            {!markdown ? (
                <Panel title="今日简报尚未生成" sub="每日 18:00（北京时间）自动生成，生成后这里会自动出现">
                    <p className="text-[13.5px] leading-relaxed text-muted-foreground">
                        今日的简报还没有发布（可能是非交易日，或者今日的分析任务尚未完成）。
                        可以去 Actions 看今天的运行状态，也可以先看邮件里的简报。
                    </p>
                    <div className="mt-4">
                        <a href={ACTIONS_URL} target="_blank" rel="noreferrer" className="btn btn-primary">
                            查看 DSA 运行记录
                        </a>
                    </div>
                </Panel>
            ) : (
                <>
                    {reportDate && !isToday && (
                        <div className="rounded-[11px] border border-line bg-warn/10 px-3.5 py-3 text-[13px] leading-relaxed text-warn">
                            这份是 {formatZh(reportDate)} 的简报，今日简报尚未生成——请以最新邮件为准。
                        </div>
                    )}
                    {!reportDate && (
                        <div className="rounded-[11px] border border-line bg-warn/10 px-3.5 py-3 text-[13px] leading-relaxed text-warn">
                            未能识别这份简报的日期，请以邮件简报为准。
                        </div>
                    )}
                    {split.stocks.length === 0 ? (
                        <Panel
                            title="每日简报"
                            sub={reportDate ? `${formatZh(reportDate)} · 仅供参考，不构成投资建议` : "仅供参考，不构成投资建议"}
                            bodyClassName="p-5"
                        >
                            <BriefMarkdown>{body}</BriefMarkdown>
                        </Panel>
                    ) : (
                        <div className="flex max-w-[920px] flex-col gap-3">
                            {split.preamble && (
                                <Panel title={split.dashboardTitle} bodyClassName="p-5">
                                    <BriefMarkdown>{split.preamble}</BriefMarkdown>
                                </Panel>
                            )}
                            {split.stocks.map((stock) => (
                                <Panel key={stock.title} title={stock.title} bodyClassName="p-5">
                                    <BriefMarkdown>{stock.body}</BriefMarkdown>
                                </Panel>
                            ))}
                            {split.footer.length > 0 && (
                                <p className="px-1 text-[12px] leading-relaxed text-faint">{split.footer.join(" · ")}</p>
                            )}
                        </div>
                    )}
                </>
            )}
        </>
    );
}
