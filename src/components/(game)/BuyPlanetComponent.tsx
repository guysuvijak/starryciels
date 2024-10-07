import React, { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { SiSolana } from 'react-icons/si';

import { useGameStore } from '@/stores/useStore';
import SpinningLoader from '@/components/(element)/SpinningLoader';
import { sendWebhookDiscordPlanet } from '@/utils/discord-webhook';
import { CreatePlanet, FetchPlanet } from '@/metaplex/planet';

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

export default BuyPlanetComponent;