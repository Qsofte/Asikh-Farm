import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../images/logo.png';
import LanguageToggle from './LanguageToggle';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useTranslation();

  // Feature flags for navigation
  const FEATURE_PRODUCTS = process.env.REACT_APP_FEATURE_PRODUCTS === 'true';
  const FEATURE_ABOUT = process.env.REACT_APP_FEATURE_ABOUT === 'true';
  const FEATURE_ORDER_NOW = true;

  // Debug feature flags
  console.log('ENV Values:', {
    REACT_APP_FEATURE_PRODUCTS: process.env.REACT_APP_FEATURE_PRODUCTS,
    REACT_APP_FEATURE_ABOUT: process.env.REACT_APP_FEATURE_ABOUT,
    FEATURE_PRODUCTS,
    FEATURE_ABOUT
  });

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleNavigate = (path) => {
    setIsMenuOpen(false); // Always close menu on navigation
    document.body.style.overflow = 'auto'; // Restore scroll
    if (location.pathname === path) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      navigate(path);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Prevent background scrolling when menu is open
    document.body.style.overflow = !isMenuOpen ? 'hidden' : 'auto';
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-primary-light shadow-md h-24 md:h-36' : 'bg-transparent h-32 md:h-48'
      }`}
    >
      <div className="container mx-auto px-4 h-full flex items-center justify-start">
        {/* Logo */}
        <div className="flex items-center">
          <a href="/" onClick={(e) => { e.preventDefault(); handleNavigate('/'); }} className="cursor-pointer">
            <img
              src={logo}
              alt="Asikh Farms Logo"
              className={`transition-all duration-300 ${
                isScrolled ? 'h-20 md:h-32' : 'h-32 md:h-40'
              }`}
            />
          </a>
        </div>

        {/* Right side navigation */}
        <div className="flex items-center ml-auto">
          {/* Burger Menu for Mobile */}
          <div
            className="lg:hidden flex flex-col justify-between w-7 h-5 cursor-pointer z-50"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span
              className={`block h-0.5 w-full transition-all duration-300 bg-primary-dark ${
                isMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            ></span>
            <span
              className={`block h-0.5 w-full transition-all duration-300 bg-primary-dark ${
                isMenuOpen ? 'opacity-0' : ''
              }`}
            ></span>
            <span
              className={`block h-0.5 w-full transition-all duration-300 bg-primary-dark ${
                isMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            ></span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center">
            <ul className="flex space-x-8">
              <li>
                <a href="/" onClick={(e) => { e.preventDefault(); handleNavigate('/'); }} className={`cursor-pointer font-gilroy-medium text-lg font-bold transition-all duration-300 hover:opacity-100 ${
                  isScrolled ? 'text-primary-dark' : 'text-primary-light'
                } hover:text-primary-green`} aria-label={t('header.home')}>
                  {t('header.home')}
                </a>
              </li>
              {FEATURE_PRODUCTS && (
                <li>
                  <a href="/products" onClick={(e) => { e.preventDefault(); handleNavigate('/products'); }} className={`cursor-pointer font-gilroy-medium text-lg font-bold transition-all duration-300 hover:opacity-100 ${
                    isScrolled ? 'text-primary-dark' : 'text-primary-light'
                  } hover:text-primary-green`} aria-label={t('header.products')}>
                    {t('header.products')}
                  </a>
                </li>
              )}
              {FEATURE_ABOUT && (
                <li>
                  <a href="/about" onClick={(e) => { e.preventDefault(); handleNavigate('/about'); }} className={`cursor-pointer font-gilroy-medium text-lg font-bold transition-all duration-300 hover:opacity-100 ${
                    isScrolled ? 'text-primary-dark' : 'text-primary-light'
                  } hover:text-primary-green`} aria-label={t('header.about')}>
                    {t('header.about')}
                  </a>
                </li>
              )}
              {FEATURE_ORDER_NOW && (
                <li>
                  <a href="/order-now" onClick={(e) => { e.preventDefault(); handleNavigate('/order-now'); }} className={`cursor-pointer font-gilroy-medium text-lg font-extrabold transition-all duration-300 hover:opacity-100 px-4 py-2 rounded-full ${
                    isScrolled ? 'bg-primary-green text-white' : 'bg-primary-light text-primary-green'
                  } hover:bg-accent-yellow hover:text-primary-dark`} aria-label={t('header.orderNow')}>
                    {t('header.orderNow')}
                  </a>
                </li>
              )}
              <li>
                <a href="/contact" onClick={(e) => { e.preventDefault(); handleNavigate('/contact'); }} className={`cursor-pointer font-gilroy-medium text-lg font-bold transition-all duration-300 hover:opacity-100 ${
                  isScrolled ? 'text-primary-dark' : 'text-primary-light'
                } hover:text-primary-green`} aria-label={t('header.contact')}>
                  {t('header.contact')}
                </a>
              </li>
            </ul>
          </nav>
          {/* Language toggle for desktop */}
          <div className="hidden lg:flex items-center ml-4">
            <LanguageToggle />
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`fixed top-0 left-0 w-full h-full bg-primary-light flex flex-col justify-center items-center transition-transform duration-500 ease-in-out lg:hidden ${
            isMenuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <ul className="flex flex-col space-y-6 text-center">
            <li>
              <a href="/" onClick={(e) => { e.preventDefault(); handleNavigate('/'); }} className="font-gilroy-medium text-2xl text-primary-green cursor-pointer">
                {t('header.home')}
              </a>
            </li>
            {FEATURE_PRODUCTS && (
              <li>
                <a href="/products" onClick={(e) => { e.preventDefault(); handleNavigate('/products'); }} className="font-gilroy-medium text-2xl text-primary-green cursor-pointer">
                  {t('header.products')}
                </a>
              </li>
            )}
            {FEATURE_ABOUT && (
              <li>
                <a href="/about" onClick={(e) => { e.preventDefault(); handleNavigate('/about'); }} className="font-gilroy-medium text-2xl text-primary-green cursor-pointer">
                  {t('header.about')}
                </a>
              </li>
            )}
            {FEATURE_ORDER_NOW && (
              <li className="mb-4">
                <a href="/order-now" onClick={(e) => { e.preventDefault(); handleNavigate('/order-now'); }} className="font-gilroy-medium font-extrabold text-2xl bg-primary-green text-white px-6 py-2 rounded-full hover:bg-accent-yellow hover:text-primary-dark cursor-pointer">
                  {t('header.orderNow')}
                </a>
              </li>
            )}
            <li>
              <a href="/contact" onClick={(e) => { e.preventDefault(); handleNavigate('/contact'); }} className="font-gilroy-medium text-2xl text-primary-green cursor-pointer">
                {t('header.contact')}
              </a>
            </li>
          </ul>
          {/* Language toggle for mobile */}
          <div className="mt-6 flex">
            <LanguageToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
