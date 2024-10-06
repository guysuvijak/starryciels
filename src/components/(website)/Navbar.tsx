import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-nprogress-bar';

import { EnterButtonProps } from '@/types/(components)/Website';
import SpinningLoader from '@/components/(element)/SpinningLoader';

const Navbar = () => {
    const router = useRouter();
    const t = useTranslations('Website');
    const [ isEnter, setIsEnter ] = useState(false);

    const handleEnterClick = useCallback(() => {
        setIsEnter(true);
        router.push('/game');
    }, [router]);

    return (
        <nav className='fixed top-0 left-0 right-0 z-50 bg-opacity-50 bg-black backdrop-blur-md'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between items-center h-16'>
                    <Logo title={t('navbar-title')} />
                    <EnterButton
                        onClick={handleEnterClick}
                        isEnter={isEnter}
                        buttonText={t('navbar-button')}
                        loadingText={t('login-button')}
                    />
                </div>
            </div>
        </nav>
    );
};

const Logo: React.FC<{ title: string }> = ({ title }) => (
    <div className='flex-shrink-0'>
        <div className='w-32 h-8 rounded flex items-center justify-center text-white font-bold'>
            <Image src='/assets/website/logo.webp' alt='logo' width={40} height={40} draggable={false} priority />
            <p className='invisible md:visible'>{title}</p>
        </div>
    </div>
);

const EnterButton: React.FC<EnterButtonProps> = ({ onClick, isEnter, buttonText, loadingText }) => (
    <button 
        onClick={onClick}
        disabled={isEnter}
        className='bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-2 px-6 rounded-full transition duration-300 transform hover:scale-105'
    >
        {isEnter ? <SpinningLoader button label title={loadingText} /> : buttonText }
    </button>
);

export default Navbar;