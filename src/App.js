import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import OrderNow from './pages/OrderNow';
import VendorOrder from './pages/VendorOrder';
import VendorOrderStandalone from './pages/VendorOrderStandalone';
import ScrollToTop from './Components/ScrollToTop';

const App = () => {
  const FEATURE_PRODUCTS = process.env.REACT_APP_FEATURE_PRODUCTS === 'true';
  const FEATURE_ABOUT = process.env.REACT_APP_FEATURE_ABOUT === 'true';

  // Debug environment variables
  console.log('App.js ENV Values:', {
    REACT_APP_FEATURE_PRODUCTS: process.env.REACT_APP_FEATURE_PRODUCTS,
    FEATURE_PRODUCTS,
    REACT_APP_FEATURE_ABOUT: process.env.REACT_APP_FEATURE_ABOUT,
    FEATURE_ABOUT
  });

  // Add preloading for key assets like fonts, logo, etc.
  useEffect(() => {
    // Function to preload images
    const preloadImages = (srcArray) => {
      srcArray.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    };

    // Images to preload (can add more as needed)
    const imagesToPreload = [
      // Add path to logo and other critical images
      '/logo.png',
    ];

    preloadImages(imagesToPreload);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={FEATURE_PRODUCTS ? <Products /> : <Navigate to="/" />} />
            <Route path="/about" element={FEATURE_ABOUT ? <About /> : <Navigate to="/" />} />
            <Route path="/order-now" element={<OrderNow />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/vendor-order" element={<VendorOrder />} />
            <Route path="/bulk-order" element={<VendorOrderStandalone />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
