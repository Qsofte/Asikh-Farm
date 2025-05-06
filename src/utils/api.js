const getApiUrl = () => {
  const isDev = process.env.NODE_ENV === 'development';
  return isDev ? 'http://localhost:5001/.netlify/functions/proxy' : '/.netlify/functions/proxy';
};

export const fetchProducts = async () => {
  try {
    console.log('Fetching products from:', getApiUrl());
    const response = await fetch(getApiUrl());
    if (!response.ok) {
      const text = await response.text();
      console.error('Error response:', text);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Response data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};
