'use client'
import '@xyflow/react/dist/style.css';
import 'react-tooltip/dist/react-tooltip.css';
import Image from 'next/image';
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
    ReactFlow, Controls, Background, BackgroundVariant, ConnectionLineType,
    EdgeProps, Node, Edge, useNodesState, useEdgesState, addEdge, BaseEdge,
    getSmoothStepPath, Handle, Position, useStore, useReactFlow
} from '@xyflow/react';
import { motion } from 'framer-motion';
import { Tooltip } from 'react-tooltip';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useGameStore, useResourceStore } from '@/stores/useStore';
import { useNodeStore } from '@/stores/nodeStore';
import useWindowSize from '@/hook/useWindowSize';

import Navbar from './Navbar';
import Panel from './Panel';

import LanguageSelector from '@/components/(element)/LanguageSelector';
import { UpdateProfile } from '@/metaplex/profile';
import AlertModal from '@/components/(element)/AlertModal';
import { useWallet } from '@solana/wallet-adapter-react';
import SpinningLoader from '@/components/(element)/SpinningLoader';

interface NodeContextType {
    nodes: Node<NodeData>[];
}
  
export const NodeContext = React.createContext<NodeContextType>({ nodes: [] });

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
    size: 'Small' | 'Medium' | 'Large';
    supply: number;
    maxSupply: number;
    connectedNodes?: string[];
    handlePositions: {
        source?: Position;
        target?: Position | Position[];
    };
    [key: string]: unknown;
    isTemporary: boolean;
    warning: '' | 'Warning';
}

interface EdgeData {
    trafficLevel: number;
    [key: string]: unknown;
}

const nodeDisplayNames: Record<string, string> = {
    'OreImport': 'Ore Station',
    'OreExport': 'Ore',
    'FuelImport': 'Fuel Station',
    'FuelExport': 'Fuel',
    'FoodImport': 'Food Station',
    'FoodExport': 'Food',
    'SpaceshipSpaceship': 'Mother Ship',
};

const nodeImages = {
    SpaceshipSpaceship: '/assets/images/spaceship.webp',
    OreExportSmall: '/assets/images/ore-small.webp',
    OreExportMedium: '/assets/images/ore-medium.webp',
    OreExportLarge: '/assets/images/ore-large.webp',
    FuelExportSmall: '/assets/images/fuel-small.webp',
    FuelExportMedium: '/assets/images/fuel-medium.webp',
    FuelExportLarge: '/assets/images/fuel-large.webp',
    FoodExportSmall: '/assets/images/food-small.webp',
    FoodExportMedium: '/assets/images/food-medium.webp',
    FoodExportLarge: '/assets/images/food-large.webp',
    OreImport: '/assets/images/ore-station.webp',
    FuelImport: '/assets/images/fuel-station.webp',
    FoodImport: '/assets/images/food-station.webp',
    OreImportWarning: '/assets/images/ore-station-warning.webp',
    FuelImportWarning: '/assets/images/fuel-station-warning.webp',
    FoodImportWarning: '/assets/images/food-station-warning.webp',
};

const ConfirmModal = ({ isOpen, onClose, onConfirm, message }: any) => {
    if (!isOpen) return null;
  
    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-theme-bg-0 p-6 rounded-lg'>
                <p className='text-lg mb-4 text-theme-title'>{message}</p>
                <div className='flex justify-end space-x-2'>
                    <button
                        className='px-4 py-2 bg-theme-button-50 rounded hover:bg-theme-button-d'
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className='px-4 py-2 bg-theme-alert text-white rounded hover:bg-theme-alert-h'
                        onClick={onConfirm}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

const CustomModal = ({ isOpen, onClose, onDelete, node, edges, canDelete }: any) => {
    const wallet = useWallet();
    const { fetchResources } = useResourceStore();
    const updateNode = useNodeStore(state => state.updateNode);
    const { profilePublic, setGameMenu, successMessage, setSuccessMessage } = useGameStore();
    const [ isSend, setIsSend ] = useState(false);
    const nodeSelect: any = useNodeStore(state => node ? state.nodes[node.id] : null);
    
    const iconProps = useMemo(() => {
        if (!node) return { Icon: '' };
        let Icon = '';
        switch(node.data.type) {
            case 'Ore':
                Icon = 'ore';
                break;
            case 'Fuel':
                Icon = 'fuel';
                break;
            case 'Food':
                Icon = 'food';
                break;
            default:
                Icon = '';
                break;
        }
        return { Icon };
    }, [node]);

    if (!isOpen || !node || !nodeSelect) return null;

    const { type, nodeType, supply, maxSupply } = nodeSelect.data;
    const visibleDelete = nodeType === 'Import';
    const checkConnectSpaceship = visibleDelete && edges.some((edge: any) => edge.source === nodeSelect.id && edge.target === '0');

    const onSendClick = async () => {
        setIsSend(true);
        try {
            const response = await UpdateProfile(String(wallet.publicKey), String(profilePublic), type, supply);
            if(response) {
                updateNode(node.id, {
                    data: {
                        ...node.data,
                        supply: 0
                    }
                });
            }
            if (wallet.publicKey) {
                await fetchResources(wallet.publicKey.toString());
                setSuccessMessage('Resources sent successfully!');
            }
        } catch(err) {
            console.error(err);
            setSuccessMessage('Failed to send resources. Please try again.');
        } finally {
            setIsSend(false);
        }
    };
  
    return (
        <div className='fixed inset-0 flex items-center justify-center'>
            <div onClick={onClose} className='fixed inset-0 flex bg-black bg-opacity-50' />
            <div className='bg-theme-bg-0 p-6 rounded-lg z-50 border-1 border-theme-border'>
                <div className='mb-4 text-theme-title text-[16px] sm:text-[18px]'>
                    <p className='font-bold'>{node?.data.displayName} (#{node?.id})</p>
                    <p className='flex'>Type: {iconProps.Icon !== '' && <Image src={`/assets/icons/resource-${iconProps.Icon}.svg`} alt={`icon-${iconProps.Icon}`} width={24} height={24} className='mx-1 w-[24px] h-[24px]' />} {type}</p>
                    {nodeType !== 'Spaceship' &&
                        <div className='flex text-theme-title'>
                            <p>Supply:</p>
                            {nodeType === 'Export' && <p className={`ml-1 ${supply <= 0 && 'text-theme-alert'}`}>{supply.toFixed(2)}</p>}
                            {nodeType === 'Import' && <p className={`ml-1 ${supply <= 0 ? 'text-theme-subtitle' : supply.toFixed(0) === maxSupply.toFixed(0) ? 'text-theme-alert' : ''}`}>{supply.toFixed(2)}</p>}
                            <p>/{maxSupply}</p>
                        </div>
                    }
                    {nodeType === 'Spaceship' &&
                        <div className='my-2'>
                            <LanguageSelector />
                        </div>
                    }
                </div>
                <div className='flex justify-end space-x-2'>
                    <button
                        className='px-4 py-2 text-white bg-theme-button-50 rounded hover:bg-theme-button-d'
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    {nodeType === 'Spaceship' &&
                        <button
                            className='px-4 py-2 bg-theme-button text-theme-button-t rounded hover:bg-theme-button-h'
                            onClick={() => setGameMenu('spaceship')}
                        >
                            Enter Ship
                        </button>
                    }
                    {visibleDelete && 
                        <button
                            className={`px-4 py-2 text-white rounded ${canDelete ? 'bg-theme-alert hover:bg-theme-alert-h' : 'bg-theme-button-d cursor-not-allowed'}`}
                            onClick={onDelete}
                            disabled={!canDelete}
                            data-tooltip-id={!canDelete ? 'tooltip-delete' : ''}
                        >
                            Destroy
                        </button>
                    }
                    {nodeType === 'Import' &&
                        <button
                            className={`px-4 py-2 text-white rounded ${checkConnectSpaceship ? 'bg-theme-success hover:bg-theme-success-h' : 'bg-theme-button-d cursor-not-allowed'}`}
                            onClick={() => onSendClick()}
                            disabled={!checkConnectSpaceship || isSend}
                            data-tooltip-id={!checkConnectSpaceship ? 'tooltip-send' : ''}
                        >
                            {isSend ? <SpinningLoader button /> : 'Send'}
                        </button>
                    }
                    <Tooltip id={'tooltip-delete'} content={'Disconnect all node first'} />
                    <Tooltip id={'tooltip-send'} content={'Connect Spaceship first'} />
                </div>
                <div className='flex w-full justify-center'>
                    {successMessage !== '' && <p className='text-orange-500 mt-2'>{successMessage}</p>}
                </div>
            </div>
        </div>
    );
};

interface FloatingNumberProps {
    value: number;
}

const FloatingNumber: React.FC<FloatingNumberProps> = React.memo(({ value }) => {
    const [ position, setPosition ] = useState(0);
    const [ displayValue, setDisplayValue ] = useState(0);
    
    const resetAnimation = useCallback(() => {
        setPosition(0);
        setDisplayValue(Math.max(0, value));
    }, [value]);
  
    useEffect(() => {
        resetAnimation();
    }, [value, resetAnimation]);
  
    useEffect(() => {
        const moveInterval = setInterval(() => {
            setPosition(prev => prev - 1);
        }, 33.33);
        return () => clearInterval(moveInterval);
    }, []);
    
    useEffect(() => {
        const resetInterval = setInterval(() => {
            resetAnimation();
        }, 1000);
        return () => clearInterval(resetInterval);
    }, [resetAnimation]);
  
    if (displayValue === 0) return null;
  
    return (
      <div
        style={{
          position: 'absolute',
          top: `${position}px`,
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: 1 - Math.abs(position) / 30,
          color: 'lime',
          fontWeight: 'bold',
          fontSize: '20px',
          pointerEvents: 'none'
        }}
      >
        +{displayValue.toFixed(2)}
      </div>
    );
  });

interface DistanceIndicatorProps {
    sourceX: number;
    sourceY: number;
    targetX: number;
    targetY: number;
}

interface ClosestNode {
    node: Node | null;
    distance: number;
}

const DistanceIndicator: React.FC<DistanceIndicatorProps> = ({ sourceX, sourceY, targetX, targetY }) => {
    const transform = useStore((state) => state.transform);
    const { getNodes } = useReactFlow();
    const [tX, tY, tScale] = transform;
    
    const sourceFlowX = (sourceX - tX) / tScale;
    const sourceFlowY = (sourceY - tY) / tScale;
    const targetFlowX = (targetX - tX) / tScale;
    const targetFlowY = (targetY - tY) / tScale;
    
    const nodes = getNodes();
    
    const sourceNode = nodes.reduce((closest: ClosestNode, node) => {
        const dx = node.position.x - sourceFlowX;
        const dy = node.position.y - sourceFlowY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < closest.distance ? { node, distance } : closest;
    }, { node: null, distance: Infinity }).node;

    const targetNode = nodes.reduce((closest: ClosestNode, node) => {
        const dx = node.position.x - targetFlowX;
        const dy = node.position.y - targetFlowY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < closest.distance ? { node, distance } : closest;
    }, { node: null, distance: Infinity }).node;
    
    const distance = sourceNode && targetNode
        ? Math.sqrt(
            Math.pow(targetNode.position.x - sourceNode.position.x, 2) +
            Math.pow(targetNode.position.y - sourceNode.position.y, 2)
        ) : 0;
    
    const midX = (sourceX + targetX) / 2;
    const midY = (sourceY + targetY) / 2;

    return (
        <div
            style={{
                position: 'absolute',
                left: midX,
                top: midY,
                transform: 'translate(-50%, -50%)',
                background: 'rgba(255, 0, 0, 0.7)',
                color: 'white',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '12px',
                pointerEvents: 'none',
                zIndex: 1000
            }}
        >
            {Math.round(distance)} units
        </div>
    );
};

interface CustomNodeProps {
    id: string;
    isConnected: boolean;
    connectedEdgesCount: number;
    efficiency: number;
    confirmNodeTemporary: any;
    cancelNodeTemporary: any;
}

const CustomNode: React.FC<CustomNodeProps> = React.memo(({ id, isConnected, connectedEdgesCount, efficiency, confirmNodeTemporary, cancelNodeTemporary }) => {
    const node: any = useNodeStore(state => state.nodes[id]);
    const updateNode = useNodeStore(state => state.updateNode);
    const [ isHovered, setIsHovered ] = useState(false);
    const [ resourceChange, setResourceChange ] = useState(0);
    const [ isConnectSpaceship, setIsConnectSpaceship ] = useState(false);
    const edges = useStore(state => state.edges);

    useEffect(() => {
        const latestNode: any = useNodeStore.getState().nodes[id];
        if (latestNode && latestNode !== node) {
            updateNode(id, latestNode.data);
        }
    }, [id, updateNode, node?.data?.isTemporary]);

    if (!node) {
        console.error(`Node with id ${id} not found`);
        return null;
    }
    
    const { type, nodeType, displayName, size, handlePositions, supply, maxSupply, isTemporary, warning } = node.data;
  
    const memoizedIsConnectSpaceship = useMemo(() => {
        return edges.some(edge => edge.source === id && edge.target === '0');
    }, [edges, id]);

    useEffect(() => {
        setIsConnectSpaceship(memoizedIsConnectSpaceship);
    }, [memoizedIsConnectSpaceship]);

    useEffect(() => {
        if (isConnected) {
            const interval = setInterval(() => {
                if(nodeType === 'Import') {
                    const spaceshipValue = isConnectSpaceship ? 1 : 0;
                    const change = (connectedEdgesCount - spaceshipValue) * (efficiency / 100);

                    if (connectedEdgesCount === 1 && isConnectSpaceship) return;

                    setResourceChange(change);
                    updateNode(id, {
                        data: {
                            ...node.data,
                            supply: Math.min(maxSupply, supply + change)
                        }
                    });
                } else if (nodeType === 'Export') {
                    const change = connectedEdgesCount * (efficiency / 100);
                    setResourceChange(-change);
                    updateNode(id, {
                        data: {
                            ...node.data,
                            supply: Math.max(0, supply - change)
                        }
                    });
                }
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [id, nodeType, maxSupply, supply, isConnected, connectedEdgesCount, efficiency, updateNode, isConnectSpaceship]);
  
    const nodeSize = useMemo(() => {
      const sizes: any = { Small: 40, Medium: 60, Large: 80 };
      return sizes[size];
    }, [size]);
  
    const iconProps = useMemo(() => {
      let Icon: string;
      switch(type) {
        case 'Ore':
          Icon = 'ore';
          break;
        case 'Fuel':
          Icon = 'fuel';
          break;
        case 'Food':
          Icon = 'food';
          break;
        default:
          Icon = '';
          break;
      }
      return { Icon };
    }, [type]);
  
    const tooltipContent = useMemo(() => (
      <div>
        <p><strong>{displayName} (#{id})</strong></p>
        <p className='flex'>Type: {iconProps.Icon !== '' && <Image src={`/assets/icons/resource-${iconProps.Icon}.svg`} alt={`icon-${iconProps.Icon}`} width={18} height={18} className='mx-1 w-[18px] h-[18px]' />} {type}</p>
        {nodeType !== 'Spaceship' &&
            <div className='flex text-white'>
                <p>Supply: </p>
                {nodeType === 'Export' && <p className={`ml-1 ${supply <= 0 && 'text-theme-alert'}`}>{supply.toFixed(2)}</p>}
                {nodeType === 'Import' && <p className={`ml-1 ${supply <= 0 ? 'text-theme-subtitle' : supply.toFixed(0) === maxSupply.toFixed(0) ? 'text-theme-alert' : ''}`}>{supply.toFixed(2)}</p>}
                <p>/{maxSupply}</p>
            </div>
        }
      </div>
    ), [id, nodeType, displayName, iconProps.Icon, type, supply, maxSupply, node.connectedNodes]);
  
    const renderHandles = useCallback(() => {
        const commonStyle = {
          width: 12,
          height: 12,
          borderColor: '#000000',
          borderWidth: 1
        };
        
        if (nodeType === 'Spaceship' && Array.isArray(handlePositions.target)) {
          return handlePositions.target.map((position: any) => (
            <Handle 
              key={position}
              type='target' 
              position={position} 
              id={`${position}-handle`}
              style={{
                ...commonStyle,
                backgroundColor: '#dadada',
                [position === Position.Left ? 'left' : position === Position.Right ? 'right' : '']: -10,
                [position === Position.Top ? 'top' : position === Position.Bottom ? 'bottom' : '']: -10
              }} 
            />
          ));
        }
      
        return (
            <>
                {(nodeType === 'Import' || nodeType === 'Export') && (
                    <Handle 
                        type='source' 
                        position={handlePositions.source || Position.Right} 
                        id={`${handlePositions.source || Position.Right}-handle`}
                        style={{ 
                            ...commonStyle,
                            right: -6,
                            backgroundColor: '#ff0000'
                        }} 
                    />
                )}
                {(nodeType === 'Import') && handlePositions.target && !Array.isArray(handlePositions.target) && (
                <Handle 
                    type='target' 
                    position={handlePositions.target} 
                    id={`${handlePositions.target}-handle`}
                    style={{ 
                        ...commonStyle,
                        left: -6,
                        backgroundColor: '#00ff15'
                    }} 
                />
                )}
            </>
        );
    }, [nodeType, handlePositions]);
  
    return (
        <>
            {renderHandles()}
            <div
                id={`node-${id}`}
                data-tooltip-id={`tooltip-${id}`}
                style={{
                    width: nodeSize,
                    height: nodeSize,
                    borderRadius: '100%',
                    overflow: 'hidden',
                    transition: 'box-shadow 0.3s ease',
                    boxShadow: isHovered ? '0 0 20px 5px rgba(255, 255, 255, 0.7)' : 'none'
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Image
                    src={(nodeImages[`${type}${nodeType}${nodeType === 'Export' ? size : ''}${warning}` as keyof typeof nodeImages]) as string}
                    alt={`${type} ${nodeType}`}
                    width={200}
                    height={200}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', padding: 5 }}
                    priority
                />
            </div>
            {isTemporary && (
                <div className='flex absolute z-10 items-center justify-center'>
                    <button 
                        className='px-2 py-1 ml-1 rounded-sm bg-red-500'
                        onClick={cancelNodeTemporary}
                    >
                        <FaTimesCircle size={14} />
                    </button>
                    <button
                        className={`px-2 py-1 ml-1 rounded-sm ${warning === '' ? 'bg-green-500' : 'bg-gray-500'}`}
                        onClick={confirmNodeTemporary}
                        disabled={warning === 'Warning'}
                    >
                        <FaCheckCircle size={14} />
                    </button>
                </div>
            )}
            <Tooltip id={`tooltip-${id}`} render={() => tooltipContent} />
            {isConnected && supply < maxSupply && (
                <FloatingNumber
                    key={`${resourceChange}-${efficiency}`}
                    value={resourceChange}
                />
            )}
        </>
    );
});

const initialNodes: Node<NodeData>[] = [
    {
        id: '0',
        type: 'custom',
        data: {
            label: 'Spaceship',
            type: 'Spaceship',
            nodeType: 'Spaceship',
            id: '0',
            displayName: 'Spaceship',
            size: 'Large',
            supply: 0,
            maxSupply: 0,
            handlePositions: {
                target: [Position.Left, Position.Right, Position.Top, Position.Bottom]
            },
            isTemporary: false,
            warning: ''
        },
        position: { x: 0, y: 0 },
    },
    {
        id: '1',
        type: 'custom',
        data: { 
            label: 'Ore Import', 
            type: 'Ore', 
            nodeType: 'Import', 
            id: '1', 
            displayName: 'Ore Station', 
            size: 'Small',
            supply: 0,
            maxSupply: 1000,
            handlePositions: {
                target: Position.Left,
                source: Position.Right
            },
            isTemporary: false,
            warning: ''
        },
        position: { x: 300, y: 100 },
    },
    {
        id: '2',
        type: 'custom',
        data: { 
            label: 'Fuel Import', 
            type: 'Fuel', 
            nodeType: 'Import', 
            id: '2', 
            displayName: 'Fuel Station', 
            size: 'Small',
            supply: 0,
            maxSupply: 1000,
            handlePositions: {
                target: Position.Left,
                source: Position.Right
            },
            isTemporary: false,
            warning: ''
        },
        position: { x: 300, y: 200 },
    },
    {
        id: '3',
        type: 'custom',
        data: { 
            label: 'Food Import',
            type: 'Food',
            nodeType: 'Import',
            id: '3',
            displayName: 'Food',
            size: 'Small',
            supply: 0,
            maxSupply: 1000,
            handlePositions: {
                target: Position.Left,
                source: Position.Right
            },
            isTemporary: false,
            warning: ''
        },
        position: { x: -100, y: 400 },
    },
];

interface CustomEdgeProps extends EdgeProps {
    sourceHandle?: string | null;
    targetHandle?: string | null;
}

const CustomEdge: React.FC<CustomEdgeProps> = ({
    id,
    source,
    target,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    sourceHandle,
    targetHandle,
    style = {},
    data,
}) => {
    const [edgePath] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition: sourceHandle ? sourceHandle as Position : sourcePosition,
        targetX,
        targetY,
        targetPosition: targetHandle ? targetHandle as Position : targetPosition
    });
  
    const trafficLevel: any = data?.trafficLevel || 0;
    const colors = ['#4caf50', '#ffeb3b', '#ff9800', '#f44336'];
    const edgeColor = colors[Math.min(trafficLevel, colors.length - 1)];
    const strokeWidth = 1 + trafficLevel;
    
    const efficiency = Math.max(0, 100 - trafficLevel * 20);
    const animationDuration = 1 / (efficiency / 100);
    
    return (
        <>
            <BaseEdge
                path={edgePath}
                style={{
                    ...style,
                    stroke: edgeColor,
                    strokeWidth: strokeWidth,
                    strokeDasharray: '10',
                    animation: `dash ${animationDuration}s linear infinite`,
                }}
            />
            <text
                style={{
                    fill: 'white',
                    fontSize: '8px',
                    textAnchor: 'middle',
                    dominantBaseline: 'central',
                }}
                x={(sourceX + targetX) / 2}
                y={(sourceY + targetY) / 2}
                dy={-10}
            >
                {`${efficiency}%`}
            </text>
            <style>
            {`
                @keyframes dash {
                    to {
                        stroke-dashoffset: -20;
                    }
                }
            `}
            </style>
        </>
    );
};

const initialEdges: Edge<EdgeData>[] = [];

const GRID_SIZE = 10;
const NODE_SIZE = 50;

const checkNodeCollision = (node: Node, otherNodes: Node[]): boolean => {
    const MINIMUM_DISTANCE_X = 150;
    const MINIMUM_DISTANCE_Y = 150;

    for (let otherNode of otherNodes) {
        if (node.id !== otherNode.id) {
            const dx = Math.abs(node.position.x - otherNode.position.x);
            const dy = Math.abs(node.position.y - otherNode.position.y);
            
            if (dx < MINIMUM_DISTANCE_X && dy < MINIMUM_DISTANCE_Y) {
                return true;
            }
        }
    }
    return false;
};

const snapToGrid = (position: { x: number; y: number }): { x: number; y: number } => {
    return {
        x: Math.round(position.x / GRID_SIZE) * GRID_SIZE,
        y: Math.round(position.y / GRID_SIZE) * GRID_SIZE,
    };
};

const doEdgesIntersect = (edge1: number[], edge2: number[]): boolean => {
    const [x1, y1, x2, y2] = edge1;
    const [x3, y3, x4, y4] = edge2;
  
    const det = (x2 - x1) * (y4 - y3) - (x4 - x3) * (y2 - y1);
    if (det === 0) return false;
  
    const t = ((x3 - x1) * (y4 - y3) - (x4 - x3) * (y3 - y1)) / det;
    const u = -((x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1)) / det;
  
    return (t >= 0 && t <= 1 && u >= 0 && u <= 1);
};

const generateRandomExportNodes = (existingNodes: Node<NodeData>[], startId: number, count = 20): Node<NodeData>[] => {
    const newNodes: Node<NodeData>[] = [];
    const resourceTypes = ['Ore', 'Fuel', 'Food'];
    const sizes = ['Small', 'Medium', 'Large'] as const;
  
    const getRandomPosition = () => {
        const range = 1000;
        return {
            x: Math.floor(Math.random() * range * 2) - range,
            y: Math.floor(Math.random() * range * 2) - range
        };
    };
  
    const isPositionValid = (position: { x: number; y: number }, nodes: Node<NodeData>[]) => {
        return !checkNodeCollision({ id: 'temp', position, data: {} as NodeData } as Node<NodeData>, [...existingNodes, ...nodes]);
    };

    const getSupplyBySize = (size: typeof sizes[number]): number => {
        switch (size) {
            case 'Small':
                return 1000;
            case 'Medium':
                return 3000;
            case 'Large':
                return 8000;
            default:
                return 1000;
        }
    };

    let currentId = startId;
  
    while (newNodes.length < count) {
        const resourceType = resourceTypes[Math.floor(Math.random() * resourceTypes.length)] as ResourceType;
        const size = sizes[Math.floor(Math.random() * sizes.length)];
        let position;
        let attempts = 0;
        const maxAttempts = 100;
  
        do {
            position = getRandomPosition();
            attempts++;
            if (attempts > maxAttempts) {
                console.warn('Could not find a valid position after', maxAttempts, 'attempts');
                break;
            }
        } while (!isPositionValid(position, newNodes));
  
        if (attempts <= maxAttempts) {
            const supply = getSupplyBySize(size);
            const newNode: Node<NodeData> = {
                id: currentId.toString(),
                type: 'custom',
                position: position,
                data: {
                    label: `${resourceType} Export`,
                    type: resourceType,
                    nodeType: 'Export',
                    id: currentId.toString(),
                    displayName: `${resourceType}`,
                    size: size,
                    supply: supply,
                    maxSupply: supply,
                    handlePositions: {
                        source: Position.Right
                    },
                    isTemporary: false,
                    warning: ''
                }
            };
            newNodes.push(newNode);
            currentId++;
        }
    }
    return newNodes;
};

const GameplayScreen = () => {
    const { widowWidth, windowHeight } = useWindowSize();
    const { landingColor, landingPublic, modalOpen, setModalOpen, setSuccessMessage } = useGameStore();
    const [ nodes, setNodes, onNodesChange ] = useNodesState<any>(initialNodes);
    const [ edges, setEdges ] = useEdgesState<any>(initialEdges);
    const [ nodeIdCounter, setNodeIdCounter ] = useState(initialNodes.length + 1);
    const [ edgeModalOpen, setEdgeModalOpen ] = useState(false);
    const [ alertModalOpen, setAlertModalOpen ] = useState(false);
    const [ edgeToDelete, setEdgeToDelete ] = useState<any>(null);
    const [ nodeToDelete, setNodeToDelete ] = useState<any>(null);
    const [ alertMessage, setAlertMessage ] = useState('');
    const [ alertType, setAlertType ] = useState<'warning' | 'success'>('warning');
    const [ connectionStart, setConnectionStart ] = useState({ x: 0, y: 0 });
    const [ mousePosition, setMousePosition ] = useState({ x: 0, y: 0 });
    const [ isConnecting, setIsConnecting ] = useState(false);
    const [ temporaryNode, setTemporaryNode ] = useState<Node<NodeData> | null>(null);
    const [ isNodeValid, setIsNodeValid ] = useState(true);
    const hasGeneratedNodesRef = useRef(false);
    const initializeNodes = useNodeStore((state: any) => state.initializeNodes);

    useEffect(() => {
        if (!hasGeneratedNodesRef.current) {
            hasGeneratedNodesRef.current = true;
            initializeNodes(initialNodes);
            
            const randomNodes = generateRandomExportNodes(initialNodes, nodeIdCounter, 10);
            setNodes(prevNodes => {
                const newNodes = [...prevNodes, ...randomNodes];
                return newNodes;
            });
            
            randomNodes.forEach(node => {
                useNodeStore.getState().addNode(node);
            });
            
            setNodeIdCounter(prevCounter => prevCounter + randomNodes.length);
        }
    }, []);

    const onConnectStart = useCallback((event: any, { nodeId, handleType, handleId }: any) => {
        const targetNode = nodes.find(n => n.id === nodeId);
        if (targetNode) {
            const handleBounds = event.target.getBoundingClientRect();
            setConnectionStart({ 
                x: handleBounds.left + handleBounds.width / 2, 
                y: handleBounds.top + handleBounds.height / 2 
            });
            setIsConnecting(true);
        }
    }, [nodes]);
    
    const onConnectEnd = useCallback(() => {
        setIsConnecting(false);
    }, []);
    
    const onMouseMove = useCallback((event: any) => {
        setMousePosition({ x: event.clientX, y: event.clientY });
    }, []);

    const getConnectedEdgesCount = useCallback((nodeId: string): number => {
        return edges.filter(edge => edge.target === nodeId || edge.source === nodeId).length;
    }, [edges]);

    const calculateEfficiency = useCallback((nodeId: string, nodeType: string): number => {
        const connectedEdges = nodeType === 'Import' ? edges.filter(edge => edge.target === nodeId) : edges.filter(edge => edge.source === nodeId);
        if (connectedEdges.length === 0) return 100;
        const avgTrafficLevel = connectedEdges.reduce((sum, edge) => sum + (edge.data?.trafficLevel || 0), 0) / connectedEdges.length;
        return Math.max(0, 100 - avgTrafficLevel * 20);
    }, [edges]);

    const calculateTraffic = useCallback((edges: Edge<EdgeData>[], nodes: Node<NodeData>[]): Edge<EdgeData>[] => {
        if (!edges || !nodes) return [];
      
        return edges.map((edge) => {
            let trafficLevel = 0;
            const sourceNode = nodes.find(n => n.id === edge.source);
            const targetNode = nodes.find(n => n.id === edge.target);
            
            if (!sourceNode || !targetNode) return edge;
        
            const edgePath = [
                sourceNode.position.x + NODE_SIZE / 2,
                sourceNode.position.y + NODE_SIZE / 2,
                targetNode.position.x + NODE_SIZE / 2,
                targetNode.position.y + NODE_SIZE / 2
            ];
        
            edges.forEach((otherEdge) => {
                if (edge.id !== otherEdge.id) {
                    const otherSourceNode = nodes.find(n => n.id === otherEdge.source);
                    const otherTargetNode = nodes.find(n => n.id === otherEdge.target);
                    
                    if (!otherSourceNode || !otherTargetNode) return;
            
                    const otherEdgePath = [
                        otherSourceNode.position.x + NODE_SIZE / 2,
                        otherSourceNode.position.y + NODE_SIZE / 2,
                        otherTargetNode.position.x + NODE_SIZE / 2,
                        otherTargetNode.position.y + NODE_SIZE / 2
                    ];
            
                    if (doEdgesIntersect(edgePath, otherEdgePath)) {
                        trafficLevel++;
                    }
                }
            });
            return { ...edge, data: { ...edge.data, trafficLevel } };
        });
    }, []);

    const calculateResourceChange = useCallback((nodeId: string, nodeType: string): number => {
        const node = nodes.find(n => n.id === nodeId);
        if (!node) return 0;
    
        const connectedEdgesCount = getConnectedEdgesCount(nodeId);
        if (connectedEdgesCount === 0) return 0;
    
        const efficiency = calculateEfficiency(nodeId, nodeType);
        const connectedEdges = edges.filter(e => nodeType === 'Export' ? e.source === nodeId : e.target === nodeId);
        
        let totalTraffic = connectedEdges.reduce((sum, edge) => sum + (edge.data?.trafficLevel || 0), 0);
        
        const baseChange = 10;
        const trafficFactor = Math.max(0, 1 - (totalTraffic / (connectedEdgesCount * 5)));
        const efficiencyFactor = efficiency / 100;
    
        const change = baseChange * connectedEdgesCount * trafficFactor * efficiencyFactor;
        
        if (nodeType === 'Export') {
            return Math.min(change, node.data.supply);
        } else {
            return Math.min(change, node.data.maxSupply - node.data.supply);
        }
    }, [nodes, edges, getConnectedEdgesCount, calculateEfficiency]);

    const onConnect = useCallback((params: any) => {
        const sourceNode = nodes.find(node => node.id === params.source);
        const targetNode = nodes.find(node => node.id === params.target);
        
        if (!sourceNode || !targetNode) {
            console.error('Source or target node not found');
            return;
        }

        const distance = Math.sqrt(
            Math.pow(targetNode.position.x - sourceNode.position.x, 2) +
            Math.pow(targetNode.position.y - sourceNode.position.y, 2)
        );
    
        if (distance > 1500) {
            setAlertMessage('Connection distance exceeds ' + distance.toFixed(0) + '/1500 units. Unable to connect nodes.');
            setAlertType('warning');
            setAlertModalOpen(true);
            return;
        }

        let sourcePosition = params.sourceHandle;
        let targetPosition = params.targetHandle;
        
        if (sourceNode.data.nodeType === 'Spaceship') {
            sourcePosition = params.sourceHandle;
        }
        if (targetNode.data.nodeType === 'Spaceship') {
            targetPosition = params.targetHandle;
        }
        
        const isValidConnection = (
            (sourceNode.data.type === targetNode.data.type && sourceNode.data.nodeType === 'Export' && targetNode.data.nodeType === 'Import') ||
            (sourceNode.data.nodeType === 'Import' && targetNode.data.nodeType === 'Spaceship' && ['Ore', 'Fuel', 'Food'].includes(sourceNode.data.type)) ||
            (sourceNode.data.nodeType === 'Spaceship' && targetNode.data.nodeType === 'Import' && ['Ore', 'Fuel', 'Food'].includes(targetNode.data.type))
        );
        
        if (isValidConnection) {
            const existingEdge = edges.find(edge => 
                edge.source === sourceNode.id && sourceNode.data.nodeType === 'Export'
            );
            if (existingEdge && sourceNode.data.nodeType === 'Export') {
                setAlertMessage('Export node can only have one connection.');
                setAlertType('warning');
                setAlertModalOpen(true);
                return;
            }

            if (targetNode.data.nodeType === 'Import') {
                const existingImportEdge = edges.find(edge => edge.target === targetNode.id);
                if (existingImportEdge) {
                    setAlertMessage('Import node can only have one connection.');
                    setAlertType('warning');
                    setAlertModalOpen(true);
                    return;
                }
            }

            if (sourceNode.data.nodeType === 'Spaceship' || targetNode.data.nodeType === 'Spaceship') {
                const spaceshipNode = sourceNode.data.nodeType === 'Spaceship' ? sourceNode : targetNode;
                const connectedEdges = edges.filter(edge => 
                    edge.source === spaceshipNode.id || edge.target === spaceshipNode.id
                );
                if (connectedEdges.length >= 4) {
                    setAlertMessage('Spaceship can have a maximum of 4 connections.');
                    setAlertType('warning');
                    setAlertModalOpen(true);
                    return;
                }
            }
    
            const newEdge = { 
                ...params, 
                type: 'custom',
                data: { trafficLevel: 0 },
                sourceHandle: sourcePosition,
                targetHandle: targetPosition
            };
    
            setEdges((eds) => {
                const newEdges = addEdge(newEdge, eds);
                const updatedEdges = calculateTraffic(newEdges, nodes);
                
                setNodes((nds) =>
                    nds.map((node) => {
                        if (node.id === sourceNode.id && node.data.nodeType === 'Export') {
                            const resourceChange = calculateResourceChange(node.id, 'Export');
                            const newSupply = Math.max(0, node.data.supply - resourceChange);
                            return { 
                                ...node, 
                                data: { 
                                    ...node.data, 
                                    isConnected: true, 
                                    connectedEdgesCount: getConnectedEdgesCount(node.id) + 1,
                                    supply: newSupply
                                } 
                            };
                        }
                        if (node.id === targetNode.id && node.data.nodeType === 'Import') {
                            const resourceChange = calculateResourceChange(node.id, 'Import');
                            const newSupply = Math.min(node.data.maxSupply, node.data.supply + resourceChange);
                            return { 
                                ...node, 
                                data: { 
                                    ...node.data, 
                                    isConnected: true, 
                                    connectedEdgesCount: getConnectedEdgesCount(node.id) + 1,
                                    supply: newSupply,
                                    connectedNodes: [...(node.data.connectedNodes || []), sourceNode.id]
                                } 
                            };
                        }
                        return node;
                    })
                );
                
                return updatedEdges;
            });
        } else {
            setAlertMessage('Invalid connection.\nCheck the rules for connecting nodes.');
            setAlertType('warning');
            setAlertModalOpen(true);
        }
    }, [nodes, edges, setEdges, calculateTraffic, setNodes, getConnectedEdgesCount, calculateResourceChange]);

    const handleCancelEdgeDelete = useCallback(() => {
        setEdgeModalOpen(false);
        setEdgeToDelete(null);
    }, []);

    const handleCancelNodeDelete = useCallback(() => {
        setModalOpen(false);
        setSuccessMessage('');
        setNodeToDelete(null);
    }, []);

    const handleAlertModal = useCallback(() => {
        setAlertModalOpen(false);
    }, []);

    const handleConfirmEdgeDelete = useCallback(() => {
        if (edgeToDelete) {
            onEdgeDelete(edgeToDelete.id);
        }
        setEdgeModalOpen(false);
        setEdgeToDelete(null);
    }, [edgeToDelete]);

    const handleConfirmNodeDelete = useCallback(() => {
        if (nodeToDelete) {
            setNodes((nds) => nds.filter((n) => n.id !== nodeToDelete.id));
            setEdges((eds) => eds.filter((e) => e.source !== nodeToDelete.id && e.target !== nodeToDelete.id));
        }
        setModalOpen(false);
        setNodeToDelete(null);
    }, [nodeToDelete, setNodes, setEdges]);

    const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge<EdgeData>) => {
        event.preventDefault();
        setEdgeToDelete(edge);
        setEdgeModalOpen(true);
    }, []);

    const onNodeClick = useCallback((event: React.MouseEvent, node: Node<NodeData>) => {
        if (!node.data.isTemporary) {
            setNodeToDelete(node);
            setModalOpen(true);
        }
    }, []);
    
    const onEdgeDelete = useCallback((edgeId: string) => {
        const edge = edges.find((e) => e.id === edgeId);
        if (edge) {
            setNodes((nds) =>
                nds.map((node) => {
                    if (node.id === edge.target && node.data.nodeType === 'Import') {
                        const resourceChange = calculateResourceChange(node.id, 'Import');
                        const newSupply = Math.max(0, Math.min(node.data.maxSupply, node.data.supply - resourceChange));
                        return { 
                            ...node, 
                            data: { 
                                ...node.data, 
                                isConnected: getConnectedEdgesCount(node.id) > 1,
                                connectedEdgesCount: Math.max(0, getConnectedEdgesCount(node.id) - 1),
                                supply: isNaN(newSupply) ? node.data.supply : newSupply,
                                connectedNodes: node.data.connectedNodes?.filter((id: string) => id !== edge.source)
                            } 
                        };
                    }
                    if (node.id === edge.source && node.data.nodeType === 'Export') {
                        const resourceChange = calculateResourceChange(node.id, 'Export');
                        const newSupply = Math.max(0, Math.min(node.data.maxSupply, node.data.supply - resourceChange));
                        return { 
                            ...node, 
                            data: { 
                                ...node.data, 
                                isConnected: getConnectedEdgesCount(node.id) > 1,
                                connectedEdgesCount: Math.max(0, getConnectedEdgesCount(node.id) - 1),
                                supply: isNaN(newSupply) ? node.data.supply : newSupply,
                                connectedNodes: node.data.connectedNodes?.filter((id: string) => id !== edge.target)
                            } 
                        };
                    }
                    return node;
                })
            );
        }
        setEdges((eds) => eds.filter((e) => e.id !== edgeId));
    }, [edges, setEdges, setNodes, nodes, getConnectedEdgesCount, calculateResourceChange]);

    const edgeTypes = useMemo(() => ({
        custom: CustomEdge
    }), []);

    useEffect(() => {
        setEdges((eds) => calculateTraffic(eds, nodes));
    }, [nodes, setEdges, calculateTraffic]);
    
    const updateNode = useNodeStore((state) => state.updateNode);

    const confirmNodePlacement = () => {
        if (temporaryNode && isNodeValid) {
            const confirmedNodeData = {
                ...temporaryNode.data,
                isTemporary: false
            };
            
            const confirmedNode = {
                ...temporaryNode,
                data: confirmedNodeData,
                draggable: false
            };
            setNodes(prevNodes => [...prevNodes, confirmedNode]);
            useNodeStore.getState().updateNode(confirmedNode.id, confirmedNode);
            setTemporaryNode(null);
        }
    };

    const cancelNodePlacement = () => {
        setTemporaryNode(null);
    };
    
    const nodeTypes = useMemo(() => ({
        custom: (props: any) => (
            <CustomNode
                {...props}
                isConnected={getConnectedEdgesCount(props.id) > 0}
                connectedEdgesCount={getConnectedEdgesCount(props.id)}
                efficiency={calculateEfficiency(props.id, props.nodeType)}
                confirmNodeTemporary={confirmNodePlacement}
                cancelNodeTemporary={cancelNodePlacement}
            />
        )
    }), [getConnectedEdgesCount, calculateEfficiency]);

    React.useEffect(() => {
        nodes.forEach(node => {
          updateNode(node.id, node.data);
        });
    }, []);

    const createTemporaryNode = (nodeType: string) => {
        const newNodeId = String(nodeIdCounter + 1);
        const centerX = 0;
        const centerY = 100;
        
        const nodeCategory = nodeType.includes('Import') ? 'Import' : 'Export';
        const resourceType = nodeType.replace('Import', '').replace('Export', '');

        const newNode: Node<NodeData> = {
            id: newNodeId,
            type: 'custom',
            data: { 
                label: `${nodeType}`,
                type: resourceType as ResourceType,
                nodeType: nodeCategory as NodeType,
                id: newNodeId,
                displayName: nodeDisplayNames[nodeType] || nodeType,
                size: 'Small',
                supply: 0,
                maxSupply: 1000,
                handlePositions: {
                    target: Position.Left
                },
                connectedNodes: [],
                isTemporary: true,
                warning: ''
            },
            position: { x: centerX, y: centerY },
            draggable: true,
        };
        
        setTemporaryNode(newNode);
        setNodeIdCounter((prev) => prev + 1);
        useNodeStore.getState().addNode(newNode);
    };

    const checkNodeValidity = (position: { x: number, y: number }) => {
        const isValid = !checkNodeCollision({ ...temporaryNode!, position }, nodes);
        setIsNodeValid(isValid);
        if (temporaryNode) {
            const warning = isValid ? '' : 'Warning';
            
            setTemporaryNode(prevNode => {
                if (!prevNode) return null;
                return {
                    ...prevNode,
                    data: {
                        ...prevNode.data,
                        warning
                    }
                };
            });
            
            useNodeStore.getState().updateNode(temporaryNode.id, {
                ...temporaryNode,
                data: {
                    ...temporaryNode.data,
                    warning
                }
            });
        }
    };

    const onNodeDragStop = (event: React.MouseEvent, node: Node) => {
        if (node.data.isTemporary) {
            const updatedPosition = snapToGrid(node.position);
            setTemporaryNode(prevNode => prevNode ? { ...prevNode, position: updatedPosition } : null);
            checkNodeValidity(updatedPosition);
        }
    };

    return (
        <>
            <NodeContext.Provider value={{ nodes }}>
                <div style={{ width: '100vw', height: '100vh' }} onMouseMove={onMouseMove}>
                    {!landingPublic ? (
                        <div>No Landing Planet</div>
                    ) : (
                        <>
                        <Navbar />
                        <div
                            className='relative min-h-screen overflow-x-hidden bg-black text-white z-10 hide-scrollbar'
                        >
                            <motion.div className='fixed top-0 left-0 w-full h-full' style={{ backgroundColor: `#${landingColor}`, backgroundImage: 'url(/assets/images/bg-game.webp)', backgroundSize: 'repeat', zIndex: 1 }} />
                            <div className='absolute z-50 top-0 bottom-0 left-0 right-0'>
                                <ReactFlow
                                    defaultViewport={{ x: (widowWidth / 2) - 40, y: (windowHeight / 2) - 40, zoom: 1 }}
                                    snapToGrid={true}
                                    snapGrid={[GRID_SIZE, GRID_SIZE]}
                                    onConnectStart={onConnectStart}
                                    onConnectEnd={onConnectEnd}
                                    nodesDraggable={false}
                                    nodes={[...nodes, ...(temporaryNode ? [temporaryNode] : [])]}
                                    edges={edges}
                                    onNodesChange={onNodesChange}
                                    onNodeDragStop={onNodeDragStop}
                                    onConnect={onConnect}
                                    onEdgeClick={onEdgeClick}
                                    onNodeClick={onNodeClick}
                                    nodeTypes={nodeTypes}
                                    edgeTypes={edgeTypes}
                                    defaultEdgeOptions={{ type: 'custom', animated: true }}
                                    connectionLineType={ConnectionLineType.SmoothStep}
                                    multiSelectionKeyCode={null}
                                    selectionKeyCode={null}
                                >
                                    <Controls showInteractive={false} position='top-right' className='text-black pt-[30px] sm:pt-[40px]' />
                                    <Background variant={BackgroundVariant.Dots} gap={10} size={1} />
                                    {isConnecting && (
                                        <DistanceIndicator
                                        sourceX={connectionStart.x}
                                        sourceY={connectionStart.y}
                                        targetX={mousePosition.x}
                                        targetY={mousePosition.y}
                                        />
                                    )}
                                </ReactFlow>
                                <ConfirmModal
                                    isOpen={edgeModalOpen}
                                    onClose={handleCancelEdgeDelete}
                                    onConfirm={handleConfirmEdgeDelete}
                                    message='คุณต้องการลบการเชื่อมต่อนี้ใช่หรือไม่?'
                                />
                                <CustomModal
                                    isOpen={modalOpen}
                                    onClose={handleCancelNodeDelete}
                                    onDelete={handleConfirmNodeDelete}
                                    node={nodeToDelete}
                                    edges={edges}
                                    canDelete={nodeToDelete && (nodeToDelete.data.nodeType === 'Import') && getConnectedEdgesCount(nodeToDelete.id) === 0}
                                />
                                <AlertModal
                                    isOpen={alertModalOpen}
                                    onClose={handleAlertModal}
                                    message={alertMessage}
                                    type={alertType}
                                />
                            </div>
                        </div>
                        <Panel onCreateTemporaryNode={createTemporaryNode} />
                        </>
                    )}
                </div>
            </NodeContext.Provider>
        </>
    );
};

export default GameplayScreen;