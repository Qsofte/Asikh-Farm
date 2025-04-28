import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import beetrootImage from '../images/Beetroot.png';
import mangoImage from '../images/mangogreen.jpeg';
import carrotImage from '../images/Carrot.png';
import { useTranslation } from 'react-i18next';

const products = [
  {
    id: 1,
    image: beetrootImage,
    description:
      'Fresh and organic beetroot sourced from our farms with sustainable farming practices.',
  },
  {
    id: 2,
    image: mangoImage,
    description:
      "Sweet and juicy mangoes with a rich aroma, grown naturally in Bihar's fertile soil.",
  },
  {
    id: 3,
    image: carrotImage,
    description:
      'Crunchy and nutritious organic carrots, packed with vitamins and antioxidants.',
  },
];

const ProductSlider = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [slidesPerView, setSlidesPerView] = useState(3);

  // Responsive setup based on window size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setSlidesPerView(1);
      } else if (width < 1024) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function to navigate to Contact Us page
  const handleKnowMore = () => {
    navigate('/contact');
    window.scrollTo(0, 0);
  };

  return (
    <div className="w-4/5 max-w-5xl mx-auto mb-8">
      <div className="h-[300px] md:h-[280px] relative overflow-hidden rounded-xl shadow-xl mb-4">
        <Swiper
          slidesPerView={slidesPerView}
          spaceBetween={20}
          loop={true}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={800}
          touchStartPreventDefault={false}
          touchMoveStopPropagation={false}
          className="h-full py-5 px-4"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="relative h-full overflow-hidden">
                <img
                  src={product.image}
                  alt={t(`productsSection.products.${product.id}`)}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-6 text-center">
                  <h2 className="text-white text-lg md:text-xl font-gilroy-semibold text-center">
                    {t(`productsSection.products.${product.id}`)}
                  </h2>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {/* Single CTA button */}
      <div className="flex justify-center mt-4">
        <button
          onClick={handleKnowMore}
          className="bg-accent-yellow text-primary-dark px-6 py-3 rounded-full font-bold uppercase text-sm hover:bg-amber-400"
          aria-label="Learn more about our products"
        >
          {t('knowMore')}
        </button>
      </div>
    </div>
  );
};

export default ProductSlider;
