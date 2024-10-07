import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import { PlanetGenerateProps } from '@/types/(components)/Element';
import SpinningLoader from '@/components/(element)/SpinningLoader';

const baseChangeColor = async (color: string): Promise<string> => {
    try {
        const response = await fetch('/assets/planet/base.svg');
        const svgText = await response.text();
        const updatedSvg = svgText.replace(/fill="#[0-9A-Fa-f]{6}"/g, `fill="#${color}"`);
        return `data:image/svg+xml;base64,${btoa(updatedSvg)}`;
    } catch (error) {
        console.error('Error fetching or processing SVG:', error);
        return '/assets/planet/base.svg';
    }
};

const baseRingsChangeColor = async (color: string, rings: string): Promise<string> => {
    try {
        const filename = rings === '1 Rings' ? 'rings-1-rings' : rings === 'X Rings' ? 'rings-x-rings' : '';
        if(filename !== '') {
            const response = await fetch(`/assets/planet/base-${filename}.svg`);
            const svgText = await response.text();
            const updatedSvg = svgText.replace(/fill="#[0-9A-Fa-f]{6}"/g, `fill="#${color}"`);
            return `data:image/svg+xml;base64,${btoa(updatedSvg)}`;
        } else {
            return '';
        }
    } catch (error) {
        console.error('Error fetching or processing SVG:', error);
        return '';
    }
};

const PlanetGenerate: React.FC<PlanetGenerateProps> = React.memo(({ color, rings, cloud, surface }) => {
    const [ isLoading, setIsLoading ] = useState(true);
    const [ baseSvg, setBaseSvg ] = useState<string>('');
    const [ baseRingSvg, setBaseRingSvg ] = useState<string>('');
    const resultRings = rings.toLowerCase().split(' ').join('-');
    const resultCloud = cloud.toLowerCase().split(' ').join('-');
    const resultSurface = surface.toLowerCase().split(' ').join('-');

    useEffect(() => {
        setIsLoading(true);
        baseChangeColor(color).then(setBaseSvg);
        baseRingsChangeColor(color, rings).then(setBaseRingSvg);
        setIsLoading(false);
    }, [color]);
    
    const traitClass = 'absolute w-32 h-32';
    return (
        <>
            {isLoading ? (
                <div className='flex w-full h-full items-center justify-center'>
                    <SpinningLoader size={64} />
                </div>
            ) : (
                <>
                    <Image src={`/assets/planet/rings-${resultRings}.webp`} alt={'image-planet-rings'} width={400} height={400} className={`${traitClass} z-[60]`} style={{ pointerEvents: 'none' }} priority />
                    {baseRingSvg && <Image src={String(baseRingSvg)} alt={'image-planet-base-rings'} width={400} height={400} className={`${traitClass} z-[50]`} style={{ pointerEvents: 'none' }} priority />}
                    <Image src={`/assets/planet/shadow.webp`} alt={'image-planet-shadow'} width={400} height={400} className={`${traitClass} z-[40]`} style={{ pointerEvents: 'none' }} priority />
                    <Image src={`/assets/planet/cloud-${resultCloud}.webp`} alt={'image-planet-cloud'} width={400} height={400} className={`${traitClass} z-[30]`} style={{ pointerEvents: 'none' }} priority />
                    <Image src={`/assets/planet/surface-${resultSurface}.webp`} alt={'image-planet-surface'} width={400} height={400} className={`${traitClass} z-[20]`} style={{ pointerEvents: 'none' }} priority />
                    {baseSvg && <Image src={String(baseSvg)} alt={'image-planet-base'} width={400} height={400} className={`${traitClass} z-[10]`} style={{ pointerEvents: 'none' }} priority />}
                </>
            )}
        </>
    )
});
PlanetGenerate.displayName = 'PlanetGenerate';

export default PlanetGenerate;