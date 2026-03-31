import React from "react";
import { Helmet } from 'react-helmet-async';
import "./Products.css";

const products = [
  { id: 1, name: "Beetroot", price: 2500, weight: "10kg", image: "/images/beetroot.jpg" },
  { id: 2, name: "Ginger", price: 500, weight: "10kg", image: "/images/ginger.jpg" },
  { id: 3, name: "Carrots", price: 2500, weight: "10kg", image: "/images/carrots.jpg" },
  { id: 4, name: "Cauliflower", price: 750, weight: "10kg", image: "/images/cauliflower.jpg" },
  { id: 5, name: "Tomato", price: 500, weight: "10kg", image: "/images/tomato.jpg" },
  { id: 6, name: "Elephant Yam", price: 500, weight: "10kg", image: "/images/yam.jpg" },
  { id: 7, name: "Jardalu Mangoes", price: 500, weight: "10kg", image: "/images/mango.jpg" },
  { id: 8, name: "Shahi Litchi", price: 500, weight: "10kg", image: "/images/litchi.jpg" },
  { id: 9, name: "Jackfruit", price: 500, weight: "10kg", image: "/images/jackfruit.jpg" }
];

const Products = () => {
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
          "@type": "ItemList",
          "name": "Asikh Farms Products",
          "url": "https://asikhfarms.in/products",
          "itemListElement": products.map((p, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "name": p.name,
            "url": "https://asikhfarms.in/products"
          }))
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://asikhfarms.in/" },
            { "@type": "ListItem", "position": 2, "name": "Products", "item": "https://asikhfarms.in/products" }
          ]
        })}</script>
      </Helmet>
    <div className="product-grid">
      {products.map((product) => (
        <div key={product.id} className="product-card">
          <img src={product.image} alt={product.name} />
          <div className="product-info">
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">₹{product.price} - {product.weight}</p>
            <button className="add-to-cart">Add to Cart</button>
          </div>
        </div>
      ))}
    </div>
    </>
  );
};

export default Products;
