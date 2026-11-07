export type Guide = {
    slug: string;
    kicker: string;
    title: string;
    description: string;
    lede: string;
    sections: { heading: string; paragraphs: string[] }[];
    faqs: { question: string; answer: string }[];
};

// Honest comparison pages. Names of other products appear because that is the search,
// and the copy says what OpenStock does and does not do.
export const GUIDES: Guide[] = [
    {
        slug: 'free-tradingview-alternative',
        kicker: '对比',
        title: '免费的 TradingView 替代品（开源）',
        description: 'OpenStock 是一款免费开源的股票追踪工具。图表使用 TradingView 挂件并保留其品牌标识；自选与邮件提醒是 OpenStock 自己的功能。',
        lede: '如果你需要 Pine Script、券商登录或 TradingView 的社交网络，请继续使用 TradingView。如果你想要免费的自选、图表和可自行部署的邮件提醒，OpenStock 就是围绕这些图表打造的开源应用。',
        sections: [
            {
                heading: '你实际能得到什么',
                paragraphs: [
                    'OpenStock 是一款采用 AGPL-3.0 协议的网页应用。托管站点免费使用：创建账号、搜索公司、打开图表即可。K 线图、绘图工具、财务数据、技术指标和公司简介均来自 TradingView 的可嵌入挂件，其 Logo 与“by TradingView”链接会保留在页面上。',
                    '在图表之外，OpenStock 还提供账号、最多 50 只代码的自选、浏览器风格的标签页，以及覆盖美国、印度、德国、加拿大、澳大利亚、加密货币与外汇的仪表盘。配置好邮件与 AI 服务后，每周邮件可汇总你关注代码的新闻。',
                ],
            },
            {
                heading: '它不是什么',
                paragraphs: [
                    'OpenStock 无法替代 TradingView 订阅。这里没有 Pine Script、没有策略测试器、没有期权链，也无法下单。能在每张图表上固定的指标是常用组合：SMA、EMA、布林带、VWAP、RSI、MACD、随机指标与 ATR。超出这些的功能只存在于当次访问的 TradingView 挂件内。',
                    '本站的公开公司页面只展示 TradingView 图表与 SEC 文件，不显示价格行情。登录后应用内的行情来自另一家数据商，不会在此转载。',
                ],
            },
            {
                heading: '费用',
                paragraphs: [
                    '社区站点免费。行情约每小时刷新一次，邮件价格提醒处于关闭状态。尚未开售的 OpenStock Cloud 计划每月 5 美元，提供实时行情与邮件提醒。自行部署免费：自带市场数据密钥即可开启实时模式，每五分钟检查一次提醒。',
                ],
            },
        ],
        faqs: [
            {
                question: '需要 TradingView 账号吗？',
                answer: '不需要。图表是其免费嵌入挂件。只有当你想用 TradingView 网站上的功能（如保存的布局或 Pine Script）时，才需要账号。',
            },
            {
                question: '能像在 TradingView 上那样发布脚本或设置提醒吗？',
                answer: '在图表上不能。OpenStock 的提醒是当美股或加密货币价格越过你设定的数值时发送的邮件，且仅在实时模式下可用（自行部署，或 Cloud 上线后）。',
            },
            {
                question: '源代码真的公开吗？',
                answer: '是的。代码仓库为 Open-Dev-Society/OpenStock，采用 AGPL-3.0 协议。你可以阅读、运行和修改它。如果你把修改后的版本作为网络服务提供，AGPL 要求你公开源代码。',
            },
        ],
    },
    {
        slug: 'self-hosted-stock-tracker',
        kicker: '自行部署',
        title: '自行部署的股票追踪工具',
        description: '使用 Docker 或预构建镜像，在自己的服务器上运行 OpenStock。数据库、市场数据密钥归你所有，开启实时模式后可获得邮件价格提醒。',
        lede: 'OpenStock 是基于 Next.js 与 MongoDB 的应用，可在小型 VPS 上运行。托管站点是便捷版本；如果你希望数据与提醒都掌握在自己手里，运行的就是同一份代码。',
        sections: [
            {
                heading: '你要运行什么',
                paragraphs: [
                    'Docker Compose 可同时启动应用与 MongoDB。MongoDB 保留在 Docker 网络内，不会发布到宿主机。预构建镜像发布于 ghcr.io/open-dev-society/openstock，支持 amd64 与 arm64，每次推送到 main 分支都会构建。README 中记录了 Railway、Vercel 和另外几家一键部署平台。',
                    '从源码构建需要 Node 22、一个 MongoDB 数据库和一个 Finnhub API 密钥，与 README 要求的一致。图表仍在浏览器中从 TradingView 加载，因此无需密钥也能正常显示。行情、搜索与邮件提醒使用该密钥。Finnhub 的条款仅限个人使用；这些公开页面不会展示相关行情。',
                ],
            },
            {
                heading: '数据的实时程度',
                paragraphs: [
                    '两种模式。缓存模式是默认模式：行情约每小时刷新一次，由使用该实例的所有人共享。实时模式约每 15 秒刷新一次，并开启价格提醒，每五分钟检查一次，触及目标即发送邮件。实时模式是构建时设置（NEXT_PUBLIC_OPENSTOCK_DATA_MODE=realtime）加上你自己的密钥。预构建镜像默认是缓存模式；自行构建可获得实时模式。',
                    '后台任务（欢迎邮件、提醒、周一摘要）需要 Inngest。邮件需要一个邮箱。摘要还需要 AI 服务商的密钥。不设置这些，应用仍可显示图表与自选。',
                ],
            },
            {
                heading: '适合谁',
                paragraphs: [
                    '想在自己掌控的机器上维护自选，或团队共用一个实例的人。这是一个单一网页应用，不是多租户托管服务。协议为 AGPL-3.0：把修改后的副本作为服务运行，意味着要向用户提供源代码。',
                ],
            },
        ],
        faqs: [
            {
                question: '自行部署包含图表吗？',
                answer: '包含。图表是在浏览器中加载的 TradingView 挂件，不经过你的 API 密钥。',
            },
            {
                question: '默认 Docker 镜像支持提醒吗？',
                answer: '预构建镜像是缓存模式，不发送价格提醒。设置为实时模式并重新构建，同时配置邮件与 Inngest，价格越过目标时就会收到提醒邮件。',
            },
            {
                question: '安装指南在哪里？',
                answer: 'README 的“Self-hosting”一节涵盖 Docker Compose、容器镜像、Railway 与 Vercel，包括环境变量。',
            },
        ],
    },
    {
        slug: 'free-stock-watchlist',
        kicker: '自选',
        title: '免费股票自选，附带邮件提醒',
        description: '免费自选最多可保存 50 只代码，保存在你的 OpenStock 账号中。邮件提醒目前需要自行部署的实时模式实例，托管站点上处于关闭状态。',
        lede: '自选是你真正关注的公司列表，而不是信息流。从搜索添加代码并保留图表。邮件提醒目前需要自行部署的实例；托管站点不发送提醒，OpenStock Cloud 也尚未开售。',
        sections: [
            {
                heading: '在免费托管站点上',
                paragraphs: [
                    '创建账号并添加最多 50 只代码。自选保存在你的账号下，显示在侧边栏，下次回来还在。社区站点的行情约每小时刷新一次。邮件价格提醒未开启：共享数据方案的粒度太粗，无法每隔几分钟检查一次目标。',
                    '你仍可查看每只代码的图表、财务数据、技术指标与公司简介；在已配置邮件的部署上，还能收到周一摘要。',
                ],
            },
            {
                heading: '邮件实际何时发送',
                paragraphs: [
                    '提醒每五分钟检查一次，且仅在实时模式下运行：即使用自己的市场数据密钥与 NEXT_PUBLIC_OPENSTOCK_DATA_MODE=realtime 自行部署的 OpenStock，或 OpenStock Cloud 上线后（计划每月 5 美元）。邮件会发到你账号上的邮箱。提醒分为上限与下限两种目标：高于或低于你输入的价格。',
                    '提醒适用于美股与加密货币。其他市场可以加入自选，但提醒用的免费行情源无法为其定价，因此提醒不会触发。',
                ],
            },
            {
                heading: '这里没有的功能',
                paragraphs: [
                    '没有券商连接，也没有下单按钮。这里的自选用于追踪价格，并在价格越过某条线时通知你。它不是选股器：你无法按比率或成交量筛选整个市场。搜索可按名称或代码查找公司，公开股票目录列出标普 500 与纳斯达克 100。',
                ],
            },
        ],
        faqs: [
            {
                question: '最多可以关注多少只代码？',
                answer: '每个账号 50 只，该上限目前已在应用中生效。',
            },
            {
                question: '为什么没有收到提醒邮件？',
                answer: '在公开社区站点上，提醒处于关闭状态。提醒在实时模式下每五分钟发送一次，发往账号邮箱。请确认该代码是美股或加密货币对，且目标价位于价格的正确一侧。',
            },
            {
                question: '自选是私密的吗？',
                answer: '是的，它保存在你的账号下。本站的公开股票页面不是你的自选，也不会显示你的提醒。',
            },
        ],
    },
    {
        slug: 'open-source-bloomberg-alternative',
        kicker: '对比',
        title: '彭博式终端的开源替代方案',
        description: 'OpenStock 是一款免费开源的股票追踪工具，提供图表、自选与 SEC 文件。它不是专业的市场终端，也无法替代专业终端。',
        lede: '专业终端是新闻专线、聊天系统、债券交易台与定价引擎的集合，每月收费高达四位数。OpenStock 都不是。它是个人免费追踪上市公司、阅读图表与查阅文件的工具。',
        sections: [
            {
                heading: 'OpenStock 覆盖的部分',
                paragraphs: [
                    '美国、印度、德国、加拿大与澳大利亚的股票页面，以及加密货币与外汇。带绘图工具的 TradingView 图表、自选、实时模式下的邮件价格提醒，以及简短的每周新闻摘要。对于标普 500 与纳斯达克 100，公开页面会链接 SEC EDGAR 上的最新年报与季报。',
                    '源代码公开（AGPL-3.0），开发者可以看到行情如何从数据商流向屏幕。这是封闭终端不会展示的部分。',
                ],
            },
            {
                heading: '它不覆盖的部分',
                paragraphs: [
                    '没有实时新闻专线、没有即时通讯、没有订单路由、没有固定收益、没有衍生品分析、没有 Excel 插件，也没有合规存档。登录后应用内的价格来自 Finnhub 的个人使用套餐，可能存在延迟。OpenStock 中的任何内容都不是买卖报价。',
                    '如果你代表他人进行交易，或按市价为账簿估值，你需要购买商业展示许可的数据供应商。OpenStock 是个人与教育工具。公开页面刻意避免转载该行情源。',
                ],
            },
            {
                heading: '合理的使用方式',
                paragraphs: [
                    '学生、自行部署者与散户投资者用它来维护列表、阅读文件，无需购买席位许可。把图表当作图表，把文件当作文件。对于涉及资金的决策，请阅读公司自己的报告与你有权信赖的来源。',
                ],
            },
        ],
        faqs: [
            {
                question: 'OpenStock 是彭博的替代品吗？',
                answer: '仅在免费追踪股票、阅读图表与文件这一狭窄用途上是。它不能替代专业终端。',
            },
            {
                question: '公司可以在办公室内部署 OpenStock 吗？',
                answer: '代码采用 AGPL-3.0 协议，你可以运行它；如果你修改后作为服务提供，需履行 AGPL 的源代码共享义务。大多数人使用的市场数据密钥是个人使用套餐。展示这些行情的企业需要向数据供应商购买商业许可，OpenStock 不授予此类许可。',
            },
            {
                question: '公开公司页面的事实来自哪里？',
                answer: '图表是 TradingView 挂件。板块与指数成员资格是静态数据。文件日期与行业代码来自 SEC EDGAR。这些页面不渲染任何行情。',
            },
        ],
    },
    {
        slug: 'stock-market-app-for-students',
        kicker: '学生',
        title: '面向学生的股票市场应用',
        description: '免费的股票追踪工具，学生无需银行卡即可使用：图表、自选、大型美国公司的 SEC 文件，以及可供项目阅读的源代码。',
        lede: '注册 OpenStock 免费，阅读代码也免费。它旨在帮助你了解市场界面是如何组合在一起的，而不是告诉你该买什么。',
        sections: [
            {
                heading: '学生在网站上能做什么',
                paragraphs: [
                    '打开一家大型美国公司，阅读 TradingView 图表，并通过链接查看其在 EDGAR 上的最新 10-K 或 10-Q。将代码保存到自选。仪表盘覆盖的不只是美国：登录后应用内还有印度、德国、加拿大、澳大利亚、加密货币与外汇。',
                    '社区站点无需信用卡。邮件价格提醒属于实时模式（自行部署）或即将推出的付费云套餐，不在免费托管站点内。按小时更新的行情足以学习界面，但不是交易信号。',
                ],
            },
            {
                heading: '学生能用代码做什么',
                paragraphs: [
                    '应用使用 Next.js、TypeScript、Tailwind 与 MongoDB，后台任务基于 Inngest。标有“good first issue”的议题是参与的入口。课程项目可以 fork 它、指向一个数据库，看到真实的认证流程、自选与图表嵌入。协议为 AGPL-3.0：如果项目只是在自己电脑上做作业，属于普通使用；如果把修改后的副本放到网上供他人使用，请分享源代码。',
                ],
            },
            {
                heading: '请不要把它当作投资建议',
                paragraphs: [
                    'OpenStock 不是券商，也不是投顾。文件事实与图表只是信息。学生投资组合作业应引用公司的文件，并说明每个数字来自哪里。公开公司页面会说明某个数字是 EDGAR 事实，还是 TradingView 的图表。',
                ],
            },
        ],
        faqs: [
            {
                question: '注册要花钱吗？',
                answer: '不用。社区站点免费。包含实时行情与邮件提醒的付费云套餐已宣布，但尚未开售。',
            },
            {
                question: '可以在作业中引用 OpenStock 吗？',
                answer: '请引用原始来源。对于美国公司的收入或风险因素，原始来源是 EDGAR 上的 10-K，本站页面会链接到它。对于图表，请说明图表是 OpenStock 嵌入的 TradingView 挂件。',
            },
            {
                question: '有移动应用吗？',
                answer: '没有。这是一个响应式网站。如需图标，可以把它添加到主屏幕。',
            },
        ],
    },
    {
        slug: 'track-nse-stocks',
        kicker: '印度',
        title: '免费追踪 NSE 股票',
        description: 'OpenStock 如何展示印度股票：登录后应用内提供 BSE 图表与收盘价行情。本版本不包含印度代码页面或 EDGAR 映射。',
        lede: '无需付费即可在 OpenStock 上关注印度公司。登录后应用使用 BSE 代码，因为免费 TradingView 嵌入不授权 NSE 图表。本站的公开目录目前仅覆盖美国。',
        sections: [
            {
                heading: '登录后可用的功能',
                paragraphs: [
                    '仪表盘上的印度市场列出流动性较好的 BSE 代码：Reliance、TCS、Infosys、HDFC Bank 等。印度行情为收盘价，非实时。搜索接受常见的 NSE 风格后缀（.NS），应用会将其映射到 BSE 以显示图表，因为 NSE 嵌入在 TradingView 免费挂件许可下无法渲染。你在 BSE 上看到的是同一家公司。',
                    '这些代码不支持价格提醒。提醒需要服务器能每五分钟重新核查的行情，该通道仅支持美股与加密货币。',
                ],
            },
            {
                heading: '公开页面不包含的内容',
                paragraphs: [
                    '公开股票目录（/s）是标普 500 加纳斯达克 100，并附带这些上市公司的 EDGAR 链接。本版本不包含印度代码页面或 EDGAR 映射。NIFTY 50 页面是后续步骤，需先逐一核查各代码在 TradingView 嵌入中的显示情况。本站不会用不允许转载的数据方案凭空编造公开行情页面。',
                ],
            },
            {
                heading: '追踪一只股票的实用方法',
                paragraphs: [
                    '注册后打开搜索，输入公司名称，将其固定到自选。图表为收盘价，简介与财务数据来自 TradingView 挂件，页面属于你自己。如需了解公司行动或财报，请阅读交易所或公司自己的投资者页面。OpenStock 不是券商，不会在 NSE 或 BSE 下单。',
                ],
            },
        ],
        faqs: [
            {
                question: '为什么没有 NSE 图表？',
                answer: 'TradingView 的免费嵌入拒绝 NSE 代码。OpenStock 将 NSE 代码映射到同一家公司的 BSE 上市代码，以便图表仍能加载。这是应用中现有的许可限制，不是可以通过样式修复的缺陷。',
            },
            {
                question: '印度价格是实时的吗？',
                answer: '不是。印度市场标注为收盘价。美股与加密货币是提供实时或按小时行情的市场，具体取决于部署方式。',
            },
            {
                question: '可以为 Reliance 或 TCS 设置邮件提醒吗？',
                answer: '目前不行。邮件提醒仅支持美股与加密货币。',
            },
        ],
    },
];

const BY_SLUG = new Map(GUIDES.map((guide) => [guide.slug, guide]));

export function findGuide(slug: string): Guide | undefined {
    return BY_SLUG.get(slug);
}
