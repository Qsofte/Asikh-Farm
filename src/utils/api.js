const getApiUrl = () => {
  const isDev = process.env.NODE_ENV === 'development';
  const url = isDev ? 'http://localhost:5001/.netlify/functions/proxy' : '/.netlify/functions/proxy';
  console.log('API URL:', url, 'Environment:', process.env.NODE_ENV);
  return url;
};

export const fetchProducts = async () => {
  try {
    const url = getApiUrl();
    console.log('Fetching products from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Error response:', {
        status: response.status,
        statusText: response.statusText,
        body: text
      });
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
