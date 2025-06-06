"use client";

import { useState, FormEvent } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

interface FormData {
  title: string;
  message: string;
  contactDetails: string;
}

export default function ContactPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    message: "",
    contactDetails: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.message) {
      setSubmitStatus({
        success: false,
        message: "Title and message are required.",
      });
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSubmitStatus({
          success: true,
          message: "Your message has been sent. Thank you!",
        });
        setFormData({
          title: "",
          message: "",
          contactDetails: "",
        });
      } else {
        setSubmitStatus({
          success: false,
          message: data.message || "Failed to send message. Please try again.",
        });
      }
    } catch {
      setSubmitStatus({
        success: false,
        message: "An error occurred. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <div className="container">
        <main className="contact-page">
          <h1 className="contact-title">Contact Us</h1>
          <p className="contact-intro">
            Have a question or want to contact us? Fill out the form below and we will contact you as soon as possible.
          </p>
          
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title <span className="required">*</span></label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter the subject of your message"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Message <span className="required">*</span></label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Enter your message"
                rows={6}
                required
              ></textarea>
            </div>
            
            <div className="form-group">
              <label htmlFor="contactDetails">
                Contact details <span className="optional">(optional)</span>
              </label>
              <input
                type="text"
                id="contactDetails"
                name="contactDetails"
                value={formData.contactDetails}
                onChange={handleChange}
                placeholder="Email or phone number where we can reach you"
              />
            </div>
            
            {submitStatus && (
              <div className={`submit-status ${submitStatus.success ? 'success' : 'error'}`}>
                {submitStatus.message}
              </div>
            )}
            
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </main>
      </div>
      <Footer />
    </div>
  );
} 