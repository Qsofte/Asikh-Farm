import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./ProductSlider.css";
import beetrootImage from "../images/Beetroot.png";
import mangoImage from "../images/mangogreen.jpeg";
import carrotImage from "../images/Carrot.png";

const products = [
  {
    id: 1,
    name: "Organic Beetroot",
    image: beetrootImage,
    description: "Fresh and organic beetroot sourced from our farms.",
  },
  {
    id: 2,
    name: "Jardalu & Safed Maldah Mango",
    image: mangoImage,
    description: "Sweet and juicy mangoes, perfect for every occasion.",
  },
  {
    id: 3,
    name: "Organic Carrots",
    image: carrotImage,
    description: "Crunchy and nutritious organic carrots for a healthy diet.",
  },
];

const ProductSlider = () => {

  const navigate = useNavigate(); // Initialize useNavigate()

  const [activeIndex, setActiveIndex] = useState(null);
  const [slidesPerView, setSlidesPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      setSlidesPerView(window.innerWidth < 768 ? 1 : 3);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

    // Function to navigate to Contact Us page
    const handleKnowMore = () => {
      navigate("/contact"); // Redirect to Contact Us page
    };

  return (
    <div className="product-slider">
      <Swiper
        slidesPerView={slidesPerView}
        spaceBetween={0}
        loop={true}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 3000 }}
        style={{ height: "498px" }}
      >
        {products.map((product, index) => (
          <SwiperSlide key={product.id}>
            <div
              className={`product-card ${activeIndex === index ? "active" : ""}`}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <img src={product.image} alt={product.name} />
              <div className="product-info">
                <h2 className="product-name">{product.name}</h2>
                <p className="product-description">{product.description}</p>
                <button className="know-more" onClick={handleKnowMore}>Know More</button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductSlider;
