'use client'
import React, { useState } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";
import { client } from '@/utils/constants';
import { sendTxns } from '@/utils/honeycomb';

import Web3Connect from '@/components/(global)/Web3Connect';

const Home: React.FC = () => {
    const wallet = useWallet();
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (message: string) => {
        setLogs(prevLogs => [...prevLogs, message]);
    };

    const handleCreate = async () => {
        setLogs([]); // Clear previous logs
        addLog('Create project started...');
        
        if (!wallet.publicKey) {
            addLog('Error: Wallet not connected');
            alert('Please connect your wallet');
            return;
        }
        
        try {
            addLog('Step 1: Preparing createCreateProjectTransaction params...');
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
            addLog(`Params: ${JSON.stringify(params, null, 2)}`);

            addLog('Step 2: Calling createCreateProjectTransaction...');
            const result = await client.createCreateProjectTransaction(params);
            addLog(`Raw result: ${JSON.stringify(result, null, 2)}`);

            if (!result || !result.createCreateProjectTransaction) {
                throw new Error('Invalid response from createCreateProjectTransaction');
            }
            
            addLog('Step 3: Extracting project and transaction data...');
            const { project: projectAddress, tx: txResponse }: any = result.createCreateProjectTransaction;
            
            addLog(`Project Address: ${projectAddress}`);
            addLog(`Transaction Response: ${JSON.stringify(txResponse, null, 2)}`);
            
            if (txResponse && txResponse.transactions) {
                addLog('Step 4: Sending transactions...');
                await sendTxns(wallet, txResponse);
                addLog('Project created successfully');
            } else {
                addLog('Error: No transactions returned');
                addLog(`Full txResponse: ${JSON.stringify(txResponse, null, 2)}`);
            }
        } catch (error: any) {
            addLog(`Error creating project: ${error.message}`);
        }
    };

    return (
        <div className='bg-red-400 p-4'>
            <h1 className='text-2xl font-bold mb-4'>Honeycomb Project Creator</h1>
            <Web3Connect />
            <button 
                onClick={handleCreate}
                className='bg-blue-500 text-white px-4 py-2 rounded mt-4 mb-4'
            >
                Create Project
            </button>
            <div className='bg-white p-4 rounded'>
                <h2 className='text-xl font-semibold mb-2'>Logs:</h2>
                {logs.map((log, index) => (
                    <div key={index} className='mb-1'>
                        {log}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;