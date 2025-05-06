const getApiUrl = (endpoint) => {
  // Check if we're in production (Netlify)
  const isProduction = process.env.NODE_ENV === 'production';
  
  // In production, use Netlify function URL
  if (isProduction) {
    return `/.netlify/functions/proxy${endpoint}`;
  }
  
  // In development, use local proxy
  return endpoint;
}

export const fetchProducts = async () => {
  const response = await fetch(getApiUrl('/api/products'));
  if (!response.ok) {
    throw new Error(`Error fetching products: ${response.status}`);
  }
  return response.json();
};

export const createCheckout = async (variantId, quantity) => {
  const response = await fetch(getApiUrl('/api/checkout'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ variantId, quantity }),
  });
  if (!response.ok) {
    throw new Error(`Checkout error: ${response.status}`);
  }
  return response.json();
};
