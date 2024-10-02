import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

import HeaderText from '@/components/(element)/HeaderText';

interface ShipCardProps {
    ship: {
        name: string;
        type: string;
        image: string;
        description: string;
    };
    index: number;
};

const ShipCard = ({ ship, index }: ShipCardProps) => (
    <motion.div 
        className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
    >
        <div className="relative h-48">
            <Image
                src={ship.image}
                alt={ship.name}
                width={650}
                height={429}
                draggable={false}
            />
        </div>
        <div className="p-4">
            <h3 className="text-xl font-bold mb-2 text-white">{ship.name}</h3>
            <p className="text-purple-400 mb-2">Type: {ship.type}</p>
            <p className="text-sm text-gray-300">{ship.description}</p>
        </div>
    </motion.div>
);

const PlanetNft = () => {
    const ships = [
        {
            name: "Stellar Voyager",
            type: "Explorer",
            image: "/assets/website/ship1.png",
            description: "The Stellar Voyager is a sleek, long-range exploration vessel designed for deep space missions. Its advanced sensors and adaptive shielding make it perfect for charting unknown territories and surviving harsh cosmic environments."
        },
        {
            name: "Nova Defender",
            type: "Combat",
            image: "/assets/website/ship2.png",
            description: "Built for interstellar warfare, the Nova Defender boasts cutting-edge weapon systems and impenetrable armor. Its agile design allows for quick maneuvers in the heat of battle, making it a formidable force in any space conflict."
        },
        {
            name: "Cosmic Harvester",
            type: "Resource Gatherer",
            image: "/assets/website/ship3.png",
            description: "The Cosmic Harvester is an engineering marvel, equipped with state-of-the-art resource extraction technology. Its expansive cargo holds and efficient propulsion systems make it ideal for long-term mining operations in resource-rich asteroid fields."
        }
    ];

    return (
        <section className="py-20 px-4 bg-gray-900">
            <div className="max-w-6xl mx-auto">
                <HeaderText title={'Planet NFTs'} />
                <motion.p 
                    className="text-lg mb-12 text-center text-gray-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    Explore our unique collection of planet, each with its own history and many attributes.
                </motion.p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {ships.map((ship, index) => (
                        <ShipCard key={ship.name} ship={ship} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PlanetNft;