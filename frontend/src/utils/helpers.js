const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
const BASE_URL = API_BASE_URL.replace('/api', '');

export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return '/assets/images/placeholder-course.jpg';
  return `${BASE_URL}${imageUrl}`;
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

export const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString();
};

export const formatPrice = (price) => {
  return `$${parseFloat(price).toFixed(2)}`;
};