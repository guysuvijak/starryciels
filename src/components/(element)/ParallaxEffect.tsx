'use client';
import React, { useEffect } from 'react';
import { useMotionValue, useTransform, motion } from 'framer-motion';

import { ParallaxEffectProps } from '@/types/(components)/Element';

const ParallaxEffect: React.FC<ParallaxEffectProps> = ({ children }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const bg1X = useTransform(x, [-100, 100], ['-5%', '5%']);
    const bg1Y = useTransform(y, [-100, 100], ['-5%', '5%']);

    const bg2X = useTransform(x, [-100, 100], ['-10%', '10%']);
    const bg2Y = useTransform(y, [-100, 100], ['-10%', '10%']);

    const bg3X = useTransform(x, [-100, 100], ['-15%', '15%']);
    const bg3Y = useTransform(y, [-100, 100], ['-15%', '15%']);

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        const { clientX, clientY } = event;
        const xOffset = window.innerWidth / 2 - clientX;
        const yOffset = window.innerHeight / 2 - clientY;

        x.set(xOffset / 10);
        y.set(yOffset / 10);
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            y.set(-scrollY / 5);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [y]);

    return (
        <div className='relative min-h-screen justify-center items-center flex overflow-x-hidden bg-black text-white' onMouseMove={handleMouseMove}>
            <motion.div className='fixed top-0 left-0 w-full h-full' style={{ backgroundImage: 'url(/assets/website/bg1.png)', backgroundSize: 'cover', x: bg1X, y: bg1Y, zIndex: 1 }} />
            <motion.div className='fixed top-0 left-0 w-full h-full' style={{ backgroundImage: 'url(/assets/website/bg2.png)', backgroundSize: 'cover', x: bg2X, y: bg2Y, zIndex: 2 }} />
            <motion.div className='fixed top-0 left-0 w-full h-full' style={{ backgroundImage: 'url(/assets/website/bg3.png)', backgroundSize: 'cover', x: bg3X, y: bg3Y, zIndex: 3 }} />
            {children}
        </div>
    );
};

export default ParallaxEffect;