import React from "react";
import "./Home.css";
import heroVideo from "../video/vdo.mp4";
import ProductSlider from "../Components/ProductSlider"; // Import the ProductSlider component
import TestimonialSlider from "../Components/TestimonialSlider";
import England from "../images/EnglandFlag.jfif"
import Germany from "../images/GermanyFlag.jfif"
import NewZealand from "../images/New Zealand-Flag.jfif"
import { useNavigate } from "react-router-dom";



const Home = () => {

  const navigate = useNavigate();

  const navigateCont = () => {
    navigate("/contact");
  }

  return (
    <>
      {/* 🔹 Hero Section */}
      <div className="hero-section">
        <video className="video-bg" autoPlay loop muted playsInline>
          <source src={heroVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="hero-content">
          <h1 className="hero-heading">Asikh Farms</h1>
          <p className="hero-text">
            At Ashik Farm, we are dedicated to positioning Bihar as a global leader in mango and fresh produce exports, transforming its rich agricultural potential into economic growth and farmer prosperity.
          </p>
          <button className="hero-btn" onClick={navigateCont}>Explore More</button>
        </div>
      </div>

      {/* 🔹 "Our Products" Section with Slider */}
      <div className="sc-hm-dsk">
        <div className="txt-dsc-hm">
          <h1 className="txt-dsc">Our Products</h1>
          <p className="txt-dscpara">Fresh, Organic and Eco-Friendly from us to you.</p>
        </div>
        <ProductSlider /> {/* Add the slider here */}
      </div>

      
      {/* 🔹 Customer Testimonial Section */}
      <div className="txt-thrd">
       <h1 className="txt-hding-home">Customer Testimonial</h1>
       <p className="txt-hding-home hm-para">Hear directly from our Customers from all over the world.</p>
      </div>

        <TestimonialSlider />

      {/* Fourth Section */}
      <div className="fourth-hm">
            <div className="Count-heading">
              <h1 className="Countries-head head-fourth">Countries where we export</h1>
              <p className="Countries-head para-fourth">From India With love</p>
            </div>
            <div className="Countries">
            <div className="England">
              <img className='count-img' src={England} alt="Girl in a jacket"/>
              <p className="count-name">England</p>
            </div>
            <div className="Germany">
              <img className='count-img' src={Germany} alt="Girl in a jacket"/>
              <p className="count-name">Germany</p>
            </div>
            <div className="New-Zealand">
            <img className='count-img' src={NewZealand} alt="Girl in a jacket"/>
            <p className="count-name">New Zealand</p>
            </div>
        </div>
      </div>
    </>
  );
};

export default Home;
