import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import heroVideo from '../video/vdo.mp4';
import ProductSlider from '../Components/ProductSlider';
import TestimonialSlider from '../Components/TestimonialSlider';
import EnglandFlag from '../images/EnglandFlag.jfif';
import GermanyFlag from '../images/GermanyFlag.jfif';
import NewZealandFlag from '../images/New Zealand-Flag.jfif';
import Singapore from '../images/Singapore.png';
import safal from '../images/safal.png';
import zomato from '../images/zomato.avif';
import modern from '../images/modern.png';
import Fiitjee from '../images/Fiitjee.jpg';
import Carlsberg from '../images/Carlsberg.png';
import Adyopant from '../images/Adyopant.png';
import blinkit from '../images/blinkit.png';
import flipkartMinutes from '../images/flipkart-minutes.png';

// Intrinsic dimensions are declared so the browser can reserve space before
// each logo loads (avoids layout shift on this below-the-fold row).
const partners = [
  { name: 'Safal', logo: safal, width: 361, height: 175 },
  { name: 'Adyopant Legal', logo: Adyopant, width: 187, height: 72 },
  { name: 'Zomato', logo: zomato, width: 627, height: 627 },
  { name: 'FIITJEE', logo: Fiitjee, width: 554, height: 554 },
  { name: 'Carlsberg', logo: Carlsberg, width: 657, height: 246 },
  { name: 'Modern School', logo: modern, width: 476, height: 477 },
  { name: 'Blinkit', logo: blinkit, width: 163, height: 148 },
  { name: 'Flipkart Minutes', logo: flipkartMinutes, width: 660, height: 363 },
];

// Cap a logo's height at 1/sqrt(aspect) of its box so every logo occupies
// roughly the same *area*. Sizing purely by height makes wide wordmarks
// (Carlsberg) dwarf square badges (Zomato); sizing by width does the reverse.
const logoMaxHeight = (width, height) =>
  `${Math.min(100, 100 / Math.sqrt(width / height))}%`;

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
      <Helmet>
        <title>Asikh Farms — Fresh Jardalu Mangoes &amp; Shahi Lychee</title>
        <meta
          name="description"
          content="Asikh Farms delivers farm-fresh Jardalu mangoes and Shahi lychee (litchi) direct from Bihar orchards. Order online for home delivery across India."
        />
        <link rel="canonical" href="https://asikhfarms.in/" />
        <meta property="og:url" content="https://asikhfarms.in/" />
        <meta
          property="og:title"
          content="Asikh Farms — Fresh Jardalu Mangoes &amp; Shahi Lychee"
        />
        <meta
          property="og:description"
          content="Asikh Farms delivers farm-fresh Jardalu mangoes and Shahi lychee direct from Bihar orchards. Order online for home delivery across India."
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Asikh Farms" />
        <meta
          property="og:image"
          content="https://asikhfarms.in/og-image.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="Asikh Farms — Premium Jardalu Mangoes &amp; Shahi Lychee from Bihar"
        />
        <meta property="og:locale" content="en_IN" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Asikh Farms — Fresh Jardalu Mangoes &amp; Shahi Lychee"
        />
        <meta
          name="twitter:description"
          content="Farm-fresh Jardalu mangoes and Shahi lychee direct from Bihar. Order online for delivery across India."
        />
        <meta
          name="twitter:image"
          content="https://asikhfarms.in/og-image.png"
        />
        <meta
          name="twitter:image:alt"
          content="Asikh Farms — Premium Jardalu Mangoes &amp; Shahi Lychee from Bihar"
        />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': ['Organization', 'LocalBusiness'],
            name: 'Asikh Farms',
            legalName: 'RAMHAR AGRI PRIVATE LIMITED',
            url: 'https://asikhfarms.in',
            logo: 'https://asikhfarms.in/android-chrome-512x512.png',
            image: 'https://asikhfarms.in/android-chrome-512x512.png',
            description:
              'Farm-fresh Jardalu mangoes, Shahi lychee and seasonal produce from Bihar, delivered across India.',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'CHINTA MANI MARKET RAMASHISH CHOUK HAJIPUR',
              addressLocality: 'Hajipur',
              addressRegion: 'Bihar',
              postalCode: '844101',
              addressCountry: 'IN',
            },
            contactPoint: [
              {
                '@type': 'ContactPoint',
                telephone: '+91-9811942958',
                contactType: 'customer service',
                availableLanguage: ['English', 'Hindi'],
              },
            ],
            sameAs: [],
            areaServed: 'IN',
            priceRange: '₹₹',
          })}
        </script>
      </Helmet>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] md:min-h-[400px] w-full flex justify-center items-start pt-32 md:pt-40 pb-16 overflow-hidden bg-gradient-to-br from-primary-green to-accent-gold">
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
          <h1 className="text-4xl md:text-6xl font-lobster mb-6 animate-fade-in-down">
            {t('hero.title')}
          </h1>
          <p className="text-lg md:text-xl font-gilroy-medium leading-relaxed mb-6">
            {t('hero.promise')}
          </p>
          <p className="text-lg md:text-xl font-gilroy-medium leading-relaxed mb-10 animate-fade-in-up-delay-500">
            {t('hero.subtitle')}
          </p>
          <button
            onClick={handleExplore}
            className="hero-btn animate-fade-in-up-delay-1000"
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
      <section className="py-4 bg-gray-100 w-full mx-auto">
        <div className="text-center px-2 mb-6">
          <h2 className="text-3xl md:text-4xl font-lobster text-primary-dark mb-4">
            {t('exportSection.title')}
          </h2>
          <p className="text-lg font-gilroy-light text-primary-dark max-w-2xl mx-auto">
            {t('exportSection.description')}
          </p>
        </div>

        <div className="flex md:flex-wrap justify-between md:justify-center gap-2 md:gap-x-4 max-w-5xl mx-auto px-2 overflow-x-auto md:overflow-visible">
          <div className="text-center flex-shrink-0 transition-transform duration-300 hover:-translate-y-2">
            <div className="w-16 h-10 md:w-24 md:h-14 mb-1 mx-auto relative overflow-hidden rounded shadow-sm">
              <img
                src={EnglandFlag}
                alt="England Flag"
                width={736}
                height={451}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <p className="text-sm md:text-base font-gilroy-medium text-primary-dark">
              England
            </p>
          </div>

          <div className="text-center flex-shrink-0 transition-transform duration-300 hover:-translate-y-2">
            <div className="w-16 h-10 md:w-24 md:h-14 mb-1 mx-auto relative overflow-hidden rounded shadow-sm">
              <img
                src={GermanyFlag}
                alt="Germany Flag"
                width={736}
                height={460}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <p className="text-sm md:text-base font-gilroy-medium text-primary-dark">
              Germany
            </p>
          </div>

          <div className="text-center flex-shrink-0 transition-transform duration-300 hover:-translate-y-2">
            <div className="w-16 h-10 md:w-24 md:h-14 mb-1 mx-auto relative overflow-hidden rounded shadow-sm">
              <img
                src={NewZealandFlag}
                alt="New Zealand Flag"
                width={736}
                height={451}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <p className="text-sm md:text-base font-gilroy-medium text-primary-dark">
              New Zealand
            </p>
          </div>

          <div className="text-center flex-shrink-0 transition-transform duration-300 hover:-translate-y-2">
            <div className="w-16 h-10 md:w-24 md:h-14 mb-1 mx-auto relative overflow-hidden rounded shadow-sm">
              <img
                src={Singapore}
                alt="Singapore Flag"
                width={309}
                height={163}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <p className="text-sm md:text-base font-gilroy-medium text-primary-dark">
              Singapore
            </p>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-8 bg-white w-full">
        <div className="text-center px-4 mb-6">
          <h2 className="text-3xl md:text-4xl font-lobster text-primary-dark mb-4">
            {t('partnersSection.title')}
          </h2>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 max-w-5xl mx-auto px-4">
          {partners.map(({ name, logo, width, height }) => (
            <div
              key={name}
              className="flex h-24 w-32 md:h-28 md:w-44 items-center justify-center rounded-lg bg-gray-50 p-3 md:p-4 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <img
                src={logo}
                alt={name}
                width={width}
                height={height}
                style={{ maxHeight: logoMaxHeight(width, height) }}
                className="max-w-full object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;
