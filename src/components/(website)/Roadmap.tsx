import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

import HeaderText from '@/components/(element)/HeaderText';

const Roadmap = () => {
    const t = useTranslations('Website');

    const milestones = [
        {
            phase: '1',
            date: 'Q4 2024',
            title: 'Development Kickoff',
            items: [
                'Gameplay Alpha Version (Devnet)',
                'Profile NFT (Devnet)',
                'Planet NFT (Devnet)',
                'Blockchain Integration',
                'Discord Integration',
                'Join Radar Hackathon'
            ]
        },
        {
            phase: '2',
            date: 'Q1 2025',
            title: 'Beta Testing & Community Building',
            items: [
                'Gameplay Beta Version (Devnet)',
                'Spacecraft NFT (Devnet)',
                'Community Engagement',
                'CEO Branding',
                'Explore the Universe',
                'Raise equity round',
                'Pre-sale Planet, Spacecraft NFT'
            ]
        },
        {
            phase: '3',
            date: 'Q2 2025',
            title: 'Mainnet Launch & Token Release',
            items: [
                'Launch Gameplay Version 1.0 (Mainnet)',
                'Profile, Planet, Spacecraft NFT (Mainnet)',
                'Treasure Box NFT (Mainnet)',
                'Engagement Campaign',
                'Release Token STCT',
                'Marketing Push'
            ]
        },
        {
            phase: '4',
            date: 'Q3 2025',
            title: 'Expansion & Partnerships',
            items: [
                'Partnership Development',
                'Community Competitions',
                'Spacecraft Upgrades',
                'STCT Token Staking',
                'Sponsor Prize Hackathon on Solana (Q3-Q4 2025)',
                'Course Build Game Web 3.0 with Metaplex'
            ]
        },
        {
            phase: '5',
            date: 'Q4 2025',
            title: 'Full Launch & Advanced Features',
            items: [
                'Full Game Launch',
                'Governance & DAO System',
                'Multiplayer System (socket.io)'
            ]
        }
    ];

    return (
        <section className='py-20 px-4 bg-gray-900 text-white'>
            <div className='max-w-6xl mx-auto'>
                <HeaderText title={t('roadmap-header')} />
                <motion.p 
                    className='text-lg mb-12 text-center text-gray-300'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    {t('roadmap-description')}
                </motion.p>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10'>
                    {milestones.map((milestone, index) => (
                        <motion.div 
                            key={index}
                            className='flex flex-col bg-gradient-to-b to-gray-800 from-gray-700 rounded-lg p-4 sm:p-6 h-full'
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                        >
                            <div className='flex items-center mb-2 sm:mb-4'>
                                <div>
                                    <div className='bg-white text-gray-900 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mr-2 sm:mr-4'>
                                        <span className='text-xl font-bold'>{milestone.phase}</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className='text-[16px] sm:text-[18px] md:text-[20px] font-bold'>{milestone.title}</h3>
                                    <p className='text-gray-400 text-[14px] sm:text-[16px]'>({milestone.date})</p>
                                </div>
                            </div>
                            <ul className='list-disc list-inside space-y-2 flex-grow'>
                                {milestone.items.map((item, itemIndex) => (
                                    <li key={itemIndex} className='text-sm'>{item}</li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Roadmap;