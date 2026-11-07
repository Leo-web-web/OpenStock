'use client';

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import InputField from "@/components/forms/InputField";
import ChoiceChips from "@/components/forms/ChoiceChips";
import PasswordRequirements from "@/components/forms/PasswordRequirements";
import { INVESTMENT_GOALS, PASSWORD_VALIDATION, PREFERRED_INDUSTRIES, RISK_TOLERANCE_OPTIONS } from "@/lib/constants";
import { CountrySelectField } from "@/components/forms/CountrySelectField";
import FooterLink from "@/components/forms/FooterLink";
import { signUpWithEmail } from "@/lib/actions/auth.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import OpenDevSocietyBranding from "@/components/OpenDevSocietyBranding";
import SocialAuthButtons from "@/components/forms/SocialAuthButtons";
import React from "react";

const SignUp = () => {
    const router = useRouter()
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormData>({
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
            country: 'IN',
            investmentGoals: 'Growth',
            riskTolerance: 'Medium',
            preferredIndustry: 'Technology'
        },
        mode: 'onBlur'
    },);

    const passwordValue = watch('password');

    const onSubmit = async (data: SignUpFormData) => {
        try {
            const result = await signUpWithEmail(data);
            if (result.success) {
                router.push('/dashboard');
                return;
            }
            toast.error('注册失败', {
                description: result.error ?? '无法创建你的账号。',
            });
        } catch (e) {
            console.error(e);
            toast.error('注册失败', {
                description: e instanceof Error ? e.message : '创建账号失败。'
            })
        }
    }

    return (
        <>
            <h1 className="form-title mb-2">创建你的账号</h1>
            <p className="mb-8 text-faint">免费开源，无需绑卡。</p>

            <SocialAuthButtons />

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
                <section className="flex flex-col gap-4" aria-label="账号">
                    <InputField
                        name="fullName"
                        label="姓名"
                        placeholder="你的姓名"
                        register={register}
                        error={errors.fullName}
                        validation={{ required: '姓名为必填项', minLength: 2 }}
                    />
                    <InputField
                        name="email"
                        label="邮箱"
                        placeholder="you@example.com"
                        register={register}
                        error={errors.email}
                        validation={{
                            required: '邮箱为必填项',
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
                                message: '请输入有效的邮箱地址'
                            }
                        }}
                    />
                    <div className="flex flex-col gap-2">
                        <InputField
                            name="password"
                            label="密码"
                            placeholder="至少 8 个字符"
                            type="password"
                            register={register}
                            error={errors.password}
                            validation={PASSWORD_VALIDATION}
                        />
                        <PasswordRequirements password={passwordValue ?? ''} />
                    </div>
                </section>

                <section className="flex flex-col gap-5 border-t border-line pt-6" aria-labelledby="personalize">
                    <div>
                        <p id="personalize" className="kicker text-brand-ink">个性化设置</p>
                        <p className="mt-1 text-[13px] text-faint">用于定制你的欢迎邮件。</p>
                    </div>
                    <CountrySelectField
                        name="country"
                        label="国家"
                        control={control}
                        error={errors.country}
                        required
                    />
                    <ChoiceChips name="investmentGoals" label="投资目标" options={INVESTMENT_GOALS} control={control} />
                    <ChoiceChips name="riskTolerance" label="风险承受能力" options={RISK_TOLERANCE_OPTIONS} control={control} />
                    <ChoiceChips name="preferredIndustry" label="偏好行业" options={PREFERRED_INDUSTRIES} control={control} />
                </section>

                <div className="flex flex-col gap-4">
                    <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full">
                        {isSubmitting ? '正在创建账号' : '创建账号'}
                    </Button>
                    <FooterLink text="已有账号？" linkText="登录" href="/sign-in" />
                </div>

                <OpenDevSocietyBranding outerClassName="flex justify-center" />
            </form>
        </>
    )
}
export default SignUp;
