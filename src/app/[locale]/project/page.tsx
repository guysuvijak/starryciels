'use client'
import { useWallet } from '@solana/wallet-adapter-react';
import { umi } from '@/utils/umi';
import { generateSigner } from '@metaplex-foundation/umi';
import { create } from '@metaplex-foundation/mpl-core';

import Web3Connect from '@/components/(global)/Web3Connect';

const Project = () => {
    const wallet = useWallet();
    const assetSigner = generateSigner(umi);

    const handleClick = async () => {
        console.log(assetSigner);
        const result = create(umi, {
            asset: assetSigner,
            name: 'StarryCiels Test',
            uri: 'https://starryciels.vercel.app',
          }).sendAndConfirm(umi)
        console.log(result);
    };

    return (
        <div className='flex bg-red-400'>
            <Web3Connect />
            <button onClick={() => handleClick()}>Create New Assets</button>
        </div>
    )
};

export default Project;