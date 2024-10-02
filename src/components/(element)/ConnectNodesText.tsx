import { useTranslations } from 'next-intl';
import { PiPlugsConnectedFill, PiPlugsFill } from 'react-icons/pi';

import { ConnectNodesTextProps } from '@/types/(components)/Element';

const ConnectNodesText = ({isConnected, setIsConnected}: ConnectNodesTextProps) => {
    const t = useTranslations('Element');

    const handleClick = () => {
        setIsConnected((prev: boolean) => !prev);
    };

    return (
        <button onClick={handleClick} className='flex items-center'>
            <span className={`flex items-center justify-center ml-2 transition-colors duration-500 ${isConnected ? 'text-white' : 'text-gray-700 line-through decoration-1'}`}>
                {t('connect-title1')}
                {isConnected ? (
                    <PiPlugsConnectedFill size={40} className='mx-1 sm:mx-2 text-white transform transition-transform duration-500 ease-in-out scale-110' />
                ) : (
                    <PiPlugsFill size={40} className='mx-1 sm:mx-2 text-gray-700 transform transition-transform duration-500 ease-in-out' />
                )}
                {t('connect-title2')}
            </span>
        </button>
    );
};

export default ConnectNodesText;