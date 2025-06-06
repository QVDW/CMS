import { motion } from "framer-motion";

interface EmptyStateProps {
  searchQuery: string;
  onResetSearch?: () => void;
}

export default function EmptyState({ searchQuery, onResetSearch }: EmptyStateProps) {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-xl shadow-md p-10 border border-gray-200"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 className="text-xl font-medium text-gray-800 mb-1">Geen collabs gevonden</h3>
      <p className="text-gray-600 text-center">
        {searchQuery 
          ? 'Geen collabs voldoen aan je zoekcriteria. Probeer andere keywords of filters.' 
          : 'Er zijn geen uitgebrachte collabs momenteel beschikbaar.'}
      </p>
      
      {searchQuery && onResetSearch && (
        <button 
          onClick={onResetSearch}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-all"
        >
          Wissen Zoekopdracht
        </button>
      )}
    </motion.div>
  );
} 