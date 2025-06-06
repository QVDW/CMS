import { motion } from "framer-motion";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  handlePageChange: (pageNumber: number) => void;
}

export default function Pagination({ currentPage, totalPages, handlePageChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  
  return (
    <motion.div 
      className="flex justify-center items-center mt-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      <button 
        onClick={() => handlePageChange(currentPage - 1)} 
        disabled={currentPage === 1}
        className="flex items-center px-4 py-2 rounded-lg mr-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-gray-100 text-gray-800 hover:bg-gray-200"
      >
        <FaAngleLeft className="mr-1" /> Previous
      </button>
      
      <div className="flex items-center space-x-1 mx-2">
        {(() => {
          const pageButtons = [];
          
          if (totalPages > 0) {
            pageButtons.push(
              <button
                key={1}
                onClick={() => handlePageChange(1)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                  currentPage === 1 
                    ? 'bg-accent text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                1
              </button>
            );
          }
          
          if (currentPage > 3) {
            pageButtons.push(
              <span key="ellipsis-start" className="w-10 h-10 flex items-center justify-center text-gray-500">
                ...
              </span>
            );
          }
          
          const startPage = Math.max(2, currentPage - 1);
          const endPage = Math.min(totalPages - 1, currentPage + 1);
          
          for (let i = startPage; i <= endPage; i++) {
            pageButtons.push(
              <button
                key={i}
                onClick={() => handlePageChange(i)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                  currentPage === i 
                    ? 'bg-accent text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {i}
              </button>
            );
          }
          
          if (currentPage < totalPages - 2) {
            pageButtons.push(
              <span key="ellipsis-end" className="w-10 h-10 flex items-center justify-center text-gray-500">
                ...
              </span>
            );
          }
          
          if (totalPages > 1) {
            pageButtons.push(
              <button
                key={totalPages}
                onClick={() => handlePageChange(totalPages)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                  currentPage === totalPages 
                    ? 'bg-accent text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {totalPages}
              </button>
            );
          }
          
          return pageButtons;
        })()}
      </div>
      
      <button 
        onClick={() => handlePageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
        className="flex items-center px-4 py-2 rounded-lg ml-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-gray-100 text-gray-800 hover:bg-gray-200"
      >
        Next <FaAngleRight className="ml-1" />
      </button>
    </motion.div>
  );
} 