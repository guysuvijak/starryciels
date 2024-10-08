import { useTranslations } from 'next-intl';

import HeaderText from '@/components/(element)/HeaderText';

const GameplayDemo = () => {
    const t = useTranslations('Website');

    return (
        <section className='py-20 pb-10 px-4 bg-gray-900'>
            <div className='max-w-4xl mx-auto'>
                <HeaderText title={t('demo-header')} />
                <div className='flex justify-center'>
                    <div className='w-[640px] h-[360px]'>
                        <iframe
                            className='w-full h-full rounded-lg'
                            src='https://www.youtube.com/embed/1q5U5ULUcA8'
                            title='StarryCiels Demo'
                            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GameplayDemo;