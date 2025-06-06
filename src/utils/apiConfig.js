export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Helper function to construct full API URL
export const getApiUrl = (path) => {
  // Make sure path starts with '/' if not already
  const formattedPath = path.startsWith('/') ? path : `/${path}`;
  
  // For server-side rendering or in a production environment,
  // just use the relative path for API calls
  if (typeof window === 'undefined' || process.env.NODE_ENV === 'production') {
    return formattedPath;
  }
  
  // For client-side development, use the full URL
  return `${API_URL}${formattedPath}`;
};

// Helper function for image URLs
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // For upload paths, use our API route
  if (imagePath.startsWith('/uploads/')) {
    const fileName = imagePath.substring('/uploads/'.length);
    return `${API_URL}/api/uploads?file=${encodeURIComponent(fileName)}`;
  }
  
  return imagePath;
};
