import Image from 'next/image';
import { Code, Globe, Heart } from 'lucide-react';
import PageHero from '@/components/marketing/PageHero';
import SectionHead from '@/components/marketing/SectionHead';
import IconCard from '@/components/marketing/IconCard';
import { GOOD_FIRST_ISSUES_URL, REPO_URL } from '@/lib/constants';

export const metadata = {
    title: '关于 | OpenStock',
    description: 'OpenStock 与 Open Dev Society 背后的故事。',
};

const PRINCIPLES = [
    { icon: Globe, title: '开放获取', body: '核心功能没有付费墙。图表、自选与研究对所有人永远免费，自部署可解锁全部功能。' },
    { icon: Code, title: '开源', body: '代码库完全透明。审计我们的算法、贡献功能、与我们一起建设。' },
    { icon: Heart, title: '社区驱动', body: '由捐赠与志愿者支撑。我们对用户负责，而非股东。' },
];

export default function AboutPage() {
    return (
        <>
            <PageHero
                kicker="关于"
                title="人人可用的工具。"
                sub="我们相信，金融智能不该被付费墙锁住。OpenStock 由社区建设、为社区服务。"
            >
                <a href={REPO_URL} target="_blank" rel="noreferrer" className="btn btn-primary h-11 px-5 text-[15px]">查看代码</a>
                <a href={GOOD_FIRST_ISSUES_URL} target="_blank" rel="noreferrer" className="btn btn-ghost h-11 px-5 text-[15px]">参与贡献</a>
            </PageHero>

            <section className="mx-auto mt-20 max-w-[1200px] px-5">
                <SectionHead kicker="原则" title="我们绝不妥协的原则。" />
                <div className="grid gap-3 md:grid-cols-3">
                    {PRINCIPLES.map(({ icon, title, body }) => <IconCard key={title} icon={icon} title={title}>{body}</IconCard>)}
                </div>
            </section>

            <section className="mx-auto mt-24 max-w-[1200px] px-5">
                <div className="hatch">
                    <div className="card grid items-center gap-10 p-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:p-12">
                        <div className="flex flex-col gap-4">
                            <p className="kicker text-brand-ink">Open Dev Society</p>
                            <h2 className="text-[30px] font-bold leading-tight tracking-[-0.04em]">源于一个简单的困扰。</h2>
                            <p className="text-[16px] leading-relaxed text-muted-foreground">
                                为什么强大的金融工具如此昂贵？OpenStock 就是我们的答案。
                            </p>
                            <p className="text-[16px] leading-relaxed text-muted-foreground">
                                我们是由开发者、设计师与金融爱好者组成的集体，在 Open Dev Society 的旗帜下工作。
                                我们的使命是通过打造高质量的开源替代品，让软件民主化，取代
                                专有平台。
                            </p>
                            <a href="https://github.com/Open-Dev-Society" target="_blank" rel="noreferrer" className="btn btn-ghost mt-2 self-start">
                                GitHub 上的 Open Dev Society
                            </a>
                        </div>
                        <div className="relative grid aspect-square max-h-[340px] place-items-center rounded-[16px] bg-page shadow-[inset_0_0_0_1px_var(--line)]">
                            <Image src="/assets/icons/odsLogo.svg" alt="Open Dev Society" fill className="object-contain p-16 opacity-90" />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
