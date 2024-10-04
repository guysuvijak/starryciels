import { motion } from 'framer-motion';
import { LuLoader2 } from 'react-icons/lu';

import { SpinningLoaderProps } from '@/types/(components)/Element';

const SpinningLoader = ({size, speed}: SpinningLoaderProps) => {
    return (
        <motion.div
            animate={{ rotate: 360 }}
            transition={{
                duration: speed ? speed : 1,
                repeat: Infinity,
                ease: 'linear'
            }}
        >
            <LuLoader2 size={size ? size : 20} className='text-white' />
        </motion.div>
    );
};

export default SpinningLoader;