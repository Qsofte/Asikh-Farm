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

  // Wait for fonts to be ready before rendering
  useEffect(() => {
    const timeout = setTimeout(() => setAppLoading(false), 2000);

    document.fonts.ready
      .then(() => {
        clearTimeout(timeout);
        setAppLoading(false);
      })
      .catch(() => {
        clearTimeout(timeout);
        setAppLoading(false);
      });

    return () => clearTimeout(timeout);
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
