import { motion } from "framer-motion";

interface EmptyStateProps {
  searchQuery: string;
  clearSearch: () => void;
}

export default function EmptyState({ searchQuery, clearSearch }: EmptyStateProps) {
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
      <h3 className="text-xl font-medium text-gray-800 mb-1">No upcoming releases found</h3>
      <p className="text-gray-600 text-center">
        {searchQuery 
          ? 'Geen releases gevonden die voldoen aan je zoekopdracht. Probeer een ander woord of filter.' 
          : 'Er zijn geen komende releases gepland op dit moment.'}
      </p>
      
      {searchQuery && (
        <button 
          onClick={clearSearch}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-all"
        >
          Clear Search
        </button>
      )}
    </motion.div>
  );
} 