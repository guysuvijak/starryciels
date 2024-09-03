export interface LanguageState {
    isLanguageView: boolean;
    setIsLanguageView: (isLanguageView: boolean) => void;
};

type Theme = 'light' | 'dark';

export interface ThemeState {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    isThemeView: boolean;
    setIsThemeView: (isThemeView: boolean) => void;
};