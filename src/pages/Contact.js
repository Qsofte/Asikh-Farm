import React, { useState } from "react";
import "./Contact.css";
import profile from '../images/imgl.png';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    surname: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // WhatsApp Number (Replace with actual number)
    const phoneNumber = "919135870743";

    // Format the message
    const whatsappMessage = `First Name: ${formData.firstName}%0A
Surname: ${formData.surname}%0A
Email: ${formData.email}%0A
Message: ${formData.message}`;

    // Create WhatsApp URL
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;

    // Open WhatsApp
    window.open(whatsappURL, "_blank");

    // Reset the form fields
    setFormData({
      firstName: "",
      surname: "",
      email: "",
      message: "",
    });
  };

  // Function to open email client
  const handleEmailClick = () => {
    const email = "xyz@example.com"; // Replace with your actual email
    const subject = "Inquiry from Contact Form";
    const body = `Hello XYZ,%0A%0AI have an inquiry about your services. Please get back to me at your earliest convenience.%0A%0AThank you!`;

    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="contact-container-abc">
      <div className="header-image-abc">
        <h1 className="contact-title-abc">Contact Us</h1>
      </div>
      <div className="breadcrumb-abc">Home › Contact Us</div>
      <div className="contact-content-abc">
        <div className="info-section-abc">
          <h2 className="info-title-abc">Drop us a message to help you out with your queries</h2>
          <p className="info-text-abc">
            We’re just one click away to help you with any details regarding our product. Fill in the form to share more details about your query. Or your favourite fruit/vegetable. Either way, we’d love to talk.
          </p>
          <div className="profile-abc">
            <img src={profile} alt="Profile" className="profile-img-abc" />
            <p className="profile-text-abc">
              Hi, I’m XYZ! Let’s chat about your amazing requirements and projects.
            </p>
            <p className="quote-abc">
              “I enjoy translating your thoughts to our diversely skilled team for the best results”
            </p>
            <p className="email-link-abc" onClick={handleEmailClick} style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}>
              ✅ Email Directly to XYZ
            </p>
          </div>
        </div>
        <div className="form-section-abc">
          <form onSubmit={handleSubmit} className="contact-form-abc">
            <div className="form-group-abc">
              <label>First Name:</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Your first name" required />
            </div>
            <div className="form-group-abc">
              <label>Surname:</label>
              <input className="surname-abc" type="text" name="surname" value={formData.surname} onChange={handleChange} placeholder="Your Surname" required />
            </div>
            <div className="form-group-abc full-width-abc">
              <label>Your email:</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your email address" required />
            </div>
            <div className="form-group-abc full-width-abc">
              <label>Message:</label>
              <textarea className="msg-abc" name="message" value={formData.message} onChange={handleChange} placeholder="Your Message here" required></textarea>
            </div>
            <button type="submit" className="submit-btn-abc">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
