import React from 'react';
import { Sprout } from "lucide-react";

function Navbar() {
  return (
    <>
      <nav className="flex items-center justify-between p-6 bg-white shadow-md sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <Sprout className="text-green-600 w-8 h-8" />
          <h1 className="text-2xl font-bold text-green-700">KrishiMitra</h1>
        </div>
        <div className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <a href="#features" className="hover:text-green-600 transition-colors">Features</a>
          <a href="#about" className="hover:text-green-600 transition-colors">About</a>
          <a href="#contact" className="hover:text-green-600 transition-colors">Contact</a>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
