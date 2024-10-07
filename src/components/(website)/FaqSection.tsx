import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { MdQuestionAnswer } from 'react-icons/md';

import HeaderText from '@/components/(element)/HeaderText';

const FaqSection = () => {
    const t = useTranslations('Website');
    
    const faqs = [
        { question: t('cm-q1'), answer: t('cm-a1') },
        { question: t('cm-q2'), answer: t('cm-a2') },
        { question: t('cm-q3'), answer: t('cm-a3') },
        { question: t('cm-q4'), answer: t('cm-a4') },
        { question: t('cm-q5'), answer: t('cm-a5') },
        { question: t('cm-q6'), answer: t('cm-a6') },
    ];

    return (
        <section className='py-20 px-4'>
            <div className='max-w-4xl mx-auto'>
                <HeaderText title={t('cm-header')} />
                <div className='space-y-4'>
                    {faqs.map(({ question, answer }, index) => (
                        <motion.div 
                            key={index}
                            className='bg-gradient-to-b to-gray-800 from-gray-700 p-6 rounded-lg'
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h4 className='text-xl font-bold mb-2'>{question}</h4>
                            <div className='flex items-center text-gray-300'>
                                <div className='mr-2'>
                                    <MdQuestionAnswer size={16} />
                                </div>
                                <p>{answer}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FaqSection;