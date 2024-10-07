export interface EnterButtonProps {
    onClick: () => void;
    isEnter: boolean;
    buttonText: string;
    loadingText: string;
}

export interface NftCardProps {
    data: {
        name: string;
        image: string;
        description: string;
    };
    index: number;
};