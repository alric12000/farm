import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="Ghordaura Krishi Farm" className="h-14 w-auto object-contain" />
              <span className="font-serif font-bold text-xl text-farm-green-dark">
                Ghordaura Krishi Farm
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-farm-green ${isActive(link.path) ? 'text-farm-green border-b-2 border-farm-green' : 'text-gray-600'
                  }`}
              >
                {link.name}
              </Link>
            ))}
            <a
              href="tel:+9779857833000"
              className="flex items-center gap-2 bg-farm-green text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-farm-green-light transition-colors"
            >
              <Phone className="w-4 h-4" />
              Call Us
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-farm-green focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive(link.path)
                  ? 'text-farm-green bg-farm-green/10'
                  : 'text-gray-600 hover:text-farm-green hover:bg-gray-50'
                  }`}
              >
                {link.name}
              </Link>
            ))}
            <a
              href="tel:+9779857833000"
              className="mt-4 flex items-center justify-center gap-2 bg-farm-green text-white px-5 py-3 rounded-md text-base font-medium hover:bg-farm-green-light"
            >
              <Phone className="w-5 h-5" />
              Call Us Now
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
