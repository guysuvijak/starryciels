import React, { useEffect, useState } from 'react';
import Image from 'next/image';

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

const PlanetGenerate = React.memo(({ color, rings, cloud, surface} : any) => {
    const resultRings = rings.toLowerCase().split(' ').join('-');
    const resultCloud = cloud.toLowerCase().split(' ').join('-');
    const resultSurface = surface.toLowerCase().split(' ').join('-');
    const [baseSvg, setBaseSvg] = useState<string>('');

    useEffect(() => {
        baseChangeColor(color).then(setBaseSvg);
    }, [color]);
    
    const traitClass = 'absolute w-32 h-32';
    return (
        <>
            <Image src={`/assets/planet/rings-${resultRings}.webp`} alt={'image-planet-rings'} width={400} height={400} className={`${traitClass} z-[50]`} style={{ pointerEvents: 'none' }} priority />
            <Image src={`/assets/planet/shadow.webp`} alt={'image-planet-shadow'} width={400} height={400} className={`${traitClass} z-[40]`} style={{ pointerEvents: 'none' }} priority />
            <Image src={`/assets/planet/cloud-${resultCloud}.webp`} alt={'image-planet-cloud'} width={400} height={400} className={`${traitClass} z-[30]`} style={{ pointerEvents: 'none' }} priority />
            <Image src={`/assets/planet/surface-${resultSurface}.webp`} alt={'image-planet-surface'} width={400} height={400} className={`${traitClass} z-[20]`} style={{ pointerEvents: 'none' }} priority />
            {baseSvg && <Image src={String(baseSvg)} alt={'image-planet-base'} width={400} height={400} className={`${traitClass} z-[10]`} style={{ pointerEvents: 'none' }} priority />}
        </>
    )
});
PlanetGenerate.displayName = 'PlanetGenerate';

export default PlanetGenerate;