import React from "react";
import { useNavigate } from "react-router-dom";
import './Home.css';
import heroVideo from "../video/vdo.mp4";


const Home = () => {

    const navigate = useNavigate();
  
  return (
    <>
    <div className="hero-section">
      {/* Background Video */}
      <video className="video-bg" autoPlay loop muted playsInline>
        <source src={heroVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Content Above Video */}
      <div className="hero-content">
        <h1 className="hero-heading">Asikh Farms</h1>
        <p className="hero-text">
        At Ashik Farm, we are dedicated to positioning Bihar as a global leader in mango and fresh produce exports, transforming its rich agricultural potential into economic growth and farmer prosperity.
        </p>
        <button className="hero-btn">Explore More</button>
      </div>
    </div>

    {/* <div className="Home-scd">
          <div className="Home-scdpara">
            <h1>Organic.Fresh.Eco-friendly</h1>
            <p>From our farm to your home</p>
          </div>
          <div className="img-para-hm">
          <div className="img-scd"></div>
          <div className="para-snd"><p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt neque perspiciatis dolore laudantium officiis doloremque sint ipsam voluptatum velit</p></div>
          </div>

          <div className="img-para-hm-scd">

          <div className="para-snd-scd"><p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt neque perspiciatis dolore laudantium officiis doloremque sint ipsam voluptatum velit</p></div>

          <div className="img-scd-snd"></div>
          
          </div>
    </div> */}
      <div className="sc-hm-dsk">
        <div className="txt-dsc-hm">
          <h1 style={{textAlign: "center"}}>Our Products</h1>
          <p style={{textAlign: "center"}}>Fresh, Organic and Eco-Friendly from us to you.</p>
        </div>

        <div className="img-bx-dsc">
          <div className="img1-dsc" onClick={() => navigate("/products")}>
            <h1>Organic Beetroot</h1>
          </div>
          <div className="img2-dsc">
            <h1>Jardalu &
                Safed Maldah 
                mangos</h1>
          </div>
          <div className="img3-dsc">
            <h1>Organic Carrots</h1>
          </div>
        </div>
      </div>

      <h1 className="txt-hding-home">Customer Testimonia</h1>
      <p className="txt-hding-home">Hear directly from our Customers from all-over the world.</p>
      <div className="Home-thrd">
      <div className="Home-thrd-img">
        <div className="Home-thrd-img-sub">
          <div className="img-sub-home"></div>
          <p className="txt-thdL">Sananda (Sandy) Chatterjee, Auckland, New Zealand</p>
        </div>
      </div>
    </div>
      
    </>
  );
};

export default Home;
