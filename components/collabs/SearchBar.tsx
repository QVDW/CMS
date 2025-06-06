import { ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import { CiSearch } from "react-icons/ci";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export default function SearchBar({ searchQuery, onSearchChange, onSearchSubmit }: SearchBarProps) {
  return (
    <motion.div 
      className="w-full max-w-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <form onSubmit={onSearchSubmit} className="relative">
        <input 
          type="text" 
          placeholder="Zoek naar merk, item of beschrijving..." 
          value={searchQuery}
          onChange={onSearchChange}
          className="w-full px-5 py-4 rounded-xl border-2 border-primary bg-white/90 text-gray-800 backdrop-blur-sm 
            placeholder:text-gray-500 focus:ring-4 focus:ring-blue-300/30 focus:border-primary transition-all text-lg"
        />
        <button type="submit" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-600 text-2xl">
          <CiSearch />
        </button>
      </form>
    </motion.div>
  );
} 