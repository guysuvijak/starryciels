'use client';
import React, { useEffect } from 'react';
import { useMotionValue, useTransform, motion } from 'framer-motion';

import Navbar from '@/components/(website)/Navbar';
import IntroSection from '@/components/(website)/IntroSection';
import GameplayDemo from '@/components/(website)/GameplayDemo';
import PlanetNft from '@/components/(website)/PlanetNft';
import InGameResource from '@/components/(website)/InGameResource';
import CommunityAndFaq from '@/components/(website)/CommunityAndFaq';
import Footer from '@/components/(website)/Footer';
import HeaderText from '@/components/(element)/HeaderText';

const Roadmap = () => {
    const milestones = [
        { phase: 'Phase 1', title: 'Launch', description: 'Initial release of 1000 StarryCiels NFTs' },
        { phase: 'Phase 2', title: 'Expansion', description: 'Introduction of planetary systems and galaxies' },
        { phase: 'Phase 3', title: 'Integration', description: 'Launch of the StarryCiels metaverse' },
    ];

    return (
        <section className='py-20 px-4 bg-gray-900'>
            <div className='max-w-4xl mx-auto'>
                <HeaderText title={'Roadmap'} />
                <div className='space-y-8'>
                    {milestones.map((milestone, index) => (
                        <motion.div 
                            key={index}
                            className='flex items-start'
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                        >
                            <div className='flex-shrink-0 bg-purple-600 rounded-full p-2 mr-4'>
                                <span className='text-white font-bold'>{milestone.phase}</span>
                            </div>
                            <div>
                                <h3 className='text-xl font-bold mb-2'>{milestone.title}</h3>
                                <p>{milestone.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default function Index() {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Different movement speeds for each layer
    const bg1X = useTransform(x, [-100, 100], ['-5%', '5%']);
    const bg1Y = useTransform(y, [-100, 100], ['-5%', '5%']);

    const bg2X = useTransform(x, [-100, 100], ['-10%', '10%']);
    const bg2Y = useTransform(y, [-100, 100], ['-10%', '10%']);

    const bg3X = useTransform(x, [-100, 100], ['-15%', '15%']);
    const bg3Y = useTransform(y, [-100, 100], ['-15%', '15%']);

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        const { clientX, clientY } = event;
        const xOffset = window.innerWidth / 2 - clientX;
        const yOffset = window.innerHeight / 2 - clientY;

        x.set(xOffset / 10);
        y.set(yOffset / 10);
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            y.set(-scrollY / 5);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [y]);

    return (
        <>
            <style jsx global>{`
                body {
                    font-family: 'Orbitron', sans-serif;
                    margin: 0;
                    padding: 0;
                    overflow: hidden;
                }
                
                .content-container {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    overflow-y: scroll;
                    z-index: 10;
                }
                    
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }

                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                
                /* Customizing scrollbar */
                .content-container::-webkit-scrollbar {
                    width: 10px;
                }
                
                .content-container::-webkit-scrollbar-track {
                    background: #1a1a1a;
                }
                
                .content-container::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #8b5cf6, #4c1d95);
                    border-radius: 5px;
                }
                
                .content-container::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, #7c3aed, #5b21b6);
                }
            `}</style>
            <div className='relative min-h-screen overflow-x-hidden bg-black text-white'
                onMouseMove={handleMouseMove}>
                {/* Parallax Background Layers */}
                <motion.div className='fixed top-0 left-0 w-full h-full' style={{ backgroundImage: 'url(/assets/website/bg1.png)', backgroundSize: 'cover', x: bg1X, y: bg1Y, zIndex: 1 }} />
                <motion.div className='fixed top-0 left-0 w-full h-full' style={{ backgroundImage: 'url(/assets/website/bg2.png)', backgroundSize: 'cover', x: bg2X, y: bg2Y, zIndex: 2 }} />
                <motion.div className='fixed top-0 left-0 w-full h-full' style={{ backgroundImage: 'url(/assets/website/bg3.png)', backgroundSize: 'cover', x: bg3X, y: bg3Y, zIndex: 3 }} />

                {/* Navbar */}
                <Navbar />

                {/* Scrollable Content Container */}
                <div className='content-container'>
                    {/* Content */}
                    <div className='relative'>
                        <IntroSection />
                        <GameplayDemo />
                        <PlanetNft />
                        <InGameResource />
                        <Roadmap />
                        <CommunityAndFaq />
                    </div>
                    <Footer />
                </div>
            </div>
        </>
    );
}