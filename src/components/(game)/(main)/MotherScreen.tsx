import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/useStore';
import { FaArrowLeft } from 'react-icons/fa';

const menuItems = [
  { id: 'own', title: 'Own Planet', icon: '🌍', state: 'own' },
  { id: 'other', title: 'Other Planet', icon: '🪐', state: 'other' },
  { id: 'buy', title: 'Buy Planet', icon: '🛒', state: 'buy' },
  { id: 'market', title: 'Marketplace', icon: '🏪', state: 'market' },
];

const OwnPlanet = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="bg-indigo-800 rounded-lg p-6 mt-8 w-full max-w-4xl max-h-[400px] overflow-y-auto"
  >
    <h2 className="text-2xl font-bold mb-4">Your NFT Planets</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((planet) => (
        <div key={planet} className="bg-indigo-700 rounded-lg p-4 flex flex-col items-center">
          <div className="w-32 h-32 bg-indigo-500 rounded-full mb-4 flex items-center justify-center text-5xl">
            🌎
          </div>
          <p className="text-lg font-semibold">Your Planet #{planet}</p>
        </div>
      ))}
    </div>
  </motion.div>
);

const OtherPlanet = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="bg-indigo-800 rounded-lg p-6 mt-8 w-full max-w-4xl max-h-[400px] overflow-y-auto"
  >
    <h2 className="text-2xl font-bold mb-4">Other Players' Planets</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((planet) => (
        <div key={planet} className="bg-indigo-700 rounded-lg p-4 flex flex-col items-center">
          <div className="w-32 h-32 bg-indigo-500 rounded-full mb-4 flex items-center justify-center text-5xl">
            🪐
          </div>
          <p className="text-lg font-semibold mb-2">Planet #{planet}</p>
          <p className="text-sm text-indigo-300">Owned by Player{planet}</p>
        </div>
      ))}
    </div>
  </motion.div>
);

const BuyPlanet = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="bg-indigo-800 rounded-lg p-6 mt-8 w-full max-w-4xl max-h-[400px] overflow-y-auto"
  >
    <h2 className="text-2xl font-bold mb-4">Buy New Planet</h2>
    <div className="flex flex-col items-center bg-indigo-700 rounded-lg p-6">
      <div className="w-32 h-32 bg-indigo-500 rounded-full mb-4 flex items-center justify-center text-7xl">
        🌎
      </div>
      <p className="text-2xl font-semibold mb-2">Exclusive New Planet</p>
      <p className="text-xl mb-4">Price: 1000 ETH</p>
      <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-xl transition duration-300">
        Buy Now
      </button>
    </div>
  </motion.div>
);

const Marketplace = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="bg-indigo-800 rounded-lg p-6 mt-8 w-full max-w-4xl max-h-[400px] overflow-y-auto"
  >
    <h2 className="text-2xl font-bold mb-4">NFT Marketplace</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-indigo-700 rounded-lg">
        <thead>
          <tr>
            <th className="px-4 py-2">Image</th>
            <th className="px-4 py-2">Planet</th>
            <th className="px-4 py-2">Owner</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3].map((item) => (
            <tr key={item} className="border-t border-indigo-600">
              <td className="px-4 py-2">
                <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-2xl">
                  🪐
                </div>
              </td>
              <td className="px-4 py-2">Planet #{item}</td>
              <td className="px-4 py-2">Owner{item}</td>
              <td className="px-4 py-2">{item * 100} ETH</td>
              <td className="px-4 py-2">
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded transition duration-300">
                  Buy
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
);

const MotherScreen = () => {
  const [menuState, setMenuState] = useState(null);
  const { setGameMenu } = useGameStore();

  return (
  <div className='flex w-full min-h-screen absolute z-100'>
    <div className="flex flex-col items-center justify-start w-full min-h-screen bg-gradient-to-b from-indigo-900 to-black text-white p-4 overflow-x-hidden relative">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute top-4 left-4 bg-gray-300 text-gray-800 p-2 rounded-full hover:bg-gray-400 transition duration-300"
        onClick={() => setGameMenu('game')}
      >
        <FaArrowLeft size={24} />
      </motion.button>
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-6xl font-bold mb-8 text-center mt-12"
      >
        Spaceship Menu
      </motion.h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-4xl">
        {menuItems.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`bg-indigo-800 rounded-lg shadow-lg overflow-hidden cursor-pointer ${
              menuState === item.state ? 'ring-4 ring-blue-400' : ''
            }`}
            onClick={() => setMenuState(item.state as any)}
          >
            <div className="p-4 flex flex-col items-center">
              <span className="text-4xl mb-2">{item.icon}</span>
              <h2 className="text-sm font-semibold text-center">{item.title}</h2>
            </div>
          </motion.div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {menuState === 'own' && <OwnPlanet key="own" />}
        {menuState === 'other' && <OtherPlanet key="other" />}
        {menuState === 'buy' && <BuyPlanet key="buy" />}
        {menuState === 'market' && <Marketplace key="market" />}
      </AnimatePresence>
    </div>
  </div>
  );
};

export default MotherScreen;