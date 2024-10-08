import { create } from 'zustand';

import { NodeStoreProps } from '@/types/(store)/NodeStore';

export const useNodeStore = create<NodeStoreProps>((set) => ({
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