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

type GameMenu = 'profile' | 'game' | 'spaceship';

export interface GameState {
    gameMenu: GameMenu;
    setGameMenu: (gameMenu: GameMenu) => void;
    profilePublic: string | null;
    setProfilePublic: (profilePublic: string | null) => void;
    landingPublic: string;
    setLandingPublic: (landingPublic) => void;
    landingColor: string;
    setLandingColor: (landingColor) => void;
    nicknameProfile: string | null;
    setNicknameProfile: (nicknameProfile) => void;
};

export interface ResourceState {
    ore: number;
    fuel: number;
    food: number;
    updateResource: (type: 'ore' | 'fuel' | 'food', amount: number) => void;
    fetchResources: (publicKey: string) => Promise<void>;
};