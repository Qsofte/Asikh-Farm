import React, { useState } from "react";
import "./Contact.css";
import profile from '../images/profileD.jpg';
import { useNavigate } from "react-router-dom";

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
    
    const recipientEmail = "support@asikhfarms.in"; // Change this to your email
    const subject = "New Contact Form Submission";
    const body = `First Name: ${formData.firstName}%0A
    Surname: ${formData.surname}%0A
    Email: ${formData.email}%0A
    Message: ${formData.message}`;

    window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
    
    setFormData({
      firstName: "",
      surname: "",
      email: "",
      message: "",
    });
  };

  const navigate = useNavigate();
  
    const navigateHm = () => {
      navigate("/");
    }

  return (
    <div className="contact-container-abc">
      <div className="header-image-abc">
        <h1 className="contact-title-abc">Contact Us</h1>
      </div>
      <div onClick={navigateHm} style={{cursor: "pointer"}} className="breadcrumb-abc">Home › Contact Us</div>
      <h2 className="info-title-abc">Drop us a message to help you out with your queries</h2>
      <div className="contact-content-abc">
        <div className="info-section-abc">
          <p className="info-text-abc">
            We’re just one click away to help you with any details regarding our product. Fill in the form to share more details about your query.
          </p>
          <div className="profile-abc">
            <img src={profile} alt="Profile" className="profile-img-abc" />
            <p className="profile-text-abc">Hi, reach out to us at support@asikhfarms.in for any enquiries or questions that you may have.</p>
            <p className="quote-abc">“I enjoy translating your thoughts to our diversely skilled team for the best results”</p>
          </div>
        </div>
        <div className="form-section-abc">
          <form onSubmit={handleSubmit} className="contact-form-abc">
            <div className="form-group-abc FirstN-abcd">
              <label>First Name:</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Your first name" required />
            </div>
            <div className="form-group-abc surname-abcd">
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
