import React from "react";
// import { Link } from "react-router-dom";
import "./Footer.css";
import logo from "../images/logo.png";
import { useNavigate } from "react-router-dom";
import Home from "../pages/Home";

const Footer = () => {

    const navigateP = useNavigate();

    const ButtonForPrivacy = () => {
        navigateP("/privacy");
    }

    const navigate = useNavigate();

    const ButtonForContact = () => {
        navigate("/contact");
    }

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Section - Logo & Description */}
        <div className="footer-about">
          <img src={logo} alt="Asikh Farms Logo" className="footer-logo" />
          <h2 className="help-ftr">Asikh Farms</h2>
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
        <div className="lnk-hlp">
          <div className="footer-links">
            <h3 className="help-ftr">Links</h3>
            {/* <a href="/about">About Us</a> */}
            {/* <a href="/products">Products</a> */}
            <a onClick={ButtonForContact} style={{cursor: "pointer"}}>Contact Us</a>
            {/* <a href="/careers">Careers</a> */}
          </div>

          {/* Right Section - Help */}
          <div className="footer-help">
            <h3 className="help-ftr">Help</h3>
            {/* <a href="/terms">Terms & Conditions</a> */}
            <a onClick={ButtonForPrivacy} style={{cursor: "pointer"}}>Privacy Policy</a>
            {/* <Link to="/privacy">Privacy Policy</Link> */}
            <a onClick={ButtonForContact} style={{cursor: "pointer"}}>Contact Us</a>
            {/* <Link to="/contact">Contact Us</Link> */}
          </div>
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
