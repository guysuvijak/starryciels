export interface AlertModalProps {
    isOpen: boolean;
    onClose: (isOpen) => void;
    message: string;
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
    size?: number;
    speed?: number;
};