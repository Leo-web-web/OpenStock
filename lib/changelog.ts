// OpenStock's changelog, newest first. The banner and its modal show RELEASES[0]; /changelog shows the whole timeline.
// Write "#123" in an item to link that pull request.
// Who made a release happen: pull requests they wrote and issues they opened that led to a change.
// Taken from GitHub (PR authors and the issues each PR closed); bots aren't listed.
export type Credit = { login: string; prs?: number[]; issues?: number[] };

export type Release = {
    id: string;
    date: string;
    title: string;
    summary: string;
    highlights?: string[]; // the short list in the banner's modal (latest release only)
    sections: { title: string; items: string[] }[];
    credits: Credit[];
};

export const MAINTAINER = 'ravixalgorithm';

export const RELEASES: Release[] = [
    {
        id: '2026-10-18',
        date: '2026年10月18日',
        title: '十月更新',
        summary: '图表上画线、指标常驻、登录更安全',
        highlights: [
            '在任意股票图表上画趋势线、斐波那契和文字。',
            '你选的指标会常驻在每张图表上。',
            'M&M、Bajaj-Auto、爱立信 B 等股票代码现在能正常出图了。',
            '登录和重置密码已做限流，重置后会登出你的其他设备。',
            '提供预构建的 Docker 镜像，方便自部署。',
        ],
        sections: [
            {
                title: '图表',
                items: [
                    '在股票图表上画线：趋势线、水平线、斐波那契、图形和文字。#118',
                    '你选的指标（SMA、EMA、布林带、VWAP、RSI、MACD、随机指标、ATR）会常驻每张图表，刷新后和全屏时也一样。#119',
                    '带 - 或 & 的股票代码现在能正常出图：印度的 M&M 和 Bajaj-Auto、斯德哥尔摩的爱立信 B、哥本哈根的诺和诺德 B。#117',
                ],
            },
            {
                title: '市场',
                items: [
                    '沙特阿拉伯（Tadawul）加入仪表盘：TASI、沙特阿美、Al Rajhi 和 STC 卡片、当日异动股和行情表，因 TradingView 嵌入屏蔽了 Tadawul，价格取自雅虎财经。沙特个股页和自选行也会显示价格。#145',
                ],
            },
            {
                title: '自选',
                items: [
                    '自选最多放 50 只股票，满了会提醒你。#127',
                    '侧边栏的关注列表会自己滚动，不再把页面撑长。#110',
                ],
            },
            {
                title: '安全',
                items: [
                    '登录、注册和重置密码已做限流，别人猜不了密码、也发不爆你的邮箱。#126',
                    '重置密码后，你在其他设备上的登录都会退出。#125',
                    '欢迎邮件里再也不会带上注册时注入的链接或标记。#122',
                    '后台任务不会再有误发整个订阅列表的风险，订阅者邮箱也不会出现在日志里。#120',
                    'Next.js 安全更新，覆盖约 30 个安全公告。#121',
                ],
            },
            {
                title: '自部署',
                items: [
                    '预构建 Docker 镜像，支持 amd64 和 arm64：ghcr.io/open-dev-society/openstock，基于 Node 22 LTS。#128',
                    'Docker 构建不需要数据库或密钥，镜像里不存任何密钥。#123',
                    'docker compose 不再把 MongoDB 暴露到你的网络，密码从 .env 读取。#124',
                    '一键部署支持 RepoCloud、ZopDay 和 Railway。#111 #115 #94',
                ],
            },
            {
                title: '社区',
                items: [
                    '好评墙：我们的赞助商和支持者，以及大家为 OpenStock 写的文章、拍的视频。',
                    'Orbit 和 RapidProxy 加入成为赞助商。',
                ],
            },
        ],
        credits: [
            { login: 'ravixalgorithm', prs: [116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130] },
            { login: 'cosmind-rusu', prs: [94] },
            { login: 'Yi-111-a', prs: [110] },
            { login: 'cosark', prs: [111] },
            { login: 'muskanbandta23', prs: [115] },
            { login: 'ahmaddirar-ios', prs: [142] },
            { login: 'nexitpl', issues: [47, 54] },
            { login: 'brainistry10', issues: [113] },
            { login: 'Greatz08', issues: [83] },
            { login: 'saschabrockel', issues: [36] },
            { login: 'a-lacruz', issues: [109] },
        ],
    },
    {
        id: '2026-09-25',
        date: '25 Sep 2026',
        title: 'The redesign',
        summary: 'A new look, a public landing page, more markets and a lot of fixes',
        sections: [
            {
                title: 'New',
                items: [
                    'A redesigned app: floating shell, browser-style tabs and a warmer palette. #106',
                    'A public landing page with a live NYSE session dial, and a Sponsor page. #106',
                    'More markets on the dashboard: US, India, Germany, Canada, Australia, Crypto and Forex. #106',
                    'A profile page to edit your details, see connected sign-ins and change your password, and sign-in with Google or GitHub. #106',
                ],
            },
            {
                title: 'Changed',
                items: [
                    'Quotes refresh hourly for everyone on the free site. #106',
                    'Price alerts are now part of OpenStock Cloud and self-hosting.',
                    'Server functions run in Mumbai, next to the database, so pages respond faster.',
                ],
            },
            {
                title: 'Fixed',
                items: [
                    'Watchlist and alert changes are tied to the signed-in user; before, one user could change another’s. #106',
                    'Welcome emails, price alerts and the weekly digest run again, and password reset completes. #106',
                    'Pages no longer hang when market data is slow, and email addresses with + are accepted. #106',
                    'Charts no longer get stuck on exchanges TradingView blocks, or on Hong Kong stocks.',
                    'A clearer environment check for self-hosters. #104',
                    'The README now says the news summary is weekly, not daily. #91',
                    'Community fixes brought into the redesign: no “NaN” market cap #82, Taiwan in the country picker #70, indicators that survive fullscreen #68, optional email settings #69, and tests for alert actions #93.',
                ],
            },
        ],
        credits: [
            { login: 'ravixalgorithm', prs: [106] },
            { login: 'keshav-005', prs: [68, 69, 70] },
            { login: 'Mubashirrrr', prs: [82] },
            { login: 'fuxicodex', prs: [93] },
            { login: 'BambaSatoru', prs: [104] },
            { login: 'kuishou68', prs: [91] },
            { login: 'nexitpl', issues: [49] },
            { login: 'juipeter-pixel', issues: [34] },
            { login: 'soonfatt', issues: [38] },
            { login: 'khajaG321', issues: [28] },
        ],
    },
    {
        id: '2026-08',
        date: 'Jun – Aug 2026',
        title: 'Summer fixes',
        summary: 'A market support guide, sturdier emails and a newer AI model',
        sections: [
            {
                title: 'Changes',
                items: [
                    'A Market Support guide explaining which exchanges chart, quote and alert, and why. #84',
                    'Email features are optional: the app runs without mail settings, and warning messages no longer show garbled characters. #85',
                    'Personalised emails use MiniMax’s newer M3 model by default. #87',
                ],
            },
        ],
        credits: [
            { login: 'akoweicollinxx', prs: [84, 85] },
            { login: 'octo-patch', prs: [87] },
            { login: 'maxsyst', issues: [37] },
        ],
    },
    {
        id: '2026-05',
        date: 'Apr – May 2026',
        title: 'Password reset',
        summary: 'Reset your password, see the password rules as you type, and better search',
        sections: [
            {
                title: 'Changes',
                items: [
                    'Forgot your password? Reset it by email. #71',
                    'Sign-up shows the password rules and ticks them off as you type. #79',
                    'Charts show the right time zone. #72',
                    'Search shows the correct exchange and company details. #73',
                    'No more Turbopack warning about the project root when running locally. #74',
                ],
            },
        ],
        credits: [
            { login: 'keshav-005', prs: [71, 72, 73, 74] },
            { login: 'Chukwuebuka-2003', prs: [79] },
            { login: 'danieldanielecki', issues: [66] },
            { login: 'nexitpl', issues: [35] },
            { login: 'aaronwork1205', issues: [55] },
            { login: 'k2alzhang', issues: [39] },
        ],
    },
    {
        id: '2026-03',
        date: 'Mar 2026',
        title: 'Sentiment and 40+ exchanges',
        summary: 'What the crowd thinks, and many more markets',
        sections: [
            {
                title: 'Changes',
                items: [
                    'Sentiment on every stock page: buzz and bullishness from Reddit, X, news and Polymarket. #64',
                    'Charts for 40+ international exchanges. #65',
                    'MiniMax as an alternative AI provider for personalised emails. #61',
                    'Updated dependencies and background jobs. #63',
                ],
            },
        ],
        credits: [
            { login: 'alexander-schneider', prs: [64] },
            { login: 'Bortlesboat', prs: [65] },
            { login: 'octo-patch', prs: [61] },
            { login: 'TPTBusiness', prs: [63] },
            { login: 'NicolasBohn', prs: [63] },
            { login: 'maplelaef0320', issues: [24] },
        ],
    },
    {
        id: '2026-02',
        date: 'Feb 2026',
        title: 'China and Hong Kong charts',
        summary: 'Shanghai, Shenzhen and Hong Kong stocks chart correctly',
        sections: [
            {
                title: 'Changes',
                items: ['Shanghai, Shenzhen and Hong Kong tickers are converted to TradingView’s format, so their charts load. #57'],
            },
        ],
        credits: [
            { login: 'CrixusWen', prs: [57] },
            { login: 'ravixalgorithm', prs: [51] },
        ],
    },
    {
        id: '2026-01',
        date: 'Jan 2026',
        title: 'Watchlist, alerts and news',
        summary: 'Save stocks, get alerted, and read the news that matters to you',
        sections: [
            {
                title: 'New',
                items: [
                    'A Watchlist page to save stocks and follow their prices, sortable by symbol. #40 #46',
                    'Price alerts when a stock goes above or below your target. #40',
                    'A news feed for the stocks on your watchlist. #40',
                    'Fullscreen charts. #45',
                    'About, Help and API docs pages, and Siray.ai as a fallback AI provider. #40',
                    'Fixed broken links in the README. #42',
                ],
            },
        ],
        credits: [
            { login: 'ravixalgorithm', prs: [40, 45, 46, 48] },
            { login: 'ettoreciolli', prs: [42] },
            { login: 'nexitpl', issues: [33, 44] },
            { login: 'cn-zeus-jp', issues: [27] },
        ],
    },
    {
        id: '2025-12',
        date: 'Dec 2025',
        title: 'Security and support',
        summary: 'A critical framework fix and a way to support the project',
        sections: [
            {
                title: 'Changes',
                items: [
                    'Fixed a critical React Server Components vulnerability. #30',
                    'Vercel Web Analytics. #31',
                    'A way to donate to the project. #32',
                ],
            },
        ],
        credits: [
            { login: 'ravixalgorithm', prs: [32] },
        ],
    },
    {
        id: '2025-10',
        date: 'Oct 2025',
        title: 'OpenStock launches',
        summary: 'Free, open-source market tracking for everyone',
        sections: [
            {
                title: 'Launch',
                items: [
                    'Started on 28 Sep 2025 and first deployed on 4 Oct 2025: accounts, stock search and a TradingView-powered dashboard. #1 #9',
                    'Docker and Docker Compose support. #17',
                    'Fixed a build error reported in the first weeks. #25',
                ],
            },
        ],
        credits: [
            { login: 'ravixalgorithm', prs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] },
            { login: 'chinnsenn', prs: [17] },
            { login: 'nb-src', prs: [25] },
            { login: 'Terry0930', issues: [23] },
        ],
    },
];

export const LATEST_RELEASE = RELEASES[0];
