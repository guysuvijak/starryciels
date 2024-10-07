import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { FaArrowLeft } from 'react-icons/fa';
import { useWallet } from '@solana/wallet-adapter-react';

import ThemeToggle from '@/components/(element)/ThemeToggle';
import { useGameStore } from '@/stores/useStore';
import OwnPlanetComponent from '@/components/(game)/OwnPlanetComponent';
import OtherPlanetComponent from '@/components/(game)/OtherPlanetComponent';
import BuyPlanetComponent from '@/components/(game)/BuyPlanetComponent';
import usePlanetData from '@/hook/usePlanetData';

const SpaceshipScreen = () => {
    const wallet = useWallet();
    const t = useTranslations('Spaceship');
    const { setGameMenu, landingPublic, setModalOpen } = useGameStore();
    const [ menuState, setMenuState ] = useState<string | null>('own');
    
    const {
        ownPlanetData,
        otherPlanetData,
        isLoadingOwn,
        isLoadingOther,
        errorMessage,
        cooldown,
        refreshOwnData,
        refreshOtherData
    } = usePlanetData();

    const menuItems = [
        { id: 'own', title: t('own-title'), icon: '🌍', enable: true },
        { id: 'other', title: t('other-title'), icon: '🪐', enable: true },
        { id: 'buy', title: t('buy-title'), icon: '🛒', enable: true }
    ];

    const handleBuySuccess = () => {
        refreshOwnData();
    };

    const handleBackToGame = () => {
        setGameMenu('game');
        setModalOpen(false);
    };

    const memoizedOwnPlanetData = useMemo(() => ownPlanetData, [ownPlanetData]);
    const memoizedOtherPlanetData = useMemo(() => otherPlanetData, [otherPlanetData]);

    return (
        <div className='flex flex-col w-full min-h-screen absolute z-100'>
            <div className='flex w-full items-center h-[90px] justify-between px-4 bg-theme-bg-0 border-b-1 border-theme-border sticky top-0 z-110'>
                {landingPublic ? (
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className='bg-theme-button text-theme-button-t p-2 rounded-full hover:bg-theme-button-h transition duration-300'
                        onClick={handleBackToGame}
                    >
                        <FaArrowLeft size={24} className='w-[18px] sm:w-[24px] h-auto' />
                    </motion.button>
                ) : (
                    <div></div>
                )}
                <div className='flex h-full'>
                    {menuItems.map((item) => (
                        <React.Fragment key={item.id}>
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                                className={`${menuState === item.id ? 'bg-theme-button' : 'hover:bg-theme-button-h'}`}
                                onClick={() => setMenuState(item.id)}
                            >
                                <div className='px-1 sm:px-2 flex flex-col items-center'>
                                    <span className='text-[24px] sm:text-[30px]'>{item.icon}</span>
                                    <h2 className={`text-[14px] sm:text[16px] font-semibold text-center ${menuState === item.id ? 'text-theme-button-t' : 'text-theme-title'}`}>{item.title}</h2>
                                </div>
                            </motion.button>
                        </React.Fragment>
                    ))}
                </div>
                <ThemeToggle />
            </div>
            <div className='flex-grow overflow-hidden bg-theme-bg-1'>
                {errorMessage !== '' &&
                    <p className='text-theme-alert mt-2'>{errorMessage}</p>
                }
                <AnimatePresence mode='wait'>
                    {menuState === 'own' && (
                        <OwnPlanetComponent 
                            key='own' 
                            data={memoizedOwnPlanetData} 
                            isLoading={isLoadingOwn} 
                            onBuyClick={() => setMenuState('buy')} 
                            onRefresh={refreshOwnData} 
                            cooldown={cooldown} 
                        />
                    )}
                    {menuState === 'other' && (
                        <OtherPlanetComponent 
                            key='other' 
                            data={memoizedOtherPlanetData} 
                            wallet={String(wallet.publicKey)} 
                            isLoading={isLoadingOther} 
                            onRefresh={refreshOtherData} 
                            cooldown={cooldown} 
                        />
                    )}
                    {menuState === 'buy' && (
                        <BuyPlanetComponent 
                            key='buy' 
                            wallet={String(wallet.publicKey)} 
                            onCheckClick={() => setMenuState('own')} 
                            onBuySuccess={handleBuySuccess} 
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SpaceshipScreen;