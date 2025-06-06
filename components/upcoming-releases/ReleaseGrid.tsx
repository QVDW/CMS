import { motion, AnimatePresence } from "framer-motion";
import ReleaseCard from "./ReleaseCard";

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

interface ReleaseGridProps {
  items: Item[];
  currentPage: number;
}

export default function ReleaseGrid({ items, currentPage }: ReleaseGridProps) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.08,
        delayChildren: 0.1,
        staggerDirection: 1
      }
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      key={currentPage}
    >
      <AnimatePresence>
        {items.map((item, index) => (
          <ReleaseCard key={item._id} item={item} index={index} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
} 