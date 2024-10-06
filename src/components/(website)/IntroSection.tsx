import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-nprogress-bar';
import { motion } from 'framer-motion';
import { RiSpaceShipFill } from 'react-icons/ri';

import SpinningLoader from '@/components/(element)/SpinningLoader';
import SciFiTitle from '@/components/(element)/SciFiTitle';
import ConnectNodesText from '@/components/(element)/ConnectNodesText';

const IntroSection: React.FC = () => {
    const [ isConnected, setIsConnected ] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsConnected((prev) => !prev);
        }, 5000);
    
        return () => clearInterval(interval);
    }, []);

    return (
        <section className='h-screen flex flex-col justify-center items-center text-center px-4'>
            <Logo isConnected={isConnected} />
            <SciFiTitle />
            <ConnectNodesTextWrapper isConnected={isConnected} setIsConnected={setIsConnected} />
            <EnterButton />
        </section>
    )
};

const Logo: React.FC<{ isConnected: boolean }> = ({ isConnected }) => (
    <Image 
        src='/assets/website/logo.webp' 
        alt='logo' 
        width={160} 
        height={160} 
        className={`${isConnected ? 'opacity-100' : 'opacity-20'} transition duration-300 mb-2`} 
        draggable={false} 
        priority 
    />
);

const ConnectNodesTextWrapper: React.FC<{
    isConnected: boolean;
    setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ isConnected, setIsConnected }) => (
    <motion.p
        className='flex justify-center items-center text-xl md:text-2xl mb-8'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
    >
        <ConnectNodesText isConnected={isConnected} setIsConnected={setIsConnected} />
    </motion.p>
);

const EnterButton: React.FC = () => {
    const router = useRouter();
    const t = useTranslations('Website');
    const [ isEnter, setIsEnter ] = useState(false);

    const handleEnterClick = useCallback(() => {
        setIsEnter(true);
        router.push('/game');
    }, [router]);

    return (
        <motion.button
            onClick={handleEnterClick}
            disabled={isEnter}
            className='flex justify-center items-center bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-2 px-6 rounded-full transition duration-300 transform hover:scale-105'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            {!isEnter && <RiSpaceShipFill size={22} className='mr-1' />}
            <p>{isEnter ? <SpinningLoader button label title={t('launch-button')} /> : t('intro-button')}</p>
        </motion.button>
    );
};

export default IntroSection;