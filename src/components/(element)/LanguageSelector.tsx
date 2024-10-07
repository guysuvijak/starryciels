import { useState, useEffect } from 'react';
import { useRouter } from 'next-nprogress-bar';
import { usePathname } from 'next/navigation';

const LanguageSelector = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [ selectedLanguage, setSelectedLanguage ] = useState('en');

    useEffect(() => {
        const pathLanguage = pathname.split('/')[1];
        if (pathLanguage === 'en' || pathLanguage === 'th') {
            setSelectedLanguage(pathLanguage);
        }
    }, [pathname]);

    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newLanguage = event.target.value;
        setSelectedLanguage(newLanguage);
    
        const pathParts = pathname.split('/');
        pathParts[1] = newLanguage;
        const newPath = pathParts.join('/');
    
        router.push(newPath);
    };

    return (
        <div>
            <select
                name='Language'
                id='Language'
                className='w-full h-8 rounded-lg bg-theme-bg-0 border-1 border-theme-border text-theme-subtitle px-2'
                value={selectedLanguage}
                onChange={handleLanguageChange}
            >
                <option value='en'>English</option>
                <option value='th'>Thai</option>
            </select>
        </div>
    )
};

export default LanguageSelector;