'use client'
import Image from 'next/image';
import React from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-nprogress-bar';

const Navbar = () => {
    const router = useRouter();
    const t = useTranslations('Locale');
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-opacity-50 bg-black backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0">
                        <div className="w-32 h-8 rounded flex items-center justify-center text-white font-bold">
                            <Image src='/assets/website/logo.webp' alt='logo' width={40} height={40} draggable={false} priority />
                            <p className='invisible md:visible'>StarryCiels</p>
                        </div>
                    </div>
                    <div>
                        <button onClick={() => router.push('/game')} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-2 px-6 rounded-full transition duration-300 transform hover:scale-105">
                            PLAY
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;