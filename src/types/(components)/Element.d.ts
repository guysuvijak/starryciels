export interface ConnectNodesTextProps {
    isConnected: boolean;
    setIsConnected: (isConnected) => void;
};

export interface HeaderTextProps {
    title: string;
}

export interface SpinningLoaderProps {
    size?: number;
    speed?: number;
};