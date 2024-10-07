import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

import HeaderText from '@/components/(element)/HeaderText';
import { NftCardProps } from '@/types/(components)/Website';

const NftCard = ({ data, index }: NftCardProps) => (
    <motion.div 
        className='bg-gradient-to-b to-gray-800 from-gray-700 rounded-lg overflow-hidden shadow-lg items-center'
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
    >
        <div className='flex items-center justify-center'>
            <Image src={data.image} alt={data.name} width={400} height={400} className='w-auto h-28 sm:h-36 pt-4' draggable={false} />
        </div>
        <div className='p-4'>
            <h3 className='text-xl font-bold mb-2 text-white self-center text-center'>{data.name}</h3>
            <p className='text-sm text-gray-400'>{data.description}</p>
        </div>
    </motion.div>
);

const Nft = () => {
    const t = useTranslations('Website');

    const data = [
        {
            name: t('nft-profile-header'),
            image: '/assets/website/nft-profile.webp',
            description: t('nft-profile-description')
        },
        {
            name: t('nft-planet-header'),
            image: '/assets/website/nft-planet.webp',
            description: t('nft-planet-description')
        },
        {
            name: t('nft-spacecraft-header'),
            image: '/assets/website/nft-spacecraft.webp',
            description: t('nft-spacecraft-description')
        },
        {
            name: t('nft-treasure-header'),
            image: '/assets/website/nft-treasure-box.webp',
            description: t('nft-treasure-description')
        }
    ];

    return (
        <section className='py-20 px-4 bg-gray-900'>
            <div className='max-w-6xl mx-auto'>
                <HeaderText title={t('nft-header')} />
                <motion.p 
                    className='text-lg mb-12 text-center text-gray-300'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    {t('nft-description')}
                </motion.p>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                    {data.map((data, index) => (
                        <NftCard key={data.name} data={data} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Nft;