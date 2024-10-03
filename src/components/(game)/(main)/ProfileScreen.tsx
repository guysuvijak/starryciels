'use client'
import dynamic from 'next/dynamic';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { useWallet } from '@solana/wallet-adapter-react';
import { useTranslations } from 'next-intl';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useGameStore } from '@/stores/useStore';
import axios from 'axios';
require('@solana/wallet-adapter-react-ui/styles.css');

import ParallaxEffect from '@/components/(element)/ParallaxEffect';
import SpinningLoader from '@/components/(element)/SpinningLoader';
import { CheckProfile, CreateProfile, UpdateProfile } from '@/metaplex/profile';
import { decodeAndParseJSON } from '@/utils/decode';

const WalletMultiButton = dynamic(
    () => import('@solana/wallet-adapter-react-ui').then(mod => mod.WalletMultiButton),
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
    const [ profileData, setProfileData ] = useState<any>(null);
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
                if(response[0].publicKey !== null) {
                    const decodedData = decodeAndParseJSON(response[0].uri);
                    setProfileData({...response[0], decodedUri: decodedData});
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

    const updatePro = async () => {
        const response = await UpdateProfile(String(wallet.publicKey), '4cBzuK72e5dGojac229F24qjyDsAdt4kmCPryKu48mBT');
        console.log(response)
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isValid) {
            setIsCreateLoading(true);
            try {
                const response = await CreateProfile(String(wallet.publicKey), nickName);
                if(response) {
                    checkProfile();
                    await axios.post('https://discord.com/api/webhooks/1291441018691915866/NbyinPz7Wfbm51-BAfM9ttBWYDj5rEmP9AAnvdSVIlVHN-nzZMr73TIUEGjaZZeyde9R', {
                        content: null,
                        embeds: [
                            {
                                "title": "name",
                                "description": "- Owner: **" + "nicknameProfile",
                                "url": `https://core.metaplex.com/explorer/${response.assetAddress}?env=devnet`,
                                "color": "colorEmbed",
                                "footer": {
                                  "text": "Birthday"
                                },
                                "timestamp": "",
                                "thumbnail": {
                                  "url": "https://gateway.pinata.cloud/ipfs/QmauoA8uruGH4xkde8uLMDQCuzi4QLQ8q4pYmJj1MFZL6N"
                                }
                            }
                        ]
                    });
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
            <div className={`flex items-center ${state ? 'text-green-500' : 'text-red-500'}`}>
                {state ? <FaCheck /> : <FaTimes />}
                <p className='pl-1'>{title}</p>
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
            <form onSubmit={handleSubmit} className='flex flex-col items-center mt-2'>
                <div className='flex self-start'>
                    <p className='flex font-medium self-start mb-1'>{t('nickname')}</p>
                    <p className='pl-1 text-red-500'>{'*'}</p>
                </div>
                <input
                    ref={inputRef}
                    type='text'
                    value={nickName}
                    onChange={handleChange}
                    minLength={3}
                    maxLength={20}
                    placeholder={t('nickname-p')}
                    className={`w-full p-2 mb-2 rounded shadow border-1 ${!isValid && 'border-red-500 text-red-500 shadow-red-500'}`}
                />
                <div className='w-full mb-2'>
                    <RequireComponent title={t('require-1')} state={isLengthValid} />
                    <RequireComponent title={t('require-2')} state={isCharValid} />
                </div>
                <button 
                    type='submit'
                    className={`text-white px-4 py-2 rounded ${isValid ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500'}`}
                    disabled={!isValid || isCreateLoading}
                >
                    {isCreateLoading ? <SpinningLoader /> : t('create-button')}
                </button>
                {error !== '' && <p className='text-red-500'>{error}</p>}
            </form>
        )
    };

    const ConnectProfileComponent = () => {
        const nicknameAttribute = profileData.decodedUri.attributes.find((attr: { trait_type: string; value: string }) => attr.trait_type === 'nickname').value;

        return (
            <div className='flex flex-col items-center py-2 mt-2'>
                <div className='flex'>
                    <p>{'nickname:'}</p>
                    <p className='pl-1 font-medium'>{nicknameAttribute}</p>
                </div>
                <button
                    className='w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-800 hover:to-indigo-800 text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1'
                    onClick={() => [setGameMenu('mother'), setNicknameProfile(nicknameAttribute)]}
                >
                    {t('login-button')}
                </button>
                {wallet.publicKey == 'HQx4BtM2QuGHg3RWmd1axx5JxMj7t5UDzhcm1fosm1uH' as any &&
                    <button onClick={() => updatePro()}>
                        Update
                    </button>
                }
            </div>
        )
    };

    return (
        <ParallaxEffect>
            <div className='flex flex-col justify-center items-center p-6 m-4 rounded-2xl text-black bg-slate-200 relative z-100'>
                <Image
                    src='/assets/images/profile.webp'
                    width={200}
                    height={200}
                    alt='profile'
                    className='w-[150px] h-[150px] rounded-full bg-[#000000] mb-2' 
                    draggable={false} 
                    priority 
                />
                {isLoading ? (
                    <div className='flex items-center'>
                        <SpinningLoader />
                        <p className='ml-1'>Loading ...</p>
                    </div>
                ) : (
                    <>
                        <h1 className='text-[22px] font-medium'>{(walletConnect && isProfile) ? t('header-success') : walletConnect ? t('header-create') : t('header-connect')}</h1>
                        <h2 className='text-gray-500'>{(walletConnect && isProfile) ? t('description-success') : walletConnect ? t('description-create') : t('description-connect')}</h2>
                        {!walletConnect && <h2 className='text-gray-500 mb-2'>{t('description-solflare')}</h2>}
                        <WalletMultiButton />
                        {(walletConnect && isProfile) ? (
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