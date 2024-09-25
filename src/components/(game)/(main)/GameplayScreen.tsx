'use client'
import '@xyflow/react/dist/style.css';
import 'react-tooltip/dist/react-tooltip.css';
import Image from 'next/image';
import React, { useState, useEffect, useCallback, useMemo, useRef, useContext } from 'react';
import {
    ReactFlow, Controls, Background, BackgroundVariant, ConnectionLineType,
    EdgeProps, Node, Edge, useNodesState, useEdgesState, addEdge, BaseEdge,
    getSmoothStepPath, Handle, Position, useStore, useReactFlow
} from '@xyflow/react';
import { motion } from 'framer-motion';
import { Tooltip } from 'react-tooltip';
import { GiWoodPile, GiStonePile } from 'react-icons/gi';
import { GiCoalWagon } from 'react-icons/gi';
import { IconType } from 'react-icons';

import Navbar from './Navbar';
import Panel from './Panel';

interface NodeContextType {
    nodes: Node<NodeData>[];
}
  
export const NodeContext = React.createContext<NodeContextType>({ nodes: [] });

const resourceTypes = ['Ore', 'Fuel', 'Food', 'Connector'];

type ResourceType = typeof resourceTypes[number];
type NodeType = 'Export' | 'Import' | 'Connector';

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
        target?: Position;
    };
    [key: string]: unknown;
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
};

const nodeImages = {
    OreExport: '/assets/images/wood-export.png',
    OreImport: '/assets/images/ore-station.webp',
    FuelExport: '/assets/images/stone-export.png',
    FuelImport: '/assets/images/fuel-station.webp',
    FoodExport: '/assets/images/coal-export.png',
    FoodImport: '/assets/images/food-station.webp',
    ConnectorConnector: '/assets/images/connector.gif'
};

interface FloatingNumberProps {
    id: number;
    value: number;
    efficiency: number;
    onComplete: (id: number) => void;
}

const ConfirmModal = ({ isOpen, onClose, onConfirm, message }: any) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg">
          <p className="text-lg mb-4 text-theme-title">{message}</p>
          <div className="flex justify-end space-x-2">
            <button
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={onConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
};

const CustomModal = ({ isOpen, onClose, onDelete, onDetail, node, canDelete }: any) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg">
          <p className="text-lg mb-4 text-theme-title">{node?.data.displayName} (#{node?.id})</p>
          <div className="flex justify-end space-x-2">
            <button
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={onDetail}
            >
              Detail
            </button>
            {node?.data.nodeType !== 'Export' && (
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={onDelete}
                disabled={!canDelete}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    );
};

const FloatingNumber = React.memo(({ value, efficiency }: { value: number; efficiency: number }) => {
    const [position, setPosition] = useState(0);
    
    useEffect(() => {
      const interval = setInterval(() => {
        setPosition(prev => {
          if (prev <= -30) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 50);
      return () => clearInterval(interval);
    }, []);
  
    const displayValue = Math.max(0, value * (efficiency / 100));
  
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

    // Convert screen coordinates to flow coordinates
    const sourceFlowX = (sourceX - tX) / tScale;
    const sourceFlowY = (sourceY - tY) / tScale;
    const targetFlowX = (targetX - tX) / tScale;
    const targetFlowY = (targetY - tY) / tScale;

    // Get all nodes
    const nodes = getNodes();

    // Find the closest nodes to the source and target points
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

    // Calculate the distance using the same formula as in onConnect
    const distance = sourceNode && targetNode
        ? Math.sqrt(
            Math.pow(targetNode.position.x - sourceNode.position.x, 2) +
            Math.pow(targetNode.position.y - sourceNode.position.y, 2)
        )
        : 0;

    // Calculate the midpoint for positioning the indicator
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
    data: NodeData;
    isConnected: boolean;
    connectedEdgesCount: number;
    efficiency: number;
    updateNodeData: (id: string, newData: Partial<NodeData>) => void;
}

const CustomNode: React.FC<CustomNodeProps> = React.memo(({ data, isConnected, connectedEdgesCount, efficiency, updateNodeData }) => {
    const rotationRef = useRef(0);
    const [isHovered, setIsHovered] = useState(false);
    const lastUpdateTimeRef = useRef(Date.now());
    const animationFrameRef = useRef<number>();
  
    const updateNodeRotation = useCallback(() => {
      rotationRef.current = (rotationRef.current + 1) % 360;
      const node = document.getElementById(`node-${data.id}`);
      if (node) {
        node.style.transform = `rotate(${rotationRef.current}deg) scale(${isHovered ? 1.2 : 1})`;
      }
      animationFrameRef.current = requestAnimationFrame(updateNodeRotation);
    }, [data.id, isHovered]);
  
    useEffect(() => {
      animationFrameRef.current = requestAnimationFrame(updateNodeRotation);
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [updateNodeRotation]);
  
    useEffect(() => {
      if (data.nodeType === 'Import' && isConnected) {
        const interval = setInterval(() => {
          const now = Date.now();
          lastUpdateTimeRef.current = now;
  
          const resourceChange = connectedEdgesCount * (efficiency / 100);
          updateNodeData(data.id, {
            supply: Math.min(data.maxSupply, data.supply + resourceChange)
          });
        }, 1000);
        return () => clearInterval(interval);
      }
    }, [data.id, data.nodeType, data.maxSupply, data.supply, isConnected, connectedEdgesCount, efficiency, updateNodeData]);
  
    const nodeSize = useMemo(() => {
      const sizes = { small: 40, medium: 60, large: 80 };
      return sizes[data.size];
    }, [data.size]);
  
    const iconProps = useMemo(() => {
      let Icon: IconType;
      let color: string;
      switch(data.type) {
        case 'Ore':
          Icon = GiWoodPile;
          color = '#d68d48';
          break;
        case 'Fuel':
          Icon = GiStonePile;
          color = '#b8baba';
          break;
        case 'Food':
          Icon = GiCoalWagon;
          color = '#525553';
          break;
        default:
          Icon = GiWoodPile;
          color = '#FFFFFF';
      }
      return { Icon, color };
    }, [data.type]);
  
    const tooltipContent = useMemo(() => (
      <div>
        <p><strong>{data.nodeType === 'Export' ? '🔴' : '🟢'} {data.displayName} (# {data.id})</strong></p>
        <p className='flex'>Type: <iconProps.Icon size={18} style={{ color: iconProps.color }} className='mx-1' /> {data.type}</p>
        <p>Supply: {data.supply.toFixed(2)}/{data.maxSupply}</p>
        {data.nodeType === 'Connector' && data.connectedNodes && (
          <p>Connected Nodes: {data.connectedNodes.join(', ') || 'None'}</p>
        )}
      </div>
    ), [data, iconProps]);
  
    return (
      <>
        {(data.nodeType === 'Export' || data.nodeType === 'Connector') && (
          <Handle type="source" position={data.handlePositions.source || Position.Right} style={{ right: -10, width: 10, height: 10 }} />
        )}
        {(data.nodeType === 'Import' || data.nodeType === 'Connector') && (
          <Handle type="target" position={data.handlePositions.target || Position.Left} style={{ left: -10, width: 10, height: 10 }} />
        )}
        <div
          id={`node-${data.id}`}
          data-tooltip-id={`tooltip-${data.id}`}
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
            src={nodeImages[`${data.type}${data.nodeType}` as keyof typeof nodeImages]}
            alt={`${data.type} ${data.nodeType}`}
            width={200}
            height={200}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            priority
          />
        </div>
        <Tooltip id={`tooltip-${data.id}`} render={() => tooltipContent} />
        {isConnected && data.nodeType === 'Import' && (
          <FloatingNumber value={connectedEdgesCount} efficiency={efficiency} />
        )}
      </>
    );
});

const initialNodes: Node<NodeData>[] = [
    {
        id: '1',
        type: 'custom',
        data: { 
            label: 'Ore Export', 
            type: 'Ore', 
            nodeType: 'Export', 
            id: '1', 
            displayName: 'Ore', 
            size: 'small',
            supply: 1000,
            maxSupply: 1000,
            handlePositions: {
                source: Position.Right
            }
        },
        position: { x: -100, y: 100 },
    },
    {
        id: '2',
        type: 'custom',
        data: { 
            label: 'Ore Import', 
            type: 'Ore', 
            nodeType: 'Import', 
            id: '2', 
            displayName: 'Ore Station', 
            size: 'small',
            supply: 0,
            maxSupply: 1000,
            handlePositions: {
                target: Position.Left
            }
        },
        position: { x: 300, y: 100 },
    },
    {
        id: '3',
        type: 'custom',
        data: { 
            label: 'Fuel Export', 
            type: 'Fuel', 
            nodeType: 'Export', 
            id: '3', 
            displayName: 'Fuel', 
            size: 'large',
            supply: 1000,
            maxSupply: 1000,
            handlePositions: {
                source: Position.Right
            }
        },
        position: { x: -100, y: 200 },
    },
    {
        id: '4',
        type: 'custom',
        data: { 
            label: 'Fuel Import', 
            type: 'Fuel', 
            nodeType: 'Import', 
            id: '4', 
            displayName: 'Fuel Station', 
            size: 'small',
            supply: 0,
            maxSupply: 1000,
            handlePositions: {
                target: Position.Left
            }
        },
        position: { x: 300, y: 200 },
    },
    {
        id: '5',
        type: 'custom',
        data: { 
            label: 'Connector', 
            type: 'Connector', 
            nodeType: 'Connector', 
            id: '5', 
            displayName: 'Connector Node', 
            size: 'small',
            supply: 0,
            maxSupply: 1000,
            connectedNodes: [],
            handlePositions: {
                source: Position.Right,
                target: Position.Left
            }
        },
        position: { x: 100, y: 100 },
    },
    {
        id: '6',
        type: 'custom',
        data: { 
            label: 'Connector', 
            type: 'Connector', 
            nodeType: 'Connector', 
            id: '6', 
            displayName: 'Connector Node', 
            size: 'small',
            supply: 0,
            maxSupply: 1000,
            connectedNodes: [],
            handlePositions: {
                source: Position.Right,
                target: Position.Left
            }
        },
        position: { x: 100, y: 200 },
    },
];

interface CustomEdgeProps extends EdgeProps {}

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
    style = {},
    data,
}) => {
    const [edgePath] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition
    });
  
    const trafficLevel: any = data?.trafficLevel || 0;
    const colors = ['#4caf50', '#ffeb3b', '#ff9800', '#f44336']; // green, yellow, orange, red
    const edgeColor = colors[Math.min(trafficLevel, colors.length - 1)];
    const strokeWidth = 1 + trafficLevel;
    
    const efficiency = Math.max(0, 100 - trafficLevel * 20); // 100% - (20% per traffic level)
    const animationDuration = 1 / (efficiency / 100); // Slower animation for lower efficiency
  
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
    for (let otherNode of otherNodes) {
        if (node.id !== otherNode.id) {
            const dx = Math.abs(node.position.x - otherNode.position.x);
            const dy = Math.abs(node.position.y - otherNode.position.y);
            if (dx < NODE_SIZE && dy < NODE_SIZE) {
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

const GameplayScreen = () => {
    const [ nodes, setNodes, onNodesChange ] = useNodesState<any>(initialNodes);
    const [ edges, setEdges ] = useEdgesState<any>(initialEdges);
    const [ nodeIdCounter, setNodeIdCounter ] = useState(7);
    const [ edgeModalOpen, setEdgeModalOpen ] = useState(false);
    const [ nodeModalOpen, setNodeModalOpen ] = useState(false);
    const [ edgeToDelete, setEdgeToDelete ] = useState<any>(null);
    const [ nodeToDelete, setNodeToDelete ] = useState<any>(null);
    const [ connectionStart, setConnectionStart ] = useState({ x: 0, y: 0 });
    const [ mousePosition, setMousePosition ] = useState({ x: 0, y: 0 });
    const [ isConnecting, setIsConnecting ] = useState(false);
    const [ temporaryNode, setTemporaryNode ] = useState<Node<NodeData> | null>(null);
    const [ isNodeValid, setIsNodeValid ] = useState(true);

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

    const calculateEfficiency = useCallback((nodeId: string): number => {
        const connectedEdges = edges.filter(edge => edge.target === nodeId);
        if (connectedEdges.length === 0) return 100;
        const avgTrafficLevel = connectedEdges.reduce((sum, edge) => sum + (edge.data?.trafficLevel || 0), 0) / connectedEdges.length;
        return Math.max(0, 100 - avgTrafficLevel * 20);
    }, [edges]);

    const getConnectedEdgesCount = useCallback((nodeId: string): number => {
        return edges.filter(edge => edge.target === nodeId || edge.source === nodeId).length;
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
    
        const efficiency = calculateEfficiency(nodeId);
        const connectedEdges = edges.filter(e => nodeType === 'Export' ? e.source === nodeId : e.target === nodeId);
        
        let totalTraffic = connectedEdges.reduce((sum, edge) => sum + (edge.data?.trafficLevel || 0), 0);
        
        const baseChange = 10;
        const trafficFactor = Math.max(0, 1 - (totalTraffic / (connectedEdgesCount * 5)));
        const efficiencyFactor = efficiency / 100;
    
        const change = baseChange * connectedEdgesCount * trafficFactor * efficiencyFactor;
        
        return nodeType === 'Export' ? change : -change; // เพิ่มสำหรับ Export, ลดสำหรับ Import
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
        console.log(distance)
    
        if (distance > 1000) {
            alert('Connection distance exceeds ' + distance.toFixed(0) + '/200 units. Unable to connect nodes.');
            return;
        }
        
        const isValidConnection = (
            (sourceNode.data.type === targetNode.data.type &&
             sourceNode.data.nodeType === 'Export' &&
             targetNode.data.nodeType === 'Import') ||
            (sourceNode.data.nodeType === 'Export' &&
             targetNode.data.nodeType === 'Connector') ||
            (sourceNode.data.nodeType === 'Connector' &&
             targetNode.data.nodeType === 'Import') ||
            (sourceNode.data.nodeType === 'Connector' &&
             targetNode.data.nodeType === 'Connector')
        );
    
        if (isValidConnection) {
            const existingEdge = edges.find(edge => 
                edge.source === sourceNode.id && sourceNode.data.nodeType === 'Export'
            );
            if (existingEdge && sourceNode.data.nodeType === 'Export') {
                alert('Export node can only have one connection.');
                return;
            }
    
            const maxConnectorConnections = 3;
            if (sourceNode.data.nodeType === 'Connector' || targetNode.data.nodeType === 'Connector') {
                const connectorNode = sourceNode.data.nodeType === 'Connector' ? sourceNode : targetNode;
                const connectorEdges = edges.filter(edge => 
                    edge.source === connectorNode.id || edge.target === connectorNode.id
                );
                if (connectorEdges.length >= maxConnectorConnections) {
                    alert(`Connector node can have a maximum of ${maxConnectorConnections} connections.`);
                    return;
                }
            }
    
            const newEdge = { 
                ...params, 
                type: 'custom',
                data: { trafficLevel: 0 }
            };
    
            setEdges((eds) => {
                const newEdges = addEdge(newEdge, eds);
                const updatedEdges = calculateTraffic(newEdges, nodes);
                
                setNodes((nds) =>
                    nds.map((node) => {
                        if (node.id === sourceNode.id && node.data.nodeType === 'Export') {
                            const resourceChange = calculateResourceChange(node.id, 'Export');
                            const newSupply = Math.max(0, Math.min(node.data.maxSupply, node.data.supply + resourceChange));
                            return { 
                                ...node, 
                                data: { 
                                    ...node.data, 
                                    isConnected: true, 
                                    connectedEdgesCount: getConnectedEdgesCount(node.id) + 1,
                                    supply: isNaN(newSupply) ? node.data.supply : newSupply
                                } 
                            };
                        }
                        if (node.id === targetNode.id && node.data.nodeType === 'Import') {
                            const resourceChange = calculateResourceChange(node.id, 'Import');
                            const newSupply = Math.max(0, Math.min(node.data.maxSupply, node.data.supply + resourceChange));
                            return { 
                                ...node, 
                                data: { 
                                    ...node.data, 
                                    isConnected: true, 
                                    connectedEdgesCount: getConnectedEdgesCount(node.id) + 1,
                                    supply: isNaN(newSupply) ? node.data.supply : newSupply,
                                    connectedNodes: [...(node.data.connectedNodes || []), sourceNode.id]
                                } 
                            };
                        }
                        if (node.id === sourceNode.id && node.data.nodeType === 'Connector') {
                            return { 
                                ...node, 
                                data: { 
                                    ...node.data, 
                                    isConnected: true, 
                                    connectedEdgesCount: getConnectedEdgesCount(node.id) + 1,
                                    connectedNodes: [...(node.data.connectedNodes || []), targetNode.id]
                                } 
                            };
                        }
                        return node;
                    })
                );
                
                return updatedEdges;
            });
        } else {
            alert('Invalid connection. Check the rules for connecting nodes.');
        }
    }, [nodes, edges, setEdges, calculateTraffic, setNodes, getConnectedEdgesCount, calculateResourceChange]);

    const handleCancelEdgeDelete = useCallback(() => {
        setEdgeModalOpen(false);
        setEdgeToDelete(null);
    }, []);

    const handleCancelNodeDelete = useCallback(() => {
        setNodeModalOpen(false);
        setNodeToDelete(null);
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
        setNodeModalOpen(false);
        setNodeToDelete(null);
    }, [nodeToDelete, setNodes, setEdges]);

    const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge<EdgeData>) => {
        event.preventDefault();
        setEdgeToDelete(edge);
        setEdgeModalOpen(true);
    }, []);

    const onNodeClick = useCallback((event: React.MouseEvent, node: Node<NodeData>) => {
        setNodeToDelete(node);
        setNodeModalOpen(true);
    }, []);
    
    const onEdgeDelete = useCallback((edgeId: string) => {
        const edge = edges.find((e) => e.id === edgeId);
        if (edge) {
            const sourceNode = nodes.find(n => n.id === edge.source);
            const targetNode = nodes.find(n => n.id === edge.target);
    
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
                    if ((node.id === edge.source || node.id === edge.target) && node.data.nodeType === 'Connector') {
                        return {
                            ...node,
                            data: {
                                ...node.data,
                                isConnected: getConnectedEdgesCount(node.id) > 1,
                                connectedEdgesCount: Math.max(0, getConnectedEdgesCount(node.id) - 1),
                                connectedNodes: node.data.connectedNodes?.filter((id: string) => id !== (node.id === edge.source ? edge.target : edge.source))
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

    const addRandomNode = () => {
        const type = resourceTypes[Math.floor(Math.random() * resourceTypes.length)];
        const nodeType = Math.random() > 0.3 ? 'Export' : 'Import';
        const size = ['small', 'medium', 'large'][Math.floor(Math.random() * 3)] as 'small' | 'medium' | 'large';
        let position;
        let attempts = 0;
        const maxAttempts = 100;
    
        do {
            position = snapToGrid({
                x: Math.random() * (window.innerWidth - 100),
                y: Math.random() * (window.innerHeight - 100),
            });
        
            const newNodeId = String(nodeIdCounter);
            const displayName = nodeDisplayNames[`${type}${nodeType}`];
            
            const handlePositions = {
                source: [Position.Left, Position.Right, Position.Top, Position.Bottom][Math.floor(Math.random() * 4)],
                target: [Position.Left, Position.Right, Position.Top, Position.Bottom][Math.floor(Math.random() * 4)]
            };
            
            if (type === 'Connector') {
                while (handlePositions.target === handlePositions.source) {
                    handlePositions.target = [Position.Left, Position.Right, Position.Top, Position.Bottom][Math.floor(Math.random() * 4)];
                }
            }
            
            const newNode: Node<NodeData> = {
                id: newNodeId,
                type: 'custom',
                data: { 
                    label: `${type} ${nodeType}`, 
                    type, 
                    nodeType, 
                    id: newNodeId,
                    displayName: displayName,
                    size: size,
                    supply: nodeType === 'Export' ? 1000 : 0,
                    maxSupply: 1000,
                    handlePositions: handlePositions,
                    connectedNodes: []
                },
                position: position,
            };
        
            if (!checkNodeCollision(newNode, nodes)) {
                setNodes((nds) => nds.concat(newNode));
                setNodeIdCounter((prev) => prev + 1);
                return;
            }
    
            attempts++;
        } while (attempts < maxAttempts);
    
        console.warn('Could not find a valid position for the new node');
    };

    const updateNodeData = useCallback((id: string, newData: Partial<NodeData>) => {
        setNodes((nds) =>
          nds.map((node) =>
            node.id === id ? { ...node, data: { ...node.data, ...newData } } : node
          )
        );
    }, [setNodes]);
    
    const nodeTypes = useMemo(() => ({
        custom: (props: any) => (
          <CustomNode
            {...props}
            isConnected={getConnectedEdgesCount(props.id) > 0}
            connectedEdgesCount={getConnectedEdgesCount(props.id)}
            efficiency={calculateEfficiency(props.id)}
            updateNodeData={updateNodeData}
          />
        )
    }), [getConnectedEdgesCount, calculateEfficiency]);

    const createTemporaryNode = (nodeType: string) => {
        const newNodeId = String(nodeIdCounter);
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        const newNode: Node<NodeData> = {
            id: newNodeId,
            type: 'custom',
            data: { 
                label: `${nodeType}`, 
                type: nodeType.replace('Import', '').replace('Connector', ''),
                nodeType: nodeType === 'Connector' ? 'Connector' : 'Import',
                id: newNodeId,
                displayName: nodeDisplayNames[nodeType],
                size: 'medium',
                supply: 0,
                maxSupply: 1000,
                handlePositions: {
                    target: Position.Left,
                    ...(nodeType === 'Connector' ? { source: Position.Right } : {})
                },
                connectedNodes: [],
                isTemporary: true
            },
            position: { x: centerX, y: centerY },
            draggable: true,
        };

        setTemporaryNode(newNode);
        setNodeIdCounter((prev) => prev + 1);
    };

    const onNodeDragStop = (event: React.MouseEvent, node: Node) => {
        if (node.data.isTemporary) {
            const updatedPosition = snapToGrid(node.position);
            setTemporaryNode(prevNode => prevNode ? { ...prevNode, position: updatedPosition } : null);
            checkNodeValidity(updatedPosition);
        }
    };

    const checkNodeValidity = (position: { x: number, y: number }) => {
        const isValid = !checkNodeCollision({ ...temporaryNode!, position }, nodes);
        setIsNodeValid(isValid);
    };

    const confirmNodePlacement = () => {
        if (temporaryNode && isNodeValid) {
            const confirmedNode = {
                ...temporaryNode,
                data: { ...temporaryNode.data, isTemporary: false },
                draggable: false
            };
            setNodes(prevNodes => [...prevNodes, confirmedNode]);
            setTemporaryNode(null);
        }
    };

    const cancelNodePlacement = () => {
        setTemporaryNode(null);
    };

    return (
        <NodeContext.Provider value={{ nodes }}>
            <div style={{ width: '100vw', height: '100vh' }} onMouseMove={onMouseMove}>
                <Navbar />
                <div
                    className='relative min-h-screen overflow-x-hidden bg-black text-white z-10 hide-scrollbar'
                >
                    <motion.div className='fixed top-0 left-0 w-full h-full' style={{ backgroundImage: 'url(/assets/website/bg1.png)', backgroundSize: 'cover', zIndex: 1 }} />
                    <motion.div className='fixed top-0 left-0 w-full h-full' style={{ backgroundImage: 'url(/assets/website/bg2.png)', backgroundSize: 'cover', zIndex: 2 }} />
                    <motion.div className='fixed top-0 left-0 w-full h-full' style={{ backgroundImage: 'url(/assets/website/bg3.png)', backgroundSize: 'cover', zIndex: 3 }} />
                    <div className='absolute z-50 top-0 bottom-0 left-0 right-0'>
                        <ReactFlow
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
                            <Controls showInteractive={false} />
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
                        {temporaryNode && (
                            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-4">
                                <button 
                                    className="px-4 py-2 bg-red-500 text-white rounded"
                                    onClick={cancelNodePlacement}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className={`px-4 py-2 ${isNodeValid ? 'bg-green-500' : 'bg-gray-500'} text-white rounded`}
                                    onClick={confirmNodePlacement}
                                    disabled={!isNodeValid}
                                >
                                    Confirm
                                </button>
                            </div>
                        )}
                        <ConfirmModal
                            isOpen={edgeModalOpen}
                            onClose={handleCancelEdgeDelete}
                            onConfirm={handleConfirmEdgeDelete}
                            message="คุณต้องการลบการเชื่อมต่อนี้ใช่หรือไม่?"
                        />
                        <CustomModal
                            isOpen={nodeModalOpen}
                            onClose={handleCancelNodeDelete}
                            onDelete={handleConfirmNodeDelete}
                            onDetail={() => {/* Implement detail action */}}
                            node={nodeToDelete}
                            canDelete={nodeToDelete && (nodeToDelete.data.nodeType === 'Import' || nodeToDelete.data.nodeType === 'Connector') && getConnectedEdgesCount(nodeToDelete.id) === 0}
                        />
                    </div>
                </div>
                <Panel onCreateTemporaryNode={createTemporaryNode} />
                <div style={{ position: 'absolute', left: 10, top: 10, zIndex: 30 }}>
                    <button onClick={addRandomNode} className='bg-white text-black px-2'>Add Random Node</button>
                </div>
            </div>
        </NodeContext.Provider>
    );
};

export default GameplayScreen;