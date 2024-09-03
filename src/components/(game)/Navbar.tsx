'use client'
import Image from 'next/image';
import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next-nprogress-bar';
import { useTranslations } from 'next-intl';

import MenuSetting from '@/components/(game)/MenuSetting';

const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations('GameFooter');

    return (
        <div className='flex top-0 left-0 right-0 justify-between relative items-center w-full p-2 lg:p-4'>
            <div className='flex sm:w-full items-center justify-end'>
                <div className='hidden sm:flex'>
                </div>
                <MenuSetting />
            </div>
        </div>
    )
};

export default Navbar;