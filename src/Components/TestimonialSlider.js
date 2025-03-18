import React, { useState, useEffect } from "react";
import "./TestimonialSlider.css";
import mangocut from "../images/Mango_cut.jpeg";
import ClientImage from "../images/imgl.png";
import backgroundImageclient from "../images/abh.jfif";
import ClientImage2 from "../images/HamishKing.jfif";

const testimonials = [
  {
    id: 1,
    name: "Sananda (Sandy) Chatterjee",
    location: "Auckland, New Zealand",
    backgroundImage: mangocut,
    clientImage: ClientImage,
    message: "Amazing quality and taste! The best mangoes I've ever had."
  },
  {
    id: 2,
    name: "Hamish King",
    location: "Auckland, New Zealand",
    backgroundImage: backgroundImageclient,
    clientImage: ClientImage2,
    message: "I love the organic products. Super fresh and healthy!"
  }
];

const TestimonialSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="testimonial-container">
      {testimonials.map((testimonial, index) => (
        <div
          key={testimonial.id}
          className={`testimonial-card ${index === currentIndex ? "visible" : "hidden"}`}
          style={{ backgroundImage: `url(${testimonial.backgroundImage})` }}
        >
          <div className="testimonial-content">
            <img src={testimonial.clientImage} alt={testimonial.name} className="client-image" />
            <p className="testimonial-message">"{testimonial.message}"</p>
            <p className="testimonial-name">{testimonial.name}, {testimonial.location}</p>
          </div>
        </div>
      ))}
      <button className="prev-btn" onClick={prevSlide}>❮</button>
      <button className="next-btn" onClick={nextSlide}>❯</button>
    </div>
  );
};

export default TestimonialSlider;
