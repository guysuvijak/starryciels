import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { RiLoader3Fill, RiLoader5Fill } from 'react-icons/ri';

import { SpinningLoaderProps } from '@/types/(components)/Element';

const SpinningLoader = ({label, title, button, size, speed}: SpinningLoaderProps) => {
    const t = useTranslations('Element');

    return (
        <div className='flex items-center'>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{
                    duration: speed ? speed : 1,
                    repeat: Infinity,
                    ease: 'linear'
                }}
                className='z-50'
            >
                <RiLoader5Fill size={size ? size : 20} className={`${button ? 'text-theme-loader-h' : 'text-theme-loader'}`} />
            </motion.div>
            <RiLoader3Fill size={size ? size : 20} className={`${button ? 'text-theme-loader' : 'text-theme-loader-h'} absolute self-center`} />
            <RiLoader3Fill size={size ? size : 20} className={`${button ? 'text-theme-loader' : 'text-theme-loader-h'} absolute self-center rotate-90`} />
            {label && <p className={`${button ? 'text-theme-button-t' : 'text-theme-title'} ml-1`}>{title ? title : t('loading-title')}</p>}
        </div>
    );
};

export default SpinningLoader;