'use client'
import '@xyflow/react/dist/style.css';
import 'react-tooltip/dist/react-tooltip.css';
import Image from 'next/image';
import React, { useState, useEffect, useCallback } from 'react';
import {
    ReactFlow, Controls, Background, BackgroundVariant, ConnectionLineType,
    EdgeProps, Node, Edge, useNodesState, useEdgesState, addEdge, BaseEdge,
    getSmoothStepPath, Handle, Position
} from '@xyflow/react';
import { motion } from 'framer-motion';
import { Tooltip } from 'react-tooltip';
import { GiWoodPile, GiStonePile } from 'react-icons/gi';
import { AiFillGold } from 'react-icons/ai';
import { GiCoalWagon } from 'react-icons/gi';
import { FaOilWell } from 'react-icons/fa6';
import { IconType } from 'react-icons';

import Navbar from './Navbar';
import Panel from './Panel';

const resourceTypes = ['Ore', 'Fuel', 'Food'];

type ResourceType = typeof resourceTypes[number];
type NodeType = 'Export' | 'Import';

interface NodeData {
    id: string;
    label: string;
    type: ResourceType;
    nodeType: NodeType;
    displayName: string;
    isConnected?: boolean;
    connectedEdgesCount?: number;
    size: 'small' | 'medium' | 'large';
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
    OreImport: '/assets/images/wood-import.png',
    FuelExport: '/assets/images/stone-export.png',
    FuelImport: '/assets/images/stone-import.png',
    FoodExport: '/assets/images/coal-export.png',
    FoodImport: '/assets/images/coal-import.png'
};

interface FloatingNumberProps {
    id: number;
    value: number;
    efficiency: number;
    onComplete: (id: number) => void;
}

const FloatingNumber = ({ id, value, efficiency, onComplete }: FloatingNumberProps) => {
    const [ position, setPosition ] = useState(0);
  
    useEffect(() => {
        const interval = setInterval(() => {
            setPosition((prev) => {
                if (prev <= -30) {
                    clearInterval(interval);
                    onComplete(id);
                    return prev;
                }
                return prev - 1;
            });
        }, 16);
        return () => clearInterval(interval);
    }, [id, onComplete]);
  
    const displayValue = Math.max(0, value - Math.round(value * (100 - efficiency) / 100));
  
    return (
        <div
            style={{
                position: 'absolute',
                top: `${position}px`,
                transform: 'translateX(-50%)',
                transition: 'top 0.3s ease-out',
                opacity: 1 - Math.abs(position) / 30,
                color: 'lime',
                fontWeight: 'bold',
                fontSize: '20px'
            }}
        >
            +{displayValue * (efficiency / 100)}
        </div>
    );
};

interface CustomNodeProps {
    data: NodeData;
    isConnected: boolean;
    connectedEdgesCount: number;
    efficiency: number;
}

const CustomNode = ({ data, isConnected, connectedEdgesCount, efficiency }: CustomNodeProps) => {
    const [ rotation, setRotation ] = useState(0);
    const [ isHovered, setIsHovered ] = useState(false);
    const [ floatingNumbers, setFloatingNumbers ] = useState([]);
  
    useEffect(() => {
        const interval = setInterval(() => {
          setRotation((prevRotation) => (prevRotation + 1) % 360);
        }, 50);
    
        return () => clearInterval(interval);
    }, []);
  
    useEffect(() => {
        if (data.nodeType === 'Import' && isConnected) {
            const interval = setInterval(() => {
                setFloatingNumbers((prev): any => [...prev, { id: Date.now(), value: connectedEdgesCount, efficiency }]);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [data.nodeType, isConnected, connectedEdgesCount, efficiency]);
  
    const removeFloatingNumber = useCallback((id: number) => {
        setFloatingNumbers(prev => prev.filter((num: any) => num.id !== id));
    }, []);

    let Icon: IconType;
    let color: string;

    const nodeSizes = {
        small: 40,
        medium: 60,
        large: 80
    };

    const nodeSize = nodeSizes[data.size];

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
            break;
    }

    const tooltipContent = (
        <div>
            <p><strong>{data.nodeType === 'Export' ? '🔴' : '🟢'} {data.displayName} (# {data.id})</strong></p>
            <p className='flex'>Type: <Icon size={18} style={{ color: color }} className='mx-1' /> {data.type}</p>
        </div>
    );
    
    return (
        <>
            {data.nodeType === 'Export' && (
                <Handle type="source" position={Position.Right} style={{ right: -10, width: 10, height: 10 }} />
            )}
            {data.nodeType === 'Import' && (
                <Handle type="target" position={Position.Left} style={{ left: -10, width: 10, height: 10 }} />
            )}
            <div
                data-tooltip-id={`tooltip-${data.id}`}
                style={{
                    width: nodeSize,
                    height: nodeSize,
                    borderRadius: '100%',
                    overflow: 'hidden',
                    border: data.nodeType === 'Export' ? '0px solid green' : '0px solid blue',
                    transform: `rotate(${rotation}deg) scale(${isHovered ? 1.2 : 1})`,
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    boxShadow: isHovered ? '0 0 20px 5px rgba(255, 255, 255, 0.7)' : 'none'
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Image
                    src={nodeImages[`${data.type}${data.nodeType}` as keyof typeof nodeImages]}
                    alt={`${data.type} ${data.nodeType}`}
                    width={200} height={200}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>
            <Tooltip id={`tooltip-${data.id}`} render={() => tooltipContent} />
            {floatingNumbers.map((num: any) => (
                <FloatingNumber 
                    key={num.id} 
                    id={num.id} 
                    value={num.value} 
                    efficiency={num.efficiency}
                    onComplete={removeFloatingNumber} 
                />
            ))}
        </>
    );
};
  
const initialNodes: Node<NodeData>[] = [
    {
        id: '1',
        type: 'custom',
        data: { label: 'Ore Export', type: 'Ore', nodeType: 'Export', id: '1', displayName: 'Ore', size: 'medium' },
        position: { x: 250, y: 25 },
    },
    {
        id: '2',
        type: 'custom',
        data: { label: 'Ore Import', type: 'Ore', nodeType: 'Import', id: '2', displayName: 'Ore Station', size: 'small' },
        position: { x: 250, y: 100 },
    },
    {
        id: '3',
        type: 'custom',
        data: { label: 'Fuel Export', type: 'Fuel', nodeType: 'Export', id: '3', displayName: 'Fuel', size: 'large' },
        position: { x: 150, y: 25 },
    },
    {
        id: '4',
        type: 'custom',
        data: { label: 'Fuel Import', type: 'Fuel', nodeType: 'Import', id: '4', displayName: 'Fuel Station', size: 'small' },
        position: { x: 150, y: 100 },
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

const GRID_SIZE = 12;
const NODE_SIZE = 50;

const checkNodeCollision = (node: Node, otherNodes: Node[]): boolean => {
    for (let otherNode of otherNodes) {
        if (node.id !== otherNode.id) {
            const dx = Math.abs(node.position.x - otherNode.position.x);
            const dy = Math.abs(node.position.y - otherNode.position.y);
            if (dx < NODE_SIZE && dy < NODE_SIZE) {
                return true; // มีการชนกัน
            }
        }
    }
    return false; // ไม่มีการชนกัน
};

const findValidPosition = (node: Node, otherNodes: Node[]): { x: number; y: number } => {
    const originalPosition = { ...node.position };
    const directions = [
        { x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 },
        { x: 1, y: 1 }, { x: 1, y: -1 }, { x: -1, y: 1 }, { x: -1, y: -1 }
    ];
  
    let distance = GRID_SIZE;
    while (distance < Math.max(window.innerWidth, window.innerHeight)) {
        for (let direction of directions) {
            const newPosition = snapToGrid({
                x: originalPosition.x + direction.x * distance,
                y: originalPosition.y + direction.y * distance
            });
            const newNode = { ...node, position: newPosition };
            if (!checkNodeCollision(newNode, otherNodes)) {
                return newPosition;
            }
        }
        distance += GRID_SIZE;
    }
  
    return originalPosition; // ถ้าไม่พบตำแหน่งที่เหมาะสม ให้คงตำแหน่งเดิม
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
  
    // คำนวณจุดตัดของเส้นตรงสองเส้น
    const det = (x2 - x1) * (y4 - y3) - (x4 - x3) * (y2 - y1);
    if (det === 0) return false; // เส้นขนานกัน
  
    const t = ((x3 - x1) * (y4 - y3) - (x4 - x3) * (y3 - y1)) / det;
    const u = -((x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1)) / det;
  
    // ตรวจสอบว่าจุดตัดอยู่บนทั้งสองเส้นหรือไม่
    return (t >= 0 && t <= 1 && u >= 0 && u <= 1);
};

const GameplayScreen = () => {
    const [ nodes, setNodes, onNodesChange ] = useNodesState<any>(initialNodes);
    const [ edges, setEdges ] = useEdgesState<any>(initialEdges);
    const [ nodeIdCounter, setNodeIdCounter ] = useState(5);

    const calculateEfficiency = useCallback((nodeId: string): number => {
        const connectedEdges = edges.filter(edge => edge.target === nodeId);
        if (connectedEdges.length === 0) return 100;
        const avgTrafficLevel = connectedEdges.reduce((sum, edge) => sum + (edge.data?.trafficLevel || 0), 0) / connectedEdges.length;
        return Math.max(0, 100 - avgTrafficLevel * 20);
    }, [edges]);

    const getConnectedEdgesCount = useCallback((nodeId: string): number => {
        return edges.filter(edge => edge.target === nodeId).length;
    }, [edges]);

    const calculateTraffic = useCallback((edges: Edge<EdgeData>[], nodes: Node<NodeData>[]): Edge<EdgeData>[] => {
        if (!edges || !nodes) return [];  // เพิ่มการตรวจสอบนี้
      
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

    const onConnect = useCallback((params: any) => {
        const sourceNode = nodes.find(node => node.id === params.source);
        const targetNode = nodes.find(node => node.id === params.target);
        
        if (!sourceNode || !targetNode) {
          console.error('Source or target node not found');
          return;
        }
        
        if (sourceNode.data.type === targetNode.data.type &&
            sourceNode.data.nodeType === 'Export' &&
            targetNode.data.nodeType === 'Import') {
            // Check if export node already has an edge
            const existingEdge = edges.find(edge => edge.source === sourceNode.id);
            if (existingEdge && sourceNode.data.nodeType === 'Export') {
                alert('Export node can only have one connection.');
                return;
            }
  
            const newEdge = { 
                ...params, 
                type: 'custom',
                data: { trafficLevel: 0 }
            };

            setEdges((eds) => {
                const newEdges = addEdge(newEdge, eds);
                const updatedEdges = calculateTraffic(newEdges, nodes);
                
                // Update nodes with new connected edges count
                setNodes((nds) =>
                nds.map((node) =>
                    node.id === targetNode.id
                    ? { ...node, data: { ...node.data, isConnected: true, connectedEdgesCount: getConnectedEdgesCount(node.id) + 1 } }
                    : node
                )
                );
                
                return updatedEdges;
            });
  
            // Update the isConnected property for the target (Import) node
            setNodes((nds) =>
                nds.map((node) =>
                node.id === targetNode.id
                    ? { ...node, data: { ...node.data, isConnected: true } }
                    : node
                )
            );
        } else {
            alert('Invalid connection. You can only connect Export to Import of the same resource type.');
        }
    }, [nodes, edges, setEdges, calculateTraffic, setNodes, getConnectedEdgesCount]);

    const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge<EdgeData>) => {
        event.preventDefault();
        const isConfirmed = window.confirm("คุณต้องการลบการเชื่อมต่อนี้ใช่หรือไม่?");
        if (isConfirmed) {
            setEdges((eds) => eds.filter((e) => e.id !== edge.id));
        }
    }, [setEdges]);

    const onEdgeDelete: any = useCallback((edgeId: string) => {
        const edge = edges.find((e) => e.id === edgeId);
        if (edge) {
            setNodes((nds) =>
                nds.map((node) =>
                node.id === edge.target
                    ? { 
                        ...node, 
                        data: { 
                        ...node.data, 
                        isConnected: getConnectedEdgesCount(node.id) > 1,
                        connectedEdgesCount: Math.max(0, getConnectedEdgesCount(node.id) - 1)
                        } 
                    }
                    : node
                )
            );
        }
        setEdges((eds) => eds.filter((e) => e.id !== edgeId));
    }, [edges, setEdges, setNodes, getConnectedEdgesCount]);

    const onEdgesChange = useCallback((changes: any) => {
        setEdges((eds) => {
            const updatedEdges = [...eds];
            changes.forEach((change: any) => {
                const index = updatedEdges.findIndex((e) => e.id === change.id);
                if (index !== -1) {
                    updatedEdges[index] = { ...updatedEdges[index], ...change };
                }
            });
            return calculateTraffic(updatedEdges, nodes);
        });
    }, [setEdges, calculateTraffic, nodes]);

    const edgeTypes = {
        custom: (props: any) => <CustomEdge {...props} onDelete={onEdgeDelete} />
    };

    useEffect(() => {
        setEdges((eds) => calculateTraffic(eds, nodes));
    }, [nodes, setEdges, calculateTraffic]);

    const addRandomNode = () => {
        const type = resourceTypes[Math.floor(Math.random() * resourceTypes.length)];
        const nodeType = Math.random() > 0.5 ? 'Export' : 'Import';
        const size = ['small', 'medium', 'large'][Math.floor(Math.random() * 3)] as 'small' | 'medium' | 'large';
        let position;
        let attempts = 0;
        const maxAttempts = 100; // ป้องกันการวนลูปไม่สิ้นสุด
    
        do {
            position = snapToGrid({
                x: Math.random() * (window.innerWidth - 100),
                y: Math.random() * (window.innerHeight - 100),
            });
        
            const newNodeId = String(nodeIdCounter);
            const displayName = nodeDisplayNames[`${type}${nodeType}`];
            
            const newNode: Node<NodeData> = {
                id: newNodeId,
                type: 'custom',
                data: { 
                    label: `${type} ${nodeType}`, 
                    type, 
                    nodeType, 
                    id: newNodeId,
                    displayName: displayName,
                    size: size
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

    const nodeTypes = {
        custom: (props: any) => (
            <CustomNode
                {...props}
                isConnected={getConnectedEdgesCount(props.id) > 0}
                connectedEdgesCount={getConnectedEdgesCount(props.id)}
                efficiency={calculateEfficiency(props.id)}
            />
        )
    };

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
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
                        nodesDraggable={false}
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onEdgeClick={onEdgeClick}
                        onEdgesDelete={onEdgeDelete}
                        nodeTypes={nodeTypes}
                        edgeTypes={edgeTypes}
                        defaultEdgeOptions={{ type: 'custom', animated: true }}
                        connectionLineType={ConnectionLineType.SmoothStep}
                        multiSelectionKeyCode={null}
                        selectionKeyCode={null}
                    >
                        <Controls showInteractive={false} />
                        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                    </ReactFlow>
                </div>
            </div>
            <Panel />
            <div style={{ position: 'absolute', left: 10, top: 10, zIndex: 30 }}>
                <button onClick={addRandomNode} className='bg-white text-black px-2'>Add Random Node</button>
            </div>
        </div>
    );
};

export default GameplayScreen;