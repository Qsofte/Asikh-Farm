import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header"; // Correct casing for Header
import Home from "./Pages/Home";         // Correct casing for Home
import Products from "./Pages/Products"; // Correct casing for Products
import About from "./Pages/About";       // Correct casing for About
import Contact from "./Pages/Contact";   // Correct casing for Contact
import Footer from "./Components/Footer";
import Privacy from "./Pages/Privacy";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
      </Routes>
      <Footer/>
    </Router>
  );
};

export default App;
