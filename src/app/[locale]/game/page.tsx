'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next-nprogress-bar';
import { useTranslations } from 'next-intl';
import { useWallet } from '@solana/wallet-adapter-react';
import { useGameStore } from '@/stores/useStore';
require('@solana/wallet-adapter-react-ui/styles.css');

import ProfileScreen from '@/components/(game)/(main)/ProfileScreen';
import GameplayScreen from '@/components/(game)/(main)/GameplayScreen';
import MotherScreen from '@/components/(game)/(main)/MotherScreen';

const Game = () => {
    const router = useRouter();
    const wallet = useWallet();
    const { gameMenu, setGameMenu } = useGameStore();

    const [ isLoading, setIsLoading ] = useState(true);
    
    useEffect(() => {
        setIsLoading(true);
        setGameMenu('profile');
        setIsLoading(false);
    }, [wallet]);
    
    return (
        <div className='flex h-full w-full justify-center items-center bg-theme-bg-1'>
            {(isLoading) ? (
                <div>Loading ...</div>
            ) : (
                <>
                    {gameMenu === 'profile' && <ProfileScreen />}
                    {(wallet.connected && gameMenu === 'mother') && <MotherScreen />}
                    {(wallet.connected && (gameMenu === 'game' || gameMenu === 'mother')) && <GameplayScreen />}
                </>
            )}
        </div>
    );
};

export default Game;
