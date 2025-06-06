/**
 * Format date for display
 */
export const formatDate = (dateString: string | Date): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  });
};

/**
 * Get random gradient
 */
export const getRandomGradient = (index: number) => {
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

/**
 * Check if an item is a new release (within last 14 days)
 */
export const isNewRelease = (releaseDate?: string | Date): boolean => {
  if (!releaseDate) return false;
  
  return (new Date().getTime() - new Date(releaseDate).getTime()) / (1000 * 3600 * 24) <= 14;
}; 