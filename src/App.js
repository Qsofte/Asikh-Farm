import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
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
  const [appLoading, setAppLoading] = useState(true);

  // Add preloading for key assets like fonts, logo, etc.
  useEffect(() => {
    // Function to preload images
    const preloadImages = (srcArray) => {
      return Promise.all(
        srcArray.map((src) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = resolve;
            img.src = src;
          });
        }),
      );
    };

    // Function to preload fonts
    const preloadFonts = () => {
      return Promise.all([
        document.fonts.load('GilroyMedium'),
        document.fonts.load('GilroyExtraBold'),
        document.fonts.load('GilroyRegular'),
        document.fonts.load('GilroySemiBold'),
        document.fonts.load('GilroyLight'),
      ]);
    };

    // Images to preload
    const imagesToPreload = [
      '/logo.png',
      '/images/Logo_re.png',
      '/images/3rd-Home-main.png',
      '/video/vdo.mp4',
    ];

    // Preload all assets
    Promise.all([
      preloadImages(imagesToPreload),
      preloadFonts(),
      // Wait for fonts to be ready
      document.fonts.ready,
    ]).then(() => {
      // Small delay to ensure everything is loaded
      setTimeout(() => {
        setAppLoading(false);
      }, 100);
    });
  }, []);

  if (appLoading) {
    return (
      <div className="min-h-screen bg-primary-light flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-primary-dark font-gilroy-medium">
            Loading Asikh Farms...
          </p>
        </div>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/about" element={<About />} />
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
    </HelmetProvider>
  );
};

export default App;
