import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Tooltip } from 'react-tooltip';
import { FaExternalLinkAlt, FaInfoCircle } from 'react-icons/fa';

import SpinningLoader from '@/components/(element)/SpinningLoader';
import RefreshDataButton from '@/components/(element)/RefreshDataButton';
import PlanetImage from '@/components/(element)/PlanetImage';

const OtherPlanetComponent = ({ data, wallet, isLoading, onRefresh, cooldown }: { data: any, wallet: string, isLoading: boolean, onRefresh: () => void, cooldown: number }) => {
    const t = useTranslations('Spaceship');

    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className='p-6 flex flex-col items-center justify-center flex-grow'
            >
                <SpinningLoader size={120} />
            </motion.div>
        )
    }

    if (data.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className='p-6 flex flex-col items-center justify-center flex-grow'
            >
                <RefreshDataButton onClick={onRefresh} isLoading={isLoading} cooldown={cooldown} />
                <p className='text-lg sm:text-xl font-semibold mt-2 text-theme-title'>{t('no-other-title')}</p>
            </motion.div>
        )
    }

    const handleSolscanClick = (publickey: string) => {
        window.open(`https://core.metaplex.com/explorer/${publickey}?env=devnet`, '_blank');
    };

    const getPlanetAttribute = (planet: any, key: string) => {
        return planet.attributes.attributeList.find((attr: any) => attr.key === key)?.value || 'N/A';
    };

    const tooltipContent = (planet: any) => {
        const t = useTranslations('Spaceship');
        const color = getPlanetAttribute(planet, 'color');
        const colorBoxStyle = { backgroundColor: `#${color}` };
    
        return (
            <div>
                <p className='font-medium'>{t('attributes-tooltip')}</p>
                <p>{t('color-tooltip')}<span style={colorBoxStyle} className={'inline-block w-[14px] h-[14px] mx-1'} />{t('color2-tooltip',{color: color})}</p>
                <p>{t('size-tooltip', {size: getPlanetAttribute(planet, 'size')})}</p>
                <p>{t('surface-tooltip', {surface: getPlanetAttribute(planet, 'surface')})}</p>
                <p>{t('cloud-tooltip', {cloud: getPlanetAttribute(planet, 'cloud')})}</p>
                <p>{t('rings-tooltip', {rings: getPlanetAttribute(planet, 'rings')})}</p>
            </div>
        )
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='p-6 w-full h-full flex flex-col'
        >
            <div className='flex justify-between items-center mb-4'>
                <h2 className='text-lg sm:text-xl md:text-2xl font-bold text-theme-title'>{t('other-header', {total: data.length})}</h2>
                <RefreshDataButton onClick={onRefresh} isLoading={isLoading} cooldown={cooldown} />
            </div>
            <div className='flex-grow overflow-y-auto' style={{ maxHeight: 'calc(100vh - 200px)' }}>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-2'>
                    {data.map((planet: any) => (
                        <div key={planet.publicKey} className='bg-theme-bg-0 rounded-lg px-2 py-4 flex flex-col items-center relative shadow-sm'>
                            <button
                                data-tooltip-id={'tooltip-view'}
                                data-tooltip-content={t('view-tooltip')}
                                onClick={() => handleSolscanClick(planet.publicKey)}
                                className='p-2 bg-theme-button-50 text-theme-button-t hover:bg-theme-button-h rounded-md absolute top-2 right-2'
                            >
                                <FaExternalLinkAlt size={18} />
                            </button>
                            <Tooltip id={'tooltip-view'} />
                            <div className='z-10 w-32 h-32'>
                                <PlanetImage color={getPlanetAttribute(planet, 'color')} rings={getPlanetAttribute(planet, 'rings')} cloud={getPlanetAttribute(planet, 'cloud')} surface={getPlanetAttribute(planet, 'surface')} />
                            </div>
                            <div className='flex justify-center items-center'>
                                <p className='text-lg font-semibold text-theme-title'>{getPlanetAttribute(planet, 'planet')}</p>
                                <button
                                    data-tooltip-id={`tooltip-${planet.publicKey}`}
                                    className='ml-1 p-1 bg-theme-button-50 text-theme-button-t hover:bg-theme-button-h rounded-full'
                                >
                                    <FaInfoCircle size={16} />
                                </button>
                                <Tooltip id={`tooltip-${planet.publicKey}`} render={() => tooltipContent(planet)} />
                            </div>
                            <p className='text-sm text-theme-subtitle'>{t('code-title', {code: getPlanetAttribute(planet, 'code')})}</p>
                            <div className='flex items-center text-sm'>
                                <p className='text-theme-subtitle'>{t('owner-title', {owner: `${(planet.owner).slice(0,5)}...${(planet.owner).slice(-5)}`})}</p>
                                {planet.owner === wallet &&
                                    <span className='rounded-full bg-theme-active ml-1 px-2 py-0.5 text-theme-title'>
                                        {t('you-title')}
                                    </span>
                                }
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    )
};

export default OtherPlanetComponent;