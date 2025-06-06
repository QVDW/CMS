import { motion } from "framer-motion";
import { getImageUrl } from "../src/utils/apiConfig";

// Interface for collaboration items
interface Collab {
  _id: string;
  name: string;
  description: string;
  brands: string[];
  category?: string;
  tags?: string[];
  image?: string;
  link?: string;
  releaseDate?: string | Date;
  isFeatured: boolean;
  isActive: boolean;
  created_at?: string | Date;
  updated_at?: string | Date;
}

interface CollabCardProps {
  collab: Collab;
  index: number;
  type: 'new' | 'upcoming';
  badgeText?: string;
  datePrefix?: string;
}

// Format date for display
const formatDate = (dateString: string | Date): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  });
};

export default function CollabCard({ collab, index, type, badgeText, datePrefix = "Released: " }: CollabCardProps) {
  return (
    <motion.div 
      key={collab._id}
      className={`collab-card ${type === 'upcoming' ? 'upcoming' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -10, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)' }}
    >
      <div className="card-image" style={{ 
        backgroundImage: collab.image ? `url(${getImageUrl(collab.image)})` : 'none' 
      }}>
        {badgeText && collab.releaseDate && (
          <div className={type === 'upcoming' ? "countdown-badge" : "release-badge new"}>
            {type === 'upcoming' ? <div className="days">{badgeText}</div> : badgeText}
          </div>
        )}
      </div>
      <div className="card-content">
        <h3>{collab.name}</h3>
        {collab.brands && (
          <p className="brands">{collab.brands.join(' × ')}</p>
        )}
        {collab.releaseDate && (
          <p className="release-date">{datePrefix}{formatDate(collab.releaseDate)}</p>
        )}
        {collab.link && (
          <motion.a 
            href={collab.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="card-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Details
          </motion.a>
        )}
      </div>
    </motion.div>
  );
} 