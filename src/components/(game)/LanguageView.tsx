'use client'
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useLanguageStore } from '@/stores/useStore';
import { useRouter } from 'next-nprogress-bar';
import { FaCircleCheck, FaRegCircle } from 'react-icons/fa6';
import { motion } from 'framer-motion';

interface CustomLanguageButtonProps {
    lang: string;
}

const LanguageView = () => {
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations('Language');

    const { isLanguageView, setIsLanguageView } = useLanguageStore();

    const handleClickLanguage = (lang: string) => {
        const currentLocale = t('locale');
        const newPath = pathname.replace(`/${currentLocale}`, `/${lang}`);
        router.push(newPath);
    };

    const CustomLanguageButton = ({lang}: CustomLanguageButtonProps) => {
        const currentLang = t('locale') === lang;
        return (
            <motion.button
                onClick={() => handleClickLanguage(lang)}
                className={`flex items-center justify-between px-5 py-2 my-2 rounded-md border-1 ${currentLang ? 'bg-theme-bg-2 border-theme-border' : 'bg-theme-bg-0 border-theme-border'} md:px-8 lg:px-10`}
                whileHover={{ boxShadow: '0px 0px 8px rgba(255, 255, 255, 0.3)' }}
            >
                <div className='flex items-center'>
                    <Image src={`/assets/etc/flag-${lang}.webp`} alt={`flag-${lang}`} width={124} height={124} className='w-[24px] h-[24px] z-20' priority />
                    <p className={`text-theme-title pl-2 ${currentLang ? 'font-medium' : 'font-normal'}`}>{t(lang)}</p>
                </div>
                {currentLang ? (
                    <FaCircleCheck width={20} height={20} className={`text-theme-button w-[20px] h-[20px]`} />
                ) : (
                    <FaRegCircle width={20} height={20} className={`text-theme-subtitle w-[20px] h-[20px]`} />
                )}
            </motion.button>
        )
    };

    return (
        <>
            {isLanguageView &&
                <div
                    onClick={() => setIsLanguageView(false)}
                    className='flex flex-col absolute bg-[#00000086] z-100 w-full h-full top-0 right-0 items-center justify-center'
                >
                    <div
                        className='flex flex-col bg-theme-bg-0 w-[70%] p-5 rounded-lg border-1 border-theme-border sm:w-[55%] md:w-50%] lg:w-[35%]'
                        style={{boxShadow: '0px 0px 40px rgba(255, 255, 255, 0.1)'}}
                    >
                        <div>
                            <h1 className='text-[20px] font-bold text-theme-title pb-2'>{t('header')}</h1>
                            <p className='text-[16px] text-theme-subtitle pb-2'>{t('description')}</p>
                        </div>
                        <CustomLanguageButton lang={'en'} />
                        <CustomLanguageButton lang={'th'} />

                    </div>
                </div>
            }
        </>
    )
};

export default LanguageView;