import React, { useState } from 'react';
import Head from 'next/head';
import { Layout } from '../components';
import { writeClient } from '../lib/client';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      // Create a new document in Sanity
      await writeClient.create({
        _type: 'contactMessage',
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        submitDate: new Date().toISOString()
      });

      // Reset form and show success message
      setFormData({ name: '', email: '', subject: '', message: '' });
      setFormSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormError('There was an error submitting your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Contact Us - Binod Tech Ventures</title>
        <meta name="description" content="Get in touch with Binod Tech Ventures" />
      </Head>

      {/* Contact Hero Section */}
      <div className="about-hero">
        <div className="container max-w-6xl mx-auto px-4 py-20 text-center text-white">
          <h1 className="text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Have questions or want to learn more about our products? We're here to help.
          </p>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="py-20 bg-white">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-xl p-8">
            {formSubmitted ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">✅</div>
                <h2 className="text-3xl font-bold mb-4 text-gray-800">Message Sent!</h2>
                <p className="text-xl mb-8">Thank you for reaching out. We'll get back to you as soon as possible.</p>
                <button 
                  onClick={() => setFormSubmitted(false)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Get In Touch</h2>
                
                {formError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {formError}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Your Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">Subject</label>
                    <input 
                      type="text" 
                      id="subject" 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Your Message</label>
                    <textarea 
                      id="message" 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="6" 
                      className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    ></textarea>
                  </div>
                  
                  <div className="text-center">
                    <button 
                      type="submit"
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-colors"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Contact Info Section */}
      <div className="py-20 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="text-5xl mb-4">📍</div>
              <h3 className="text-2xl font-bold mb-4">Our Location</h3>
              <p>123 Tech Park Avenue<br />Innovation District<br />Mumbai, Maharashtra 400001<br />India</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-2xl font-bold mb-4">Phone & Email</h3>
              <p>+91 98765 43210<br />hello@binodtechventures.com<br />support@binodtechventures.com</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="text-5xl mb-4">⏰</div>
              <h3 className="text-2xl font-bold mb-4">Business Hours</h3>
              <p>Monday - Friday: 10:00 AM - 7:00 PM<br />Saturday: 10:00 AM - 3:00 PM<br />Sunday: Closed</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;