import React from "react";
// import './About.css';

const About = () => {
  return (
    <div className="bg-white" style={{marginTop: "20%"}}>
      {/* Hero Section */}
      <div className="relative h-80 bg-cover bg-center" style={{ backgroundImage: "url('/hero-image.jpg')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-4xl font-bold">About Us</h1>
        </div>
      </div>
      
      {/* Content Sections */}
      <div className="max-w-6xl mx-auto py-10 px-5">
        {/* Our Story */}
        <div className="md:flex md:items-center md:space-x-8 mb-10">
          <img src="/story-image.jpg" alt="Our Story" className="w-48 h-48 rounded-full mx-auto md:mx-0" />
          <div>
            <h2 className="text-2xl font-semibold mb-2">Our Story</h2>
            <p className="text-gray-600">Fruits from his farms—sent as a token of blessings, good wishes, and gratitude—to loved ones abroad and the local community that cares for them in foreign lands. A simple act of kindness, rooted in tradition, carried across borders.

What began as a heartfelt gesture soon grew into a larger vision—one that sought to bridge the gap between the farmers of Bihar and fork holders in faraway lands. A dream nurtured by the desire to connect those who cultivate with those who consume, ensuring that the essence of home reaches distant tables.

This vision found life through the dedication of his son, Dr. Maurya Vijay Chandra, whose relentless efforts, along with the unwavering support of many well-wishers, turned aspiration into reality. A journey of connection, gratitude, and shared prosperity continues to unfold.</p>
          </div>
        </div>
        
        {/* Our Mission */}
        <div className="md:flex md:items-center md:space-x-8 mb-10 flex-row-reverse">
          <img src="/mission-image.jpg" alt="Our Mission" className="w-48 h-48 rounded-full mx-auto md:mx-0" />
          <div>
            <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
            <p className="text-gray-600"> At Ashik Farm, we are committed to making Bihar a global leader in organic mango exports, ensuring fresh, naturally grown mangoes reach premium markets. Over the past six years, we have built a seamless farm-to-fork logistics system, helping farmers meet global organic export standards while enhancing their skills. Our vision includes developing organic-certified packhouses and ripening chambers, strengthening cold chain infrastructure and eco-friendly packaging, expanding mechanized loading and export facilities, and simplifying custom clearance and documentation to boost Bihar’s mango trade.

Despite producing 30% of India’s mangoes, Bihar’s exports remain low. In 2023, India exported 27,330 tonnes, while Bihar contributed only 1,200 tonnes, mainly to neighboring countries. Our goal is to increase Bihar’s exports to 9,110 tonnes annually, positioning it as a global hub for premium organic mangoes. 

By investing in critical infrastructure and sustainable practices, we aim to unlock Bihar’s true potential and drive prosperity for local farmers.</p>
          </div>
        </div>
        
        {/* Our Vision */}
        <div className="md:flex md:items-center md:space-x-8 mb-10">
          <img src="/vision-image.jpg" alt="Our Vision" className="w-48 h-48 rounded-full mx-auto md:mx-0" />
          <div>
            <h2 className="text-2xl font-semibold mb-2">Our Vision</h2>
            <p className="text-gray-600">We aim to expand globally while maintaining top quality...</p>
          </div>
        </div>
      </div>

      {/* Countries Section */}
      <div className="bg-gray-100 py-8 text-center">
        <h2 className="text-xl font-semibold mb-4">From India to the World</h2>
        <div className="flex justify-center space-x-6">
          <img src="/uk-flag.png" alt="UK" className="w-16 h-10" />
          <img src="/germany-flag.png" alt="Germany" className="w-16 h-10" />
          <img src="/nz-flag.png" alt="New Zealand" className="w-16 h-10" />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-6 mt-10">
        <div className="mb-4">
          <img src="/logo.png" alt="Logo" className="mx-auto w-16" />
        </div>
        <p>&copy; 2025 YourCompany LLC. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default About;
