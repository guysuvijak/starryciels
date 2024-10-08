import { useTranslations } from 'next-intl';
import { FaYoutube, FaDiscord } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { IoIosDocument } from 'react-icons/io';

const Footer = () => {
    const t = useTranslations('Website');

    const renderSocialLink = (href: string, Icon: React.ElementType, text: string, hoverColor: string) => (
        <a href={href} target='_blank' rel='noopener noreferrer' className={`flex text-white ${hoverColor} transition-colors`}>
            <Icon width={20} height={20} className='w-[20px] h-[20px] mr-1' /> {text}
        </a>
    );

    return (
        <div className='flex flex-col justify-center items-center text-white bg-black py-4'>
            <p className='mb-2 text-lg'>{t('footer-title')}</p>
            <div className='flex justify-center space-x-6 border-b-1 border-[#8b5cf6] pb-2'>
                {renderSocialLink('https://x.com/starryciels', FaXTwitter, 'Twitter', 'hover:text-[#9e9e9e]')}
                {renderSocialLink('https://discord.gg/KCzPPgKkUR', FaDiscord, 'Discord', 'hover:text-[#5865F2]')}
                {renderSocialLink('https://www.youtube.com/@MeteorVIIx/videos', FaYoutube, 'Youtube', 'hover:text-[#FF0000]')}
                {renderSocialLink('https://docs.google.com/presentation/d/1CXG6njgXe-GXy0Cekqzx1efYNvNEwIAaQ2M1dQtUOB4', IoIosDocument, 'Document', 'hover:text-[#ffd57b]')}
            </div>
            <div className='flex flex-col justify-center items-center mt-2 text-[#b3b3b3]'>
                <p>{`© ${new Date().getFullYear()} StarryCiels. All Rights Reserved.`}</p>
                <p>{t('footer-create')}<a href={'https://github.com/guysuvijak'} target='_blank' rel='noopener noreferrer' className='ml-1 text-[#a078ff]'>{'MeteorVIIx'}</a></p>
            </div>
        </div>
    )
};

export default Footer;