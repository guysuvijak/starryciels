import { create } from 'zustand';
import { Position } from '@xyflow/react';

const resourceTypes = ['Ore', 'Fuel', 'Food'];

type ResourceType = typeof resourceTypes[number] | 'Spaceship';
type NodeType = 'Export' | 'Import' | 'Spaceship';

interface NodeData {
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

interface NodeStore {
    nodes: { [key: string]: NodeData };
    initializeNodes: (nodes: NodeData[]) => void;
    addNode: (node: any) => void;
    updateNode: (id: string, data: Partial<NodeData>) => void;
}

export const useNodeStore = create<NodeStore>((set) => ({
    nodes: {},
    initializeNodes: (nodes) => set({ nodes: nodes.reduce((acc, node) => ({ ...acc, [node.id]: node }), {}) }),
    addNode: (node) => set((state) => ({ nodes: { ...state.nodes, [node.id]: node } })),
    updateNode: (id, data) => set((state) => ({
        nodes: {
            ...state.nodes,
            [id]: { ...state.nodes[id], ...data }
        }
    })),
}));