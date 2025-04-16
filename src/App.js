import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header"; // Correct casing for Header
import Products from "./pages/Products"; // Correct casing for Products
import About from "./pages/About";       // Correct casing for About
import Contact from "./pages/Contact";   // Correct casing for Contact
import Footer from "./Components/Footer";
import Privacy from "./pages/Privacy";
import ScrollToTop from "./Components/ScrollToTop";
import Home from "./pages/Home";

const App = () => {
  return (
    <Router>
      <ScrollToTop />
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
