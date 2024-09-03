'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IoMenu, IoSettingsSharp, IoClose } from 'react-icons/io5';
import { RiArrowUpSFill } from 'react-icons/ri';
import { BiWorld } from 'react-icons/bi';
import { IoMdColorPalette } from 'react-icons/io';

import { CustomSettingButtonProps } from '@/types/(game)/MenuSetting';
import { useLanguageStore, useThemeStore } from '@/stores/useStore';

const MenuSetting = () => {
    const [ isSettingMenu, setIsSettingMenu ] = useState(false);

    const { setIsLanguageView } = useLanguageStore();
    const { setIsThemeView } = useThemeStore();

    const CustomSettingButton = ({icon, onClick}: CustomSettingButtonProps) => {
        let iconName = null;

        switch (icon) {
            case 'theme':
                iconName = <IoMdColorPalette size={26} className='text-theme-button hover:text-theme-button-h w-[22px] h-[22px] sm:w-[26px] sm:h-[26px]' />
                break;
            case 'language':
                iconName = <BiWorld size={26} className='text-theme-button hover:text-theme-button-h w-[22px] h-[22px] sm:w-[26px] sm:h-[26px]' />
                break;
            case 'setting':
                iconName = <IoSettingsSharp size={26} className='text-theme-button hover:text-theme-button-h w-[22px] h-[22px] sm:w-[26px] sm:h-[26px]' />
                break;
        }

        return (
            <motion.button
                key={`${icon}-button`}
                id={`${icon}-button`}
                className='p-2'
                whileHover={{ scale: 1.1 }}
                onClick={onClick}
            >
                {iconName && iconName}
            </motion.button>
        )
    };

    return (
        <div className='relative flex flex-col items-start'>
            <motion.button
                id={'other-button'}
                aria-label={'Other Button'}
                onClick={() => setIsSettingMenu(prev => !prev)}
                className='z-30 px-2 py-1 rounded-sm bg-theme-bg-0 border-2 border-theme-border sm:px-3 sm:py-1'
            >
                {isSettingMenu ? (
                    <IoClose size={30} className='text-theme-alert w-[26px] h-[26px] sm:w-[30px] sm:h-[30px]' />
                ) : (
                    <IoMenu size={30} className='text-theme-button w-[26px] h-[26px] sm:w-[30px] sm:h-[30px]' />
                )}
            </motion.button>
            {isSettingMenu &&
                <motion.div
                    initial={{ y: -40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className='flex flex-col absolute z-20 top-8 right-[2px] pt-1 bg-theme-bg-0 border-2 border-theme-border rounded-b-sm sm:pt-2 sm:top-10 sm:right-[6px]'
                >
                    <CustomSettingButton icon={'theme'} onClick={() => setIsThemeView(true)} />
                    <CustomSettingButton icon={'language'} onClick={() => setIsLanguageView(true)} />
                    <CustomSettingButton icon={'setting'} onClick={() => {}} />
                    <button
                        id={'close-button'}
                        onClick={() => setIsSettingMenu(prev => !prev)}
                        className='flex justify-center mt-1 bg-theme-button sm:mt-2'
                    >
                        <motion.div whileHover={{ scale: 1.2 }}>
                            <RiArrowUpSFill size={30} className='text-theme-bg-0 my-[-10px]' />
                        </motion.div>
                    </button>
                </motion.div>
            }
        </div>
    )
};

export default MenuSetting;