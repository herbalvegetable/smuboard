'use client';
import { usePathname } from "next/navigation";
import { Page } from "@/components";
import Providers from "@/context/providers";

export default function MyLayout(props: any) {
    const { children } = props;
    const pathname = usePathname();

    return (
        <Providers>
            {
                pathname == '/login' ?

                    children

                    :

                    <Page>{children}</Page>
            }
        </Providers>
    )
}