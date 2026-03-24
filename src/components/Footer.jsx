import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Brand & Description */}
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-bold text-white tracking-wider">
              STORE.
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Delivering the best products directly to your doorstep with unbeatable prices and premium quality.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-cyan-400 transition-colors duration-300">Home</Link>
              </li>
              <li>
                <Link to="/cart" className="text-sm hover:text-cyan-400 transition-colors duration-300">Shopping Cart</Link>
              </li>
              <li>
                <Link to="/login" className="text-sm hover:text-cyan-400 transition-colors duration-300">Sign In / Register</Link>
              </li>
              <li>
                <Link to="/profile" className="text-sm hover:text-cyan-400 transition-colors duration-300">My Account</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-sm hover:text-cyan-400 transition-colors duration-300">Track Order</Link>
              </li>
              <li>
                <Link to="#" className="text-sm hover:text-cyan-400 transition-colors duration-300">Shipping & Returns</Link>
              </li>
              <li>
                <Link to="#" className="text-sm hover:text-cyan-400 transition-colors duration-300">FAQ</Link>
              </li>
              <li>
                <Link to="#" className="text-sm hover:text-cyan-400 transition-colors duration-300">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-sm">
                <MapPin size={18} className="text-cyan-400 flex-shrink-0" />
                <span>123 Market Street<br />Kozhikode, Kerala 673001</span>
              </li>
              <li className="flex items-center space-x-3 text-sm">
                <Phone size={18} className="text-cyan-400 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-3 text-sm">
                <Mail size={18} className="text-cyan-400 flex-shrink-0" />
                <span>support@store.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 text-center flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} STORE. All rights reserved.
          </p>
          <div className="flex space-x-4 text-sm text-gray-500">
            <span>Built with React & Tailwind</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;