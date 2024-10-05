import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

import HeaderText from '@/components/(element)/HeaderText';

const InGameResource = () => {
    const t = useTranslations('Website');

    const data = [
        { id: 1, name: t('ig-item1'), image: '/assets/images/ore-small.webp' },
        { id: 2, name: t('ig-item2'), image: '/assets/images/ore-medium.webp' },
        { id: 3, name: t('ig-item3'), image: '/assets/images/ore-large.webp' },
        { id: 4, name: t('ig-item4'), image: '/assets/images/fuel-small.webp' },
        { id: 5, name: t('ig-item5'), image: '/assets/images/fuel-medium.webp' },
        { id: 6, name: t('ig-item6'), image: '/assets/images/fuel-large.webp' },
        { id: 7, name: t('ig-item7'), image: '/assets/images/food-small.webp' },
        { id: 8, name: t('ig-item8'), image: '/assets/images/food-medium.webp' },
        { id: 9, name: t('ig-item9'), image: '/assets/images/food-large.webp' },
        { id: 10, name: t('ig-item10'), image: '/assets/images/ore-station.webp' },
        { id: 11, name: t('ig-item11'), image: '/assets/images/fuel-station.webp' },
        { id: 12, name: t('ig-item12'), image: '/assets/images/food-station.webp' }
    ];

    return (
        <section className='py-20 px-4'>
            <div className='max-w-6xl mx-auto'>
                <HeaderText title={t('ig-header')} />
                <motion.p 
                    className='text-lg mb-12 text-center text-gray-300'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    {t('ig-description')}
                </motion.p>
                <div className='grid grid-cols-3 gap-2 md:gap-4'>
                    {data.map(({ id, name, image }) => (
                        <motion.div
                            key={id}
                            className='flex flex-col bg-gradient-to-b to-gray-800 from-gray-700 rounded-lg overflow-hidden items-center'
                            whileHover={{ scale: 1.05 }}
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Image src={image} alt={name} width={400} height={400} className='w-auto h-28 sm:h-36 pt-4 object-cover' draggable={false} />
                            <div className='mb-4 text-center whitespace-pre-wrap'>
                                <h3 className='text-[12px] md:text-[14px] lg-text[16px] sm:font-semibold'>{name}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default InGameResource;