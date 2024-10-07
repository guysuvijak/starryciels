import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

import HeaderText from '@/components/(element)/HeaderText';

const CoreTechnology = () => {
    const t = useTranslations('Website');

    const data = [
        { id: 1, name: 'Solana', image: '/assets/website/logo-solana.webp', href: 'https://solana.com' },
        { id: 2, name: 'Metaplex', image: '/assets/website/logo-metaplex.webp', href: 'https://metaplex.com' },
        { id: 3, name: 'Solflare Wallet', image: '/assets/website/logo-solflare.webp', href: 'https://solflare.com' },
        { id: 4, name: 'Solscan', image: '/assets/website/logo-solscan.webp', href: 'https://solscan.io' },
        { id: 5, name: 'Pinata', image: '/assets/website/logo-pinata.webp', href: 'https://pinata.cloud' },
        { id: 6, name: 'Alchemy', image: '/assets/website/logo-alchemy.webp', href: 'https://alchemy.com' },
        { id: 7, name: 'Helius', image: '/assets/website/logo-helius.webp', href: 'https://helius.dev' },
        { id: 8, name: 'React Flow', image: '/assets/website/logo-reactflow.webp', href: 'https://reactflow.dev' },
        { id: 9, name: 'Next.js', image: '/assets/website/logo-nextjs.webp', href: 'https://nextjs.org' }
    ];

    return (
        <section className='py-20 px-4 bg-gray-900'>
            <div className='max-w-6xl mx-auto'>
                <HeaderText title={t('tech-header')} />
                <motion.p 
                    className='text-lg mb-12 text-center text-gray-300'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    {t('tech-description')}
                </motion.p>
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                    {data.map(({ id, name, image, href }) => (

                        <motion.a
                            key={id}
                            href={href}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex flex-col bg-gradient-to-b to-gray-800 from-gray-700 rounded-lg overflow-hidden items-center'
                            whileHover={{ scale: 1.05 }}
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Image src={image} alt={name} width={400} height={400} className='w-auto h-24 sm:h-32 p-4 object-cover' draggable={false} />
                            <div className='p-4 pt-0 whitespace-pre-wrap'>
                                <h3 className='text-sm sm:text-lg font-bold'>{name}</h3>
                            </div>
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CoreTechnology;