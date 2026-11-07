import { cache } from 'react';

// SEC fair-access rules: https://www.sec.gov/os/accessing-edgar-data
// Declare a User-Agent with a contact address, and stay under 10 requests per second.
export const SEC_USER_AGENT = 'OpenStock (opendevsociety@gmail.com)';

const ANNUAL_FORMS = ['10-K', '20-F', '40-F', '10-K/A', '20-F/A', '40-F/A'];
const QUARTERLY_FORMS = ['10-Q', '10-Q/A'];

const MONTHS = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月',
];

const STATES: Record<string, string> = {
    AL: '阿拉巴马州', AK: '阿拉斯加州', AZ: '亚利桑那州', AR: '阿肯色州', CA: '加利福尼亚州',
    CO: '科罗拉多州', CT: '康涅狄格州', DE: '特拉华州', DC: '哥伦比亚特区',
    FL: '佛罗里达州', GA: '佐治亚州', HI: '夏威夷州', ID: '爱达荷州', IL: '伊利诺伊州',
    IN: '印第安纳州', IA: '艾奥瓦州', KS: '堪萨斯州', KY: '肯塔基州', LA: '路易斯安那州',
    ME: '缅因州', MD: '马里兰州', MA: '马萨诸塞州', MI: '密歇根州', MN: '明尼苏达州',
    MS: '密西西比州', MO: '密苏里州', MT: '蒙大拿州', NE: '内布拉斯加州', NV: '内华达州',
    NH: '新罕布什尔州', NJ: '新泽西州', NM: '新墨西哥州', NY: '纽约州',
    NC: '北卡罗来纳州', ND: '北达科他州', OH: '俄亥俄州', OK: '俄克拉荷马州', OR: '俄勒冈州',
    PA: '宾夕法尼亚州', RI: '罗得岛州', SC: '南卡罗来纳州', SD: '南达科他州',
    TN: '田纳西州', TX: '得克萨斯州', UT: '犹他州', VT: '佛蒙特州', VA: '弗吉尼亚州',
    WA: '华盛顿州', WV: '西弗吉尼亚州', WI: '威斯康星州', WY: '怀俄明州',
};

export type EdgarFiling = {
    form: string;
    filed: string;
    description: string;
    url: string;
};

export type EdgarCompany = {
    sic: string;
    sicDescription: string;
    fiscalYearEnd: string;
    stateOfIncorporation: string;
    annual: EdgarFiling | null;
    quarterly: EdgarFiling | null;
    filingsUrl: string;
};

type RecentFilings = {
    form?: string[];
    filingDate?: string[];
    accessionNumber?: string[];
    primaryDocument?: string[];
    primaryDocDescription?: string[];
};

export function filingUrl(cik: string, accession: string, primaryDocument: string): string {
    const cikInt = String(Number(cik));
    const accessionNoDashes = accession.replace(/-/g, '');
    return `https://www.sec.gov/Archives/edgar/data/${cikInt}/${accessionNoDashes}/${primaryDocument}`;
}

export function companyBrowseUrl(cik: string): string {
    return `https://www.sec.gov/edgar/browse/?CIK=${Number(cik)}&owner=exclude`;
}

export function formatFiscalYearEnd(mmdd: string): string | null {
    if (!/^\d{4}$/.test(mmdd)) return null;
    const month = Number(mmdd.slice(0, 2));
    const day = Number(mmdd.slice(2));
    if (month < 1 || month > 12 || day < 1 || day > 31) return null;
    return `${MONTHS[month - 1]} ${day}`;
}

export function formatFilingDate(iso: string): string {
    const [year, month, day] = iso.split('-').map(Number);
    if (!year || !month || !day) return iso;
    return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
    });
}

export function stateName(code: string): string {
    if (!code) return '';
    return STATES[code] ?? code;
}

function pickFiling(recent: RecentFilings, forms: string[], cik: string): EdgarFiling | null {
    const filed = recent.form ?? [];
    for (const form of forms) {
        const index = filed.indexOf(form);
        if (index < 0) continue;
        const accession = recent.accessionNumber?.[index];
        const primaryDocument = recent.primaryDocument?.[index];
        const date = recent.filingDate?.[index];
        if (!accession || !primaryDocument || !date) continue;
        return {
            form,
            filed: date,
            description: recent.primaryDocDescription?.[index] || form,
            url: filingUrl(cik, accession, primaryDocument),
        };
    }
    return null;
}

export function parseSubmissions(cik: string, body: {
    sic?: string;
    sicDescription?: string;
    fiscalYearEnd?: string;
    stateOfIncorporation?: string;
    filings?: { recent?: RecentFilings };
}): EdgarCompany {
    const recent = body.filings?.recent ?? {};
    return {
        sic: body.sic ?? '',
        sicDescription: body.sicDescription ?? '',
        fiscalYearEnd: formatFiscalYearEnd(body.fiscalYearEnd ?? '') ?? '',
        stateOfIncorporation: stateName(body.stateOfIncorporation ?? ''),
        annual: pickFiling(recent, ANNUAL_FORMS, cik),
        quarterly: pickFiling(recent, QUARTERLY_FORMS, cik),
        filingsUrl: companyBrowseUrl(cik),
    };
}

// ponytail: one gap shared by this process. A second instance can double the rate; the Next
// data cache (24h) is what keeps a crawl from asking EDGAR twice for the same company.
const GAP_MS = 125;
let nextSlot = 0;
const memory = new Map<string, { expires: number; value: EdgarCompany | null }>();
const pending = new Map<string, Promise<EdgarCompany | null>>();
const OK_MS = 12 * 60 * 60 * 1000;
const FAIL_MS = 10 * 60 * 1000;

function pace(): Promise<void> {
    const now = Date.now();
    const at = Math.max(now, nextSlot);
    nextSlot = at + GAP_MS;
    const wait = at - now;
    return wait > 0 ? new Promise((resolve) => setTimeout(resolve, wait)) : Promise.resolve();
}

async function loadEdgarCompany(cik: string): Promise<EdgarCompany | null> {
    const key = cik.replace(/\D/g, '').padStart(10, '0');
    if (!Number(key)) return null;

    const hit = memory.get(key);
    if (hit && hit.expires > Date.now()) return hit.value;

    const inflight = pending.get(key);
    if (inflight) return inflight;

    const job = (async () => {
        try {
            // Static generation must not call EDGAR. The page is dynamic; this is a backstop so
            // `next build` still passes if a page is pre-rendered without a network.
            if (process.env.NEXT_PHASE === 'phase-production-build') return null;

            await pace();
            const res = await fetch(`https://data.sec.gov/submissions/CIK${key}.json`, {
                headers: { 'User-Agent': SEC_USER_AGENT, Accept: 'application/json' },
                next: { revalidate: 60 * 60 * 24 },
                signal: AbortSignal.timeout(8000),
            });
            if (!res.ok) throw new Error(`SEC submissions ${res.status}`);
            const value = parseSubmissions(cik, await res.json());
            memory.set(key, { expires: Date.now() + OK_MS, value });
            return value;
        } catch (error) {
            console.error('EDGAR submissions failed', key, error);
            memory.set(key, { expires: Date.now() + FAIL_MS, value: null });
            return null;
        } finally {
            pending.delete(key);
        }
    })();

    pending.set(key, job);
    return job;
}

// One lookup per request, shared by generateMetadata and the page.
export const getEdgarCompany = cache((cik: string) => (cik ? loadEdgarCompany(cik) : Promise.resolve(null)));
