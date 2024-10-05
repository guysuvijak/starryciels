'use client'
import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useGameStore } from '@/stores/useStore';
require('@solana/wallet-adapter-react-ui/styles.css');

import SpinningLoader from '@/components/(element)/SpinningLoader';
import ProfileScreen from '@/components/(game)/(main)/ProfileScreen';
import GameplayScreen from '@/components/(game)/(main)/GameplayScreen';
import SpaceshipScreen from '@/components/(game)/(main)/SpaceshipScreen';

const Game = () => {
    const wallet = useWallet();
    const { gameMenu, setGameMenu } = useGameStore();

    const [ isLoading, setIsLoading ] = useState(true);
    
    useEffect(() => {
        setIsLoading(true);
        setGameMenu('profile');
        setIsLoading(false);
    }, [wallet]);
    
    return (
        <div className='flex h-full w-full justify-center items-center bg-black'>
            {isLoading ? (
                <SpinningLoader size={50} />
            ) : (
                <>
                    {gameMenu === 'profile' && <ProfileScreen />}
                    {(wallet.connected && gameMenu === 'spaceship') && <SpaceshipScreen />}
                    {(wallet.connected && (gameMenu === 'game' || gameMenu === 'spaceship')) && <GameplayScreen />}
                </>
            )}
        </div>
    );
};

export default Game;
