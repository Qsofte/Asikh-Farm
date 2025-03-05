// import React, { useState } from "react";
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
  );
};

export default Products;
