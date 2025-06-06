"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import Loader from "../../../components/Loader";
import { getApiUrl } from '../../utils/apiConfig';

// Import new components
import PageHeader from "../../../components/upcoming-releases/PageHeader";
import FilterBar from "../../../components/upcoming-releases/FilterBar";
import ReleaseGrid from "../../../components/upcoming-releases/ReleaseGrid";
import EmptyState from "../../../components/upcoming-releases/EmptyState";
import Pagination from "../../../components/upcoming-releases/Pagination";

const ITEMS_PER_PAGE = 12;

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
  created_at?: string | Date;
  updated_at?: string | Date;
}

export default function UpcomingReleases() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'soonest' | 'latest' | 'alphabetical'>('soonest');

  // Get unique categories from items
  const categories = ["All", ...new Set(items.map(item => item.category).filter(Boolean) as string[])];

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const res = await fetch(getApiUrl('/api/items'), { cache: 'no-store' });
        if (!res.ok) {
          throw new Error('Failed to fetch items');
        }
        const data = await res.json();
        
        const itemsData = Array.isArray(data) ? data : data?.items || [];
        
        const currentDate = new Date();
        
        const upcomingItems = itemsData.filter((item: Item) => {
          if (!item.isActive) return false;
          
          if (!item.releaseDate) return false;
          
          const releaseDate = new Date(item.releaseDate);
          return releaseDate > currentDate;
        });
        
        const sortedItems = [...upcomingItems].sort((a, b) => {
          if (a.releaseDate && b.releaseDate) {
            const dateA = new Date(a.releaseDate).getTime();
            const dateB = new Date(b.releaseDate).getTime();
            return dateA - dateB;
          }
          return 0;
        });
        
        setItems(sortedItems);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    let filtered = [...items];
    
    // Filter by category if not "All"
    if (selectedCategory !== "All") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.brands && item.brands.some(brand => brand.toLowerCase().includes(searchQuery.toLowerCase()))) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      );
    }
    
    // Sort items
    switch (sortOrder) {
      case 'soonest':
        filtered.sort((a, b) => {
          if (a.releaseDate && b.releaseDate) {
            return new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
          }
          return 0;
        });
        break;
      case 'latest':
        filtered.sort((a, b) => {
          if (a.releaseDate && b.releaseDate) {
            return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
          }
          return 0;
        });
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    
    const totalItemCount = filtered.length;
    const calculatedPages = Math.max(1, Math.ceil(totalItemCount / ITEMS_PER_PAGE));
    
    setTotalPages(calculatedPages);
    
    if (currentPage > calculatedPages) {
      setCurrentPage(1);
    }
    
    setFilteredItems(filtered);
  }, [items, searchQuery, selectedCategory, sortOrder]);

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    
    return filteredItems.slice(startIndex, endIndex);
  };

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      setTimeout(() => {
        setCurrentPage(pageNumber);
      }, 100);
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (order: 'soonest' | 'latest' | 'alphabetical') => {
    setSortOrder(order);
  };
  
  const clearSearch = () => {
    setSearchQuery('');
    setSelectedCategory('All');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-white text-gray-800">
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      
      <PageHeader 
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
      />
      
      <FilterBar 
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        filteredItemsCount={filteredItems.length}
        selectedCategory={selectedCategory}
        sortOrder={sortOrder}
        handleSortChange={handleSortChange}
        categories={categories}
        handleCategoryChange={handleCategoryChange}
      />
      
      <div className="w-full max-w-[2000px] mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {loading ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <Loader size="large" text="Loading upcoming releases..." />
          </div>
        ) : getCurrentPageItems().length > 0 ? (
          <ReleaseGrid 
            items={getCurrentPageItems()} 
            currentPage={currentPage}
          />
        ) : (
          <EmptyState 
            searchQuery={searchQuery}
            clearSearch={clearSearch}
          />
        )}
        
        {!loading && totalPages > 1 && (
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        )}
      </div>
      
      <Footer />
    </div>
  );
} 