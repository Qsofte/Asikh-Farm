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
      try {
        const res = await fetch('/api/products');
        if (!res.ok) {
          setError(`Error fetching products: ${res.status} ${res.statusText}`);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleBuy = async (productId, variantId) => {
    // Debug: log buy action and set processing state
    console.log('🛒 handleBuy called', { productId, variantId, qty: quantities[productId] });
    setProcessingId(variantId);
    try {
      const qty = parseInt(quantities[productId], 10) || 1;
      const resp = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ variantId, quantity: qty }),
      });
      if (!resp.ok) {
        console.error('Checkout error:', resp.status, resp.statusText);
        setProcessingId(null);
        return;
      }
      const { webUrl } = await resp.json().catch(e => {
        console.error('Invalid JSON in checkout response:', e);
        return {};
      });
      if (webUrl) window.location.href = webUrl;
    } catch (err) {
      console.error(err);
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
          {products.map((product) => {
            const selId =
              selectedVariants[product.id] || product.variants[0].id;
            const variant = product.variants.find((v) => v.id === selId);
            const qty = parseInt(quantities[product.id], 10) || 1;
            const unitPrice = parseFloat(variant.priceV2?.amount) || 0;
            const totalPrice = (unitPrice * qty).toFixed(2);
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
                    <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
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
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-lg font-bold">{totalPrice} {variant.priceV2?.currencyCode}</p>
                    <button
                      onClick={() => handleBuy(product.id, variant.id)}
                      disabled={processingId === variant.id}
                      className="bg-primary-green text-white px-3 py-2 rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {processingId === variant.id ? 'Processing...' : 'Buy Now'}
                    </button>
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
