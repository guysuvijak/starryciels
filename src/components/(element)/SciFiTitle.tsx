import { motion } from 'framer-motion';

const SciFiTitle = () => {
    return (
        <h1 className='text-5xl md:text-7xl font-bold mb-4 relative'>
            <motion.span
                className={`inline-block`}
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 * 0.1 }}
                style={{
                    textShadow: '0 0 10px #7c3aed, 0 0 20px #7c3aed, 0 0 30px #7c3aed',
                    animation: `${'glow 2s ease-in-out infinite alternate'}`
                }}
            >
                StarryCiels
            </motion.span>
            <style jsx>
                {`@keyframes glow {
                    from {
                        text-shadow: 0 0 5px #7c3aed, 0 0 10px #7c3aed, 0 0 15px #7c3aed;
                    }
                    to {
                        text-shadow: 0 0 20px #7c3aed, 0 0 30px #7c3aed, 0 0 40px #7c3aed;
                    }
                }`}
            </style>
        </h1>
    );
};

export default SciFiTitle;