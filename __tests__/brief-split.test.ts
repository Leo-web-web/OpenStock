import { describe, expect, it } from 'vitest';

import { splitBrief } from '@/lib/brief-split';

// 贴近真实 latest.md 结构的缩微样本：导言、摘要、两只股票、页脚
const SAMPLE = `> 数据截至北京时间 2026-11-06 18:00；仅供参考，不构成投资建议。

# 🎯 2026-11-06 决策仪表盘

> 共分析 **6** 只股票 | 🟢买入:0 🟡观望:5 🔴卖出:1

市场状态：美股 · 盘中

## 📊 分析结果摘要

⚪ **iShares China Large-Cap ETF(FXI)**: 观望 | 评分 52 | 震荡

🟠 **Invesco QQQ Trust, Series 1(QQQ)**: 减仓 | 评分 31 | 强烈看空

---

## ⚪ iShares China Large-Cap ETF (FXI)

### 📰 重要信息速览

**💭 舆情情绪**: 市场情绪回暖。

### 📌 核心结论

**⚪ 观望** | 震荡

> **一句话决策**: 等待回踩。

---

## 🟠 Invesco QQQ Trust, Series 1 (QQQ)

### 📰 重要信息速览

**💭 舆情情绪**: 极度悲观。

---

*报告生成时间：2026-11-06 17:09:27*
*分析模型：gemini/gemini-3-flash-preview*
`;

describe('splitBrief', () => {
    it('splits a report into dashboard preamble, sections and footer', () => {
        const split = splitBrief(SAMPLE);

        expect(split.dashboardTitle).toBe('决策仪表盘');
        expect(split.preamble).toContain('共分析');
        expect(split.preamble).toContain('市场状态');
        expect(split.preamble).not.toContain('决策仪表盘');
        expect(split.preamble).not.toContain('---');

        // 摘要和每只股票各成一节，标题去掉开头的状态圆点
        expect(split.stocks.map((s) => s.title)).toEqual([
            '分析结果摘要',
            'iShares China Large-Cap ETF (FXI)',
            'Invesco QQQ Trust, Series 1 (QQQ)',
        ]);

        const summary = split.stocks[0];
        expect(summary?.body).toContain('观望 | 评分 52');
        expect(summary?.body).not.toContain('---');

        const fxi = split.stocks[1];
        expect(fxi?.body).toContain('重要信息速览');
        expect(fxi?.body).toContain('一句话决策');
        expect(fxi?.body).not.toContain('iShares China Large-Cap ETF (FXI)\n');
        expect(fxi?.body).not.toContain('---');

        const qqq = split.stocks[2];
        expect(qqq?.body).toContain('极度悲观');

        expect(split.footer).toEqual([
            '报告生成时间：2026-11-06 17:09:27',
            '分析模型：gemini/gemini-3-flash-preview',
        ]);
    });

    it('falls back to a single preamble when there are no sections', () => {
        const split = splitBrief('只有正文，没有股票小节。\n\n第二段。');
        expect(split.stocks).toEqual([]);
        expect(split.preamble).toBe('只有正文，没有股票小节。\n\n第二段。');
        expect(split.footer).toEqual([]);
    });
});
