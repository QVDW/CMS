'use client';

import { useState } from 'react';
import { FaUser, FaBriefcase, FaPhone, FaEnvelope, FaPaperPlane, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

interface ContactFormData {
  name: string;
  title: string;
  description: string;
  contact: string;
  company?: string;
}

interface ContactFormErrors {
  name?: string;
  title?: string;
  description?: string;
  contact?: string;
}

export default function ContactSection() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    title: '',
    description: '',
    contact: '',
    company: ''
  });
  
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateForm = (): boolean => {
    const newErrors: ContactFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Naam is verplicht';
    }

    
    if (!formData.description.trim()) {
      newErrors.description = 'Beschrijving is verplicht';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Beschrijving moet minimaal 10 karakters zijn';
    }
    


    if (!formData.contact.trim()) {
      newErrors.contact = 'E-mail is verplicht';
    } else {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (!emailRegex.test(formData.contact)) {
        newErrors.contact = 'Voer een geldig e-mailadres in';
      }
    }

    if (formData.title.trim()) {
      // Phone validation (only if filled in, since it's optional now)
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
      
      if (!phoneRegex.test(formData.title)) {
        newErrors.title = 'Voer een geldig telefoonnummer in';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof ContactFormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Prepare email data for the API
      const emailData = {
        title: formData.title,
        message: formData.description,
        contactDetails: `Naam: ${formData.name}${formData.company ? `\nBedrijf: ${formData.company}` : ''}\nContact: ${formData.contact}`
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        title: '',
        description: '',
        contact: '',
        company: ''
      });
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact-section">
        <div className="contact-page">
          <div className="contact-info">
            <div className="contact-info-content">
            <h1 className="contact-title">Neem Contact Op</h1>
            <p className="contact-text">
              Heeft u een vraag of bent u geïnteresseerd in samenwerking? 
              Vul het formulier in en wij nemen zo snel mogelijk contact met u op.
            </p>
            <p className="contact-text">
              <FaPhone />
              +31 6 12345678
            </p>
            <p className="contact-text">
              <FaEnvelope />
              contact@qvdw.dev
              </p>
            </div>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <h1>Neem Contact Op</h1>
            <h2>Gegarandeerd reactie binnen 24 uur</h2>
            {submitStatus === 'success' && (
              <div className="submit-status success">
                <FaCheckCircle style={{ marginRight: '0.5rem' }} />
                Uw bericht is succesvol verzonden naar contact@qvdw.dev! Wij nemen zo snel mogelijk contact met u op.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="submit-status error">
                <FaExclamationTriangle style={{ marginRight: '0.5rem' }} />
                Er is een fout opgetreden bij het verzenden van uw bericht. Probeer het later opnieuw of stuur een email naar contact@qvdw.dev.
              </div>
            )}

            <div className="form-group form-group-50">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Naam*"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group form-group-50">
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Bedrijf"
              />
            </div>

            <div className="form-group form-group-100">
              <label htmlFor="contact">
                <FaEnvelope />
              </label>
              <input
                type="email"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                placeholder="E-mail*"
                className={errors.contact ? 'error' : ''}
              />
              {errors.contact && <span className="error-message">{errors.contact}</span>}
            </div>

            <div className="form-group form-group-100">
              <label htmlFor="title">
                <FaPhone />
              </label>
              <input
                type="tel"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Telefoonnummer"
                className={errors.title ? 'error' : ''}
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>

            <div className="form-group form-group-100">
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Beschrijf uw vraag of project in detail..."
                rows={6}
                className={`form-group-100 ${errors.description ? 'error' : ''}`}
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner"></div>
                  Bezig met verzenden...
                </>
              ) : (
                <>
                  <FaPaperPlane style={{ marginRight: '0.5rem' }} />
                  Verstuur Bericht
                </>
              )}
            </button>
            <p className="contact-text">
              Door contact op te nemen met ons, gaat u akkoord met onze <a href="/privacy">privacyverklaring</a>.
            </p>
          </form>
        </div>
    </section>
  );
} 