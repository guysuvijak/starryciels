import React, { FC, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { createRpc, Rpc } from '@lightprotocol/stateless.js';
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

const LightProtocolContext = React.createContext<any>(null);

const LightProtocolProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
    const connection: Rpc = createRpc();
    const { publicKey } = useWallet();

    const rpc = useMemo(() => {
        if (connection && publicKey) {
            return createRpc(
                'https://zk-testnet.helius.dev:8899',
                'https://zk-testnet.helius.dev:8784', // zk compression rpc
                'https://zk-testnet.helius.dev:3001'  // prover
            );
        }
        return null;
    }, [connection, publicKey]);

    return (
        <LightProtocolContext.Provider value={rpc}>
            {children}
        </LightProtocolContext.Provider>
    );
};

export const useLightProtocol = () => React.useContext(LightProtocolContext);

const Web3Connect = () => {
    return (
        <Web3Provider>
            <LightProtocolProvider>
                <WalletMultiButton />
                <WalletDisconnectButton />
            </LightProtocolProvider>
        </Web3Provider>
    )
};

export default Web3Connect;