import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { debounce } from 'lodash';
import ProductCard from '../Components/ProductCard';

// Initialize Shopify client with env vars (set these in .env)
// import Client from 'shopify-buy';
// import Client from 'shopify-buy'; replaced by server proxy

const HARDCODED_DISCOUNTS = {
  'Safed Malda- 1 Kg Box': { price: '₹250.00', original: '₹450.00', percent: 44, promo: 'Limited Time Offer!' },
  'Safed Malda- 3 Kg Box': { price: '₹749.00', original: '₹1,199.00', percent: 38, promo: 'Limited Time Offer!' },
  'Jardalu- 1 Kg Box':     { price: '₹250.00', original: '₹450.00', percent: 44, promo: 'Limited Time Offer!' },
  'Jardalu- 3 Kg Box':     { price: '₹749.00', original: '₹1,199.00', percent: 38, promo: 'Limited Time Offer!' },
};

const getDisplayPrice = (variant, qty, variantDiscountInfo) => {
  const hardcoded = HARDCODED_DISCOUNTS[variant.title];
  if (hardcoded) {
    return {
      price: hardcoded.price,
      originalPrice: hardcoded.original,
      discountPercent: hardcoded.percent,
      promoText: hardcoded.promo,
    };
  }
  if (variantDiscountInfo) {
    return {
      price: `${variantDiscountInfo.finalPrice} ${variantDiscountInfo.currencyCode}`,
      originalPrice: `${variantDiscountInfo.originalPrice} ${variantDiscountInfo.currencyCode}`,
      discountPercent: variantDiscountInfo.discountPercent,
      promoText: variantDiscountInfo.discountTitle || null,
    };
  }
  const unitPrice = parseFloat(variant.priceV2?.amount) || 0;
  const totalPrice = (unitPrice * qty).toFixed(2);
  if (
    variant.compareAtPriceV2 &&
    parseFloat(variant.compareAtPriceV2.amount) > parseFloat(variant.priceV2.amount)
  ) {
    const discPct = Math.round(
      (1 - parseFloat(variant.priceV2.amount) / parseFloat(variant.compareAtPriceV2.amount)) * 100,
    );
    return {
      price: `${totalPrice} ${variant.priceV2?.currencyCode}`,
      originalPrice: `${(parseFloat(variant.compareAtPriceV2.amount) * qty).toFixed(2)} ${variant.compareAtPriceV2?.currencyCode}`,
      discountPercent: discPct,
      promoText: null,
    };
  }
  return {
    price: `${totalPrice} ${variant.priceV2?.currencyCode}`,
    originalPrice: null,
    discountPercent: null,
    promoText: null,
  };
};

const OrderNow = () => {
  const [products, setProducts] = useState([]);
  const [processingId, setProcessingId] = useState(null);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [discountInfo, setDiscountInfo] = useState({});
  const [loadingDiscounts, setLoadingDiscounts] = useState({});
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchProducts = async () => {
      setError('');
      setLoading(true);
      try {
        const res = await fetch('/api/products');
        if (!res.ok) {
          const errorMessage =
            res.status === 404
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
          setError(
            'No products are currently available. Please check back soon.',
          );
          setLoading(false);
          return;
        }

        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error('Product fetch error:', err);
        setError(
          'Unable to connect to our product service. Please check your internet connection and try again.',
        );
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Function to calculate discounts for a variant
  const calculateDiscount = useCallback(async (variantId, quantity) => {
    try {
      const res = await fetch('/api/calculate-discount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          variantId,
          quantity,
        }),
      });

      if (!res.ok) {
        console.error('Error calculating discount:', res.status);
        return null;
      }

      const data = await res.json();
      return data.discountInfo;
    } catch (err) {
      console.error('Error calculating discount:', err);
      return null;
    }
  }, []);

  // Debounced function to update discounts
  const updateDiscounts = useCallback(() => {
    const debouncedFunction = debounce(async () => {
      const newDiscountInfo = { ...discountInfo };
      const newLoadingDiscounts = { ...loadingDiscounts };

      for (const productId in selectedVariants) {
        const variantId = selectedVariants[productId];
        const quantity = parseInt(quantities[productId], 10) || 1;

        // Set loading state for this variant
        newLoadingDiscounts[variantId] = true;
        setLoadingDiscounts(newLoadingDiscounts);

        const discountData = await calculateDiscount(variantId, quantity);

        // Update discount info and loading state
        newLoadingDiscounts[variantId] = false;
        if (discountData) {
          newDiscountInfo[variantId] = discountData;
        }
      }

      setDiscountInfo(newDiscountInfo);
      setLoadingDiscounts(newLoadingDiscounts);
    }, 500);

    debouncedFunction();
  }, [
    discountInfo,
    selectedVariants,
    quantities,
    loadingDiscounts,
    calculateDiscount,
  ]);

  // Effect to update discounts when selections change - DISABLED to prevent 404 errors
  useEffect(() => {
    // Disabled API calls to prevent 404 errors
    // if (Object.keys(selectedVariants).length > 0) {
    //   updateDiscounts();
    // }
  }, [selectedVariants, quantities, updateDiscounts]);

  // State for checkout error messages
  const [checkoutError, setCheckoutError] = useState({});

  const handleBuy = async (productId, variantId) => {
    // Clear any previous errors for this product
    setCheckoutError((prev) => ({ ...prev, [productId]: null }));

    // Log buy action and set processing state
    console.log('🛒 handleBuy called', {
      productId,
      variantId,
      qty: quantities[productId],
    });
    setProcessingId(variantId);

    try {
      const qty = parseInt(quantities[productId], 10) || 1;

      // Validate quantity
      if (qty <= 0 || isNaN(qty)) {
        setCheckoutError((prev) => ({
          ...prev,
          [productId]: 'Please enter a valid quantity',
        }));
        setProcessingId(null);
        return;
      }

      const resp = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
            errorMessage =
              'Product is out of stock or unavailable in the requested quantity.';
          } else if (resp.status >= 500) {
            errorMessage =
              'Our checkout service is currently experiencing issues. Please try again later.';
          }
        }

        console.error('Checkout error:', resp.status, resp.statusText);
        setCheckoutError((prev) => ({ ...prev, [productId]: errorMessage }));
        setProcessingId(null);
        return;
      }

      // Parse response
      const checkoutData = await resp.json().catch((e) => {
        console.error('Invalid JSON in checkout response:', e);
        setCheckoutError((prev) => ({
          ...prev,
          [productId]: 'Unable to process checkout. Please try again.',
        }));
        return {};
      });

      // Check if there are detailed error messages in the response
      if (checkoutData.error) {
        console.log('Checkout error details:', checkoutData.details);
        const errorMsg = checkoutData.error;

        // Display the error message with the product information advice
        setCheckoutError((prev) => ({ ...prev, [productId]: errorMsg }));
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
        setCheckoutError((prev) => ({
          ...prev,
          [productId]: 'Unable to create checkout. Please try again.',
        }));
        console.error('Missing webUrl in checkout response');
        setProcessingId(null);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setCheckoutError((prev) => ({
        ...prev,
        [productId]: 'An unexpected error occurred. Please try again.',
      }));
      setProcessingId(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>Order Now — Fresh Mangoes &amp; Lychee | Asikh Farms</title>
        <meta
          name="description"
          content="Order farm-fresh Jardalu mangoes, Shahi lychee, and seasonal Bihar produce online. Direct from orchard to your door."
        />
        <link rel="canonical" href="https://asikhfarms.in/order-now" />
        <meta property="og:url" content="https://asikhfarms.in/order-now" />
        <meta
          property="og:title"
          content="Order Now — Fresh Mangoes &amp; Lychee | Asikh Farms"
        />
        <meta
          property="og:description"
          content="Order farm-fresh Jardalu mangoes, Shahi lychee, and seasonal Bihar produce online. Direct from orchard to your door."
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Asikh Farms" />
        <meta
          property="og:image"
          content="https://asikhfarms.in/og-image.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="Order Jardalu Mangoes &amp; Shahi Lychee — Asikh Farms"
        />
        <meta property="og:locale" content="en_IN" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Order Now — Fresh Mangoes &amp; Lychee | Asikh Farms"
        />
        <meta
          name="twitter:description"
          content="Order Jardalu mangoes and Shahi lychee online. Farm-fresh Bihar produce delivered to your door."
        />
        <meta
          name="twitter:image"
          content="https://asikhfarms.in/og-image.png"
        />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://asikhfarms.in/',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Order Now',
                item: 'https://asikhfarms.in/order-now',
              },
            ],
          })}
        </script>
      </Helmet>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 items-stretch">
            {products.length === 0 && !loading && !error && (
              <div className="col-span-3 text-center py-10">
                <p className="text-lg text-gray-600">
                  No products are currently available. Please check back soon.
                </p>
              </div>
            )}

            {products.map((product) => {
              if (!product.variants || product.variants.length === 0)
                return null;

              const selId =
                selectedVariants[product.id] || product.variants[0].id;
              const variant = product.variants.find((v) => v.id === selId);

              if (!variant) return null;

              const qty = parseInt(quantities[product.id], 10) || 1;
              const variantDiscountInfo = discountInfo[variant.id];

              const stockInfo =
                variant.quantityAvailable !== undefined &&
                variant.quantityAvailable !== null
                  ? variant.quantityAvailable > 10
                    ? { text: 'In Stock', className: 'text-green-600' }
                    : variant.quantityAvailable > 0
                      ? {
                          text: `Only ${variant.quantityAvailable} left`,
                          className: 'text-orange-600',
                        }
                      : { text: 'Out of Stock', className: 'text-red-600' }
                  : { text: 'In Stock', className: 'text-green-600' };

              const isOutOfStock =
                variant.quantityAvailable !== undefined &&
                variant.quantityAvailable !== null &&
                variant.quantityAvailable <= 0;

              const displayPrice = getDisplayPrice(variant, qty, variantDiscountInfo);

              return (
                <ProductCard
                  key={product.id}
                  title={product.title}
                  image={product.images[0]?.src}
                  stockText={stockInfo.text}
                  stockClassName={stockInfo.className}
                  options={product.variants.map((v) => ({ id: v.id, label: v.title }))}
                  selectedOption={selId}
                  price={displayPrice.price}
                  originalPrice={displayPrice.originalPrice}
                  discountPercent={displayPrice.discountPercent}
                  promoText={displayPrice.promoText}
                  quantity={quantities[product.id] ?? ''}
                  onQuantityChange={(val) =>
                    setQuantities({ ...quantities, [product.id]: val })
                  }
                  onOptionChange={(val) =>
                    setSelectedVariants({ ...selectedVariants, [product.id]: val })
                  }
                  onBuyNow={() => handleBuy(product.id, variant.id)}
                  onProductInfo={`https://asikhfarms.myshopify.com/products/${product.handle || product.title.toLowerCase().replace(/\s+/g, '-')}`}
                  isProcessing={processingId === variant.id}
                  isOutOfStock={isOutOfStock}
                  checkoutError={checkoutError[product.id] || null}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderNow;
