import React, { useState, useEffect } from 'react';
import mangocut from '../images/Mango_cut.jpeg';
import ClientImage from '../images/imgl.png';
import backgroundImageclient from '../images/abh.jfif';
import ClientImage2 from '../images/HamishKing.jfif';

const testimonials = [
  {
    id: 1,
    name: 'Sananda (Sandy) Chatterjee',
    location: 'Auckland, New Zealand',
    backgroundImage: mangocut,
    clientImage: ClientImage,
    message:
      "Amazing quality and taste! The mangoes from Asikh Farms are the best I've ever had. The natural sweetness and aroma transport me back to the orchards of Bihar.",
  },
  {
    id: 2,
    name: 'Hamish King',
    location: 'Auckland, New Zealand',
    backgroundImage: backgroundImageclient,
    clientImage: ClientImage2,
    message:
      'I love the organic products from Asikh Farms. Everything is super fresh, healthy, and you can taste the care that goes into growing their produce. Truly farm-to-table quality.',
  },
];

const TestimonialSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        changeSlide((currentIndex + 1) % testimonials.length);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, isTransitioning]);

  // Handle slide transition
  const changeSlide = (index) => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setCurrentIndex(index);

    // Reset transitioning state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  // Navigation handlers
  const nextSlide = () => {
    changeSlide((currentIndex + 1) % testimonials.length);
  };

  const prevSlide = () => {
    changeSlide((currentIndex - 1 + testimonials.length) % testimonials.length);
  };

  // Go to specific slide
  const goToSlide = (index) => {
    changeSlide(index);
  };

  return (
    <div className="w-4/5 max-w-5xl mx-auto h-[500px] md:h-[450px] relative mb-20 overflow-hidden rounded-xl shadow-xl">
      {testimonials.map((testimonial, index) => (
        <div
          key={testimonial.id}
          className={`absolute w-full h-full bg-cover bg-center transition-all duration-500 ease-in-out ${
            index === currentIndex
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-5'
          }`}
          style={{ backgroundImage: `url(${testimonial.backgroundImage})` }}
          aria-hidden={index !== currentIndex}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-11/12 max-w-xl bg-white bg-opacity-90 p-8 rounded-lg shadow-lg">
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
              <img
                src={testimonial.clientImage}
                alt={testimonial.name}
                className="w-20 h-20 rounded-full border-4 border-white shadow-md object-cover"
                loading="lazy"
              />
            </div>
            <div className="mt-10 text-center">
              <p className="text-gray-800 italic mb-4 font-gilroy-medium">
                "{testimonial.message}"
              </p>
              <h3 className="text-gray-900 font-gilroy-semibold text-lg">
                {testimonial.name}
              </h3>
              <p className="text-gray-600 text-sm font-gilroy-regular">
                {testimonial.location}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <button
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-80 w-10 h-10 rounded-full flex items-center justify-center text-primary-green hover:bg-white hover:scale-110 transition-all duration-300 z-10"
        onClick={prevSlide}
        aria-label="Previous testimonial"
      >
        ❮
      </button>
      <button
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-80 w-10 h-10 rounded-full flex items-center justify-center text-primary-green hover:bg-white hover:scale-110 transition-all duration-300 z-10"
        onClick={nextSlide}
        aria-label="Next testimonial"
      >
        ❯
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-primary-green scale-125'
                : 'bg-white bg-opacity-50'
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialSlider;
