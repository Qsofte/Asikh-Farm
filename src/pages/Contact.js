import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import profile from '../images/profileD.jpg';

const Contact = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    email: '',
    message: '',
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare email content
    const recipientEmail = 'support@asikhfarms.in';
    const subject = 'New Contact Form Submission';
    const body = `First Name: ${formData.firstName}%0A
    Surname: ${formData.surname}%0A
    Email: ${formData.email}%0A
    Message: ${formData.message}`;

    // Open email client
    window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;

    // Reset form and show success message
    setFormData({
      firstName: '',
      surname: '',
      email: '',
      message: '',
    });

    setFormSubmitted(true);

    // Hide success message after 5 seconds
    setTimeout(() => {
      setFormSubmitted(false);
    }, 5000);
  };

  return (
    <div className="bg-primary-light pt-20 min-h-screen">
      {/* Header Section */}
      <div
        className="relative w-full h-80 bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url('../images/3rd-Home-main.png')` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <h1 className="relative z-10 text-4xl md:text-5xl font-gilroy-semibold text-white">
          Contact Us
        </h1>
      </div>

      {/* Breadcrumb Navigation */}
      <div
        className="px-5 py-5 font-gilroy-semibold text-base cursor-pointer hover:text-primary-green transition-colors"
        onClick={() => navigate('/')}
      >
        Home › Contact Us
      </div>

      {/* Main Heading */}
      <h2 className="text-2xl md:text-3xl font-gilroy-semibold text-primary-dark text-center px-4 mb-12">
        Drop us a message to help you out with your queries
      </h2>

      {/* Content Section */}
      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-8 mb-20">
        {/* Information Section */}
        <div className="md:w-5/12 lg:w-1/3">
          <p className="text-primary-dark text-lg font-gilroy-regular mb-8">
            We're just one click away to help you with any details regarding our
            product. Fill in the form to share more details about your query,
            and our team will get back to you promptly.
          </p>

          <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
            <div className="flex items-start gap-4 mb-4">
              <img
                src={profile}
                alt="Support Team Member"
                className="w-12 h-12 rounded-full object-cover border-2 border-primary-green"
              />
              <div>
                <h3 className="font-gilroy-semibold text-lg text-primary-dark">
                  Customer Support
                </h3>
              </div>
            </div>
            <p className="text-primary-dark font-gilroy-regular mb-4">
              Hi, reach out to us at support@asikhfarms.in for any enquiries or
              questions that you may have.
            </p>
            <p className="text-secondary-gray italic font-gilroy-light text-sm border-l-2 border-primary-green pl-3 mb-4">
              "I enjoy translating your thoughts to our diversely skilled team
              for the best results"
            </p>
            <a
              href="mailto:support@asikhfarms.in"
              className="text-primary-green font-gilroy-medium hover:underline"
            >
              support@asikhfarms.in
            </a>
          </div>
        </div>

        {/* Form Section */}
        <div className="md:w-7/12 lg:w-2/3">
          {formSubmitted && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              Thank you for your message! We'll get back to you soon.
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1">
                <label
                  htmlFor="firstName"
                  className="block text-primary-dark font-gilroy-semibold mb-2"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Your first name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
                  required
                />
              </div>

              <div className="flex-1">
                <label
                  htmlFor="surname"
                  className="block text-primary-dark font-gilroy-semibold mb-2"
                >
                  Surname
                </label>
                <input
                  type="text"
                  id="surname"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  placeholder="Your surname"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-primary-dark font-gilroy-semibold mb-2"
              >
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email address"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="message"
                className="block text-primary-dark font-gilroy-semibold mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message here"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg h-40 resize-y focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-secondary-blue text-white font-gilroy-semibold py-3 px-6 rounded-lg float-right hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Send Message
            </button>
            <div className="clear-both"></div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
