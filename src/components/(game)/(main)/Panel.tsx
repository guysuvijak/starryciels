'use client'
import Image from 'next/image';
import React from 'react';
import { SiFueler } from 'react-icons/si';
import { MdFoodBank } from 'react-icons/md';
import { GiMinerals } from 'react-icons/gi';

const Panel = () => {

    const CustomCard = ({ imageSrc, title, cost, Icon }: { imageSrc: string, title: string, cost: number, Icon: React.ElementType }) => (
        <button className='flex flex-col w-[150px] m-2 p-1 items-center bg-gradient-to-t from-theme-bg-1 to-theme-button hover:from-theme-bg-0 hover:to-theme-button-h rounded-lg'>
            <Image src={imageSrc} alt={title} width={150} height={150} className='w-[100px] h-auto' priority />
            <p className='font-medium'>{title}</p>
            <div className='flex items-center justify-center text-theme-title'>
                <p>Cost</p>
                <p className='font-medium mx-1'>{cost}</p>
                <Icon size={22} />
            </div>
        </button>
    );

    return (
        <div className='flex w-full absolute z-50 bottom-0'>
            <div className='flex w-full overflow-x-auto bg-[#00000080]'> 
                <CustomCard imageSrc={'/assets/images/ore-station.webp'} title={'Ore Station'} cost={1000} Icon={GiMinerals} />
                <CustomCard imageSrc={'/assets/images/fuel-station.webp'} title={'Fuel Station'} cost={1000} Icon={SiFueler} />
                <CustomCard imageSrc={'/assets/images/food-station.webp'} title={'Food Station'} cost={1000} Icon={MdFoodBank} />
                <CustomCard imageSrc={'/assets/images/connector.gif'} title={'Connector'} cost={1000} Icon={GiMinerals} />
            </div>
        </div>
    )
};

export default Panel;