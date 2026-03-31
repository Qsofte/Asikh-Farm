import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import "./Products.css";

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
    return price ? `₹${parseFloat(price.amount).toLocaleString('en-IN')}` : null;
  };

  return (
    <>
      <Helmet>
        <title>Our Products — Jardalu Mangoes, Shahi Lychee &amp; More | Asikh Farms</title>
        <meta name="description" content="Shop premium Bihar produce: Jardalu mangoes, Shahi lychee, beetroot, ginger, carrots and more. Farm-fresh, delivered to your door." />
        <link rel="canonical" href="https://asikhfarms.in/products" />
        <meta property="og:url" content="https://asikhfarms.in/products" />
        <meta property="og:title" content="Our Products — Jardalu Mangoes, Shahi Lychee &amp; More | Asikh Farms" />
        <meta property="og:description" content="Shop premium Bihar produce: Jardalu mangoes, Shahi lychee, beetroot, ginger, carrots and more. Farm-fresh, delivered to your door." />
        <meta property="og:image" content="https://asikhfarms.in/android-chrome-512x512.png" />
        <meta name="twitter:title" content="Our Products — Asikh Farms" />
        <meta name="twitter:description" content="Shop Jardalu mangoes, Shahi lychee and other premium Bihar produce, delivered fresh to your door." />
        <meta name="twitter:image" content="https://asikhfarms.in/android-chrome-512x512.png" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://asikhfarms.in/" },
            { "@type": "ListItem", "position": 2, "name": "Products", "item": "https://asikhfarms.in/products" }
          ]
        })}</script>
      </Helmet>

      {loading && (
        <div className="product-grid" style={{ marginTop: '15%' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="product-card" style={{ minHeight: 280, background: '#f3f4f6' }} />
          ))}
        </div>
      )}

      {error && (
        <div style={{ textAlign: 'center', marginTop: '20%', padding: '2rem' }}>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>{error}</p>
          <button className="add-to-cart" style={{ marginTop: '1rem' }} onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              {product.images && product.images.length > 0 ? (
                <img src={product.images[0].src} alt={product.title} />
              ) : (
                <div style={{ width: '100%', height: 200, background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#9ca3af' }}>No image</span>
                </div>
              )}
              <div className="product-info">
                <h3 className="product-name">{product.title}</h3>
                {getPrice(product) && (
                  <p className="product-price">{getPrice(product)}</p>
                )}
                <button
                  className="add-to-cart"
                  onClick={() => navigate('/order-now')}
                >
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Products;
