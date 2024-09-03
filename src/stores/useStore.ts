import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { LanguageState, ThemeState } from '@/types/(store)/BearStore';

export const useLanguageStore = create<LanguageState>()(
    persist(
        (set) => ({
            isLanguageView: false,
            setIsLanguageView: (isLanguageView) => set({ isLanguageView })
        }),
        {
            name: 'language-storage',
            storage: createJSONStorage(() => localStorage)
        }
    )
);

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            theme: 'light',
            setTheme: (theme) => set({ theme }),
            isThemeView: false,
            setIsThemeView: (isThemeView) => set({ isThemeView })
        }),
        {
            name: 'theme-storage',
            storage: createJSONStorage(() => localStorage)
        }
    )
);