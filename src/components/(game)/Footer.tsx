'use client'
import Image from 'next/image';
import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next-nprogress-bar';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

const Footer = () => {
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations('GameFooter');
    const lang = useTranslations('Locale');

    const CustomMenuButton = ({name}: {name: string}) => {
        const handleClick = () => {
            if (name === 'lobby') {
                router.push(`/${lang('locale')}/game`);
            } else if (pathname === `/${lang('locale')}/game` || pathname.startsWith(`/${lang('locale')}/game/`)) {
                router.push(`/${lang('locale')}/game/${name}`);
            } else {
                router.push(`/${name}`);
            }
        };
        
        const currentPathParts = pathname.split('/');
        const isActive = (name === 'lobby' && pathname === `/${lang('locale')}/game`) || name === 'lobby' && pathname === `/${lang('locale')}/game/account` || (currentPathParts.includes(name) && currentPathParts[currentPathParts.indexOf('game') + 1] === name);

        const icon = useMemo(() => (
            <Image src={`/assets/game/menu/${name}.webp`} alt={`menu-${name}`} width={100} height={100} className='w-10 h-10 opacity-100 sm:w-12 sm:h-12' priority />
        ), [name]);

        return (
            <motion.button
                id={name}
                onClick={() => handleClick()}
                className={`relative flex-1 py-8 ${isActive && 'bg-theme-bg-3'}`}
                whileHover={{ backgroundColor: 'var(--theme-bg-2)', transition: { duration: 0.15 } }}
            >
                <div className='absolute inset-0 flex items-end justify-center z-10 pb-1'>
                    <p className='text-[12px] font-bold text-white stroke-text sm:text-[16px]'>{t(`${name}`)}</p>
                </div>
                <div className='absolute inset-0 flex items-center justify-center'>
                    {icon}
                </div>
            </motion.button>
        )
    };

    return (
        <div className='flex justify-between w-full fixed bottom-0 left-0 right-0 bg-theme-bg-1 border-t-4 border-theme-border'>
            <CustomMenuButton name={'lobby'} />
            <CustomMenuButton name={'character'} />
            <CustomMenuButton name={'upgrade'} />
            <CustomMenuButton name={'map'} />
            <CustomMenuButton name={'trade'} />
        </div>
    )
};

export default Footer;
