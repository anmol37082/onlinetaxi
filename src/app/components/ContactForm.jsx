"use client";

import React, { useState } from "react";
import { Send, User, Mail, Phone, MapPin, MessageSquare, CheckCircle } from "lucide-react";
import styles from "./ContactForm.module.css";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "+91",
    address: "",
    message: ""
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          countryCode: "+91",
          address: "",
          message: ""
        });
      } else {
        // Handle error response with better error handling
        const responseText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(responseText);
          console.error("Failed to submit form:", response.status, errorData);
          alert(`Failed to submit form: ${errorData.error || 'Unknown error'}`);
        } catch (jsonError) {
          console.error("Failed to parse JSON error response, raw response text:", responseText);
          // Check if it's an HTML error page (likely due to server configuration issues)
          if (responseText.includes('<html>') || responseText.includes('Please define MONGO_URI')) {
            alert(`Failed to submit form: Server configuration error. Please check your database connection settings.`);
          } else {
            alert(`Failed to submit form: Server returned an unexpected response. Please try again later.`);
          }
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
      // Reset submission state after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    }
  };

  return (
    <section className={styles.contactFormSection}>
      {/* Background Elements */}
      <div className={styles.backgroundElement1}></div>
      <div className={styles.backgroundElement2}></div>
      <div className={styles.backgroundElement3}></div>
      
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <p className={styles.subtitle}>TALK WITH OUR TEAM</p>
          <h2 className={styles.mainTitle}>
            Any Question? Feel Free to Contact
          </h2>
          <p className={styles.description}>
            We're here to help you with all your transportation needs. Fill out the form below 
            and we'll get back to you as soon as possible.
          </p>
        </div>

        {/* Form Container */}
        <div className={styles.formContainer}>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className={styles.contactForm}>
              <div className={styles.formGrid}>
                {/* Left Column */}
                <div className={styles.leftColumn}>
                  {/* Name Field */}
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>
                      <User className={styles.labelIcon} size={16} />
                      Your Name:
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Name*"
                      className={styles.input}
                      required
                    />
                  </div>

                  {/* Email Field */}
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>
                      <Mail className={styles.labelIcon} size={16} />
                      Email:
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email*"
                      className={styles.input}
                      required
                    />
                  </div>

                  {/* Phone Field */}
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>
                      <Phone className={styles.labelIcon} size={16} />
                      Phone:
                    </label>
                    <div className={styles.phoneInputContainer}>
                      <select
                        name="countryCode"
                        value={formData.countryCode}
                        onChange={handleChange}
                        className={styles.countryCode}
                      >
                        <option value="+91">+91</option>
                        <option value="+1">+1</option>
                        <option value="+44">+44</option>
                      </select>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone Number*"
                        className={styles.phoneInput}
                        required
                      />
                    </div>
                  </div>

                  {/* Address Field */}
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>
                      <MapPin className={styles.labelIcon} size={16} />
                      Address:
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Address*"
                      className={styles.input}
                      required
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className={styles.rightColumn}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>
                      <MessageSquare className={styles.labelIcon} size={16} />
                      Messages:
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Message*"
                      className={styles.textarea}
                      rows="12"
                      required
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className={`${styles.submitButton} ${isLoading ? styles.loading : ''}`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className={styles.spinner}></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Submit
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* Success Message */
            <div className={styles.successMessage}>
              <CheckCircle className={styles.successIcon} size={64} />
              <h3 className={styles.successTitle}>Message Sent Successfully!</h3>
              <p className={styles.successText}>
                Thank you for contacting us. We'll get back to you soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactForm;