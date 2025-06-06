import { motion } from "framer-motion";
import { FaFilter } from "react-icons/fa";

interface FilterBarProps {
  isFilterOpen: boolean;
  setIsFilterOpen: (isOpen: boolean) => void;
  filteredItemsCount: number;
  selectedCategory: string;
  sortOrder: 'soonest' | 'latest' | 'alphabetical';
  handleSortChange: (order: 'soonest' | 'latest' | 'alphabetical') => void;
  categories: string[];
  handleCategoryChange: (category: string) => void;
}

export default function FilterBar({
  isFilterOpen,
  setIsFilterOpen,
  filteredItemsCount,
  selectedCategory,
  sortOrder,
  handleSortChange,
  categories,
  handleCategoryChange
}: FilterBarProps) {
  // Animation variants
  const filterVariants = {
    closed: { height: 0, opacity: 0, overflow: 'hidden' },
    open: { 
      height: 'auto', 
      opacity: 1,
      transition: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }
    }
  };

  return (
    <div className="w-full bg-white/90 backdrop-blur-lg py-6 sticky top-0 z-20 border-t border-b border-blue-100 shadow-sm">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-3 md:gap-4 justify-between items-center">
          <div className="flex gap-2 items-center">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 py-2 px-4 bg-accent hover:bg-accent text-white rounded-lg transition-all"
            >
              <FaFilter /> Filters
            </button>
            
            <div className="flex flex-col items-start">
              <span className="text-xs text-gray-600">
                {filteredItemsCount} {filteredItemsCount === 1 ? 'release' : 'releases'} found
              </span>
              {selectedCategory !== "All" && (
                <span className="text-xs text-blue-600">
                  Category: {selectedCategory}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => handleSortChange('soonest')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                sortOrder === 'soonest' 
                  ? 'bg-accent text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Soonest
            </button>
            <button 
              onClick={() => handleSortChange('latest')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                sortOrder === 'latest' 
                  ? 'bg-accent text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Latest
            </button>
            <button 
              onClick={() => handleSortChange('alphabetical')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                sortOrder === 'alphabetical' 
                  ? 'bg-accent text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              A-Z
            </button>
          </div>
        </div>
        
        <motion.div
          variants={filterVariants}
          initial="closed"
          animate={isFilterOpen ? "open" : "closed"}
          className="overflow-hidden"
        >
          <div className="py-4 border-gray-200">
            <h3 className="text-gray-800 text-lg mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? 'bg-accent text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 