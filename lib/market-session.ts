// NYSE trading sessions, in New York minutes-of-day.
// ponytail: exchange holidays and half-days are ignored; add a holiday list if it matters.
export const PRE = 4 * 60, OPEN = 9 * 60 + 30, CLOSE = 16 * 60, AFTER_END = 20 * 60;
export const DAY = 24 * 60;

export type Phase = 'pre' | 'open' | 'after' | 'closed';

export function newYorkNow(date: Date) {
    const parts = Object.fromEntries(
        new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' })
            .formatToParts(date).map((p) => [p.type, p.value]),
    );
    const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parts.weekday);
    return { weekday, minutes: Number(parts.hour) * 60 + Number(parts.minute), time: `${parts.hour.padStart(2, '0')}:${parts.minute}` };
}

export const isWeekday = (d: number) => d >= 1 && d <= 5;

export function sessionOf(weekday: number, minutes: number): { phase: Phase; line: string } {
    const until = (target: number) => formatSpan(target - minutes);
    if (isWeekday(weekday)) {
        if (minutes >= OPEN && minutes < CLOSE) return { phase: 'open', line: `开盘 · ${until(CLOSE)}后收盘` };
        if (minutes >= PRE && minutes < OPEN) return { phase: 'pre', line: `盘前 · ${until(OPEN)}后开盘` };
        if (minutes >= CLOSE && minutes < AFTER_END) return { phase: 'after', line: `盘后 · ${until(AFTER_END)}后结束` };
        if (minutes < PRE) return { phase: 'closed', line: `已收盘 · ${until(OPEN)}后开盘` };
    }
    // Next weekday open, counting whole days from today
    let days = 1;
    while (!isWeekday((weekday + days) % 7)) days++;
    return { phase: 'closed', line: `已收盘 · ${formatSpan(days * DAY + OPEN - minutes)}后开盘` };
}

export function formatSpan(totalMinutes: number) {
    const d = Math.floor(totalMinutes / DAY);
    const h = Math.floor((totalMinutes % DAY) / 60);
    const m = totalMinutes % 60;
    if (d > 0) return `${d}天${h}小时`;
    return h > 0 ? `${h}小时${String(m).padStart(2, '0')}分钟` : `${m}分钟`;
}

