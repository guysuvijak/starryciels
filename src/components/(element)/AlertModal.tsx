import { useTranslations } from 'next-intl';
import { IoIosAlert } from 'react-icons/io';

import { AlertModalProps } from '@/types/(components)/Element';

const AlertModal = ({ isOpen, onClose, message }: AlertModalProps) => {
    const t = useTranslations('Element');

    if (!isOpen) {
        return null;
    }
  
    return (
        <div className='fixed inset-0 flex items-center justify-center mx-4'>
            <div onClick={onClose} className='fixed inset-0 flex bg-black bg-opacity-50' />
            <div className='flex flex-col bg-theme-bg-0 p-4 items-center justify-center rounded-2xl z-50 border-2 border-theme-border shadow-sm'>
                <IoIosAlert size={60} className='text-theme-alert mb-2' />
                <p className='sm:text-lg text-theme-title whitespace-pre-wrap text-center'>{message}</p>
                <button
                    className='sm:text-lg px-10 py-2 rounded bg-theme-button hover:bg-theme-button-h space-x-2 mt-4'
                    onClick={onClose}
                >
                    {t('alert-button')}
                </button>
            </div>
        </div>
    );
};

export default AlertModal;