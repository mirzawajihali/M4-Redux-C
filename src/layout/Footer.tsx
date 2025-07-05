import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black   text-white py-8 ">
      <div className="container  mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">BookLib</h3>
            <p className="text-gray-300 mb-4">
              Your digital library management system. Discover, borrow, and manage books with ease.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/books" className="text-gray-300 hover:text-white transition-colors">All Books</a></li>
              <li><a href="/add-book" className="text-gray-300 hover:text-white transition-colors">Add Book</a></li>
              <li><a href="/borrow-summary" className="text-gray-300 hover:text-white transition-colors">Borrow Summary</a></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Email: info@booklib.com</li>
              <li>Phone: (555) 123-4567</li>
              <li>Address: 123 Library St.</li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-300">
            © {new Date().getFullYear()} BookLib. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;