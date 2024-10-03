import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/useStore';
import { FaArrowLeft } from 'react-icons/fa';
import { useWallet } from '@solana/wallet-adapter-react';
import { FaExternalLinkAlt, FaInfoCircle, FaSyncAlt } from 'react-icons/fa';
import { SiSolana } from 'react-icons/si';
import { RiSpaceShipFill } from 'react-icons/ri';
import { Tooltip } from 'react-tooltip';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import axios from 'axios';

import SpinningLoader from '@/components/(element)/SpinningLoader';
import { CreatePlanet, FetchOwnPlanet, FetchOtherPlanet, FetchPlanet } from '@/metaplex/planet';

const DynamicPlanetGenerate = dynamic(() => import('./PlanetGenerate'), { ssr: false });

const menuItems = [
    { id: 'own', title: 'Own Planet', icon: '🌍', enable: true },
    { id: 'other', title: 'Other Planet', icon: '🪐', enable: true },
    { id: 'buy', title: 'Buy Planet', icon: '🛒', enable: true },
    { id: 'market', title: 'Marketplace', icon: '🏪', enable: false },
];

const getPlanetAttribute = (planet: any, key: string) => {
    return planet.attributes.attributeList.find((attr: any) => attr.key === key)?.value || 'N/A';
};

const handleSolscanClick = (publickey: string) => {
    window.open(`https://core.metaplex.com/explorer/${publickey}?env=devnet`, '_blank');
};

const tooltipContent = (planet: any) => {
    const color = getPlanetAttribute(planet, 'color');
    const colorBoxStyle = { backgroundColor: `#${color}` };
    return (
        <div>
            <p className='font-medium'>[ Attributes ]</p>
            <p>- Color:<span style={colorBoxStyle} className={'inline-block w-[14px] h-[14px] mx-1'} />#{color}</p>
            <p>- Size: {getPlanetAttribute(planet, 'size')}</p>
            <p>- Surface: {getPlanetAttribute(planet, 'surface')}</p>
            <p>- Cloud: {getPlanetAttribute(planet, 'cloud')}</p>
            <p>- Rings: {getPlanetAttribute(planet, 'rings')}</p>
        </div>
    )
};

const RefreshDataButton = ({ onClick, isLoading, cooldown }: { onClick: () => void; isLoading: boolean; cooldown: number }) => {
    return (
        <button
            onClick={onClick}
            disabled={isLoading || cooldown > 0}
            className={`absolute top-2 right-2 font-bold py-2 px-4 rounded-full transition duration-300 flex items-center ${
                cooldown > 0 || isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
        >
            <FaSyncAlt size={18} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {cooldown > 0 ? `Wait (${cooldown}s)` : 'Refresh'}
        </button>
    );
};

const OwnPlanetComponent = ({data, isLoading, onBuyClick, onRefresh, cooldown}: {data: any, isLoading: boolean, onBuyClick: () => void, onRefresh: () => void, cooldown: number}) => {
    const { setGameMenu, setLandingPublic, setLandingColor } = useGameStore();

    const handleOnClick = async (publicKey: string, color: string) => {
        setLandingPublic(publicKey);
        setLandingColor(color);
        setGameMenu('game');
    };

    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className='bg-indigo-800 rounded-lg p-6 mt-8 w-full max-w-4xl flex justify-center items-center'
            >
                <SpinningLoader />
            </motion.div>
        );
    }

    if (data.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className='bg-indigo-800 rounded-lg p-6 mt-8 w-full max-w-4xl flex flex-col justify-center items-center relative'
            >
                <RefreshDataButton onClick={onRefresh} isLoading={isLoading} cooldown={cooldown} />
                <p className='text-xl font-semibold'>No Planets Found</p>
                <p className='text-xl font-semibold my-2'>Get first new planet</p>
                <button onClick={onBuyClick} className='flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-xl transition duration-300'>
                    Here
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='bg-indigo-800 rounded-lg p-6 mt-8 w-full max-w-4xl max-h-[400px] overflow-y-auto relative'
        >
            <RefreshDataButton onClick={onRefresh} isLoading={isLoading} cooldown={cooldown} />
            <h2 className='text-2xl font-bold mb-4'>Your NFT Planets ({data.length})</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
            {data.map((planet: any) => (
                <div key={planet.publicKey} className='bg-indigo-700 rounded-lg p-4 flex flex-col items-center relative'>
                    <button
                        data-tooltip-id={'tooltip-view'}
                        data-tooltip-content={'View on Metaplex'}
                        onClick={() => handleSolscanClick(planet.publicKey)}
                        className='p-1 bg-indigo-600 rounded-md absolute top-2 right-2'
                    >
                        <FaExternalLinkAlt size={18} />
                    </button>
                    <Tooltip id={'tooltip-view'} />
                    <div className='z-10 w-32 h-32'>
                        <DynamicPlanetGenerate color={getPlanetAttribute(planet, 'color')} rings={getPlanetAttribute(planet, 'rings')} cloud={getPlanetAttribute(planet, 'cloud')} surface={getPlanetAttribute(planet, 'surface')} />
                    </div>
                    <div className='flex justify-center items-center'>
                        <p className='text-lg font-semibold'>{getPlanetAttribute(planet, 'planet')}</p>
                        <button
                            data-tooltip-id={`tooltip-${planet.publicKey}`}
                            className='ml-1 p-1 bg-indigo-600 rounded-full'
                        >
                        <FaInfoCircle size={16} />
                        </button>
                        <Tooltip id={`tooltip-${planet.publicKey}`} render={() => tooltipContent(planet)} />
                    </div>
                    <p className='text-sm text-indigo-300'>Code: {getPlanetAttribute(planet, 'code')}</p>
                    <div className='mt-2'>
                        <button
                            onClick={() => handleOnClick(planet.publicKey, getPlanetAttribute(planet, 'color'))}
                            className='flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-4 rounded-lg transition duration-300'
                        >
                            <RiSpaceShipFill size={18} />
                            <p className='ml-1'>Landing</p>
                        </button>
                    </div>
                </div>
            ))}
            </div>
        </motion.div>
    )
};

const OtherPlanetComponent = ({ data, wallet, isLoading, onRefresh, cooldown }: { data: any, wallet: string, isLoading: boolean, onRefresh: () => void, cooldown: number }) => {
    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className='bg-indigo-800 rounded-lg p-6 mt-8 w-full max-w-4xl flex justify-center items-center'
            >
                <SpinningLoader />
            </motion.div>
        );
    }

    if (data.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className='bg-indigo-800 rounded-lg p-6 mt-8 w-full max-w-4xl flex justify-center items-center relative'
            >
                <RefreshDataButton onClick={onRefresh} isLoading={isLoading} cooldown={cooldown} />
                <p className='text-xl font-semibold'>No Other Planets Found</p>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='bg-indigo-800 rounded-lg p-6 mt-8 w-full max-w-4xl max-h-[400px] overflow-y-auto relative'
        >
            <RefreshDataButton onClick={onRefresh} isLoading={isLoading} cooldown={cooldown} />
            <h2 className='text-2xl font-bold mb-4'>Other Players Planets ({data.length})</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
            {data.map((planet: any) => (
                <div key={planet.publicKey} className='bg-indigo-700 rounded-lg p-4 flex flex-col items-center relative'>
                    <button
                        data-tooltip-id={'tooltip-view'}
                        data-tooltip-content={'View on Metaplex'}
                        onClick={() => handleSolscanClick(planet.publicKey)}
                        className='p-1 bg-indigo-600 rounded-md absolute top-2 right-2'
                    >
                        <FaExternalLinkAlt size={18} />
                    </button>
                    <Tooltip id={'tooltip-view'} />
                    <div className='z-10 w-32 h-32'>
                        <DynamicPlanetGenerate color={getPlanetAttribute(planet, 'color')} rings={getPlanetAttribute(planet, 'rings')} cloud={getPlanetAttribute(planet, 'cloud')} surface={getPlanetAttribute(planet, 'surface')} />
                    </div>
                    <div className='flex justify-center items-center'>
                        <p className='text-lg font-semibold'>{getPlanetAttribute(planet, 'planet')}</p>
                        <button
                            data-tooltip-id={`tooltip-${planet.publicKey}`}
                            className='ml-1 p-1 bg-indigo-600 rounded-full'
                        >
                        <FaInfoCircle size={16} />
                        </button>
                        <Tooltip id={`tooltip-${planet.publicKey}`} render={() => tooltipContent(planet)} />
                    </div>
                    <p className='text-sm text-indigo-300'>Code: {getPlanetAttribute(planet, 'code')}</p>
                    <div className='flex items-center text-sm'>
                        <p className='text-indigo-300'>Owner: {(planet.owner).slice(0,5)}...{(planet.owner).slice(-5)}</p>
                        {planet.owner === wallet &&
                            <span className='rounded-full bg-purple-100 ml-1 px-2 py-0.5 text-purple-700'>
                                You
                            </span>
                        }
                    </div>
                </div>
            ))}
            </div>
        </motion.div>
    )
};

const BuyPlanetComponent = ({ wallet, onCheckClick, onBuySuccess }: { wallet: string; onCheckClick: () => void; onBuySuccess: () => void }) => {
    const { nicknameProfile } = useGameStore();
    const [ isBuying, setIsBuying ] = useState(false);
    const [ newPlanet, setNewPlanet ] = useState('');
    
    const handleBuyPlanet = async () => {
        setIsBuying(true);
        try {
            const response = await CreatePlanet(wallet);
            const resPlanet: any = await FetchPlanet(response.assetAddress);
            const name = resPlanet.name;
            const planetAttributes = resPlanet.attributes.attributeList.reduce((acc: any, attr: any) => {
                acc[attr.key] = attr.value;
                return acc;
            }, {});
            const { birthday, planet, color, size, surface, cloud, rings, code } = planetAttributes;
            const colorEmbed = parseInt(color, 16);

            await axios.post('https://discord.com/api/webhooks/1291384347777302539/LKtLyHipdK_Mho7wScLf_zrozMkdmErZbkZF8gj9cfpc5uJSj0S6U-U1t33jxWTKoxEf', {
                content: null,
                embeds: [
                    {
                        "title": name,
                        "description": "- Owner: **" + nicknameProfile + "**\n- Planet: **" + planet + "**\n- Color: **#" + color + "**\n- Size: **" + size + "**\n- Surface: **" + surface + "**\n- Cloud: **" + cloud + "**\n- Rings: **" + rings + "**\n- Code: **" + code + "**",
                        "url": `https://core.metaplex.com/explorer/${response.assetAddress}?env=devnet`,
                        "color": colorEmbed,
                        "footer": {
                          "text": "Birthday"
                        },
                        "timestamp": birthday,
                        "thumbnail": {
                          "url": "https://gateway.pinata.cloud/ipfs/QmcgpFxeN7Ecfwux8TMCu84jAkhtSNjiJNm8AJuHUwLSLR"
                        }
                    }
                ]
            });
            setNewPlanet(response.assetAddress);
            onBuySuccess();
        } catch (error) {
            console.error("Error buying planet:", error);
        } finally {
            setIsBuying(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='bg-indigo-800 rounded-lg p-6 mt-8 w-full max-w-4xl max-h-[400px] overflow-y-auto'
        >
            <h2 className='text-2xl font-bold mb-4'>Buy New Planet</h2>
            <div className='flex flex-col items-center bg-indigo-700 rounded-lg p-4'>
                <Image src='/assets/images/planet.webp' alt='planet' width={800} height={800} className='flex w-32 h-32' />
                <p className='text-2xl font-semibold mb-2'>New Planet</p>
                {isBuying ? (
                    <div className='flex items-center bg-gray-500 py-3 px-6 rounded-lg'>
                        <SpinningLoader />
                    </div>
                ) : (
                    <button onClick={() => handleBuyPlanet()} className='flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-xl transition duration-300'>
                        <p className='pr-1'>1</p>
                        <SiSolana size={20} />
                    </button>
                )}
                {newPlanet &&
                    <div className='flex flex-col justify-center items-center'>
                        <p className='text-white mb-2'>Success Mint: {newPlanet}</p>
                        <button onClick={onCheckClick} className='flex items-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg text-xl transition duration-300'>
                            Check NFT
                        </button>
                    </div>
                }
            </div>
        </motion.div>
    )
};

const MotherScreen = () => {
    const wallet = useWallet();
    const { setGameMenu, landingPublic } = useGameStore();
    const [ menuState, setMenuState ] = useState<string | null>(null);
    const [ ownPlanetData, setOwnPlanetData ] = useState<any>([]);
    const [ otherPlanetData, setOtherPlanetData ] = useState<any>([]);
    const [ refreshTrigger, setRefreshTrigger ] = useState(0);
    const [ isLoadingOwn, setIsLoadingOwn ] = useState(true);
    const [ isLoadingOther, setIsLoadingOther ] = useState(true);
    const [ cooldown, setCooldown ] = useState(0);

    useEffect(() => {
        getDataInitial();
    }, [refreshTrigger]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (cooldown > 0) {
            timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [cooldown]);

    const sortedPlanet = (data: any) => {
        return data.sort((a: any, b: any) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            return nameA.localeCompare(nameB);
        });
    };

    const getDataInitial = async () => {
        setIsLoadingOwn(true);
        setIsLoadingOther(true);
        try {
            const ownPlanet = await FetchOwnPlanet(String(wallet.publicKey));
            setOwnPlanetData(sortedPlanet(ownPlanet));
            setIsLoadingOwn(false);

            const otherPlanet = await FetchOtherPlanet();
            setOtherPlanetData(sortedPlanet(otherPlanet));
            setIsLoadingOther(false);
        } catch (error) {
            console.error("Error fetching planet data:", error);
        }
    };

    const refreshOwnData = async () => {
        if (cooldown === 0) {
            setIsLoadingOwn(true);
            setCooldown(10);
            try {
                const ownPlanet = await FetchOwnPlanet(String(wallet.publicKey));
                setOwnPlanetData(sortedPlanet(ownPlanet));
            } catch (error) {
                console.error("Error refreshing own planet data:", error);
            } finally {
                setIsLoadingOwn(false);
            }
        }
    };

    const refreshOtherData = async () => {
        if (cooldown === 0) {
            setIsLoadingOther(true);
            setCooldown(10);
            try {
                const otherPlanet = await FetchOtherPlanet();
                setOtherPlanetData(sortedPlanet(otherPlanet));
            } catch (error) {
                console.error("Error refreshing other planet data:", error);
            } finally {
                setIsLoadingOther(false);
            }
        }
    };

    const handleBuySuccess = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
    <div className='flex w-full min-h-screen absolute z-100'>
        <div className='flex flex-col items-center justify-start w-full min-h-screen bg-gradient-to-b from-indigo-900 to-black text-white p-4 overflow-x-hidden relative'>
            {landingPublic &&
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className='absolute top-4 left-4 bg-gray-300 text-gray-800 p-2 rounded-full hover:bg-gray-400 transition duration-300'
                    onClick={() => setGameMenu('game')}
                >
                    <FaArrowLeft size={24} />
                </motion.button>
            }
            <motion.h1
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='text-4xl md:text-6xl font-bold mb-8 text-center mt-12'
            >
                Spaceship Menu
            </motion.h1>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-4xl'>
                {menuItems.map((item) => (
                    <React.Fragment key={item.id}>
                        {item.enable ? (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className={`bg-indigo-800 rounded-lg shadow-lg overflow-hidden cursor-pointer ${
                                    menuState === item.id ? 'ring-4 ring-blue-400' : ''
                                }`}
                                onClick={() => setMenuState(item.id)}
                            >
                                <div className='p-4 flex flex-col items-center'>
                                    <span className='text-4xl mb-2'>{item.icon}</span>
                                    <h2 className='text-sm font-semibold text-center'>{item.title}</h2>
                                </div>
                            </motion.button>
                        ) : (
                            <div className={'flex justify-center items-center bg-gray-800 rounded-lg shadow-lg overflow-hidden'}>
                                <div className='p-4 flex flex-col items-center text-gray-500'>
                                    <h2 className='text-sm font-semibold text-center'>{item.title}</h2>
                                    <h2 className='text-sm font-semibold text-center'>Coming Soon...</h2>
                                </div>
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
            <AnimatePresence mode='wait'>
                {menuState === 'own' && <OwnPlanetComponent key='own' data={ownPlanetData} isLoading={isLoadingOwn} onBuyClick={() => setMenuState('buy')} onRefresh={refreshOwnData} cooldown={cooldown} />}
                {menuState === 'other' && <OtherPlanetComponent key='other' data={otherPlanetData} wallet={String(wallet.publicKey)} isLoading={isLoadingOther} onRefresh={refreshOtherData} cooldown={cooldown} />}
                {menuState === 'buy' && <BuyPlanetComponent key='buy' wallet={String(wallet.publicKey)} onCheckClick={() => setMenuState('own')} onBuySuccess={handleBuySuccess} />}
            </AnimatePresence>
        </div>
    </div>
    );
};

export default MotherScreen;