'use client'
import React, { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useGameStore } from '@/stores/useStore';
require('@solana/wallet-adapter-react-ui/styles.css');

import SpinningLoader from '@/components/(element)/SpinningLoader';
import ProfileScreen from '@/components/(game)/ProfileScreen';
import GameplayScreen from '@/components/(game)/GameplayScreen';
import SpaceshipScreen from '@/components/(game)/SpaceshipScreen';

const Game = () => {
    const wallet = useWallet();
    const { gameMenu, setGameMenu } = useGameStore();
    
    useEffect(() => {
        if (!gameMenu || !wallet.connected) {
            setGameMenu('profile');
        }
    }, [wallet, gameMenu]);
    
    if (!gameMenu) {
        return <SpinningLoader size={50} />;
    }
    
    return (
        <div className='flex h-full w-full justify-center items-center bg-black'>
            {gameMenu === 'profile' && <ProfileScreen />}
            {wallet.connected && gameMenu === 'spaceship' && <SpaceshipScreen />}
            {wallet.connected && (gameMenu === 'game' || gameMenu === 'spaceship') && <GameplayScreen />}
        </div>
    );
};

export default Game;
