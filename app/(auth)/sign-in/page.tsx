'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import InputField from '@/components/forms/InputField';
import FooterLink from '@/components/forms/FooterLink';
import { signInWithEmail } from "@/lib/actions/auth.actions";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import OpenDevSocietyBranding from "@/components/OpenDevSocietyBranding";
import SocialAuthButtons from "@/components/forms/SocialAuthButtons";
import React from "react";

const SignIn = () => {
    const router = useRouter()
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInFormData>({
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onBlur',
    });

    const onSubmit = async (data: SignInFormData) => {
        try {
            const result = await signInWithEmail(data);
            if (result.success) {
                router.push('/dashboard');
                return;
            }
            toast.error('登录失败', {
                description: result.error ?? '邮箱或密码不正确。',
            });
        } catch (e) {
            console.error(e);
            toast.error('登录失败', {
                description: e instanceof Error ? e.message : '登录失败。'
            })
        }
    }

    return (
        <>
            <h1 className="form-title mb-2">欢迎回来</h1>
            <p className="mb-8 text-faint">登录以查看你的自选与提醒。</p>

            <SocialAuthButtons />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <InputField
                    name="email"
                    label="邮箱"
                    placeholder="opendevsociety@cc.cc"
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

                <InputField
                    name="password"
                    label="密码"
                    placeholder="输入你的密码"
                    type="password"
                    register={register}
                    error={errors.password}
                    validation={{ required: '密码为必填项', minLength: 8 }}
                />

                <div className="flex justify-end">
                    <Link href="/forgot-password" className="footer-link text-sm">
                        忘记密码？
                    </Link>
                </div>

                <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5">
                    {isSubmitting ? '正在登录' : '登录'}
                </Button>

                <FooterLink text="还没有账号？" linkText="创建账号" href="/sign-up" />
                <OpenDevSocietyBranding outerClassName="mt-10 flex justify-center" />
            </form>
        </>
    );
};
export default SignIn;
