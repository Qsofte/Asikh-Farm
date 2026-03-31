import React, { useEffect } from "react";
import { Helmet } from 'react-helmet-async';
import farmImg from "../images/Farm.png";
import img1 from "../images/Cus7.jpg";
import img2 from "../images/Cus2.jpg";
import img3 from "../images/Cus3.jpg";
import img4 from "../images/Cus4.jpg";
import img5 from "../images/Cus5.jpg";
import img6 from "../images/Cus6.jpg";
import img7 from "../images/Cus1.jpg";
import heroImg from "../images/treeB.jpg";
import qrCode from "../images/qr_web.png";
import { FaWhatsapp } from "react-icons/fa";
import mango from "../images/Jardalu.jpg";
import gur from "../images/Gur.png";
import chura from "../images/KatarniChura.jpg";
import banana from "../images/Banana.jpg";

const About = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>About Us — Asikh Farms | Bihar's Farm-Fresh Produce</title>
        <meta name="description" content="Learn about Asikh Farms — a family-run farm in Bihar bringing you the finest Jardalu mangoes, Shahi lychee, and seasonal produce straight from the orchard." />
        <link rel="canonical" href="https://asikhfarms.in/about" />
        <meta property="og:url" content="https://asikhfarms.in/about" />
        <meta property="og:title" content="About Us — Asikh Farms | Bihar's Farm-Fresh Produce" />
        <meta property="og:description" content="Learn about Asikh Farms — a family-run farm in Bihar bringing you Jardalu mangoes, Shahi lychee, and seasonal produce straight from the orchard." />
        <meta property="og:image" content="https://asikhfarms.in/android-chrome-512x512.png" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://asikhfarms.in/" },
            { "@type": "ListItem", "position": 2, "name": "About", "item": "https://asikhfarms.in/about" }
          ]
        })}</script>
      </Helmet>
    <div className="bg-green-50">

      {/* HERO SECTION */}
      <section className="relative h-[90vh] w-full overflow-hidden">

  {/* Background Image */}
  <img
    src={heroImg}
    alt="Mango"
    className="absolute w-full h-full object-cover"
  />

  {/* Gradient Overlay (like brochure) */}
  <div className="absolute inset-0 bg-gradient-to-t from-blue-200/80 via-transparent to-yellow-300/40"></div>

  {/* Content Wrapper */}
  <div className="relative z-10 h-full flex flex-col justify-end px-6 pb-10">

    {/* Contact Details */}
    <div className="text-primary-dark text-sm md:text-base font-gilroy-medium space-y-1">
      <p className="flex items-center gap-2">
  <FaWhatsapp className="text-green-600 text-lg" />
  +91 8092242248
</p>
      <p>📞 +91 9811942958/+91 8092242251</p>
      <p>🌐 www.asikhfarms.in</p>
    </div>

    {/* QR Code */}
    <div className="absolute bottom-10 right-6 bg-white p-3 rounded-xl shadow-lg">
      <img
        src={qrCode}
        alt="QR Code"
        className="w-20 h-20 md:w-28 md:h-28 object-contain"
      />
    </div>

  </div>
</section>

      {/* ROOTS SECTION */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto bg-white rounded-[40px] p-6 md:p-10 shadow-md border-r-8 border-yellow-400">
          
          <h2 className="text-2xl md:text-3xl font-lobster text-primary-dark mb-4">
            Our Roots, Our Flavour
          </h2>

          <p className="text-base md:text-lg text-gray-700 leading-relaxed">
            At Asikh Farms, our story begins in the fertile soils of Bihar, India. 
            Since 2019, we have been on a mission to share the authentic, unique 
            flavors of our region—specifically our celebrated GI-tagged Jardalu 
            and Safed Malda mangoes—with the world.
          </p>

          <p className="mt-4 text-base md:text-lg text-gray-700 leading-relaxed">
            By collaborating directly with local farmers and introducing 
            sustainable Good Agricultural Practices (GAP), we empower 
            communities while delivering premium quality produce globally.
          </p>
        </div>
      </section>

      {/* IMAGE SECTION */}
      <section className="px-4 pb-12">
        <div className="max-w-5xl mx-auto overflow-hidden rounded-[40px] border-l-8 border-yellow-400">
          <img
            src={farmImg}
            alt="Farm"
            className="w-full h-[400px] object-cover"
          />
        </div>
      </section>

      {/* PRODUCT SECTION */}
      <section className="py-12 px-4 bg-green-100">
        <div className="max-w-5xl mx-auto bg-white rounded-[40px] p-6 md:p-10 shadow-md border-r-8 border-yellow-400">
          
          <h2 className="text-2xl md:text-3xl font-lobster text-primary-dark mb-4">
            G.I Tagged Jardalu
          </h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            Grown in Bhagalpur, Bihar, the Jardalu mango is known for its golden 
            hue, intense aroma, and rich flavor. It has gained global recognition 
            and is exported internationally.
          </p>

          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>GI-Certified Origin – Bhagalpur, Bihar</li>
            <li>Exquisite sweet flavor with rich aroma</li>
            <li>Handpicked and carefully graded</li>
            <li>Premium seasonal availability</li>
          </ul>

        </div>
      </section>

      {/* SECOND PRODUCT */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto bg-white rounded-[40px] p-6 md:p-10 shadow-md border-r-8 border-yellow-400">
          
          <h2 className="text-2xl md:text-3xl font-lobster text-primary-dark mb-4">
            Safed Malda
          </h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            Known for its creamy texture and sweetness, Safed Malda mango is 
            a premium variety from Bihar, loved for its rich pulp and smooth taste.
          </p>

          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>Greenish-yellow skin turning golden</li>
            <li>Sweet, creamy texture</li>
            <li>Medium to large size fruits</li>
            <li>Available June to August</li>
          </ul>

        </div>
      </section>

      {/* CUSTOMER FEEDBACK */}
      <section className="py-12 px-4 bg-green-100">
        <div className="max-w-5xl mx-auto bg-white rounded-[40px] p-6 md:p-10 shadow-md border-r-8 border-yellow-400">
          
          <h2 className="text-2xl md:text-3xl font-lobster text-primary-dark mb-6">
            Customer Feedback
          </h2>

          <p className="text-gray-700 mb-4">
            "Everything is super fresh, healthy, and full of flavor. Truly farm-to-table quality."
          </p>

          <p className="text-gray-700 mb-6">
            "The mangoes are the best I've ever had. The sweetness and aroma are unmatched."
          </p>

          {/* Image Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[img1, img2, img3, img4, img5, img6].map((img, index) => (
    <div className="overflow-hidden rounded-lg h-32 md:h-40">
  <img
    src={img}
    alt={`Customer ${index + 1}`}
    className="w-full h-half object-cover hover:scale-105 transition duration-300"
  />
</div>
  ))}
          </div>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-0 max-w-5xl mx-auto overflow-hidden rounded-[40px] border-l-8 border-yellow-400">
          <img
            src={img7}
            alt="Customer"
            className="object-cover"
          />
        </div>
        </div>
      </section>

      {/* PRODUCTS LIST */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto bg-white rounded-[40px] p-6 md:p-10 shadow-md border-r-8 border-yellow-400">
          
          <h2 className="text-2xl md:text-3xl font-lobster text-primary-dark mb-6">
            Premium Agri Products
          </h2>

          <div className="space-y-4">
            <div className="space-y-6">

  {[
    { name: "Jardalu / Safed Maldah Aam", img: mango },
    { name: "Chemical Free Gur (Jaggery)", img: gur },
    { name: "Katarni Dhaan Ka Chura", img: chura },
    { name: "Banana (Chiniya/Kela)", img: banana }
  ].map((item, index) => (
    
    <div
      key={index}
      className="flex items-center bg-[#9BB67A] rounded-full p-2 md:p-3 shadow-sm"
    >
      
      {/* Image */}
      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden flex-shrink-0">
        <img
          src={item.img}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Text */}
      <p className="ml-4 text-sm md:text-lg font-gilroy-medium text-primary-dark">
        {item.name}
      </p>

    </div>

  ))}

</div>
          </div>

        </div>
      </section>

    </div>
    </>
  );
};

export default About;