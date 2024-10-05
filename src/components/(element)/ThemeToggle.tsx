import { MdLightMode, MdDarkMode } from 'react-icons/md';
import { useThemeStore } from '@/stores/useStore';

const ThemeToggle = () => {
    const { theme, setTheme } = useThemeStore();

    const onChangeTheme = () => {
        theme === 'light' ? setTheme('dark') : setTheme('light');
    };

    return (
        <label
            htmlFor='themeToggle'
            className='relative inline-block h-8 w-14 cursor-pointer rounded-full bg-gray-400 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-gray-600'
        >
            <input
                type='checkbox'
                id='themeToggle'
                checked={theme === 'dark'}
                onChange={onChangeTheme}
                className='peer sr-only [&:checked_+_span_svg[data-checked-icon]]:block [&:checked_+_span_svg[data-unchecked-icon]]:hidden'
            />
            <span className='absolute inset-y-0 start-0 z-10 m-1 inline-flex size-6 items-center justify-center rounded-full bg-white text-[#f1c311] transition-all peer-checked:start-6 peer-checked:text-black'>
                <svg
                    data-unchecked-icon
                    className='size-4'
                    viewBox='0 0 18 18'
                    fill='currentColor'
                >
                    <MdLightMode size={18} />
                </svg>
                <svg
                    data-checked-icon
                    className='hidden size-4'
                    viewBox='0 0 18 18'
                    fill='currentColor'
                >
                    <MdDarkMode size={18} />
                </svg>
            </span>
        </label>
    )
};

export default ThemeToggle;