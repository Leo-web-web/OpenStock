import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/marketing/PageHero';
import { GUIDES } from '@/lib/seo/comparisons';
import { siteUrl } from '@/lib/seo/site';

const title = '指南 | OpenStock';
const description = 'OpenStock 是什么、不是什么：一个开源股票追踪器，提供 TradingView 图表、自选、邮件提醒与自部署。诚实对比，无需账号。';

export function generateMetadata(): Metadata {
    const url = `${siteUrl()}/compare`;
    return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: { title, description, url, siteName: 'OpenStock', type: 'website' },
        twitter: { card: 'summary', title, description },
    };
}

export default function GuideIndexPage() {
    return (
        <>
            <PageHero
                kicker="指南"
                title="OpenStock 的用途。"
                sub="针对人们真正会问的问题的简短、真实的页面。本站图表均为 TradingView 挂件。登录后的应用可免费试用。"
            />
            <section className="mx-auto mt-12 grid max-w-[1200px] gap-3 px-5 md:grid-cols-2">
                {GUIDES.map((guide) => (
                    <Link key={guide.slug} href={`/compare/${guide.slug}`} className="hatch group">
                        <article className="card flex h-full flex-col gap-3 p-6">
                            <p className="kicker text-brand-ink">{guide.kicker}</p>
                            <h2 className="text-[22px] font-bold tracking-[-0.03em] group-hover:text-brand-ink">{guide.title}</h2>
                            <p className="text-[15px] leading-relaxed text-muted-foreground">{guide.description}</p>
                        </article>
                    </Link>
                ))}
            </section>
        </>
    );
}
