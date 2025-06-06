import { useState, useEffect, useRef } from "react";
import { MdNavigateBefore, MdNavigateNext, MdCalendarToday } from "react-icons/md";
import { getImageUrl } from "../src/utils/apiConfig";
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

interface FeaturedCarouselProps {
  featuredCollabs: Collab[];
  isLoading?: boolean;
}

export default function FeaturedCarousel({ featuredCollabs, isLoading = false }: FeaturedCarouselProps) {
  const [leftButtonHover, setLeftButtonHover] = useState(false);
  const [rightButtonHover, setRightButtonHover] = useState(false);
  const [showFixedNav, setShowFixedNav] = useState(false);
  const [initialTop, setInitialTop] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);
  const featuredItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const autoSwipeTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updateNavPosition = () => {
      if (scrollContainerRef.current) {
        const rect = scrollContainerRef.current.getBoundingClientRect();
        if (rect.top < 0 && rect.bottom > 0) {
          setShowFixedNav(true);
          
          if (initialTop === null) {
            setInitialTop(rect.top);
          }
        } else {
          setShowFixedNav(false);
          setInitialTop(null);
        }
      }
    };

    // Run once initially
    updateNavPosition();
    
    // Add scroll listener
    window.addEventListener('scroll', updateNavPosition);
    
    // Add resize listener to update positions on window resize
    window.addEventListener('resize', updateNavPosition);
    
    return () => {
      window.removeEventListener('scroll', updateNavPosition);
      window.removeEventListener('resize', updateNavPosition);
    };
  }, [initialTop]);

  // Function to reset and restart the auto-swipe timer
  const resetAutoSwipeTimer = () => {
    if (autoSwipeTimerRef.current) {
      clearInterval(autoSwipeTimerRef.current);
    }
    
    if (featuredCollabs.length <= 1) return;
    
    autoSwipeTimerRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % featuredCollabs.length;
        return nextIndex;
      });
    }, 5000);
  };

  // Auto-swipe functionality
  useEffect(() => {
    resetAutoSwipeTimer();
    
    return () => {
      if (autoSwipeTimerRef.current) {
        clearInterval(autoSwipeTimerRef.current);
      }
    };
  }, [featuredCollabs.length]);

  // Effect to handle scrolling when currentIndex changes
  useEffect(() => {
    if (featuredCollabs.length <= 0) return;
    
    const targetElement = featuredItemsRef.current[currentIndex];
    
    if (targetElement && scrollContentRef.current) {
      // Instead of scrolling the whole page, only scroll the carousel content
      const scrollContainer = scrollContentRef.current;
      const itemOffsetLeft = targetElement.offsetLeft;
      
      scrollContainer.scrollTo({
        left: itemOffsetLeft,
        behavior: 'smooth'
      });
    }
  }, [currentIndex, featuredCollabs.length]);

  const handleScrollBefore = () => {
    if (featuredCollabs.length <= 1) return;
    
    setCurrentIndex((prevIndex) => {
      return prevIndex === 0 ? featuredCollabs.length - 1 : prevIndex - 1;
    });
    
    // Reset timer when manually navigating
    resetAutoSwipeTimer();
  };

  const handleScrollAfter = () => {
    if (featuredCollabs.length <= 1) return;
    
    setCurrentIndex((prevIndex) => {
      return (prevIndex + 1) % featuredCollabs.length;
    });
    
    // Reset timer when manually navigating
    resetAutoSwipeTimer();
  };

  return (
    <section className="featured-section">
      {isLoading ? (
        <div className="loader-container" style={{ minHeight: "400px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Loader size="large" text="Loading featured collaborations..." />
        </div>
      ) : (
        <>
          {/* Fixed navigation buttons that show when scrolling */}
          {showFixedNav && initialTop !== null && (
            <div className="fixed-nav-buttons" style={{
              position: 'fixed',
              zIndex: 9999,
              pointerEvents: 'none',
              left: 0,
              width: '100%',
              height: scrollContainerRef.current ? `${scrollContainerRef.current.offsetHeight}px` : '45vw',
              top: initialTop,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0 2rem'
            }}>
              <button 
                onClick={handleScrollBefore}
                onMouseEnter={() => setLeftButtonHover(true)}
                onMouseLeave={() => setLeftButtonHover(false)}
                style={{
                  width: '4rem',
                  height: '4rem',
                  backgroundColor: leftButtonHover ? 'rgb(0, 0, 0)' : 'rgba(32, 32, 32, 0.8)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  pointerEvents: 'auto',
                  transition: 'background-color 0.2s, transform 0.2s',
                  boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
                  transform: leftButtonHover ? 'scale(1.1)' : 'scale(1)'
                }}
              >
                <MdNavigateBefore style={{ width: '3rem', height: '3rem' }} />
              </button>
              <button 
                onClick={handleScrollAfter}
                onMouseEnter={() => setRightButtonHover(true)}
                onMouseLeave={() => setRightButtonHover(false)}
                style={{
                  width: '4rem',
                  height: '4rem',
                  backgroundColor: rightButtonHover ? 'rgb(0, 0, 0)' : 'rgba(32, 32, 32, 0.8)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  pointerEvents: 'auto',
                  transition: 'background-color 0.2s, transform 0.2s',
                  boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
                  transform: rightButtonHover ? 'scale(1.1)' : 'scale(1)'
                }}
              >
                <MdNavigateNext style={{ width: '3rem', height: '3rem' }} />
              </button>
            </div>
          )}
          
          <div className="content">
            <div id="featured-items" ref={scrollContainerRef}>
              {/* Always visible controls */}
              <div className="carousel-controls" style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 2rem',
                pointerEvents: 'none',
                zIndex: 5
              }}>
                <button 
                  onClick={handleScrollBefore}
                  onMouseEnter={() => setLeftButtonHover(true)}
                  onMouseLeave={() => setLeftButtonHover(false)}
                  style={{
                    width: '4rem',
                    height: '4rem',
                    backgroundColor: leftButtonHover ? 'rgb(0, 0, 0)' : 'rgba(32, 32, 32, 0.8)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    pointerEvents: 'auto',
                    transition: 'background-color 0.2s, transform 0.2s',
                    boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
                    transform: leftButtonHover ? 'scale(1.1)' : 'scale(1)'
                  }}
                >
                  <MdNavigateBefore style={{ width: '3rem', height: '3rem' }} />
                </button>
                <button 
                  onClick={handleScrollAfter}
                  onMouseEnter={() => setRightButtonHover(true)}
                  onMouseLeave={() => setRightButtonHover(false)}
                  style={{
                    width: '4rem',
                    height: '4rem',
                    backgroundColor: rightButtonHover ? 'rgb(0, 0, 0)' : 'rgba(32, 32, 32, 0.8)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    pointerEvents: 'auto',
                    transition: 'background-color 0.2s, transform 0.2s',
                    boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
                    transform: rightButtonHover ? 'scale(1.1)' : 'scale(1)'
                  }}
                >
                  <MdNavigateNext style={{ width: '3rem', height: '3rem' }} />
                </button>
              </div>
              
              <div id="scroll-content" className="scroll-content" ref={scrollContentRef}>
                {featuredCollabs.length > 0 ? (
                  featuredCollabs.map((collab, index) => (
                    <div 
                      className="featured-item" 
                      key={collab._id}
                      ref={el => {
                        featuredItemsRef.current[index] = el;
                      }}
                      style={{ 
                        backgroundImage: collab.image ? `url(${getImageUrl(collab.image)})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      <div className="bottom-text">
                        <h2>{collab.name}</h2>
                        <div className="flex" style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          gap: '20px'
                        }}>
                          {collab.releaseDate && (
                            <p className="release-date" style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              fontSize: '1.7rem',
                              margin: '0',
                              color: 'white',
                              textShadow: '0 2px 4px rgba(0, 0, 0, 0.6)'
                            }}>
                              <MdCalendarToday style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                              <span style={{ verticalAlign: 'middle' }}>{new Date(collab.releaseDate).toLocaleDateString()}</span>
                            </p>
                          )}
                          {collab.link && (
                            <a href={collab.link} target="_blank" rel="noopener noreferrer">View Collab</a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-featured">
                    <h2>No featured collaborations found</h2>
                  </div>
                )}
              </div>
              
              {/* Carousel indicators */}
              {featuredCollabs.length > 1 && (
                <div className="carousel-indicators" style={{
                  position: 'absolute',
                  bottom: '1rem',
                  left: 0,
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  zIndex: 5
                }}>
                  {featuredCollabs.map((_, index) => (
                    <button 
                      key={index}
                      onClick={() => {
                        setCurrentIndex(index);
                        // Reset timer when indicator buttons are clicked
                        resetAutoSwipeTimer();
                      }}
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: index === currentIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer'
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
} 