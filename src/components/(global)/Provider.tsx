'use client'
import React, { useEffect, useMemo, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { ProviderProps } from '@/types/(global)/Global';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import dynamic from 'next/dynamic';

import LanguageView from '@/components/(game)/LanguageView';
import ThemeView from '@/components/(game)/ThemeView';
import { useThemeStore } from '@/stores/useStore';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity
        },
    },
});

const Footer = dynamic(() => import('@/components/(website)/Footer'), { ssr: false });
const Navbar = dynamic(() => import('@/components/(website)/Navbar'), { ssr: false });

const FooterGame = dynamic(() => import('@/components/(game)/Footer'), { 
    ssr: false, 
    loading: () => <FooterGamePlaceholder />
});

const NavbarGame = dynamic(() => import('@/components/(game)/Navbar'), { 
    ssr: false, 
    loading: () => <NavbarGamePlaceholder />
});

const FooterGamePlaceholder = () => (
    <div className='flex w-full h-[68px] fixed bottom-0 left-0 right-0 bg-gradient-to-b to-[#6B4E3D] from-[#533828] border-t-4 border-[#99735E] animate-pulse' />
);
FooterGamePlaceholder.displayName = 'FooterGamePlaceholder';

const NavbarGamePlaceholder = () => (
    <div className='flex fixed top-0 left-0 right-0 w-full h-[54px] bg-[#44362E] lg:h-[74px] animate-pulse' />
);
NavbarGamePlaceholder.displayName = 'NavbarGamePlaceholder';

const MemoizedLanguageView = React.memo(LanguageView);
MemoizedLanguageView.displayName = 'MemoizedLanguageView';

const MemoizedThemeView = React.memo(ThemeView);
MemoizedThemeView.displayName = 'MemoizedThemeView';

const MemoizedProgressBar = React.memo(() => (
    <ProgressBar
        height='4px'
        color='#FFC65D'
        options={{ showSpinner: false }}
        shallowRouting
    />
));
MemoizedProgressBar.displayName = 'MemoizedProgressBar';

const LayoutProvider = React.memo(({ children, locale }: ProviderProps) => {
    const { theme } = useThemeStore();
    const pathname = usePathname();

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const NavbarComponent = useMemo(() => {
        if (pathname === `/${locale}`) {
            return <Navbar />;
        } else if (pathname.includes(`/${locale}/game`)) {
            return <NavbarGame />;
        }
        return null;
    }, [pathname, locale]);

    const FooterComponent = useMemo(() => {
        if (pathname === `/${locale}`) {
            return <Footer />;
        } else if (pathname.includes(`/${locale}/game`)) {
            return <FooterGame />;
        }
        return null;
    }, [pathname, locale]);

    return (
        <div className='flex flex-col min-h-screen'>
            <MemoizedLanguageView />
            <MemoizedThemeView />
            <QueryClientProvider client={queryClient}>
                <main className='flex flex-col flex-grow w-full h-10 overflow-y-scroll hide-scrollbar'>
                    {children}
                </main>
            </QueryClientProvider>
        </div>
    );
});

LayoutProvider.displayName = 'LayoutProvider';

export default LayoutProvider;