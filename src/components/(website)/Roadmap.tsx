import { motion } from 'framer-motion';

import HeaderText from '@/components/(element)/HeaderText';

const Roadmap = () => {
    const milestones = [
        { phase: 'Phase 1', title: 'Launch', description: 'Initial release of 1000 StarryCiels NFTs' },
        { phase: 'Phase 2', title: 'Expansion', description: 'Introduction of planetary systems and galaxies' },
        { phase: 'Phase 3', title: 'Integration', description: 'Launch of the StarryCiels metaverse' },
    ];

    return (
        <section className='py-20 px-4 bg-gray-900'>
            <div className='max-w-4xl mx-auto'>
                <HeaderText title={'Roadmap'} />
                <div className='space-y-8'>
                    {milestones.map((milestone, index) => (
                        <motion.div 
                            key={index}
                            className='flex items-start'
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                        >
                            <div className='flex-shrink-0 bg-purple-600 rounded-full p-2 mr-4'>
                                <span className='text-white font-bold'>{milestone.phase}</span>
                            </div>
                            <div>
                                <h3 className='text-xl font-bold mb-2'>{milestone.title}</h3>
                                <p>{milestone.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Roadmap;