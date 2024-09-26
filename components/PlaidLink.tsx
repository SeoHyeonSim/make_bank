import React, { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
    PlaidLinkOnSuccess,
    PlaidLinkOptions,
    usePlaidLink,
} from "react-plaid-link";
import { useRouter } from "next/navigation";
import {
    createLinkToken,
    exchangePublicToken,
} from "@/lib/actions/user.actions";
import Image from "next/image";

const PlaidLink = ({ user, variant }: PlaidLinkProps) => {
    const router = useRouter();

    const [token, setToken] = useState("");

    useEffect(() => {
        // 사용자가 Plaid 링크 토큰을 생성하는 비동기 함수
        const getLinkToken = async () => {
            // Plaid 링크 토큰 생성 API 호출
            const data = await createLinkToken(user);
            // 생성된 링크 토큰을 상태에 저장
            setToken(data?.linkToken);
        };

        getLinkToken();
    }, [user]);

    // 성공적으로 은행 연결이 완료된 경우 호출되는 콜백
    const onSuccess = useCallback<PlaidLinkOnSuccess>(
        async (public_token: string) => {
            await exchangePublicToken({
                publicToken: public_token,
                user,
            });
            
            // 메인 페이지 리다이렉트
            router.push("/");
        },
        [router, user]
    );

    // Plaid 링크 토큰 및 콜백 
    const config: PlaidLinkOptions = {
        token,
        onSuccess,
    };

    const { open, ready } = usePlaidLink(config);

    return (
        <>
            {variant === "primary" ? (
                <Button
                    onClick={() => open()}
                    disabled={!ready}
                    className="plaidlink-primary"
                >
                    Connect bank
                </Button>
            ) : variant === "ghost" ? (
                <Button
                    onClick={() => open()}
                    variant="ghost"
                    className="plaidlink-ghost"
                >
                    <Image
                        src="/icons/connect-bank.svg"
                        alt="connect bank"
                        width={24}
                        height={24}
                    />
                    <p className="hiddenl text-[16px] font-semibold text-black-2 xl:block">
                        Connect bank
                    </p>
                </Button>
            ) : (
                <Button onClick={() => open()} className="plaidlink-default">
                    <Image
                        src="/icons/connect-bank.svg"
                        alt="connect bank"
                        width={24}
                        height={24}
                    />
                    <p className="text-[16px] font-semibold text-black-2">
                        Connect bank
                    </p>
                </Button>
            )}
        </>
    );
};

export default PlaidLink;
