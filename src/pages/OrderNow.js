import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchProducts } from '../utils/api';

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
    const getProducts = async () => {
      setError('');
      try {
        const data = await fetchProducts();
        console.log('Fetched products:', data);
        setProducts(data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  const handleBuy = async (productId, variantId) => {
    setProcessingId(variantId);
    try {
      const qty = parseInt(quantities[productId], 10) || 1;
      console.log('Attempting checkout with:', { variantId, qty });
      // For testing, just log the checkout attempt
      console.log('Checkout initiated');
      // Uncomment when ready to test actual checkout
      // const checkoutData = await createCheckout(variantId, qty);
      // window.location.href = checkoutData.webUrl;
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message);
    } finally {
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
            const variants = product.variants || [];
            const selId = selectedVariants[product.id] || (variants[0] && variants[0].id);
            const variant = variants.find((v) => v.id === selId) || variants[0];
            const qty = parseInt(quantities[product.id], 10) || 1;
            const unitPrice = parseFloat(variant?.priceV2?.amount) || 0;
            const totalPrice = (unitPrice * qty).toFixed(2);
            const images = product.images || [];
            
            return (
              <div
                key={product.id}
                className="border rounded-lg overflow-hidden shadow-md max-w-sm mx-auto flex flex-col"
              >
                <div className="bg-gray-100 w-full h-40 flex items-center justify-center">
                  <img
                    src={images[0]?.src || 'https://via.placeholder.com/300'}
                    alt={product.title}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                  </div>
                  <div className="mb-4 flex items-center space-x-4">
                    <div className="flex-1">
                      <label htmlFor={`variant-select-${product.id}`} className="block font-gilroy-semibold mb-1">
                        Option:
                      </label>
                      <select
                        id={`variant-select-${product.id}`}
                        value={selId || ''}
                        onChange={(e) =>
                          setSelectedVariants({
                            ...selectedVariants,
                            [product.id]: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded"
                      >
                        {variants.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor={`quantity-input-${product.id}`}
                        className="block font-gilroy-semibold mb-1"
                      >
                        Qty:
                      </label>
                      <input
                        id={`quantity-input-${product.id}`}
                        type="number"
                        min="1"
                        value={quantities[product.id] || 1}
                        onChange={(e) =>
                          setQuantities({
                            ...quantities,
                            [product.id]: e.target.value,
                          })
                        }
                        className="w-20 p-2 border rounded"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold">
                      ₹{totalPrice}
                    </div>
                    <button
                      onClick={() => handleBuy(product.id, selId)}
                      disabled={processingId === selId}
                      className={`px-4 py-2 rounded ${
                        processingId === selId
                          ? 'bg-gray-400'
                          : 'bg-primary-green hover:bg-primary-green-dark'
                      } text-white transition-colors`}
                    >
                      {processingId === selId ? 'Processing...' : 'Buy Now'}
                    </button>
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
