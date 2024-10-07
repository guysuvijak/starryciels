import React from 'react';
import dynamic from 'next/dynamic';

import { PlanetImageProps } from '@/types/(components)/Element';

const DynamicPlanetGenerate = dynamic(() => import('@/components/(element)/PlanetGenerate'), { ssr: false });

const PlanetImage: React.FC<PlanetImageProps> = React.memo(({ color, rings, cloud, surface }) => {
    return (
        <div className='z-10 w-32 h-32'>
            <DynamicPlanetGenerate color={color} rings={rings} cloud={cloud} surface={surface} />
        </div>
    );
});

PlanetImage.displayName = 'PlanetImage';

export default PlanetImage;