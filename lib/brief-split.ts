// 把 DSA 每日简报的 Markdown 拆成卡片：导言（决策仪表盘）+ 每个 ## 小节一块 + 页脚行。
// 只做呈现层面的拆分，不删减、不改写任何正文；格式变了调用方就整体回退到单卡片渲染。
// 纯函数、无 JSX，供 app/(root)/brief/page.tsx 和 __tests__/brief-split.test.ts 共用。

// 标题开头的状态圆点等装饰符号（⚪🟠🟡…）：只剥离呈现，不改文字本身
const LEADING_DECOR = /^(?:[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}\s]+)/u;

function cleanHeading(text: string): string {
    const stripped = text.replace(LEADING_DECOR, "").trim();
    return stripped || text;
}

// 去掉 chunk 首尾的空行和 --- 分隔线（分隔线由卡片边界代替）
function trimChunk(chunk: string): string {
    const lines = chunk.split("\n");
    while (lines.length > 0 && (lines[0]?.trim() === "" || lines[0]?.trim() === "---")) lines.shift();
    while (lines.length > 0) {
        const last = lines[lines.length - 1]?.trim() ?? "";
        if (last === "" || last === "---") lines.pop();
        else break;
    }
    return lines.join("\n").trim();
}

export type BriefStock = { title: string; body: string };
export type SplitBrief = { dashboardTitle: string; preamble: string; stocks: BriefStock[]; footer: string[] };

export function splitBrief(body: string): SplitBrief {
    const lines = body.split("\n");
    const footer: string[] = [];
    while (lines.length > 0) {
        const last = lines[lines.length - 1]?.trim() ?? "";
        if (last === "") {
            lines.pop();
            continue;
        }
        const m = last.match(/^\*(报告生成时间|分析模型)：(.*)\*$/);
        if (!m) break;
        footer.unshift(`${m[1]}：${m[2]}`);
        lines.pop();
    }

    const text = lines.join("\n");
    const headingRe = /^##\s+(.+)$/gm;
    const headings = [...text.matchAll(headingRe)];

    let preamble = headings.length > 0 ? text.slice(0, headings[0].index ?? 0) : text;
    let dashboardTitle = "决策仪表盘";
    const h1 = preamble.match(/^#\s+(.+)$/m);
    if (h1) {
        const raw = (h1[1] ?? "").replace(LEADING_DECOR, "").replace(/^\d{4}-\d{2}-\d{2}\s*/, "").trim();
        if (raw) dashboardTitle = raw;
        preamble = preamble.replace(/^#\s+.+$/m, "");
    }
    preamble = trimChunk(preamble);

    const stocks: BriefStock[] = headings.map((h, i) => {
        const start = (h.index ?? 0) + h[0].length;
        const end = i + 1 < headings.length ? (headings[i + 1].index ?? text.length) : text.length;
        return {
            title: cleanHeading(h[1] ?? ""),
            body: trimChunk(text.slice(start, end)),
        };
    });

    return { dashboardTitle, preamble, stocks, footer };
}
