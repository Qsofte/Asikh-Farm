import React, { useState, useEffect } from "react";
import "./Header.css";
import "./Responsive.css";
import logo from "../images/logo.png";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Header = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const ButtonForHome = () => {

  if(location.pathname === "/"){
    window.scrollTo(0,0);
  }

  else{
      navigate("/");
  }

}

useEffect(() => {
  setIsMenuOpen(false);
}, [location.pathname]);

  const ButtonForContact = () => {
    navigate("/contact");
  }
  
      

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`header ${isScrolled ? "scrolled" : ""}`}>
      <div className="container">
        {/* Logo Section */}
        <div className="logo">
          <a onClick={ButtonForHome} style={{cursor: "pointer"}}>
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
              <a onClick={ButtonForHome} style={{cursor: "pointer"}} className={`nav-item ${isScrolled ? "scrolled-text" : ""}`}>HOME</a>
            </li>
            <li>
              <a href="/products" className={`nav-item nav-item-prd ${isScrolled ? "scrolled-text" : ""}`}>PRODUCTS</a>
            </li>
            <li>
              <a href="/about" className={`nav-item nav-item-abt ${isScrolled ? "scrolled-text" : ""}`}>ABOUT US</a>
            </li>
            <li>
              <a onClick={ButtonForContact} style={{cursor: "pointer"}} className={`nav-item ${isScrolled ? "scrolled-text" : ""}`}>CONTACT US</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
