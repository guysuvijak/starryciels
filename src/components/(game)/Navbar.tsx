'use client'
import React, { useEffect } from 'react';
import Image from 'next/image';
import { useWallet } from '@solana/wallet-adapter-react';

import { useResourceStore } from '@/stores/useStore';

const Navbar = () => {
    const wallet = useWallet();
    const { ore, fuel, food, fetchResources } = useResourceStore();

    useEffect(() => {
        if (wallet.publicKey) {
            fetchResources(wallet.publicKey.toString());
        }
    }, [wallet.publicKey, fetchResources]);

    const CustomResource = ({ name, amount }: { name: string, amount: number }) => {
        return (
            <div className='flex w-[100%] mr-2 sm:mr-4 justify-center items-center bg-theme-bg-0 text-theme-title rounded-md px-2 border-2 border-theme-border'>
                <Image src={`/assets/icons/resource-${name}.svg`} alt={`icon-${name}`} width={28} height={28} className='mr-2 w-[20px] sm:w-[24px] h-auto' />
                <p className='text-[14px] sm:text-[18px]'>{amount}</p>
            </div>
        )
    };

    return (
        <div className='flex w-full absolute z-50'>
            <div className='flex m-2 w-full'>
                <div className='flex w-full sm:py-1'>
                    <CustomResource name='ore' amount={ore} />
                    <CustomResource name='fuel' amount={fuel} />
                    <CustomResource name='food' amount={food} />
                </div>
            </div>
        </div>
    )
};

export default Navbar;