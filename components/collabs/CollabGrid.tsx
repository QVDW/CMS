import { motion, AnimatePresence } from "framer-motion";
import CollabCard, { Item } from "./CollabCard";
import EmptyState from "./EmptyState";
import Loader from "./Loader";

interface CollabGridProps {
  items: Item[];
  loading: boolean;
  searchQuery: string;
  onResetSearch?: () => void;
}

export default function CollabGrid({ items, loading, searchQuery, onResetSearch }: CollabGridProps) {
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

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader size="large" text="Loading collabs..." />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState 
        searchQuery={searchQuery}
        onResetSearch={onResetSearch}
      />
    );
  }
  
  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <AnimatePresence>
        {items.map((item, index) => (
          <CollabCard 
            key={item._id} 
            item={item} 
            index={index} 
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
} 