import { motion } from "framer-motion";
import CollabCard from "./CollabCard";
import Loader from "./Loader";

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

interface CollabSectionProps {
  title: string;
  collabs: Collab[];
  type: 'new' | 'upcoming';
  viewAllLink: string;
  getBadgeText?: (collab: Collab) => string;
  datePrefix?: string;
  isLoading?: boolean;
}

export default function CollabSection({ 
  title, 
  collabs, 
  type, 
  viewAllLink, 
  getBadgeText, 
  datePrefix,
  isLoading = false
}: CollabSectionProps) {
  return (
    <section className={`section-container ${type === 'upcoming' ? 'upcoming-section' : ''}`}>
      <motion.div 
        className="section-header"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2>{title}</h2>
        <a href={viewAllLink} className="view-all">View All</a>
      </motion.div>
      
      <div className="collab-grid">
        {isLoading ? (
          <div className="loader-container" style={{ width: "100%", minHeight: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Loader size="medium" text={`Loading ${type === 'upcoming' ? 'upcoming' : 'recent'} collaborations...`} />
          </div>
        ) : collabs.length > 0 ? (
          collabs.map((collab, index) => (
            <CollabCard 
              key={collab._id}
              collab={collab}
              index={index}
              type={type}
              badgeText={getBadgeText ? getBadgeText(collab) : undefined}
              datePrefix={datePrefix}
            />
          ))
        ) : (
          <p className="no-items">No {type === 'upcoming' ? 'upcoming' : 'recent'} collaborations found</p>
        )}
      </div>
    </section>
  );
} 