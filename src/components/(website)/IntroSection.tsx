import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-nprogress-bar';
import { motion } from 'framer-motion';
import { RiSpaceShipFill } from 'react-icons/ri';

import SciFiTitle from '@/components/(element)/SciFiTitle';
import ConnectNodesText from '@/components/(element)/ConnectNodesText';

const IntroSection = () => {
    const router = useRouter();
    const t = useTranslations('Website');
    const [ isConnected, setIsConnected ] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsConnected((prev) => !prev);
        }, 5000);
    
        return () => clearInterval(interval);
    }, []);

    return (
        <section className='h-screen flex flex-col justify-center items-center text-center px-4'>
            <Image src='/assets/website/logo.webp' alt='logo' width={160} height={160} className={`${isConnected ? 'opacity-100' : 'opacity-20'} transition duration-300 mb-2`} draggable={false} priority />
            <SciFiTitle />
            <motion.p
                className='flex justify-center items-center text-xl md:text-2xl mb-8'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
            >
                <ConnectNodesText isConnected={isConnected} setIsConnected={setIsConnected} />
            </motion.p>
            <motion.button
                onClick={() => router.push('/game')}
                className='flex justify-center items-center bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-2 px-6 rounded-full transition duration-300 transform hover:scale-105'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <RiSpaceShipFill size={22} className='mr-1' />
                <p>{t('intro-button')}</p>
            </motion.button>
        </section>
    )
};

export default IntroSection;