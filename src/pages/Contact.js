import "./Contact.css";
import React from "react";

const Contact = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div
        className="relative h-80 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-contact.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-4xl font-bold">Contact Us</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-10 px-5">
        {/* Breadcrumb */}
        <p className="text-gray-500 mb-6">Home &gt; Contact Us</p>

        {/* Contact Form Section */}
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Drop us a message to help you out with your queries
            </h2>
            <p className="text-gray-600 mb-4">
              We're just one click away to help you with any details regarding our
              product. Fill in the form to share more details about your query. Or your
              favorite fruit/vegetable. Either way, we'd love to talk.
            </p>
            <div className="border p-4 rounded-lg flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                🤖
              </div>
              <div>
                <p className="font-semibold">Hi, I'm XYZ! Let's chat about your amazing requirements and projects.</p>
                <p className="text-sm text-gray-500">*By submitting your thoughts, so our delivery is ideal from the best results.*</p>
                <div className="flex items-center mt-2 gap-2">
                  <span className="text-green-500">✅</span>
                  <p className="text-green-600">Email Directly to XYZ</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input type="text" placeholder="Your first name" className="p-3 w-full bg-yellow-200 rounded-md" />
              <input type="text" placeholder="Your Surname" className="p-3 w-full bg-yellow-200 rounded-md" />
            </div>
            <input type="email" placeholder="Your email address" className="p-3 w-full bg-yellow-200 rounded-md mb-4" />
            <textarea placeholder="Your Message here" className="p-3 w-full bg-yellow-200 rounded-md mb-4 h-32"></textarea>
            <button className="bg-blue-500 text-white px-6 py-2 rounded-md">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
