'use client'
import React from 'react';
import { useRouter } from 'next-nprogress-bar';
import { useTranslations } from 'next-intl';

import GameplayScreen from '@/components/(game)/(main)/GameplayScreen';

const Game = () => {
    const router = useRouter();
    
    return (
        <div className='flex h-full w-full justify-center items-center bg-theme-bg-1'>
            <GameplayScreen />
        </div>
    );
};

export default Game;
