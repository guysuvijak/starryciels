'use client'
import React from 'react';
import { useWallet } from "@solana/wallet-adapter-react";
import { client } from '@/utils/constants';
import { sendTxns } from '@/utils/honeycomb';

import Web3Connect from '@/components/(global)/Web3Connect';

const handleCreate = async (wallet: any) => {
    console.log('Create project started...');
    
    if (!wallet.publicKey) {
        console.error('Wallet not connected');
        alert('Please connect your wallet');
        return;
    }
    
    try {
        console.log('Step 1: Preparing createCreateProjectTransaction params...');
        const params = {
            authority: wallet.publicKey.toBase58(),
            name: "nextjs-starry-ciel",
            payer: wallet.publicKey.toBase58(),
            profileDataConfig: {
              achievements: [
                "First Achievement",
                "Second Achievement"
              ],
              customDataFields: [
                "NFTs owned",
              ]
            }
        };
        console.log('Params:', params);

        console.log('Step 2: Calling createCreateProjectTransaction...');
        const result = await client.createCreateProjectTransaction(params);
        console.log('Raw result:', result);

        if (!result || !result.createCreateProjectTransaction) {
            throw new Error('Invalid response from createCreateProjectTransaction');
        }
        
        console.log('Step 3: Extracting project and transaction data...');
        const { project: projectAddress, tx: txResponse }: any = result.createCreateProjectTransaction;
        
        console.log('Project Address:', projectAddress);
        console.log('Transaction Response:', JSON.stringify(txResponse, null, 2));
        
        if (txResponse && txResponse.transactions) {
            console.log('Step 4: Sending transactions...');
            await sendTxns(wallet, txResponse);
            console.log('Project created successfully');
        } else {
            console.error('No transactions returned');
            console.log('Full txResponse:', txResponse);
        }
    } catch (error) {
        console.error('Error creating project:', error);
    }
};

const Home: React.FC = () => {
    const wallet = useWallet();

    return (
        <div className='bg-red-400'>
            <h1>Honeycomb Project Creator</h1>
            <Web3Connect />
            <button onClick={() => handleCreate(wallet)}>Create Project</button>
        </div>
    );
};

export default Home;