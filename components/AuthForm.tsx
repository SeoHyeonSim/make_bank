"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomInput from "./CustomInput";
import { authFormSchema } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { getLoggedInUser, signIn, signUp } from "@/lib/actions/user.actions";
import PlaidLink from "./PlaidLink";

const AuthForm = ({ type }: { type: string }) => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isLoading, setisLoading] = useState(false);

    const formSchema = authFormSchema(type);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setisLoading(true);

        try {
            // 회원가입 시 전달되는 정보
            if (type === "sign-up") {
                const userData = {
                    firstName: data.firstName!,
                    lastName: data.lastName!,
                    address: data.address!,
                    city: data.city!,
                    postalCode: data.postalCode!,
                    birthDate: data.birthDate!,
                    ssn: data.ssn!,
                    email: data.email,
                    password: data.password,
                };

                const newUser = await signUp(userData);

                setUser(newUser);
            }

            // 로그인 시 전달되는 정보
            if (type === "sign-in") {
                const response = await signIn({
                    email: data.email,
                    password: data.password,
                });

                if (response) router.push("/");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setisLoading(false);
        }
    };

    return (
        <section className="auth-form" >
            <header className="flex flex-col gap-5 md:gap-8">
                <Link
                    href="/"
                    className="cursor-pointer flex items-center gap-1"
                >
                    <Image
                        src="/icons/logo.svg"
                        width={34}
                        height={34}
                        alt="Horizon logo"
                    />
                    <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
                        Penny
                    </h1>
                </Link>
                <div className="flex flex-col gap-1 md:gap-3">
                    
                    <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
                        {user
                            ? "Link Account"
                            : type === "sign-in"
                            ? "Sign In"
                            : "Sign Up"}

                        <p className="text-16 font-normal text-gray-600">
                            {user
                                ? "Link your acceount to get started"
                                : "Please enter your details"}
                        </p>
                    </h1>
                </div>
            </header>
            {user ? (
                <div className="flex flex-col gap-4">
                    <PlaidLink user={user!} variant="primary" />
                </div>
            ) : (
                <>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            {/* 회원가입시 기입 정보 추가 */}
                            {type === "sign-up" && (
                                <>
                                    <div className="flex gap-4">
                                        <CustomInput
                                            control={form.control}
                                            name="firstName"
                                            label="First Name"
                                            placeholder="Enter your First Name"
                                        />
                                        <CustomInput
                                            control={form.control}
                                            name="lastName"
                                            label="Last Name"
                                            placeholder="Enter your Last Name"
                                        />
                                    </div>

                                    <CustomInput
                                        control={form.control}
                                        name="address"
                                        label="Address"
                                        placeholder="Enter your Adress"
                                    />
                                    
                                    <div className="flex gap-4">
                                        <CustomInput
                                            control={form.control}
                                            name="city"
                                            label="City"
                                            placeholder="Example: City L, Luminous Ray"
                                        />
                                        <CustomInput
                                            control={form.control}
                                            name="postalCode"
                                            label="Postal Code"
                                            placeholder="Enter your Postal Code"
                                        />
                                    </div>
                                    <div className="gap-4">
                                        <CustomInput
                                            control={form.control}
                                            name="birthDate"
                                            label="Birth Date"
                                            placeholder="Example:YYYY-MM-DD"
                                        />
                                        <CustomInput
                                            control={form.control}
                                            name="ssn"
                                            label="SSN"
                                            placeholder="Example: 1234"
                                        />
                                    </div>
                                </>
                            )}

                            {/* 이메일 및 비밀번호 */}
                            <CustomInput
                                control={form.control}
                                name="email"
                                label="Email"
                                placeholder="Enter your email"
                            />
                            <CustomInput
                                control={form.control}
                                name="password"
                                label="password"
                                placeholder="Enter your password"
                            />

                            <div className="flex flex-col gap-4">
                                <Button
                                    type="submit"
                                    className="form-btn"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2
                                                size={20}
                                                className="animate-spin"
                                            />{" "}
                                            &nbsp; Loading...
                                        </>
                                    ) : type === "sign-in" ? (
                                        "Sign In"
                                    ) : (
                                        "Sign Up"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>

                    {/* 하단에 회원가입 페이지 연결 링크 구현 */}
                    <footer className="flex justify-center gap-1">
                        <p className="text-14 font-normal text-gray-600">
                            {type === "sign-in"
                                ? ""
                                : "Already have an account?"}
                        </p>
                        <Link
                            href={type === "sign-in" ? "/sign-up" : "/sign-in"}
                            className="form-link"
                        >
                            {type === "sign-in" ? "Sign up" : "Sign in"}
                        </Link>
                    </footer>
                </>
            )}
        </section>
    );
};

export default AuthForm;
