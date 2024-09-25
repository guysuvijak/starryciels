'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next-nprogress-bar';
import { useTranslations } from 'next-intl';
import { useWallet } from '@solana/wallet-adapter-react';
import { publicKey } from '@metaplex-foundation/umi';

import CheckProfileScreen from '@/components/(game)/(main)/CreateProfileScreen';
import GameplayScreen from '@/components/(game)/(main)/GameplayScreen';
import { PublicKey } from '@solana/web3.js';

import { CheckProfile } from '@/metaplex/profile';

const Game = () => {
    const router = useRouter();
    const wallet = useWallet();

    const [ isLoading, setIsLoading ] = useState(true);
    
    useEffect(() => {
        const init = async () => {
            setIsLoading(true);
            if (wallet.connected && wallet.publicKey) {
                await checkProfile();
            }
            setIsLoading(false);
        };
    
        init();
    }, [wallet.publicKey]);

    const checkProfile = async () => {
        if (wallet.publicKey) {
            try {
                const response = await CheckProfile(wallet.publicKey);
                console.log(response);
            } catch (error) {
                console.error("Error checking profile:", error);
            }
        } else {
            console.log("Wallet not connected");
        }
    };
    
    return (
        <div className='flex h-full w-full justify-center items-center bg-theme-bg-1'>
            {(isLoading) ? (
                <div>Loading ...</div>
            ) : (
                <>
                    {!wallet.connected && <div>Please connect your wallet</div>}
                    {wallet.connected && !wallet.publicKey && <div>Wallet connected, but public key not available</div>}
                    {wallet.connected && wallet.publicKey && (
                        <>
                            <CheckProfileScreen />
                            <GameplayScreen />
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Game;
