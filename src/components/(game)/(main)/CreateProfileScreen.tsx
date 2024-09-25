'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { CreateAsset, FetchAsset } from '@/metaplex/asset';
import { umi } from '@/utils/umi';

const CheckProfileScreen = () => {
    const t = useTranslations('CreateProfile');

    const [ nickName, setNickName ] = useState('');
    const [ error, setError ] = useState('');
    const [ isLengthValid, setIsLengthValid ] = useState(false);
    const [ isCharValid, setIsCharValid ] = useState(false);

    useEffect(() => {
        setIsLengthValid(nickName.length >= 3 && nickName.length <= 20);
        setIsCharValid(/^[a-zA-Z0-9]*$/.test(nickName));
    }, [nickName]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLengthValid && isCharValid) {
            console.log('Valid name submitted:', nickName);
            // เพิ่มโค้ดสำหรับการสร้าง asset หรือดำเนินการอื่นๆ ที่นี่
        } else {
            setError('กรุณาตรวจสอบเงื่อนไขของชื่อให้ถูกต้อง');
        }
    };

    return (
        <div className='flex flex-col items-center w-full h-full bg-slate-200 absolute z-100 p-4'>
            <Image 
                src='/assets/metaplex/profile.png' 
                width={200} 
                height={200} 
                alt='profile' 
                className='w-[150px] h-[150px] rounded-full bg-[#000000] mb-2' 
                draggable={false} 
                priority 
            />
            <h1 className='text-[20px] font-medium'>{t('header')}</h1>
            <form onSubmit={handleSubmit} className='flex flex-col items-center'>
                <p className='font-medium self-start'>{t('nickname')}</p>
                <input
                    type='text'
                    value={nickName}
                    onChange={(e) => {
                        setNickName(e.target.value);
                        setError('');
                    }}
                    placeholder={t('nickname-p')}
                    className='w-full p-2 mb-2 rounded'
                />
                {error && <p className='text-yellow-300 mb-2'>{error}</p>}
                <div className='w-full mb-2'>
                    <p className={isLengthValid ? 'text-green-500' : 'text-red-500'}>
                        {isLengthValid ? '✓' : 'X'} {t('require-1')}
                    </p>
                    <p className={isCharValid ? 'text-green-500' : 'text-red-500'}>
                        {isCharValid ? '✓' : 'X'} {t('require-2')}
                    </p>
                </div>
                <button 
                    type='submit'
                    className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
                    disabled={(isLengthValid && isCharValid) ? false : true}
                >
                    {t('create-button')}
                </button>
            </form>
        </div>
    )
};

export default CheckProfileScreen;