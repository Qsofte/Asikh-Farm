import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
        className="relative w-full h-40 bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url('../images/3rd-Home-main.png')` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <h1 className="relative z-10 text-4xl md:text-5xl font-gilroy-semibold text-white">
          {t('contact.title')}
        </h1>
      </div>

      {/* Breadcrumb Navigation */}
      <div
        className="px-5 py-5 font-gilroy-semibold text-base cursor-pointer hover:text-primary-green transition-colors"
        onClick={() => navigate('/')}
      >
        {t('contact.breadcrumb')}
      </div>

      {/* Main Heading */}
      <h2 className="text-2xl md:text-3xl font-gilroy-semibold text-primary-dark text-center px-4 mb-12">
        {t('contact.heading')}
      </h2>

      {/* Content Section */}
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-start justify-center gap-8 mb-20">
        {/* Form Section */}
        <div className="md:w-7/12 lg:w-2/3">
          {formSubmitted && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {t('contact.successMessage')}
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
                  {t('contact.form.firstNameLabel')}
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder={t('contact.form.firstNamePlaceholder')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
                  required
                />
              </div>

              <div className="flex-1">
                <label
                  htmlFor="surname"
                  className="block text-primary-dark font-gilroy-semibold mb-2"
                >
                  {t('contact.form.surnameLabel')}
                </label>
                <input
                  type="text"
                  id="surname"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  placeholder={t('contact.form.surnamePlaceholder')}
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
                {t('contact.form.emailLabel')}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t('contact.form.emailPlaceholder')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="message"
                className="block text-primary-dark font-gilroy-semibold mb-2"
              >
                {t('contact.form.messageLabel')}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={t('contact.form.messagePlaceholder')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg h-40 resize-y focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-secondary-blue text-white font-gilroy-semibold py-3 px-6 rounded-lg float-right hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              {t('contact.form.submit')}
            </button>
            <div className="clear-both"></div>
          </form>
        </div>

        {/* Business Contact Details */}
        <div className="md:w-5/12 lg:w-1/3 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-gilroy-semibold text-primary-dark mb-4">
            Contact Details
          </h3>
          <p className="mb-2">
            <strong>Address:</strong> KH. 314, Plot I-IA, Jaffarpur Extn., Najafgarh, South West Delhi, Delhi, 110073, India
          </p>
          <p className="mb-2">
            <strong>Email:</strong> Mayank@asikhfarms.in
          </p>
          <p className="mb-2">
            <strong>Phone:</strong> +91-9999714807
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
