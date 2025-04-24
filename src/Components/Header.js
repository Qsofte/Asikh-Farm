import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../images/logo.png';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Feature flags for navigation
  const FEATURE_PRODUCTS = process.env.REACT_APP_FEATURE_PRODUCTS === 'true';
  const FEATURE_ABOUT = process.env.REACT_APP_FEATURE_ABOUT === 'true';

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
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <a onClick={() => handleNavigate('/')} className="cursor-pointer">
            <img
              src={logo}
              alt="Asikh Farms Logo"
              className={`transition-all duration-300 ${
                isScrolled ? 'h-20 md:h-32' : 'h-32 md:h-40'
              }`}
            />
          </a>
        </div>

        {/* Burger Menu for Mobile */}
        <div
          className="lg:hidden flex flex-col justify-between w-7 h-5 cursor-pointer z-50"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span
            className={`block h-0.5 w-full transition-all duration-300 ${
              isScrolled ? 'bg-primary-dark' : 'bg-white'
            } ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}
          ></span>
          <span
            className={`block h-0.5 w-full transition-all duration-300 ${
              isScrolled ? 'bg-primary-dark' : 'bg-white'
            } ${isMenuOpen ? 'opacity-0' : ''}`}
          ></span>
          <span
            className={`block h-0.5 w-full transition-all duration-300 ${
              isScrolled ? 'bg-primary-dark' : 'bg-white'
            } ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}
          ></span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center">
          <ul className="flex space-x-8">
            <li>
              <a
                onClick={() => handleNavigate('/')}
                className={`cursor-pointer font-gilroy-medium text-lg font-bold transition-all duration-300 hover:opacity-100 ${
                  isScrolled ? 'text-primary-dark' : 'text-primary-light'
                } hover:text-primary-green`}
                aria-label="Home"
              >
                HOME
              </a>
            </li>
            {FEATURE_PRODUCTS && (
              <li>
                <a
                  onClick={() => handleNavigate('/products')}
                  className={`cursor-pointer font-gilroy-medium text-lg font-bold transition-all duration-300 hover:opacity-100 ${
                    isScrolled ? 'text-primary-dark' : 'text-primary-light'
                  } hover:text-primary-green`}
                  aria-label="Products"
                >
                  PRODUCTS
                </a>
              </li>
            )}
            {FEATURE_ABOUT && (
              <li>
                <a
                  onClick={() => handleNavigate('/about')}
                  className={`cursor-pointer font-gilroy-medium text-lg font-bold transition-all duration-300 hover:opacity-100 ${
                    isScrolled ? 'text-primary-dark' : 'text-primary-light'
                  } hover:text-primary-green`}
                  aria-label="About Us"
                >
                  ABOUT US
                </a>
              </li>
            )}
            <li>
              <a
                onClick={() => handleNavigate('/contact')}
                className={`cursor-pointer font-gilroy-medium text-lg font-bold transition-all duration-300 hover:opacity-100 ${
                  isScrolled ? 'text-primary-dark' : 'text-primary-light'
                } hover:text-primary-green`}
                aria-label="Contact Us"
              >
                CONTACT US
              </a>
            </li>
          </ul>
        </nav>

        {/* Mobile Navigation Menu */}
        <div
          className={`fixed top-0 left-0 w-full h-full bg-primary-light flex flex-col justify-center items-center transition-transform duration-500 ease-in-out lg:hidden ${
            isMenuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <ul className="flex flex-col space-y-6 text-center">
            <li>
              <a
                onClick={() => handleNavigate('/')}
                className="font-gilroy-medium text-2xl text-primary-green cursor-pointer"
              >
                HOME
              </a>
            </li>
            {FEATURE_PRODUCTS && (
              <li>
                <a
                  onClick={() => handleNavigate('/products')}
                  className="font-gilroy-medium text-2xl text-primary-green cursor-pointer"
                >
                  PRODUCTS
                </a>
              </li>
            )}
            {FEATURE_ABOUT && (
              <li>
                <a
                  onClick={() => handleNavigate('/about')}
                  className="font-gilroy-medium text-2xl text-primary-green cursor-pointer"
                >
                  ABOUT US
                </a>
              </li>
            )}
            <li>
              <a
                onClick={() => handleNavigate('/contact')}
                className="font-gilroy-medium text-2xl text-primary-green cursor-pointer"
              >
                CONTACT US
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
