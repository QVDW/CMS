import { motion } from "framer-motion";
import { getImageUrl } from "../../src/utils/apiConfig";
import SearchBar from "./SearchBar";
import { FormEvent, ChangeEvent } from "react";

interface PageHeaderProps {
  searchQuery: string;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export default function PageHeader({ searchQuery, onSearchChange, onSearchSubmit }: PageHeaderProps) {
  return (
    <div className="relative w-full flex justify-center overflow-hidden pt-12">
      <motion.div 
        className="absolute w-full h-64 md:h-80 lg:h-96 opacity-40 bg-cover bg-center blur-lg"
        style={{ 
          backgroundImage: `url(${getImageUrl('header-background.jpg')})`,
          backgroundPosition: 'center 30%'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1 }}
      />
      
      <div className="relative z-10 w-full max-w-7xl px-4 pt-12 pb-24 sm:px-6 lg:px-8 flex flex-col items-center">
        <motion.h1 
          className="text-5xl md:text-6xl lg:text-7xl font-bold pb-6 tracking-tight text-center bg-clip-text text-gray-700 bg-gradient-to-r from-blue-600 to-blue-400"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Upcoming Releases
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto text-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          Get ready for these exciting upcoming collaborations
        </motion.p>
        
        <SearchBar 
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onSearchSubmit={onSearchSubmit}
        />
      </div>
    </div>
  );
} 