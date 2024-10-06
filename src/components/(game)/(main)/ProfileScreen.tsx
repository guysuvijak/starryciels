'use client'
import dynamic from 'next/dynamic';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { useWallet } from '@solana/wallet-adapter-react';
import { useTranslations } from 'next-intl';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useGameStore } from '@/stores/useStore';
require('@solana/wallet-adapter-react-ui/styles.css');

import { sendWebhookDiscordProfile } from '@/utils/discord-webhook';
import { ProfileDataProps } from '@/types/(game)/Profile';
import ParallaxEffect from '@/components/(element)/ParallaxEffect';
import SpinningLoader from '@/components/(element)/SpinningLoader';
import { CheckProfile, CreateProfile } from '@/metaplex/profile';
import { decodeAndParseJSON } from '@/utils/decode';
import ThemeToggle from '@/components/(element)/ThemeToggle';

const WalletMultiButton = dynamic(() => import('@solana/wallet-adapter-react-ui').then(mod => mod.WalletMultiButton),
    { ssr: false }
);

const ProfileScreen = () => {
    const t = useTranslations('Profile');
    const { setGameMenu, setProfilePublic, setLandingPublic, setNicknameProfile } = useGameStore();
    const wallet = useWallet();
    const walletConnect = wallet.connected;

    const [ nickName, setNickName ] = useState('');
    const [ isLoading, setIsLoading ] = useState(true);
    const [ isLengthValid, setIsLengthValid ] = useState(false);
    const [ isCharValid, setIsCharValid ] = useState(false);
    const [ isProfile, setIsProfile ] = useState(false);
    const [ isCreateLoading, setIsCreateLoading ] = useState(false);
    const [ profileData, setProfileData ] = useState<ProfileDataProps | null | undefined>(null);
    console.log('profileData',profileData)
    const [ error, setError ] = useState('');

    const isValid = (isLengthValid && isCharValid) ? true : false;

    useEffect(() => {
        setLandingPublic(null);
    }, []);

    useEffect(() => {
        setIsLengthValid(nickName.length >= 3 && nickName.length <= 20);
        setIsCharValid(/^[a-zA-Z0-9]*$/.test(nickName));
    }, [nickName]);

    useEffect(() => {
        checkProfile();
    }, [walletConnect]);

    const checkProfile = async () => {
        setIsLoading(true);
        if (walletConnect) {
            try {
                const response = await CheckProfile(String(wallet.publicKey));
                if(response && response[0].publicKey !== null) {
                    console.log('test', response)
                    const decodedData = decodeAndParseJSON(response[0].uri);
                    setProfileData({...response[0], decodedUri: decodedData} as ProfileDataProps);
                    setProfilePublic(response[0].publicKey);
                    setIsProfile(true);
                }
            } catch (error) {
                setIsProfile(false);
                setProfilePublic(null);
            }
        } else {
            setIsProfile(false);
            setProfileData(null);
            setProfilePublic(null);
        }
        setIsLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isValid) {
            setIsCreateLoading(true);
            try {
                const response = await CreateProfile(String(wallet.publicKey), nickName);
                if(response) {
                    checkProfile();
                    await sendWebhookDiscordProfile(nickName, response.assetAddress);
                    setIsCreateLoading(false);
                }
            } catch (err: unknown) {
                setError(String(err));
                setIsCreateLoading(false);
            }
        }
    };

    const RequireComponent = ({ title, state }: {title: string, state: boolean}) => {
        return (
            <div className={`flex items-center ${state ? 'text-theme-success' : 'text-theme-alert'}`}>
                {state ? <FaCheck /> : <FaTimes />}
                <p className='pl-1 text-[12px] md:text-sm'>{title}</p>
            </div>
        )
    };

    const CreateProfileComponent = () => {
        const inputRef = useRef<HTMLInputElement>(null);

        const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
            setNickName(e.target.value);
        }, []);

        useEffect(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, []);
        
        return (
            <form onSubmit={handleSubmit} className='flex flex-col items-center bg-theme-bg-0 p-4 md:p-6 rounded-lg shadow-md'>
                <div className='flex self-start'>
                    <p className='font-medium mb-1 text-theme-title'>{t('nickname')}</p>
                    <p className='pl-1 text-theme-alert'>{'*'}</p>
                </div>
                <input
                    ref={inputRef}
                    type='text'
                    value={nickName}
                    onChange={handleChange}
                    minLength={3}
                    maxLength={20}
                    placeholder={t('nickname-p')}
                    className={`w-full p-2 mb-2 rounded shadow border-1 bg-theme-bg-0 placeholder:text-theme-subtitle ${isValid ? 'text-theme-title border-theme-border' : 'text-theme-alert border-theme-alert shadow-theme-alert'}`}
                    disabled={isCreateLoading}
                    spellCheck={false}
                />
                <div className='w-full mb-4'>
                    <RequireComponent title={t('require-1')} state={isLengthValid} />
                    <RequireComponent title={t('require-2')} state={isCharValid} />
                </div>
                <button 
                    type='submit'
                    className={`text-theme-button-t px-4 py-2 rounded ${isValid ? 'bg-theme-button hover:bg-theme-button-h' : 'bg-theme-button-d cursor-not-allowed'}`}
                    disabled={!isValid || isCreateLoading}
                >
                    {isCreateLoading ? <SpinningLoader label /> : t('create-button')}
                </button>
                {error !== '' && <p className='text-theme-alert'>{error}</p>}
            </form>
        )
    };

    const ConnectProfileComponent = () => {
        const nicknameAttribute = profileData?.decodedUri?.attributes?.find(attr => attr.trait_type === 'nickname')?.value || 'Unknown';

        return (
            <div className='flex flex-col items-center'>
                <p className='text-[18px] md:text-[20px] font-medium mb-2 text-theme-success'>{nicknameAttribute}</p>
                <button 
                    className={'text-theme-button-t px-4 py-2 rounded bg-theme-button hover:bg-theme-button-h'}
                    onClick={() => [setGameMenu('spaceship'), setNicknameProfile(nicknameAttribute)]}
                >
                    {t('login-button')}
                </button>
            </div>
        )
    };

    return (
        <ParallaxEffect>
            <div className='flex flex-col min-w-[300px] w-screen h-screen md:w-full md:h-full justify-center items-center p-6 md:m-4 md:rounded-2xl bg-gradient-to-tr to-theme-bg-0 from-theme-bg-1 relative z-100 md:border-2 md:border-theme-border'>
                <div className='absolute top-0 right-0 p-4'>
                    <ThemeToggle />
                </div>
                <Image
                    src='/assets/images/profile.webp'
                    width={200}
                    height={200}
                    alt='profile'
                    className='w-[150px] h-[150px] rounded-full bg-theme-bg-2 mb-4' 
                    draggable={false} 
                    priority 
                />
                {isLoading ? (
                    <div className='flex items-center justify-center min-h-[80px]'>
                        <SpinningLoader label />
                    </div>
                ) : (
                    <>
                        <WalletMultiButton />
                        <div className='flex flex-col items-center my-2'>
                            <h1 className='text-[20px] md:text-[22px] font-bold text-theme-title'>
                                {(walletConnect && isProfile) ? t('header-success') : walletConnect ? t('header-create') : t('header-connect')}
                            </h1>
                            <h2 className='text-[16px] md:text-[18px] text-theme-subtitle'>
                                {(walletConnect && isProfile) ? t('description-success') : walletConnect ? t('description-create') : t('description-connect')}
                            </h2>
                            {!walletConnect && <h2 className='text-orange-600'>{t('description-solflare')}</h2>}
                        </div>
                        
                        {(walletConnect && isProfile && profileData) ? (
                            <ConnectProfileComponent />
                        ) : (
                            <>
                                {walletConnect && <CreateProfileComponent />}
                            </>
                        )}
                    </>
                )}
            </div>
        </ParallaxEffect>
    )
};

export default ProfileScreen;