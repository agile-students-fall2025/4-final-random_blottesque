const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

// Get the full image URL
export const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads')) {
      // Remove /api from API_URL if present
      const baseUrl = API_URL.replace('/api', '');
      return `${baseUrl}${url}`;
    }
    return url;
};

