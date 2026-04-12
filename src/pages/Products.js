import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../Components/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) {
          setError('Unable to load products. Please try again later.');
          setLoading(false);
          return;
        }
        const data = await res.json();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError('Unable to connect to our product service. Please try again.');
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const getPrice = (product) => {
    if (!product.variants || product.variants.length === 0) return null;
    const price = product.variants[0].priceV2;
    return price
      ? `₹${parseFloat(price.amount).toLocaleString('en-IN')}`
      : null;
  };

  return (
    <>
      <Helmet>
        <title>Products — Fresh Mangoes &amp; Lychee | Asikh Farms</title>
        <meta
          name="description"
          content="Shop premium Bihar produce: Jardalu mangoes, Shahi lychee, beetroot, ginger, carrots and more. Farm-fresh, delivered to your door."
        />
        <link rel="canonical" href="https://asikhfarms.in/products" />
        <meta property="og:url" content="https://asikhfarms.in/products" />
        <meta
          property="og:title"
          content="Products — Fresh Mangoes &amp; Lychee | Asikh Farms"
        />
        <meta
          property="og:description"
          content="Shop premium Bihar produce: Jardalu mangoes, Shahi lychee, beetroot, ginger, carrots and more. Farm-fresh, delivered to your door."
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Asikh Farms" />
        <meta
          property="og:image"
          content="https://asikhfarms.in/og-image.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Our Products — Asikh Farms" />
        <meta property="og:locale" content="en_IN" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Products — Fresh Mangoes &amp; Lychee | Asikh Farms"
        />
        <meta
          name="twitter:description"
          content="Shop Jardalu mangoes, Shahi lychee and other premium Bihar produce, delivered fresh to your door."
        />
        <meta
          name="twitter:image"
          content="https://asikhfarms.in/og-image.png"
        />
        <meta name="robots" content="noindex, follow" />
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
                name: 'Products',
                item: 'https://asikhfarms.in/products',
              },
            ],
          })}
        </script>
      </Helmet>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-5 mt-20 items-stretch">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="border rounded-lg overflow-hidden shadow-md"
              style={{ minHeight: 280, background: '#f3f4f6' }}
            />
          ))}
        </div>
      )}

      {error && (
        <div className="text-center px-8 mt-20 py-8">
          <p className="text-gray-500 text-lg">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-primary-green text-white rounded hover:bg-green-700 transition-colors"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-5 mt-20 items-stretch">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              title={product.title}
              image={product.images?.[0]?.src}
              price={getPrice(product)}
              onBuyNow={() => navigate('/order-now')}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default Products;
