'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useMotionValue, useTransform, motion } from 'framer-motion';
import { useRouter } from 'next-nprogress-bar';
import Head from 'next/head';
import { RiSpaceShipFill } from 'react-icons/ri';
import { PiPlugsConnectedFill, PiPlugsFill } from 'react-icons/pi';
import { FaYoutube,  FaDiscord } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

import Navbar from '@/components/(website)/Navbar';
import AboutCosmicNFTs from '@/components/(website)/AboutCosmicNFTs';
import HeaderText from '@/components/(website)/HeaderText';

const SciFiTitle = () => {
    const titleText = "Starry Ciels";

    return (
        <h1 className="text-5xl md:text-7xl font-bold mb-4 relative">
            {titleText.split('').map((char, index) => (
                <motion.span
                    key={index}
                    className={`inline-block`}
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    style={{
                        textShadow: '0 0 10px #7c3aed, 0 0 20px #7c3aed, 0 0 30px #7c3aed',
                        animation: `${'glow 2s ease-in-out infinite alternate'}`
                    }}
                >
                    {char}
                </motion.span>
            ))}
            <style jsx>{`
                @keyframes glow {
                    from {
                        text-shadow: 0 0 5px #7c3aed, 0 0 10px #7c3aed, 0 0 15px #7c3aed;
                    }
                    to {
                        text-shadow: 0 0 20px #7c3aed, 0 0 30px #7c3aed, 0 0 40px #7c3aed;
                    }
                }
            `}</style>
        </h1>
    );
};

const ConnectNodes = ({isConnected, setIsConnected}: any) => {
    return (
        <button onClick={() => {setIsConnected((prev: boolean) => !prev)}} className="flex items-center">
            <span
                className={`flex items-center justify-center ml-2 transition-colors duration-500 ${
                    isConnected ? 'text-white' : 'text-gray-700 line-through decoration-1'
                }`}
            >
                Connect nodes
            {isConnected ? (
                <PiPlugsConnectedFill size={40} className="mx-1 sm:mx-2 text-white transform transition-transform duration-500 ease-in-out scale-110" />
            ) : (
                <PiPlugsFill size={40} className="mx-1 sm:mx-2 text-gray-700 transform transition-transform duration-500 ease-in-out" />
            )}
                connect Worlds
            </span>
        </button>
    );
};

const VideoGame = () => {
    return (
        <section className="py-20 pb-10 px-4 bg-gray-900">
            <div className="max-w-4xl mx-auto">
                <HeaderText title={'Gameplay Demo'} />
                <div className="flex justify-center">
                    <div className="w-full w-[640px] h-[360px]">
                        <iframe
                            className="w-full h-full rounded-lg"
                            src="https://www.youtube.com/embed/H50Vkei4nD0"
                            title="Starry Ciels Demo"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    );
};

const NFTShowcase = () => {
    const nfts = [
        { id: 1, name: "Cosmic Nebula #1", image: "/assets/images/coal-import.png" },
        { id: 2, name: "Stardust Cluster #2", image: "/assets/images/gold-import.png" },
        { id: 3, name: "Galactic Vortex #3", image: "/assets/images/stone-import.png" },
        { id: 4, name: "Wood Resource", image: "/assets/images/wood-export.png" },
        { id: 5, name: "Gold Resource", image: "/assets/images/gold-export.png" },
        { id: 6, name: "Stone Resource", image: "/assets/images/stone-export.png" },
        // Add more NFTs as needed
    ];

    return (
        <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <HeaderText title={'Explore Our Cosmic Collection'} />
                <motion.p 
                    className="text-lg mb-12 text-center text-gray-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    Each planet represents a player's digital asset, which can harvest limited resources from the planet they control.
                </motion.p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {nfts.map((nft, index) => (
                        <motion.div 
                            key={nft.id}
                            className="flex bg-gray-800 rounded-lg overflow-hidden items-center"
                            whileHover={{ scale: 1.05 }}
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                        >
                            <Image src={nft.image} alt={nft.name} width={400} height={400} className="w-auto h-48 object-cover" />
                            <div className="p-4">
                                <h3 className="text-xl font-bold">{nft.name}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const Roadmap = () => {
    const milestones = [
        { phase: "Phase 1", title: "Launch", description: "Initial release of 1000 Starry Ciels NFTs" },
        { phase: "Phase 2", title: "Expansion", description: "Introduction of planetary systems and galaxies" },
        { phase: "Phase 3", title: "Integration", description: "Launch of the Starry Ciels metaverse" },
        // Add more milestones as needed
    ];

    return (
        <section className="py-20 px-4 bg-gray-900">
            <div className="max-w-4xl mx-auto">
                <HeaderText title={'Our Cosmic Roadmap'} />
                <div className="space-y-8">
                    {milestones.map((milestone, index) => (
                        <motion.div 
                            key={index}
                            className="flex items-start"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                        >
                            <div className="flex-shrink-0 bg-purple-600 rounded-full p-2 mr-4">
                                <span className="text-white font-bold">{milestone.phase}</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                                <p>{milestone.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const CommunityAndFAQ = () => {
    const faqs = [
        { question: "What is an NFT?", answer: "NFT stands for Non-Fungible Token. It's a unique digital asset verified using blockchain technology." },
        { question: "How can I purchase a Starry Ciels NFT?", answer: "You can purchase our NFTs through our official website or authorized NFT marketplaces." },
        // Add more FAQs as needed
    ];

    return (
        <section className="py-20 px-4">
            <div className="max-w-4xl mx-auto">
                <HeaderText title={'Join Our Cosmic Community'} />
                <div className="flex justify-center space-x-6 mb-12">
                    {/* Add your social media icons/links here */}
                    <a href="#" className="flex text-white hover:text-[#CCCCCC] transition-colors"><FaXTwitter width={20} height={20} className='w-[20px] h-[20px] mr-1' /> Twitter</a>
                    <a href="#" className="flex text-white hover:text-[#5865F2] hover:bg-black rounded-full transition-colors"><FaDiscord width={20} height={20} className='w-[20px] h-[20px] mr-1' /> Discord</a>
                    <a href="#" className="flex text-white hover:text-[#FF0000] hover:bg-black rounded-full transition-colors"><FaYoutube width={20} height={20} className='w-[20px] h-[20px] mr-1' /> Youtube</a>
                </div>
                <h3 className="text-2xl font-bold mb-6">Frequently Asked Questions</h3>
                <div className="space-y-6">
                    {faqs.map((faq, index) => (
                        <motion.div 
                            key={index}
                            className="bg-gray-800 p-6 rounded-lg"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h4 className="text-xl font-bold mb-2">{faq.question}</h4>
                            <p>{faq.answer}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default function Index() {
    const router = useRouter();

    const [ isConnected, setIsConnected ] = useState(false);
  
    useEffect(() => {
        const interval = setInterval(() => {
            setIsConnected((prev) => !prev);
        }, 5000);
    
        return () => clearInterval(interval);
    }, []);

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
            <Head>
                <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet" />
            </Head>
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
                <div className="content-container">
                    {/* Content */}
                    <div className="relative">
                        {/* Intro Section */}
                        <section className="h-screen flex flex-col justify-center items-center text-center px-4">
                            <Image src='/assets/website/logo.webp' alt='logo' width={160} height={160} className={`${isConnected ? 'opacity-100' : 'opacity-20'} transition duration-300 mb-2`} draggable={false} />
                            <SciFiTitle />
                            <motion.p
                                className="flex justify-center items-center text-xl md:text-2xl mb-8"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5, duration: 1 }}
                            >
                                <ConnectNodes isConnected={isConnected} setIsConnected={setIsConnected} />
                            </motion.p>
                            <motion.button
                                onClick={() => router.push('/game')}
                                className="flex justify-center items-center bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-2 px-6 rounded-full transition duration-300 transform hover:scale-105"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <RiSpaceShipFill size={22} className='mr-1' /> Launch into Space
                            </motion.button>
                        </section>
                        
                        <VideoGame />
                        <AboutCosmicNFTs />
                        <NFTShowcase />
                        <Roadmap />
                        <CommunityAndFAQ />
                    </div>
                    <div className='flex flex-col justify-center items-center bg-black py-4 justify-center'>
                        <p className='text-[16px] text-white'>{`© ${new Date().getFullYear()} StarryCiels. All Rights Reserved.`}</p>
                        <p className='text-[16px] text-white'>{`Created by MeteorVIIx`}</p>
                    </div>
                </div>
            </div>
        </>
    );
}