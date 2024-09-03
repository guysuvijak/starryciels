'use client'
import { useTranslations } from 'next-intl';
import { useThemeStore } from '@/stores/useStore';
import { FaCircleCheck, FaRegCircle } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import { MdLightMode, MdDarkMode } from 'react-icons/md';

interface CustomThemeButtonProps {
    themeValue: 'light' | 'dark';
}

const ThemeView = () => {
    const t = useTranslations('Theme');

    const { theme, setTheme, isThemeView, setIsThemeView } = useThemeStore();

    const handleClickTheme = (themeValue: 'light' | 'dark') => {
        if (theme !== themeValue) {
            setTheme(theme === 'light' ? 'dark' : 'light');
        }
    };

    const CustomThemeButton = ({themeValue}: CustomThemeButtonProps) => {
        let iconName = null;

        switch (themeValue) {
            case 'light':
                iconName = <MdLightMode size={124} className='text-theme-button w-[24px] h-[24px] sm:w-[26px] sm:h-[26px] z-20' />
                break;
            case 'dark':
                iconName = <MdDarkMode size={124} className='text-theme-button w-[24px] h-[24px] sm:w-[26px] sm:h-[26px] z-20' />
                break;
        }

        return (
            <motion.button
                onClick={() => handleClickTheme(themeValue)}
                className={`flex items-center justify-between px-5 py-2 my-2 rounded-md border-1 ${themeValue === theme ? 'bg-theme-bg-2 border-theme-border' : 'bg-theme-bg-0 border-theme-border'} md:px-8 lg:px-10`}
                whileHover={{ boxShadow: '0px 0px 8px rgba(255, 255, 255, 0.3)' }}
            >
                <div className='flex items-center'>
                    {iconName}
                    <p className={`text-theme-title pl-2 ${themeValue === theme ? 'font-medium' : 'font-normal'}`}>{t(themeValue)}</p>
                </div>
                {themeValue === theme ? (
                    <FaCircleCheck width={20} height={20} className={`text-theme-button w-[20px] h-[20px]`} />
                ) : (
                    <FaRegCircle width={20} height={20} className={`text-theme-subtitle w-[20px] h-[20px]`} />
                )}
            </motion.button>
        )
    };

    return (
        <>
            {isThemeView &&
                <div
                    onClick={() => setIsThemeView(false)}
                    className='flex flex-col absolute bg-[#00000086] z-100 w-full h-full top-0 right-0 items-center justify-center'
                >
                    <div
                        className='flex flex-col bg-theme-bg-0 w-[70%] p-5 rounded-lg border-1 border-theme-border sm:w-[55%] md:w-50%] lg:w-[35%]'
                        style={{boxShadow: '0px 0px 40px rgba(255, 255, 255, 0.1)'}}
                    >
                        <div>
                            <h1 className='text-[20px] font-bold text-theme-title pb-2'>{t('header')}</h1>
                            <p className='text-[16px] text-theme-subtitle pb-2s'>{t('description')}</p>
                        </div>
                        <CustomThemeButton themeValue={'light'} />
                        <CustomThemeButton themeValue={'dark'} />

                    </div>
                </div>
            }
        </>
    )
};

export default ThemeView;