import React from 'react';
import dynamic from 'next/dynamic';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { createRpc } from '@lightprotocol/stateless.js';
require('@solana/wallet-adapter-react-ui/styles.css');

import Web3Provider from '@/components/(global)/Web3Provider';

const rpcURL = process.env.HC_RPC_URL;

const WalletMultiButton = dynamic(
    () => import('@solana/wallet-adapter-react-ui').then(mod => mod.WalletMultiButton),
    { ssr: false }
);
  
const WalletDisconnectButton = dynamic(
    () => import('@solana/wallet-adapter-react-ui').then(mod => mod.WalletDisconnectButton),
    { ssr: false }
);

const LightProtocolContext = React.createContext<any>(null);

export const useLightProtocol = () => React.useContext(LightProtocolContext);

const Web3Connect = () => {
    const { connection } = useConnection();
    const { publicKey } = useWallet();

    const rpc = React.useMemo(() => {
        if (connection && publicKey) {
            return createRpc(rpcURL);
        }
        return null;
    }, [connection, publicKey]);

    return (
        <Web3Provider>
            <LightProtocolContext.Provider value={rpc}>
                <WalletMultiButton />
                <WalletDisconnectButton />
            </LightProtocolContext.Provider>
        </Web3Provider>
    )
};

export default Web3Connect;