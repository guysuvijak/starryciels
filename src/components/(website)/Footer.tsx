'use client'
import Image from 'next/image';
import { FaFacebook, FaYoutube,  FaDiscord } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import { SocialIconProps, MenuLinkProps } from '@/types/(website)/Footer';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const SocialIcon = ({ href, name }: SocialIconProps) => {
        let socialColor;
        let hoverColor;
        let ariaLabel;

        switch (name) {
            case 'facebook':
                socialColor = 'hover:text-[#FFFFFF]';
                hoverColor = '#1877F2';
                ariaLabel = 'Facebook';
                break;
            case 'xtwitter':
                socialColor = 'hover:text-[#000000]';
                hoverColor = '#FFFFFF';
                ariaLabel = 'Twitter';
                break;
            case 'discord':
                socialColor = 'hover:text-[#FFFFFF]';
                hoverColor = '#5865F2';
                ariaLabel = 'Discord';
                break;
            case 'youtube':
                socialColor = 'hover:text-[#FFFFFF]';
                hoverColor = '#FF0000';
                ariaLabel = 'Youtube';
                break;
        }

        return (
            <motion.a
                href={href}
                target='_blank'
                rel='noopener noreferrer'
                aria-label={ariaLabel}
                className={`flex justify-center items-center w-[40px] h-[40px] mx-2 rounded-full bg-[#1F1F1F] text-[#A7A7A7] ${socialColor}`}
                whileHover={{ backgroundColor: hoverColor, transition: { duration: 0.2 } }}
            >
                {name === 'facebook' && <FaFacebook width={20} height={20} className='w-[20px] h-[20px]' />}
                {name === 'xtwitter' && <FaXTwitter width={20} height={20} className='w-[20px] h-[20px]' />}
                {name === 'discord' && <FaDiscord width={20} height={20} className='w-[20px] h-[20px]' />}
                {name === 'youtube' && <FaYoutube width={20} height={20} className='w-[20px] h-[20px]' />}
            </motion.a>
        )
    };

    const MenuLink = ({ href, title }: MenuLinkProps) => {
        return (
            <motion.a
                href={href}
                target='_blank'
                rel='noopener noreferrer'
                className={`text-[16px] px-6 py-1 border-[#777777] font-medium text-[#777777] hover:underline text-center`}
                whileHover={{ color: '#EED6AD', transition: { duration: 0.2 } }}
            >
                <span>{title}</span>
            </motion.a>
        )
    };

    return (
        <div className='justify-center p-5 border-t-[1px] border-[#464646] text-[#FFFFFF] bg-[#000000]'>
            <div className='flex justify-center my-2'>
                <SocialIcon href='https://www.facebook.com/PixtureTraveler' name='facebook' />
                <SocialIcon href='https://www.youtube.com/@PixtureTraveler' name='youtube' />
                <SocialIcon href='https://x.com/PixtureTraveler' name='xtwitter' />
                <SocialIcon href='https://discord.gg/pixture-traveler' name='discord' />
            </div>
            <div className='flex flex-col md:flex-row justify-center items-center self-center my-4'>
                <MenuLink href='' title={'Terms of use'} />
                <div className='bg-[#777777] w-[1px] h-[30px] hidden md:flex' />
                <MenuLink href='' title={'Privacy Policy'} />
                <div className='bg-[#777777] w-[1px] h-[30px] hidden md:flex' />
                <MenuLink href='' title={'Marketplace'} />
                <div className='bg-[#777777] w-[1px] h-[30px] hidden md:flex' />
                <MenuLink href='' title={'Whitepaper'} />
            </div>
            <div className='flex justify-center my-2'>
                <p className='text-[16px] text-[#777777]'>{`© ${currentYear} Pixture Traveler. All Rights Reserved.`}</p>
            </div>
        </div>
    );
}

export default Footer;