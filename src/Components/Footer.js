import React from "react";
import "./Footer.css";
import logo from "../images/logo.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Section - Logo & Description */}
        <div className="footer-about">
          <img src={logo} alt="Asikh Farms Logo" className="footer-logo" />
          <h2>Asikh Farms</h2>
          <p>
            Discover the essence of Asikh Farms, where we cultivate nature’s
            bounty with care and passion. Here, every seed is planted with
            intention, and every harvest is a celebration of the earth’s
            generosity.
          </p>
          <p>
            Our dedicated team works tirelessly to ensure that each crop is
            nurtured in harmony with the environment, allowing us to bring you
            the freshest produce.
          </p>
          {/* Social Media Icons */}
          <div className="footer-socials">
            <a href="#" className="social-icon fa-instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="social-icon fa-linkedin-in">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="#" className="social-icon fa-facebook-f">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="social-icon fa-youtube">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>

        {/* Middle Section - Links */}
        <div className="footer-links">
          <h3>Links</h3>
          <a href="/about">About Us</a>
          <a href="/products">Products</a>
          <a href="/contact">Contact Us</a>
          <a href="/careers">Careers</a>
        </div>

        {/* Right Section - Help */}
        <div className="footer-help">
          <h3>Help</h3>
          <a href="/terms">Terms & Conditions</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/contact">Contact Us</a>
        </div>
      </div>

      {/* Bottom Section - Copyright */}
      <div className="footer-bottom">
        <p>&copy; 2025 Asikh Farms LLC. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
