import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { FaDiscord } from 'react-icons/fa';

import HeaderText from '@/components/(element)/HeaderText';

const TeamSection = () => {
    const t = useTranslations('Website');

    const data = [
        {
            id: 1,
            name: 'MeteorVIIx',
            image: '/assets/website/profile-meteorviix.webp',
            position: 'Founder & Developer',
            role: t('team-role1'),
            discord: 'meteorviix',
            href: 'https://discord.com/users/220231582722555924'
        },
        {
            id: 2,
            name: 'PS SharpShine',
            image: '/assets/website/profile-pssharpshine.webp',
            position: 'Pixel Artist',
            role: t('team-role2'),
            discord: 'pittawat_dc',
            href: 'https://discord.com/users/707415595511185408'
        },
        {
            id: 3,
            name: 'Teezaboo',
            image: '/assets/website/profile-teezaboo.webp',
            position: 'Game Designer',
            role: t('team-role3'),
            discord: 't08188',
            href: 'https://discord.com/users/475608060124201000'
        }
    ];

    return (
        <section className='py-12 px-4'>
            <div className='max-w-5xl mx-auto'>
                <HeaderText title={t('team-header')} />
                <motion.p 
                    className='text-base mb-8 text-center text-gray-300'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    {t('team-description')}
                </motion.p>
                <div className='flex items-center justify-center gap-4 flex-col sm:flex-row sm:flex-wrap'>
                    {data.map(({ id, name, image, position, role, discord, href }) => (
                        <motion.div 
                            key={id}
                            className='flex flex-row px-4 sm:flex-col bg-gradient-to-b to-gray-800 from-gray-700 rounded-lg overflow-hidden shadow-lg w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)] max-w-sm'
                            whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className='relative w-auto h-32 md:h-48 self-center overflow-hidden'>
                                <Image src={image} alt={name} width={200} height={200} className='h-32 md:h-48 w-auto' draggable={false} />
                            </div>
                            <div className='w-2/3 sm:w-full p-4 flex flex-col justify-between'>
                                <div>
                                    <div className='flex items-center'>
                                        <h3 className='text-md sm:text-lg font-bold text-white'>{name}</h3>
                                        <Image src='/assets/website/flag-th.webp' alt='flag-th' width={20} height={15} className='ml-2' />
                                    </div>
                                    <p className='text-sm sm:text-md font-semibold text-indigo-300 mb-1'>{position}</p>
                                    <p className='text-xs text-gray-400 mb-4 h-[50px] sm:h-[40px] md:h-[30px]'>{role}</p>
                                </div>
                                <a href={href} target='_blank' rel='noopener noreferrer' className='flex items-center mt-auto text-indigo-400 hover:text-indigo-300 transition-colors'>
                                    <FaDiscord className='mr-2' size={16} />
                                    <span className='text-xs'>{discord}</span>
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TeamSection;