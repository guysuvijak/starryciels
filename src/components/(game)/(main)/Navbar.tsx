'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useWallet } from '@solana/wallet-adapter-react';
import { AiFillSetting } from 'react-icons/ai';

import { CheckProfile } from '@/metaplex/profile';

const Navbar = () => {
    const wallet = useWallet();
    const [ resourceData, setResourceData ] = useState({ ore: 0, fuel: 0, food: 0 });

    useEffect(() => {
        getResourceData();
    }, []);

    const getResourceData = async () => {
        const response = await CheckProfile(String(wallet.publicKey));
        if (response && response[0]?.attributes?.attributeList) {
            const attributeList = response[0].attributes.attributeList;
            const ore = Number(attributeList.find(attr => attr.key === 'ore')?.value) || 0;
            const fuel = Number(attributeList.find(attr => attr.key === 'fuel')?.value) || 0;
            const food = Number(attributeList.find(attr => attr.key === 'food')?.value) || 0;
            setResourceData({ ore, fuel, food });
        }
    };

    const CustomResource = ({ name, amount }: { name: string, amount: number }) => {
        return (
            <div className='flex w-[100%] mr-2 sm:mr-4 justify-center items-center bg-theme-bg-0 text-theme-title-1 rounded-md px-2 border-2 border-theme-border'>
                <Image src={`/assets/icons/resource-${name}.svg`} alt={`icon-${name}`} width={28} height={28} className='mr-1 w-[20px] sm:w-[28px] h-auto' />
                <p className='text-[14px] sm:text-[18px]'>{amount}</p>
            </div>
        )
    };

    return (
        <div className='flex w-full absolute z-50'>
            <div className='flex m-2 w-full'>
                <div className='flex w-full sm:py-1'>
                    <CustomResource name='ore' amount={resourceData.ore} />
                    <CustomResource name='fuel' amount={resourceData.fuel} />
                    <CustomResource name='food' amount={resourceData.food} />
                </div>
                <button onClick={() => {}} className='p-1 sm:p-2 bg-theme-button hover:bg-theme-button-h rounded-full'>
                    <AiFillSetting size={26} className='text-theme-title w-[22px] sm:w-[26px] h-auto' />
                </button>
            </div>
        </div>
    )
};

export default Navbar;