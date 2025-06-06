import { motion } from "framer-motion";
import { FaCalendarAlt, FaFire } from "react-icons/fa";
import { getImageUrl } from "../../src/utils/apiConfig";
import { formatDate, getRandomGradient, isNewRelease } from "./utils";

export interface Item {
  _id: string;
  name: string;
  description?: string;
  brands?: string[];
  category?: string;
  tags?: string[];
  image?: string;
  link?: string;
  releaseDate?: string | Date;
  isFeatured?: boolean;
  isActive?: boolean;
  created_at?: string | Date;
  updated_at?: string | Date;
}

interface CollabCardProps {
  item: Item;
  index: number;
}

export default function CollabCard({ item, index }: CollabCardProps) {
  // Check if this is a "new" release (within last 14 days)
  const isNew = isNewRelease(item.releaseDate);
  
  return (
    <motion.div
      key={item._id}
      className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200 h-full"
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: { 
          y: 0, 
          opacity: 1,
          transition: { duration: 0.4 }
        },
        hover: {
          y: -10,
          scale: 1.02,
          boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)",
          transition: { duration: 0.3 }
        }
      }}
      whileHover="hover"
    >
      <div className="group relative">
        <div 
          className="h-72 bg-cover bg-center" 
          style={{ 
            backgroundImage: item.image 
              ? `url(${getImageUrl(item.image)})` 
              : getRandomGradient(index)
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-gray-800/70 via-gray-800/30 to-transparent group-hover:opacity-70 transition-opacity"></div>
          
          {isNew && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
              <FaFire className="mr-1" /> New Release
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            {item.description && (
              <p className="text-white text-sm line-clamp-3 mb-3 drop-shadow-md">
                {item.description}
              </p>
            )}
            
            {item.link && (
              <motion.a 
                href={`${item.link}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-primary hover:bg-secondary text-white font-semibold py-2 px-4 rounded-lg transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Collab
              </motion.a>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 min-h-[3.5rem]">{item.name}</h2>
        
        {item.brands && item.brands.length > 0 && (
          <p className="text-sm text-blue-600 mb-3 font-medium">
            {item.brands.join(' × ')}
          </p>
        )}
        
        {item.releaseDate && (
          <div className="flex items-center text-gray-600 text-sm mb-3">
            <FaCalendarAlt className="mr-2 text-gray-500" />
            <span>{formatDate(item.releaseDate)}</span>
          </div>
        )}
        
        {item.category && (
          <div className="mt-3 mb-1">
            <span className="inline-block bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-xs">
              {item.category}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
} 