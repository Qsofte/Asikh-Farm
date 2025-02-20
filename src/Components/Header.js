import React, { useState } from "react";
import "./Header.css";
import "./Responsive.css";
import logo from "../images/logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="container">
        {/* Logo Section */}
        <div className="logo">
          <a href="/">
            <img src={logo} alt="Logo" className="logo-image" />
          </a>
        </div>

        {/* Burger Icon */}
        <div className="burger" onClick={toggleMenu}>
          <div className={`line ${isMenuOpen ? "open" : ""}`}></div>
          <div className={`line ${isMenuOpen ? "open" : ""}`}></div>
          <div className={`line ${isMenuOpen ? "open" : ""}`}></div>
        </div>

        {/* Navbar Links */}
        <nav className={`navbar ${isMenuOpen ? "active" : ""}`}>
          <ul className="nav-links">
            <li>
              <a href="/" className="nav-item" >Home</a>
            </li>
            <li>
              <a href="/products" className="nav-item" >Products</a>
            </li>
            <li>
              <a href="/about" className="nav-item" >About Us</a>
            </li>
            <li>
              <a href="/contact" className="nav-item" >Contact Us</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
