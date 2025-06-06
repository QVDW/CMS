"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { getApiUrl } from '../../utils/apiConfig';
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import PageHeader from "../../../components/collabs/PageHeader";
import CollabFilter from "../../../components/collabs/CollabFilter";
import CollabGrid from "../../../components/collabs/CollabGrid";
import Pagination from "../../../components/collabs/Pagination";
import { Item } from "../../../components/collabs/CollabCard";

const ITEMS_PER_PAGE = 10;

export default function CollabsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("Alle categorieën");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'alphabetical'>('newest');

  // Get unique categories from items
  const categories = ["Alle categorieën", ...new Set(items.map(item => item.category).filter(Boolean) as string[])];

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
        
        const releasedItems = itemsData.filter((item: Item) => {
          if (!item.isActive) return false;
          
          if (!item.releaseDate) return true;
          
          const releaseDate = new Date(item.releaseDate);
          return releaseDate <= currentDate;
        });
        
        const sortedItems = [...releasedItems].sort((a, b) => {
          if (a.releaseDate && b.releaseDate) {
            const dateA = new Date(a.releaseDate).getTime();
            const dateB = new Date(b.releaseDate).getTime();
            return dateB - dateA;
          }
          
          if (a.releaseDate && !b.releaseDate) return -1;
          if (!a.releaseDate && b.releaseDate) return 1;
          
          if (a.updated_at && b.updated_at) {
            const dateA = new Date(a.updated_at).getTime();
            const dateB = new Date(b.updated_at).getTime();
            return dateB - dateA;
          }
          
          if (a.created_at && b.created_at) {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return dateB - dateA;
          }
          
          return 0;
        });
        
        setItems(sortedItems);
        
        // Check for saved items
        const savedItemsFromStorage = localStorage.getItem('savedCollabs');
        if (savedItemsFromStorage) {
          try {
            const parsed = JSON.parse(savedItemsFromStorage);
            if (Array.isArray(parsed)) {
              setSavedItems(parsed);
            }
          } catch (e) {
            console.error('Error parsing saved items', e);
          }
        }
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
    if (selectedCategory !== "Alle categorieën") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(item => 
        (item.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
        (item.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
        (item.brands && item.brands.some(brand => brand.toLowerCase().includes(searchQuery.toLowerCase()))) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      );
    }
    
    // Sort items
    switch (sortOrder) {
      case 'newest':
        filtered.sort((a, b) => {
          if (a.releaseDate && b.releaseDate) {
            return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
          }
          return 0;
        });
        break;
      case 'oldest':
        filtered.sort((a, b) => {
          if (a.releaseDate && b.releaseDate) {
            return new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
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
      // Force scroll to top first before changing page
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Short timeout to ensure scroll completes before page change
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
  
  const handleSortChange = (order: 'newest' | 'oldest' | 'alphabetical') => {
    setSortOrder(order);
  };
  
  const handleResetSearch = () => {
    setSearchQuery('');
    setSelectedCategory('Alle categorieën');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-white text-gray-800">
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      
      <PageHeader 
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
      />
      
      <CollabFilter
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        selectedCategory={selectedCategory}
        handleCategoryChange={handleCategoryChange}
        categories={categories}
        sortOrder={sortOrder}
        handleSortChange={handleSortChange}
        filteredItemsCount={filteredItems.length}
      />
      
      <div className="w-full max-w-[2000px] mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <CollabGrid 
          items={getCurrentPageItems()}
          loading={loading}
          searchQuery={searchQuery}
          onResetSearch={handleResetSearch}
        />
        
        {!loading && (
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
