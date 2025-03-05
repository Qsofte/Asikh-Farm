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
              <a href="/" className="nav-item" >HOME</a>
            </li>
            <li>
              <a href="/products" className="nav-item" >PRODUCTS</a>
            </li>
            <li>
              <a href="/about" className="nav-item" >ABOUT US</a>
            </li>
            <li>
              <a href="/contact" className="nav-item" >CONTACT US</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
