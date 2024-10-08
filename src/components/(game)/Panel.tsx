'use client'
import Image from 'next/image';
import React from 'react';

interface PanelProps {
    onCreateTemporaryNode: (nodeType: string) => void;
}

const Panel: React.FC<PanelProps> = ({ onCreateTemporaryNode }) => {
    const CustomCard = ({ imageSrc, title, cost, Icon, nodeType }: { imageSrc: string, title: string, cost: number, Icon: string, nodeType: string }) => (
        <button
            className='flex flex-col w-[150px] m-2 p-1 items-center bg-gradient-to-t from-theme-bg-0 to-theme-bg-2 hover:from-theme-bg-1 hover:to-theme-bg-3 rounded-lg'
            onClick={() => onCreateTemporaryNode(nodeType)}
        >
            <Image src={imageSrc} alt={title} width={150} height={150} className='w-[80px] sm:w-[90px] md:w-[100px] h-auto' priority />
            <p className='font-medium text-theme-title text-[14px] sm:text-[16px]'>{title}</p>
            <div className='flex items-center justify-center text-theme-title'>
                <p className='font-medium mx-1 text-[14px] sm:text-[16px]'>{cost}</p>
                <Image src={`/assets/icons/resource-${Icon}.svg`} alt={`icon-${Icon}`} width={22} height={22} className='w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] md:w-[20px] md:h-[20px]' />
            </div>
        </button>
    );

    return (
        <div className='flex w-full absolute z-50 bottom-0'>
            <div className='flex w-full overflow-x-auto bg-[#00000080]'> 
                <CustomCard imageSrc={'/assets/images/ore-station.webp'} title={'Ore Station'} cost={1000} Icon={'ore'} nodeType='OreImport' />
                <CustomCard imageSrc={'/assets/images/fuel-station.webp'} title={'Fuel Station'} cost={1000} Icon={'fuel'} nodeType='FuelImport' />
                <CustomCard imageSrc={'/assets/images/food-station.webp'} title={'Food Station'} cost={1000} Icon={'food'} nodeType='FoodImport' />
            </div>
        </div>
    )
};

export default Panel;