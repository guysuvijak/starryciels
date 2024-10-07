import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ThemeState, GameState, ResourceState } from '@/types/(store)/BearStore';
import { CheckProfile } from '@/metaplex/profile';

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

export const useGameStore = create<GameState>()(
    persist(
        (set) => ({
            gameMenu: 'profile',
            setGameMenu: (gameMenu) => set({ gameMenu }),
            profilePublic: null,
            setProfilePublic: (profilePublic) => set({ profilePublic }),
            landingPublic: '',
            setLandingPublic: (landingPublic) => set({ landingPublic }),
            landingColor: '',
            setLandingColor: (landingColor) => set({ landingColor }),
            nicknameProfile: '',
            setNicknameProfile: (nicknameProfile) => set({ nicknameProfile }),
            modalOpen: false,
            setModalOpen: (modalOpen) => set({ modalOpen }),
            successMessage: '',
            setSuccessMessage: (successMessage) => set({ successMessage })
        }),
        {
            name: 'game-storage',
            storage: createJSONStorage(() => localStorage)
        }
    )
);

export const useResourceStore = create<ResourceState>((set) => ({
    ore: 0,
    fuel: 0,
    food: 0,
    updateResource: (type, amount) => set((state) => ({ [type]: amount })),
    fetchResources: async (publicKey: string) => {
        try {
            const response = await CheckProfile(publicKey);
            if (response && response[0]?.attributes?.attributeList) {
                const attributeList = response[0].attributes.attributeList;
                const ore = Number(attributeList.find(attr => attr.key === 'ore')?.value) || 0;
                const fuel = Number(attributeList.find(attr => attr.key === 'fuel')?.value) || 0;
                const food = Number(attributeList.find(attr => attr.key === 'food')?.value) || 0;
                set({ ore, fuel, food });
            }
        } catch (error) {
            console.error('Error fetching resources:', error);
        }
    },
}));