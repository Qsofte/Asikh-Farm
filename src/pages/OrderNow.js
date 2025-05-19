import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Initialize Shopify client with env vars (set these in .env)
// import Client from 'shopify-buy';
// import Client from 'shopify-buy'; replaced by server proxy

const OrderNow = () => {
  const [products, setProducts] = useState([]);
  const [processingId, setProcessingId] = useState(null);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchProducts = async () => {
      setError('');
      setLoading(true);
      try {
        const res = await fetch('/api/products');
        if (!res.ok) {
          const errorMessage = res.status === 404 
            ? 'Product service is currently unavailable. Please try again later.'
            : res.status === 500
              ? 'Our product catalog is experiencing technical difficulties. Please check back soon.'
              : `Unable to load products (${res.status}). Please refresh the page or try again later.`;
          
          setError(errorMessage);
          console.error(`API Error: ${res.status} ${res.statusText}`);
          setLoading(false);
          return;
        }
        
        const data = await res.json();
        if (!data || data.length === 0) {
          setError('No products are currently available. Please check back soon.');
          setLoading(false);
          return;
        }
        
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error('Product fetch error:', err);
        setError('Unable to connect to our product service. Please check your internet connection and try again.');
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // State for checkout error messages
  const [checkoutError, setCheckoutError] = useState({});

  const handleBuy = async (productId, variantId) => {
    // Clear any previous errors for this product
    setCheckoutError(prev => ({ ...prev, [productId]: null }));
    
    // Log buy action and set processing state
    console.log('🛒 handleBuy called', { productId, variantId, qty: quantities[productId] });
    setProcessingId(variantId);
    
    try {
      const qty = parseInt(quantities[productId], 10) || 1;
      
      // Validate quantity
      if (qty <= 0 || isNaN(qty)) {
        setCheckoutError(prev => ({ ...prev, [productId]: 'Please enter a valid quantity' }));
        setProcessingId(null);
        return;
      }
      
      const resp = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ variantId, quantity: qty }),
      });
      
      if (!resp.ok) {
        let errorMessage = 'Unable to process your order';
        
        try {
          // Try to get the detailed error message from the response
          const errorData = await resp.json();
          console.log('Error response from server:', errorData);
          
          if (errorData && errorData.error) {
            errorMessage = errorData.error;
            console.log('Using error message from server:', errorMessage);
          }
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          // If we can't parse the error response, fall back to status code based messages
          if (resp.status === 400) {
            errorMessage = 'This product is currently unavailable.';
          } else if (resp.status === 404) {
            errorMessage = 'Product not found or no longer available.';
          } else if (resp.status === 422) {
            errorMessage = 'Product is out of stock or unavailable in the requested quantity.';
          } else if (resp.status >= 500) {
            errorMessage = 'Our checkout service is currently experiencing issues. Please try again later.';
          }
        }
        
        console.error('Checkout error:', resp.status, resp.statusText);
        setCheckoutError(prev => ({ ...prev, [productId]: errorMessage }));
        setProcessingId(null);
        return;
      }
      
      // Parse response
      const checkoutData = await resp.json().catch(e => {
        console.error('Invalid JSON in checkout response:', e);
        setCheckoutError(prev => ({ ...prev, [productId]: 'Unable to process checkout. Please try again.' }));
        return {};
      });
      
      // Check if there are detailed error messages in the response
      if (checkoutData.error) {
        console.log('Checkout error details:', checkoutData.details);
        const errorMsg = checkoutData.error;
        
        // Display the error message with the product information advice
        setCheckoutError(prev => ({ ...prev, [productId]: errorMsg }));
        setProcessingId(null);
        
        // Alert the error for immediate visibility during testing
        console.error('Product error:', errorMsg);
        return;
      }
      
      if (checkoutData.webUrl) {
        // Redirect to Shopify checkout
        window.location.href = checkoutData.webUrl;
      } else {
        // Handle missing checkout URL
        setCheckoutError(prev => ({ ...prev, [productId]: 'Unable to create checkout. Please try again.' }));
        console.error('Missing webUrl in checkout response');
        setProcessingId(null);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setCheckoutError(prev => ({ ...prev, [productId]: 'An unexpected error occurred. Please try again.' }));
      setProcessingId(null);
    }
  };

  return (
    <div className="bg-primary-light pt-20 min-h-screen">
      {/* Header Section */}
      <div
        className="relative w-full h-40 bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url('../images/3rd-Home-main.png')` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <h1 className="relative z-10 text-4xl md:text-5xl font-gilroy-semibold text-white">
          {t('order.title') || 'Order Now'}
        </h1>
      </div>
      {/* Breadcrumb */}
      <div
        className="px-5 py-5 font-gilroy-semibold text-base cursor-pointer hover:text-primary-green transition-colors"
        onClick={() => navigate('/')}
      >
        Home › Order Now
      </div>
      {/* Main Heading */}
      <h2 className="text-2xl md:text-3xl font-gilroy-semibold text-primary-dark text-center px-4 mb-12">
        {t('order.heading') || 'Pick your favorite products and buy directly'}
      </h2>
      <div className="container mx-auto px-4 mb-20">
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {loading && <p className="text-center mb-4">Loading products...</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.length === 0 && !loading && !error && (
            <div className="col-span-3 text-center py-10">
              <p className="text-lg text-gray-600">No products are currently available. Please check back soon.</p>
            </div>
          )}
          
          {products.map((product) => {
            // Skip products with no variants (should be filtered on the server, but just in case)
            if (!product.variants || product.variants.length === 0) return null;
            
            // Get the selected variant or default to the first one
            const selId = selectedVariants[product.id] || product.variants[0].id;
            const variant = product.variants.find((v) => v.id === selId);
            
            // Skip rendering if no valid variant is found
            if (!variant) return null;
            
            const qty = parseInt(quantities[product.id], 10) || 1;
            const unitPrice = parseFloat(variant.priceV2?.amount) || 0;
            const totalPrice = (unitPrice * qty).toFixed(2);
            
            // Display stock information if available
            const stockInfo = variant.quantityAvailable !== undefined && variant.quantityAvailable !== null
              ? variant.quantityAvailable > 10 
                ? { text: 'In Stock', className: 'text-green-600' }
                : variant.quantityAvailable > 0
                  ? { text: `Only ${variant.quantityAvailable} left`, className: 'text-orange-600' }
                  : { text: 'Out of Stock', className: 'text-red-600' }
              : { text: 'In Stock', className: 'text-green-600' };
            return (
              <div
                key={product.id}
                className="border rounded-lg overflow-hidden shadow-md max-w-sm mx-auto flex flex-col"
              >
                <div className="bg-gray-100 w-full h-40 flex items-center justify-center">
                  <img
                    src={product.images[0]?.src}
                    alt={product.title}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-xl font-semibold">{product.title}</h2>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${stockInfo.className} bg-opacity-20`}>
                        {stockInfo.text}
                      </span>
                    </div>
                  </div>
                  <div className="mb-4 flex items-center space-x-4">
                    <div className="flex-1">
                      <label htmlFor={`variant-select-${product.id}`} className="block font-gilroy-semibold mb-1">Option:</label>
                      <select
                        id={`variant-select-${product.id}`}
                        value={selId}
                        onChange={(e) =>
                          setSelectedVariants({
                            ...selectedVariants,
                            [product.id]: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-green"
                      >
                        {product.variants.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-20 flex-shrink-0">
                      <label htmlFor={`quantity-${product.id}`} className="block font-gilroy-semibold mb-1">Qty:</label>
                      <input
                        type="number"
                        id={`quantity-${product.id}`}
                        min="1"
                        value={quantities[product.id] ?? ''}
                        placeholder="1"
                        onChange={(e) =>
                          setQuantities({
                            ...quantities,
                            [product.id]: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-green"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col mt-4">
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold">{totalPrice} {variant.priceV2?.currencyCode}</p>
                      <button
                        onClick={() => handleBuy(product.id, variant.id)}
                        disabled={processingId === variant.id || 
                          (variant.quantityAvailable !== undefined && variant.quantityAvailable !== null && variant.quantityAvailable <= 0)}
                        className={`px-3 py-2 rounded transition-colors ${variant.quantityAvailable === 0 ? 
                          'bg-gray-400 text-white cursor-not-allowed' : 
                          'bg-primary-green text-white hover:bg-green-700'} disabled:opacity-50`}
                      >
                        {processingId === variant.id ? 'Processing...' : 
                         variant.quantityAvailable === 0 ? 'Out of Stock' : 'Buy Now'}
                      </button>
                    </div>
                    
                    {/* Checkout Error Message */}
                    {checkoutError[product.id] && (
                      <div className="mt-2 text-red-600 text-sm bg-red-50 p-2 rounded border border-red-200">
                        <div className="flex items-start">
                          <svg className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <p>{checkoutError[product.id]}</p>
                            <p className="mt-1 text-xs text-gray-700">
                              Please click the <span className="font-medium text-primary-green">Product Information</span> link below for more details and availability.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Product Information Link */}
                  <div className="mt-3 border-t pt-2">
                    <a
                      href={`https://asikhfarms.myshopify.com/products/${product.handle || product.title.toLowerCase().replace(/\s+/g, '-')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-green flex items-center w-full justify-between font-medium hover:underline"
                    >
                      Product Information
                      <svg 
                        className="w-4 h-4"
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderNow;
