'use client'
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { umi } from '@/utils/umi';
import { useWallet } from '@solana/wallet-adapter-react';
import { publicKey } from '@metaplex-foundation/umi';
import { fetchCollection } from '@metaplex-foundation/mpl-core';

import { CreateCollection, FetchCollection, CreateProfileCollection } from '@/metaplex/collection';
import { CreateAsset, FetchAsset, FetchAssetByCollection, TransferAsset } from '@/metaplex/asset';
import Web3Connect from '@/components/(global)/Web3Connect';

const Project = () => {
    const wallet = useWallet();
    const [decodedData, setDecodedData] = useState<any>(null);

    const projectFetch = async () => {
        const collectionAddress = publicKey('Abku8gXwJqxhV2tDnffUnkUGjqdbsi3WWEQhZf2LTwuQ');
        const collection = await fetchCollection(umi, collectionAddress);
        console.log(collection)
    };

    const handleClick = async () => {
        const result = await CreateCollection();
        console.log('Collection Address:', result.collectionAddress.toString());
    };

    const createAsset = async () => {
        const result = await CreateAsset();
        console.log('Asset Address:', result.assetAddress.toString())
    };

    const fetchAsset = async () => {
        const result = await FetchAsset();
        console.log('Asset URI:', result);
        
        const base64Data = result.uri.split(',')[1];
        const decodedJson = JSON.parse(atob(base64Data));
        setDecodedData(decodedJson);
    };

    const transferAsset = async () => {
        const result = await TransferAsset();
        console.log('Asset URI:', result);
    };

    const fetchAssetCollection = async () => {
        const result = await FetchAssetByCollection();
        console.log(result)
    };

    const CreateCreateCollection = async () => {
        const result = await CreateProfileCollection();
        console.log(result)
    };

    return (
        <div className='flex flex-col bg-red-400 p-4'>
            <Web3Connect />
            <div>
                <button className='px-4 mx-2 bg-slate-500' onClick={() => handleClick()}>Create New Assets</button>
                <button className='px-4 mx-2 bg-slate-500' onClick={() => projectFetch()}>Fetch Collection</button>
                <button className='px-4 mx-2 bg-slate-500' onClick={() => CreateCreateCollection()}>Create Profile Collection</button>
            </div>
            <div>
                <button className='px-4 mx-2 bg-slate-500' onClick={() => createAsset()}>Create Asset</button>
                <button className='px-4 mx-2 bg-slate-500' onClick={() => fetchAsset()}>Fetch Asset</button>
                <button className='px-4 mx-2 bg-slate-500' onClick={() => fetchAssetCollection()}>Fetch Asset Collection</button>
                <button className='px-4 mx-2 bg-slate-500' onClick={() => transferAsset()}>Transfer Asset</button>
            </div>
            <div className='bg-white p-4 rounded mt-4'>
                {decodedData ? (
                    <div>
                        {decodedData.image && (
                            <Image 
                                src={decodedData.image} 
                                alt={decodedData.name}
                                width={200}
                                height={200}
                                className='mb-4 rounded'
                                priority
                                draggable={false}
                            />
                        )}
                        <h2 className='text-[20px] font-medium'>{decodedData.name}</h2>
                        <span>{decodedData.description}</span>
                        <pre>{JSON.stringify(decodedData, null, 2)}</pre>
                    </div>
                ) : (
                    <p>No asset data fetched.</p>
                )}
            </div>
        </div>
    )
};

export default Project;