import { Position } from '@xyflow/react';

const resourceTypes = ['Ore', 'Fuel', 'Food'];

type ResourceType = typeof resourceTypes[number] | 'Spaceship';
type NodeType = 'Export' | 'Import' | 'Spaceship';

interface NodeDataProps {
    id: string;
    label: string;
    type: ResourceType;
    nodeType: NodeType;
    displayName: string;
    isConnected?: boolean;
    connectedEdgesCount?: number;
    size: 'small' | 'medium' | 'large';
    supply: number;
    maxSupply: number;
    connectedNodes?: string[];
    handlePositions: {
        source?: Position;
        target?: Position | Position[];
    };
    [key: string]: unknown;
}

export interface NodeStoreProps {
    nodes: { [key: string]: NodeDataProps };
    initializeNodes: (nodes: NodeDataProps[]) => void;
    addNode: (node: any) => void;
    updateNode: (id: string, data: Partial<NodeDataProps>) => void;
}