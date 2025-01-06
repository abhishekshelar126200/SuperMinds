import React from 'react'
import './Footer.css';
import { Mail, Phone, Instagram, Linkedin, Github } from 'lucide-react';

function Footer() {
  return (
    

    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Company Info Section */}
          <div className="company-info">
            <h3 className="footer-title">SocialLens</h3>
            <p className="company-description">
              Transforming ideas into digital reality. We create amazing digital experiences.
            </p>
          </div>

          {/* Contact Info Section */}
          <div className="contact-info">
            <h4 className="section-title">Contact Us</h4>
            <div className="contact-links">
              <a href="mailto:codexpro12@gmail.com" className="contact-link">
                <Mail size={20} />
                <span>codexpro12@gmail.com</span>
              </a>
              <a href="tel:9307608068" className="contact-link">
                <Phone size={20} />
                <span>+91 (9307608068)</span>
              </a>
            </div>
          </div>

          {/* Social Links Section */}
          <div className="social-links">
            <h4 className="section-title">Follow Us</h4>
            <div className="social-icons">
              <a href="https://www.instagram.com/abhishelar01/" target="_blank" rel="noopener noreferrer" className="social-icon">
                <Instagram size={24} />
              </a>
              <a href="https://www.linkedin.com/in/abhishek-shelar-7b8b76245/" target="_blank" rel="noopener noreferrer" className="social-icon">
                <Linkedin size={24} />
              </a>
              <a href="https://github.com/abhishekshelar126200" target="_blank" rel="noopener noreferrer" className="social-icon">
                <Github size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="footer-divider"></div>

        {/* Copyright Section */}
        <div className="copyright">
          <p>© {new Date().getFullYear()} MySite. All rights reserved.</p>
        </div>
      </div>
    </footer>
    
  )
}

export default Footer
