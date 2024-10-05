import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { FaArrowLeft } from 'react-icons/fa';
import { useWallet } from '@solana/wallet-adapter-react';
import { FaExternalLinkAlt, FaInfoCircle, FaSyncAlt } from 'react-icons/fa';
import { SiSolana } from 'react-icons/si';
import { RiSpaceShipFill } from 'react-icons/ri';
import { Tooltip } from 'react-tooltip';
import dynamic from 'next/dynamic';
import Image from 'next/image';

import { useGameStore } from '@/stores/useStore';
import { sendWebhookDiscordPlanet } from '@/utils/discord-webhook';
import ThemeToggle from '@/components/(element)/ThemeToggle';
import SpinningLoader from '@/components/(element)/SpinningLoader';
import { CreatePlanet, FetchOwnPlanet, FetchOtherPlanet, FetchPlanet } from '@/metaplex/planet';

const DynamicPlanetGenerate = dynamic(() => import('./PlanetGenerate'), { ssr: false });

const getPlanetAttribute = (planet: any, key: string) => {
    return planet.attributes.attributeList.find((attr: any) => attr.key === key)?.value || 'N/A';
};

const handleSolscanClick = (publickey: string) => {
    window.open(`https://core.metaplex.com/explorer/${publickey}?env=devnet`, '_blank');
};

const tooltipContent = (planet: any) => {
    const t = useTranslations('Spaceship');
    const color = getPlanetAttribute(planet, 'color');
    const colorBoxStyle = { backgroundColor: `#${color}` };

    return (
        <div>
            <p className='font-medium'>{t('attributes-tooltip')}</p>
            <p>{t('color-tooltip')}<span style={colorBoxStyle} className={'inline-block w-[14px] h-[14px] mx-1'} />{t('color2-tooltip',{color: color})}</p>
            <p>{t('size-tooltip', {size: getPlanetAttribute(planet, 'size')})}</p>
            <p>{t('surface-tooltip', {surface: getPlanetAttribute(planet, 'surface')})}</p>
            <p>{t('cloud-tooltip', {cloud: getPlanetAttribute(planet, 'cloud')})}</p>
            <p>{t('rings-tooltip', {rings: getPlanetAttribute(planet, 'rings')})}</p>
        </div>
    )
};

const RefreshDataButton = ({ onClick, isLoading, cooldown }: { onClick: () => void; isLoading: boolean; cooldown: number }) => {
    const t = useTranslations('Spaceship');

    return (
        <button
            onClick={onClick}
            disabled={isLoading || cooldown > 0}
            className={`font-bold py-1 sm:py-2 px-4 rounded-full transition duration-300 flex items-center ${cooldown > 0 || isLoading ? 'bg-theme-button-d text-theme-button-t cursor-not-allowed' : 'bg-theme-button hover:bg-theme-button-h text-theme-button-t'}`}
        >
            <FaSyncAlt size={18} className={`w-[16px] sm:w-[18px] h-auto mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {cooldown > 0 ? t('wait-button', {cooldown: cooldown}) : t('refresh-button')}
        </button>
    );
};

const OwnPlanetComponent = ({data, isLoading, onBuyClick, onRefresh, cooldown}: {data: any, isLoading: boolean, onBuyClick: () => void, onRefresh: () => void, cooldown: number}) => {
    const t = useTranslations('Spaceship');
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
                className='p-6 flex flex-col items-center justify-center flex-grow'
            >
                <SpinningLoader size={120} />
            </motion.div>
        )
    }

    if (data.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className='p-6 flex flex-col items-center justify-center flex-grow'
            >
                <RefreshDataButton onClick={onRefresh} isLoading={isLoading} cooldown={cooldown} />
                <p className='text-lg sm:text-xl font-semibold text-theme-title'>{t('no-own-title')}</p>
                <p className='text-lg sm:text-xl font-semibold text-theme-title my-2'>{t('get-new-title')}</p>
                <button onClick={onBuyClick} className='flex items-center bg-theme-button hover:bg-theme-button-h text-theme-button-t font-bold py-3 px-6 rounded-lg text-xl transition duration-300'>
                    {t('here-button')}
                </button>
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='p-6 w-full h-full flex flex-col'
        >
            <div className='flex justify-between items-center mb-4'>
                <h2 className='text-lg sm:text-xl md:text-2xl font-bold text-theme-title'>{t('own-header', {total: data.length})}</h2>
                <RefreshDataButton onClick={onRefresh} isLoading={isLoading} cooldown={cooldown} />
            </div>
            <div className='flex-grow overflow-y-auto' style={{ maxHeight: 'calc(100vh - 200px)' }}>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-2'>
                    {data.map((planet: any) => (
                        <div key={planet.publicKey} className='bg-theme-bg-0 rounded-lg px-2 py-4 flex flex-col items-center relative shadow-sm'>
                            <button
                                data-tooltip-id={'tooltip-view'}
                                data-tooltip-content={t('view-tooltip')}
                                onClick={() => handleSolscanClick(planet.publicKey)}
                                className='p-2 bg-theme-button-50 text-theme-button-t hover:bg-theme-button-h rounded-md absolute top-2 right-2'
                            >
                                <FaExternalLinkAlt size={18} />
                            </button>
                            <Tooltip id={'tooltip-view'} />
                            <div className='z-10 w-32 h-32'>
                                <DynamicPlanetGenerate color={getPlanetAttribute(planet, 'color')} rings={getPlanetAttribute(planet, 'rings')} cloud={getPlanetAttribute(planet, 'cloud')} surface={getPlanetAttribute(planet, 'surface')} />
                            </div>
                            <div className='flex justify-center items-center'>
                                <p className='text-lg font-semibold text-theme-title'>{getPlanetAttribute(planet, 'planet')}</p>
                                <button
                                    data-tooltip-id={`tooltip-${planet.publicKey}`}
                                    className='ml-1 p-1 bg-theme-button-50 text-theme-button-t hover:bg-theme-button-h rounded-full'
                                >
                                    <FaInfoCircle size={16} />
                                </button>
                                <Tooltip id={`tooltip-${planet.publicKey}`} render={() => tooltipContent(planet)} />
                            </div>
                            <p className='text-sm text-theme-subtitle'>{t('code-title', {code: getPlanetAttribute(planet, 'code')})}</p>
                            <div className='mt-2'>
                                <button
                                    onClick={() => handleOnClick(planet.publicKey, getPlanetAttribute(planet, 'color'))}
                                    className='flex items-center bg-theme-button hover:bg-theme-button-h text-theme-button-t font-bold py-1 px-4 rounded-lg transition duration-300'
                                >
                                    <RiSpaceShipFill size={18} />
                                    <p className='ml-1'>{t('landing-button')}</p>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    )
};

const OtherPlanetComponent = ({ data, wallet, isLoading, onRefresh, cooldown }: { data: any, wallet: string, isLoading: boolean, onRefresh: () => void, cooldown: number }) => {
    const t = useTranslations('Spaceship');

    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className='p-6 flex flex-col items-center justify-center flex-grow'
            >
                <SpinningLoader size={120} />
            </motion.div>
        )
    }

    if (data.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className='p-6 flex flex-col items-center justify-center flex-grow'
            >
                <RefreshDataButton onClick={onRefresh} isLoading={isLoading} cooldown={cooldown} />
                <p className='text-lg sm:text-xl font-semibold mt-2 text-theme-title'>{t('no-other-title')}</p>
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='p-6 w-full h-full flex flex-col'
        >
            <div className='flex justify-between items-center mb-4'>
                <h2 className='text-lg sm:text-xl md:text-2xl font-bold text-theme-title'>{t('other-header', {total: data.length})}</h2>
                <RefreshDataButton onClick={onRefresh} isLoading={isLoading} cooldown={cooldown} />
            </div>
            <div className='flex-grow overflow-y-auto' style={{ maxHeight: 'calc(100vh - 200px)' }}>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-2'>
                    {data.map((planet: any) => (
                        <div key={planet.publicKey} className='bg-theme-bg-0 rounded-lg px-2 py-4 flex flex-col items-center relative shadow-sm'>
                            <button
                                data-tooltip-id={'tooltip-view'}
                                data-tooltip-content={t('view-tooltip')}
                                onClick={() => handleSolscanClick(planet.publicKey)}
                                className='p-2 bg-theme-button-50 text-theme-button-t hover:bg-theme-button-h rounded-md absolute top-2 right-2'
                            >
                                <FaExternalLinkAlt size={18} />
                            </button>
                            <Tooltip id={'tooltip-view'} />
                            <div className='z-10 w-32 h-32'>
                                <DynamicPlanetGenerate color={getPlanetAttribute(planet, 'color')} rings={getPlanetAttribute(planet, 'rings')} cloud={getPlanetAttribute(planet, 'cloud')} surface={getPlanetAttribute(planet, 'surface')} />
                            </div>
                            <div className='flex justify-center items-center'>
                                <p className='text-lg font-semibold text-theme-title'>{getPlanetAttribute(planet, 'planet')}</p>
                                <button
                                    data-tooltip-id={`tooltip-${planet.publicKey}`}
                                    className='ml-1 p-1 bg-theme-button-50 text-theme-button-t hover:bg-theme-button-h rounded-full'
                                >
                                    <FaInfoCircle size={16} />
                                </button>
                                <Tooltip id={`tooltip-${planet.publicKey}`} render={() => tooltipContent(planet)} />
                            </div>
                            <p className='text-sm text-theme-subtitle'>{t('code-title', {code: getPlanetAttribute(planet, 'code')})}</p>
                            <div className='flex items-center text-sm'>
                                <p className='text-theme-subtitle'>{t('owner-title', {owner: `${(planet.owner).slice(0,5)}...${(planet.owner).slice(-5)}`})}</p>
                                {planet.owner === wallet &&
                                    <span className='rounded-full bg-theme-active ml-1 px-2 py-0.5 text-theme-title'>
                                        {t('you-title')}
                                    </span>
                                }
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    )
};

const BuyPlanetComponent = ({ wallet, onCheckClick, onBuySuccess }: { wallet: string; onCheckClick: () => void; onBuySuccess: () => void }) => {
    const t = useTranslations('Spaceship');
    const { nicknameProfile } = useGameStore();
    const [ isBuying, setIsBuying ] = useState(false);
    const [ newPlanet, setNewPlanet ] = useState('');
    const [ errorMessage, setErrorMessage ] = useState('');
    
    const handleBuyPlanet = async () => {
        setErrorMessage('');
        setIsBuying(true);
        try {
            const response = await CreatePlanet(wallet);
            const resPlanet: any = await FetchPlanet(response.assetAddress);
            const name = resPlanet.name;
            const planetAttributes = resPlanet.attributes.attributeList.reduce((acc: any, attr: any) => {
                acc[attr.key] = attr.value;
                return acc;
            }, {});

            await sendWebhookDiscordPlanet(name, nicknameProfile as string, response.assetAddress, planetAttributes);

            setNewPlanet(response.assetAddress);
            onBuySuccess();
        } catch (error) {
            setErrorMessage(error as string);
        } finally {
            setIsBuying(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='p-6 w-full h-full flex flex-col'
        >
            <h2 className='text-lg sm:text-xl md:text-2xl font-bold text-theme-title mb-4'>{t('buy-header')}</h2>
            <div className='bg-theme-bg-0 rounded-lg px-2 py-4 flex flex-col items-center relative shadow-sm'>
                <Image src='/assets/images/planet.webp' alt='planet' width={800} height={800} className='flex w-32 h-32' />
                <p className='text-2xl font-semibold mb-2 text-theme-title'>{t('buy-title')}</p>
                {isBuying ? (
                    <div className='flex items-center bg-theme-button-d py-3 px-6 rounded-lg'>
                        <SpinningLoader />
                    </div>
                ) : (
                    <button onClick={() => handleBuyPlanet()} className='flex items-center bg-theme-success hover:bg-theme-success-h text-theme-button-t font-bold py-3 px-6 rounded-lg text-xl transition duration-300'>
                        <p className='pr-1'>{t('price-button')}</p>
                        <SiSolana size={20} />
                    </button>
                )}
                {newPlanet &&
                    <div className='flex flex-col justify-center items-center'>
                        <p className='text-theme-title mb-2'>{t('success-button', {address: newPlanet})}</p>
                        <button onClick={onCheckClick} className='flex items-center bg-orange-500 hover:bg-orange-600 text-theme-button-t font-bold py-2 px-4 rounded-lg text-xl transition duration-300'>
                            {t('check-button')}
                        </button>
                    </div>
                }
                {errorMessage !== '' &&
                    <p className='text-theme-alert mt-2'>{errorMessage}</p>
                }
                <div className='flex flex-col items-center justify-center p-4 mt-4 bg-theme-bg-1 rounded-md max-w-[550px] flex-grow overflow-y-auto'>
                    <h1 className='text-lg font-semibold sm:text-xl text-theme-title'>{t('attributes-header')}</h1>
                    <h2 className='text-[14px] sm:text-[16px] text-theme-subtitle'>{t('attributes-description')}</h2>
                    <div className='text-[14px] sm:text-[16px] text-theme-title mt-2'>
                        <p>{t('planet-tooltip', { planet: 'ABC-123-0' })}</p>
                        <p>{t('color3-tooltip', { color: 'ABC-123-0' })}</p>
                        <p>{t('size-tooltip', { size: 'Small / Medium / Large' })}</p>
                        <p>{t('surface-tooltip', { surface: 'Mountain 1-3 / Rough 1-3 / Coarse 1-3' })}</p>
                        <p>{t('cloud-tooltip', { cloud: 'None / Low / High' })}</p>
                        <p>{t('rings-tooltip', { rings: 'None / 1 Rings / X Rings / Aura' })}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    )
};

const SpaceshipScreen = () => {
    const wallet = useWallet();
    const t = useTranslations('Spaceship');
    const { setGameMenu, landingPublic } = useGameStore();
    const [ menuState, setMenuState ] = useState<string | null>('own');
    const [ ownPlanetData, setOwnPlanetData ] = useState<any>([]);
    const [ otherPlanetData, setOtherPlanetData ] = useState<any>([]);
    const [ refreshTrigger, setRefreshTrigger ] = useState(0);
    const [ isLoadingOwn, setIsLoadingOwn ] = useState(true);
    const [ isLoadingOther, setIsLoadingOther ] = useState(true);
    const [ errorMessage, setErrorMessage ] = useState('');
    const [ cooldown, setCooldown ] = useState(0);
    
    const menuItems = [
        { id: 'own', title: t('own-title'), icon: '🌍', enable: true },
        { id: 'other', title: t('other-title'), icon: '🪐', enable: true },
        { id: 'buy', title: t('buy-title'), icon: '🛒', enable: true }
    ];

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
            const [ textA, numberA ] = nameA.split('#');
            const [ textB, numberB ] = nameB.split('#');
            const textComparison = textA.localeCompare(textB);
            
            if (textComparison === 0) {
                return parseInt(numberB) - parseInt(numberA);
            }
            
            return textComparison;
        });
    };

    const getDataInitial = async () => {
        setErrorMessage('');
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
            setErrorMessage(error as string);
        }
    };

    const refreshOwnData = async () => {
        if (cooldown === 0) {
            setErrorMessage('');
            setIsLoadingOwn(true);
            setCooldown(10);
            try {
                const ownPlanet = await FetchOwnPlanet(String(wallet.publicKey));
                setOwnPlanetData(sortedPlanet(ownPlanet));
            } catch (error) {
                setErrorMessage(error as string);
            } finally {
                setIsLoadingOwn(false);
            }
        }
    };

    const refreshOtherData = async () => {
        if (cooldown === 0) {
            setErrorMessage('');
            setIsLoadingOther(true);
            setCooldown(10);
            try {
                const otherPlanet = await FetchOtherPlanet();
                setOtherPlanetData(sortedPlanet(otherPlanet));
            } catch (error) {
                setErrorMessage(error as string);
            } finally {
                setIsLoadingOther(false);
            }
        }
    };

    const handleBuySuccess = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className='flex flex-col w-full min-h-screen absolute z-100'>
            <div className='flex w-full items-center h-[90px] justify-between px-4 bg-theme-bg-0 border-b-1 border-theme-border sticky top-0 z-110'>
                {landingPublic ? (
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className='bg-theme-button text-theme-button-t p-2 rounded-full hover:bg-theme-button-h transition duration-300'
                        onClick={() => setGameMenu('game')}
                    >
                        <FaArrowLeft size={24} className='w-[18px] sm:w-[24px] h-auto' />
                    </motion.button>
                ) : (
                    <div></div>
                )}
                <div className='flex h-full'>
                    {menuItems.map((item) => (
                        <React.Fragment key={item.id}>
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                                className={`${menuState === item.id ? 'bg-theme-button' : 'hover:bg-theme-button-h'}`}
                                onClick={() => setMenuState(item.id)}
                            >
                                <div className='px-1 sm:px-2 flex flex-col items-center'>
                                    <span className='text-[24px] sm:text-[30px]'>{item.icon}</span>
                                    <h2 className={`text-[14px] sm:text[16px] font-semibold text-center ${menuState === item.id ? 'text-theme-button-t' : 'text-theme-title'}`}>{item.title}</h2>
                                </div>
                            </motion.button>
                        </React.Fragment>
                    ))}
                </div>
                <ThemeToggle />
            </div>
            <div className='flex-grow overflow-hidden bg-theme-bg-1'>
                {errorMessage !== '' &&
                    <p className='text-theme-alert mt-2'>{errorMessage}</p>
                }
                <AnimatePresence mode='wait'>
                    {menuState === 'own' && <OwnPlanetComponent key='own' data={ownPlanetData} isLoading={isLoadingOwn} onBuyClick={() => setMenuState('buy')} onRefresh={refreshOwnData} cooldown={cooldown} />}
                    {menuState === 'other' && <OtherPlanetComponent key='other' data={otherPlanetData} wallet={String(wallet.publicKey)} isLoading={isLoadingOther} onRefresh={refreshOtherData} cooldown={cooldown} />}
                    {menuState === 'buy' && <BuyPlanetComponent key='buy' wallet={String(wallet.publicKey)} onCheckClick={() => setMenuState('own')} onBuySuccess={handleBuySuccess} />}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SpaceshipScreen;