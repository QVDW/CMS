"use client";

import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import FeaturedCarousel from "../../components/FeaturedCarousel";
import CollabSection from "../../components/CollabSection";
import { getApiUrl } from "../utils/apiConfig";

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

// Calculate days until release
const getDaysUntilRelease = (releaseDate: string | Date): string => {
  const now = new Date();
  const release = new Date(releaseDate);
  const diffTime = release.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 0) return "Just Released!";
  if (diffDays === 1) return "Tomorrow!";
  return `${diffDays} days`;
};

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [collabs, setCollabs] = useState<Collab[]>([]);
  const [featuredCollabs, setFeaturedCollabs] = useState<Collab[]>([]);
  const [newCollabs, setNewCollabs] = useState<Collab[]>([]);
  const [upcomingCollabs, setUpcomingCollabs] = useState<Collab[]>([]);
  
  // Fetch collaboration data
  useEffect(() => {
    const fetchCollabs = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(getApiUrl('/api/items'), {
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error('Failed to fetch collaborations');
        }
        
        const data = await res.json();
        const collabData = Array.isArray(data) ? data : data?.items || [];
        
        const currentDate = new Date();
        
        // Filter and sort by different criteria
        const featured = collabData.filter((collab: Collab) => collab.isFeatured && collab.isActive);
        
        const released = collabData.filter((collab: Collab) => {
          if (!collab.isActive) return false;
          if (!collab.releaseDate) return true;
          const releaseDate = new Date(collab.releaseDate);
          return releaseDate <= currentDate;
        }).sort((a: Collab, b: Collab) => {
          if (a.releaseDate && b.releaseDate) {
            return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
          }
          return 0;
        });
        
        const upcoming = collabData.filter((collab: Collab) => {
          if (!collab.isActive) return false;
          if (!collab.releaseDate) return false;
          const releaseDate = new Date(collab.releaseDate);
          return releaseDate > currentDate;
        }).sort((a: Collab, b: Collab) => {
          if (a.releaseDate && b.releaseDate) {
            return new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
          }
          return 0;
        });
        
        setCollabs(collabData);
        setFeaturedCollabs(featured);
        setNewCollabs(released.slice(0, 8));
        setUpcomingCollabs(upcoming.slice(0, 8));
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching collabs:', error);
        setIsLoading(false);
      }
    };
    
    fetchCollabs();
  }, []);

  return (
    <div 
      className="collab-tracker-home"
      data-total-collabs={collabs.length}
    >
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      
      {/* Featured Collaborations Carousel */}
      <FeaturedCarousel featuredCollabs={featuredCollabs} isLoading={isLoading} />
      
      {/* Newly Released Collaborations */}
      <CollabSection 
        title="Newly Released"
        collabs={newCollabs}
        type="new"
        viewAllLink="/collabs"
        getBadgeText={() => "New Release"}
        datePrefix="Released: "
        isLoading={isLoading}
      />
      
      {/* Upcoming Collaborations */}
      <CollabSection 
        title="Upcoming Collaborations"
        collabs={upcomingCollabs}
        type="upcoming"
        viewAllLink="/upcoming-releases"
        getBadgeText={(collab) => collab.releaseDate ? getDaysUntilRelease(collab.releaseDate) : ""}
        datePrefix="Coming: "
        isLoading={isLoading}
      />
      
      <Footer />
    </div>
  );
}