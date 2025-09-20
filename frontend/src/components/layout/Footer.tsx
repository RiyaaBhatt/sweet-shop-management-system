import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-sweet-brown text-sweet-cream">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-hero flex items-center justify-center">
                <span className="text-white text-sm">🍯</span>
              </div>
              <span className="font-heading text-xl font-bold">Sweet Delights</span>
            </div>
            <p className="text-sm opacity-90">
              Bringing you the finest traditional Indian sweets and confectionery 
              made with authentic recipes and premium ingredients since 1985.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 hover:text-primary cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 hover:text-primary cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 hover:text-primary cursor-pointer transition-colors" />
              <Youtube className="h-5 w-5 hover:text-primary cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products" className="opacity-90 hover:opacity-100 hover:text-primary transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/categories" className="opacity-90 hover:opacity-100 hover:text-primary transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/offers" className="opacity-90 hover:opacity-100 hover:text-primary transition-colors">
                  Special Offers
                </Link>
              </li>
              <li>
                <Link to="/gift-cards" className="opacity-90 hover:opacity-100 hover:text-primary transition-colors">
                  Gift Cards
                </Link>
              </li>
              <li>
                <Link to="/bulk-orders" className="opacity-90 hover:opacity-100 hover:text-primary transition-colors">
                  Bulk Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-semibold">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/contact" className="opacity-90 hover:opacity-100 hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="opacity-90 hover:opacity-100 hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="opacity-90 hover:opacity-100 hover:text-primary transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/returns" className="opacity-90 hover:opacity-100 hover:text-primary transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="opacity-90 hover:opacity-100 hover:text-primary transition-colors">
                  Track Your Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-semibold">Contact Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="opacity-90">
                  123 Sweet Street, Confectionery District, Mumbai 400001
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="opacity-90">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="opacity-90">hello@sweetdelights.com</span>
              </div>
            </div>
            <div className="pt-2">
              <p className="text-xs opacity-75">
                <strong>Store Hours:</strong><br />
                Mon-Sat: 9:00 AM - 9:00 PM<br />
                Sun: 10:00 AM - 8:00 PM
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-sweet-cream/20 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm opacity-75">
              © 2024 Sweet Delights. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="opacity-75 hover:opacity-100 hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="opacity-75 hover:opacity-100 hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="opacity-75 hover:opacity-100 hover:text-primary transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;