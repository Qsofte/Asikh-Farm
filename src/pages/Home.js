import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import heroVideo from '../video/vdo.mp4';
import ProductSlider from '../Components/ProductSlider';
import TestimonialSlider from '../Components/TestimonialSlider';
import EnglandFlag from '../images/EnglandFlag.jfif';
import GermanyFlag from '../images/GermanyFlag.jfif';
import NewZealandFlag from '../images/New Zealand-Flag.jfif';

const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleExplore = () => {
    navigate('/contact');
    window.scrollTo(0, 0);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[400px] w-full flex justify-center items-start pt-32 md:pt-40 overflow-hidden bg-gradient-to-br from-primary-green to-accent-gold">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0 hidden md:block"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={heroVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10 hidden md:block"></div>

        {/* Hero content */}
        <div className="z-20 text-center text-white max-w-4xl px-4 md:px-8">
          <h1 className="text-4xl md:text-6xl font-lobster mb-6 animate-[fadeInDown_1s_ease-out]">
            {t('hero.title')}
          </h1>
          <p className="text-lg md:text-xl font-gilroy-medium leading-relaxed mb-6">
            {t('hero.promise')}
          </p>
          <p className="text-lg md:text-xl font-gilroy-medium leading-relaxed mb-10 animate-[fadeInUp_1s_ease-out_0.5s] opacity-0 animation-fill-forwards">
            {t('hero.subtitle')}
          </p>
          <button
            onClick={handleExplore}
            className="hero-btn animate-[fadeInUp_1s_ease-out_1s] opacity-0 animation-fill-forwards"
            aria-label="Explore more about our products and services"
          >
            {t('hero.explore')}
          </button>
        </div>
      </section>

      {/* Products & Testimonials Split Section */}
      <section className="bg-white w-full px-4 py-8 flex flex-col md:flex-row md:space-x-8">
        {/* Our Products */}
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h2 className="text-3xl md:text-4xl font-lobster text-primary-dark mb-4 text-center">
            {t('productsSection.title')}
          </h2>
          <p className="text-lg font-gilroy-light text-primary-dark text-center max-w-2xl mx-auto mb-6">
            {t('productsSection.description')}
          </p>
          <ProductSlider />
        </div>
        {/* Customer Testimonials */}
        <div className="md:w-1/2">
          <h2 className="text-3xl md:text-4xl font-lobster text-primary-dark mb-4 text-center">
            {t('testimonialsSection.title')}
          </h2>
          <TestimonialSlider />
        </div>
      </section>

      {/* Export Countries Section */}
      <section style={{ height: '30%' }} className="py-4 bg-gray-100 w-full mx-auto">
        <div className="text-center px-2 mb-6">
          <h2 className="text-3xl md:text-4xl font-lobster text-primary-dark mb-4">
            {t('exportSection.title')}
          </h2>
          <p className="text-lg font-gilroy-light text-primary-dark max-w-2xl mx-auto">
            {t('exportSection.description')}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 max-w-5xl mx-auto px-2">
          <div className="text-center transition-transform duration-300 hover:-translate-y-2">
            <div className="w-20 h-12 md:w-24 md:h-14 mb-1 mx-auto relative overflow-hidden rounded shadow-sm">
              <img
                src={EnglandFlag}
                alt="England Flag"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <p className="text-base font-gilroy-medium text-primary-dark">
              England
            </p>
          </div>

          <div className="text-center transition-transform duration-300 hover:-translate-y-2">
            <div className="w-20 h-12 md:w-24 md:h-14 mb-1 mx-auto relative overflow-hidden rounded shadow-sm">
              <img
                src={GermanyFlag}
                alt="Germany Flag"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <p className="text-base font-gilroy-medium text-primary-dark">
              Germany
            </p>
          </div>

          <div className="text-center transition-transform duration-300 hover:-translate-y-2">
            <div className="w-20 h-12 md:w-24 md:h-14 mb-1 mx-auto relative overflow-hidden rounded shadow-sm">
              <img
                src={NewZealandFlag}
                alt="New Zealand Flag"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <p className="text-base font-gilroy-medium text-primary-dark">
              New Zealand
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
