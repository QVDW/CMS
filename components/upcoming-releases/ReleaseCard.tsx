import { motion } from "framer-motion";
import { FaCalendarAlt, FaHourglassHalf } from "react-icons/fa";
import { getImageUrl } from "../../src/utils/apiConfig";

interface Item {
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
}

interface ReleaseCardProps {
  item: Item;
  index: number;
}

export default function ReleaseCard({ item, index }: ReleaseCardProps) {
  // Animation variants
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4 }
    },
    exit: {
      y: 20,
      opacity: 0,
      transition: { duration: 0.3 }
    },
    hover: {
      y: -10,
      scale: 1.02,
      boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)",
      transition: { duration: 0.3 }
    }
  };

  // Helper functions
  const formatReleaseDate = (dateString: string | Date): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getDaysUntilRelease = (releaseDate: string | Date): string => {
    const now = new Date();
    const release = new Date(releaseDate);
    const diffTime = release.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today!";
    if (diffDays === 1) return "Tomorrow!";
    return `${diffDays} days`;
  };

  // Get random gradient for items without images
  const getRandomGradient = (index: number) => {
    const gradients = [
      'linear-gradient(to right, #ff9966, #ff5e62)',
      'linear-gradient(to right, #4facfe, #00f2fe)',
      'linear-gradient(to right, #43e97b, #38f9d7)',
      'linear-gradient(to right, #fa709a, #fee140)',
      'linear-gradient(to right, #6a11cb, #2575fc)',
      'linear-gradient(to right, #fc5c7d, #6a82fb)',
      'linear-gradient(to right, #00c6fb, #005bea)',
      'linear-gradient(to right, #f83600, #f9d423)'
    ];
    
    return gradients[index % gradients.length];
  };

  // Get background color based on release proximity
  const getCountdownColor = (days: number): string => {
    if (days <= 3) return "bg-red-500";
    if (days <= 7) return "bg-orange-500"; 
    if (days <= 14) return "bg-amber-500";
    return "bg-green-500";
  };

  if (!item) return null;

  const daysUntil = item.releaseDate ? parseInt(getDaysUntilRelease(item.releaseDate).split(' ')[0]) : 0;
  const countdownColor = item.releaseDate ? getCountdownColor(daysUntil) : "bg-gray-500";
  const isComingSoon = daysUntil !== undefined && daysUntil <= 7;

  return (
    <motion.div
      className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200 h-full"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
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
          
          {isComingSoon && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
              <FaHourglassHalf className="mr-1" /> Coming Soon!
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
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Preview Collab
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
          <div className="flex flex-col gap-1 mb-3">
            <div className="flex items-center text-gray-600 text-sm">
              <FaCalendarAlt className="mr-2 text-gray-500" />
              <span>{formatReleaseDate(item.releaseDate)}</span>
            </div>
            
            <div className="flex items-center mt-1">
              <span className={`${countdownColor} text-white text-xs px-2 py-0.5 rounded-full font-medium`}>
                {getDaysUntilRelease(item.releaseDate)}
              </span>
            </div>
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