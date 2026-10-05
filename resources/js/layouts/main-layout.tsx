import type { ReactNode } from "react";
import TopBar from "@/components/top-navigation";
import { Head } from "@inertiajs/react";

type AppLayoutProps = {
    children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <>
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <main>
                <TopBar></TopBar>
                {children}
            </main>
        </>
    );
}
