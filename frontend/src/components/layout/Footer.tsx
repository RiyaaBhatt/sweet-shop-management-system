import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
   <footer className="bg-sweet-brown text-sweet-cream dark:bg-gray-900 dark:text-gray-200">
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

      {/* ...rest of your code unchanged... */}

    </div>

    <div className="border-t border-sweet-cream/20 dark:border-gray-700 mt-8 pt-6">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="text-sm opacity-75">
          © 2025 Sweet Delights. All rights reserved.
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