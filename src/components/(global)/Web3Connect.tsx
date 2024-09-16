import React from 'react';
import dynamic from 'next/dynamic';
require('@solana/wallet-adapter-react-ui/styles.css');

import Web3Provider from '@/components/(global)/Web3Provider';

const WalletMultiButton = dynamic(
    () => import('@solana/wallet-adapter-react-ui').then(mod => mod.WalletMultiButton),
    { ssr: false }
);
  
const WalletDisconnectButton = dynamic(
    () => import('@solana/wallet-adapter-react-ui').then(mod => mod.WalletDisconnectButton),
    { ssr: false }
);

const Web3Connect = () => {

    return (
        <Web3Provider>
            <WalletMultiButton />
            <WalletDisconnectButton />
        </Web3Provider>
    )
};

export default Web3Connect;