import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Handle, Position } from '@xyflow/react';
import { Tooltip } from 'react-tooltip';

const resourceTypes = ['Ore', 'Fuel', 'Food', 'Connector'];

type ResourceType = typeof resourceTypes[number] | 'Spaceship';
type NodeType = 'Export' | 'Import' | 'Connector' | 'Spaceship';

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

interface CustomNodeProps {
    data: NodeData;
    isConnected: boolean;
    connectedEdgesCount: number;
    efficiency: number;
    updateNodeData: (id: string, newData: Partial<NodeData>) => void;
}

const nodeImages = {
    OreExport: '/assets/images/node-ore.webp',
    OreImport: '/assets/images/ore-station.webp',
    FuelExport: '/assets/images/node-fuel.webp',
    FuelImport: '/assets/images/fuel-station.webp',
    FoodExport: '/assets/images/node-food.webp',
    FoodImport: '/assets/images/food-station.webp',
    ConnectorConnector: '/assets/images/connector-station.webp',
    SpaceshipSpaceship: '/assets/images/spaceship.webp'
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

const CustomNode: React.FC<CustomNodeProps> = React.memo(({ data, isConnected, connectedEdgesCount, efficiency, updateNodeData }) => {
    const [ isHovered, setIsHovered ] = useState(false);
  
    useEffect(() => {
        if (data.nodeType === 'Import' && isConnected) {
            const interval = setInterval(() => {
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
        let Icon: string;
        switch(data.type) {
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
    }, [data.type]);
  
    const tooltipContent = useMemo(() => (
        <div>
            <p><strong>{data.nodeType === 'Export' ? '🔴' : '🟢'} {data.displayName} (# {data.id})</strong></p>
            <p className='flex'>Type: {iconProps.Icon !== '' && <Image src={`/assets/icons/resource-${iconProps.Icon}.svg`} alt={`icon-${iconProps.Icon}`} width={18} height={18} className='mx-1 w-[18px] h-[18px]' />} {data.type}</p>
            <p>Supply: {data.supply.toFixed(2)}/{data.maxSupply}</p>
            {data.nodeType === 'Connector' && data.connectedNodes && (
                <p>Connected Nodes: {data.connectedNodes.join(', ') || 'None'}</p>
            )}
        </div>
    ), [data, iconProps]);
  
    return (
        <>
            {data.nodeType === 'Spaceship' && Array.isArray(data.handlePositions.target) && data.handlePositions.target.map((position) => (
                <Handle 
                    key={position}
                    type='target' 
                    position={position} 
                    id={`${position}-handle`}
                    style={{ 
                        [position === Position.Left ? 'left' : position === Position.Right ? 'right' : '']: -10,
                        [position === Position.Top ? 'top' : position === Position.Bottom ? 'bottom' : '']: -10,
                        width: 10, 
                        height: 10 
                    }} 
                />
            ))}
            {(data.nodeType === 'Export' || data.nodeType === 'Connector') && (
                <Handle 
                    type='source' 
                    position={data.handlePositions.source || Position.Right} 
                    id={`${data.handlePositions.source || Position.Right}-handle`}
                    style={{ right: -10, width: 10, height: 10 }} 
                />
            )}
            {(data.nodeType === 'Import' || data.nodeType === 'Connector') && data.handlePositions.target && !Array.isArray(data.handlePositions.target) && (
                <Handle 
                    type='target' 
                    position={data.handlePositions.target} 
                    id={`${data.handlePositions.target}-handle`}
                    style={{ left: -10, width: 10, height: 10 }} 
                />
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
                    src={(data.imagePath || nodeImages[`${data.type}${data.nodeType}` as keyof typeof nodeImages]) as string}
                    alt={`${data.type} ${data.nodeType}`}
                    width={200}
                    height={200}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', padding: 5 }}
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

export default CustomNode;