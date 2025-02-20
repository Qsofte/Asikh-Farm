import React from "react";
import './Home.css';

const Home = () => {
  return (
    <>
    <div className="Home-para">
      <h1 className="Heading-fst">Asikh Farms</h1>
      <p className="para-fst">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.    gcgjvgvjcggch</p>

      <button className="btn-fst">Know More</button>
    </div>

    <div className="Home-scd">
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
    </div>
    </>
  );
};

export default Home;
