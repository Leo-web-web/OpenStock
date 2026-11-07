'use server';

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/better-auth/auth";
import { INVESTMENT_GOALS, PREFERRED_INDUSTRIES, RISK_TOLERANCE_OPTIONS } from "@/lib/constants";

export type ProfileInput = {
    name: string;
    country: string;
    investmentGoals: string;
    riskTolerance: string;
    preferredIndustry: string;
};

const isOption = (options: readonly { value: string }[], value: string) => options.some((o) => o.value === value);

// Every call acts on the signed-in user's own session; nothing here takes a user id from the client.
export async function updateProfile(input: ProfileInput) {
    const name = input.name.trim();
    if (name.length < 2 || name.length > 80) return { success: false, error: '姓名需为 2 至 80 个字符。' };
    if (!/^[A-Z]{2}$/.test(input.country)) return { success: false, error: '请选择国家。' };
    if (!isOption(INVESTMENT_GOALS, input.investmentGoals)
        || !isOption(RISK_TOLERANCE_OPTIONS, input.riskTolerance)
        || !isOption(PREFERRED_INDUSTRIES, input.preferredIndustry)) {
        return { success: false, error: '请在每组中各选一项。' };
    }

    try {
        await auth.api.updateUser({
            headers: await headers(),
            body: {
                name,
                country: input.country,
                investmentGoals: input.investmentGoals,
                riskTolerance: input.riskTolerance,
                preferredIndustry: input.preferredIndustry,
            },
        });
        revalidatePath('/', 'layout');
        return { success: true };
    } catch (e) {
        console.error('Profile update failed', e);
        return { success: false, error: '无法保存你的个人资料。' };
    }
}

export async function changePassword({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) {
    try {
        await auth.api.changePassword({
            headers: await headers(),
            body: { currentPassword, newPassword, revokeOtherSessions: true },
        });
        return { success: true };
    } catch (e) {
        console.error('Password change failed', e);
        return { success: false, error: '当前密码不正确，或新密码太短。' };
    }
}
