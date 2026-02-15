import React from 'react'
import Link from 'next/link'
import { AiFillInstagram, AiOutlineTwitter, AiFillYoutube, AiFillFacebook } from 'react-icons/ai'

const Footer = () => {
  return (
    <footer className="site-footer">
      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="footer-grid">
          {/* Column 1 - Brand */}
          <div className="footer-column footer-brand">
            <h4 className="footer-heading">Sampada</h4>
            <p className="footer-tagline">
              Prosperity in Every Print – Custom T-shirts, Mugs & Blankets
            </p>
            {/* Social Media Icons */}
            <div className="footer-social">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <AiFillInstagram />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <AiOutlineTwitter />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <AiFillFacebook />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <AiFillYoutube />
              </a>
            </div>
          </div>

          {/* Column 2 - Product */}
          <div className="footer-column">
            <h4 className="footer-heading">Product</h4>
            <ul className="footer-links">
              <li><Link href="/designer">Features</Link></li>
              <li><Link href="/subscription">Pricing</Link></li>
              <li><Link href="/stories">Use Cases</Link></li>
              <li><Link href="/about">Roadmap</Link></li>
            </ul>
          </div>

          {/* Column 3 - Company */}
          <div className="footer-column">
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-links">
              <li><Link href="/about">About</Link></li>
              <li><Link href="/stories">Blog</Link></li>
              <li><Link href="/contact">Careers</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Column 4 - Support */}
          <div className="footer-column">
            <h4 className="footer-heading">Support</h4>
            <ul className="footer-links">
              <li><Link href="/about">Documentation</Link></li>
              <li><Link href="/about">API Reference</Link></li>
              <li><Link href="/contact">Community</Link></li>
              <li><Link href="/contact">Status</Link></li>
            </ul>
          </div>
        </div>

        {/* Legal Section */}
        <div className="footer-legal-section">
          <h4 className="footer-heading footer-legal-heading">Legal</h4>
          <ul className="footer-legal-links">
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms of Service</Link></li>
            <li><Link href="/cookies">Cookie Policy</Link></li>
          </ul>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="footer-bottom">
        <p>© 2026 Sampada. Powered by Printify & Stripe</p>
      </div>
    </footer>
  )
}

export default Footer