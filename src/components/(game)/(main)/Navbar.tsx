'use client'
import React from 'react';
import { SiFueler } from 'react-icons/si';
import { MdFoodBank } from 'react-icons/md';
import { GiMinerals } from 'react-icons/gi';
import { AiFillSetting } from 'react-icons/ai';

const Navbar = () => {

    const CustomResource = ({ Icon, amount }: { Icon: React.ElementType, amount: number }) => {
        return (
            <div className='flex w-[100%] mr-2 sm:mr-4 justify-center items-center bg-theme-bg-0 text-theme-title-1 rounded-md px-2 border-2 border-theme-border'>
                <Icon size={28} className='mr-1 w-[20px] sm:w-[28px] h-auto' />
                <p className='text-[14px] sm:text-[18px]'>{amount}</p>
            </div>
        )
    };

    return (
        <div className='flex w-full absolute z-50'>
            <div className='flex m-2 w-full'>
                <div className='flex w-full sm:py-1'>
                    <CustomResource Icon={GiMinerals} amount={10000} />
                    <CustomResource Icon={SiFueler} amount={10000} />
                    <CustomResource Icon={MdFoodBank} amount={10000} />
                </div>
                <button onClick={() => {}} className='p-1 sm:p-2 bg-theme-button hover:bg-theme-button-h rounded-full'>
                    <AiFillSetting size={26} className='text-theme-title w-[22px] sm:w-[26px] h-auto' />
                </button>
            </div>
        </div>
    )
};

export default Navbar;