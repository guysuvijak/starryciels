export interface AlertModalProps {
    isOpen: boolean;
    onClose: (isOpen) => void;
    message: string;
    type: 'warning' | 'success';
};

export interface ConnectNodesTextProps {
    isConnected: boolean;
    setIsConnected: (isConnected) => void;
};

export interface HeaderTextProps {
    title: string;
}

export interface ParallaxEffectProps {
    children: React.ReactNode;
}

export interface SpinningLoaderProps {
    label?: boolean;
    title?: string;
    button?: boolean;
    size?: number;
    speed?: number;
};

export interface RefreshDataButtonProps {
    onClick: () => void;
    isLoading: boolean;
    cooldown: number
};

export interface PlanetImageProps {
    color: string;
    rings: string;
    cloud: string;
    surface: string;
};

export interface PlanetGenerateProps {
    color: string;
    rings: string;
    cloud: string;
    surface: string;
};