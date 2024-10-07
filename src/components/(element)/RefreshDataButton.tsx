import { useTranslations } from 'next-intl';
import { FaSyncAlt } from 'react-icons/fa';

import { RefreshDataButtonProps } from '@/types/(components)/Element';

const RefreshDataButton = ({ onClick, isLoading, cooldown }: RefreshDataButtonProps) => {
    const t = useTranslations('Spaceship');

    return (
        <button
            onClick={onClick}
            disabled={isLoading || cooldown > 0}
            className={`font-bold py-1 sm:py-2 px-4 rounded-full transition duration-300 flex items-center ${cooldown > 0 || isLoading ? 'bg-theme-button-d text-theme-button-t cursor-not-allowed' : 'bg-theme-button hover:bg-theme-button-h text-theme-button-t'}`}
        >
            <FaSyncAlt size={18} className={`w-[16px] sm:w-[18px] h-auto mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {cooldown > 0 ? t('wait-button', {cooldown: cooldown}) : t('refresh-button')}
        </button>
    );
};

export default RefreshDataButton;