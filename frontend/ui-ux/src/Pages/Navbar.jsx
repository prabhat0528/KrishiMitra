import React from 'react';
import { motion } from "framer-motion";
import { Leaf, MessageCircle, Sprout } from "lucide-react";
import { useNavigate } from "react-router-dom";


function Navbar() {
  return (
   <>
    <nav className="flex items-center justify-between p-6 bg-white shadow-md">
        <div className="flex items-center space-x-2">
          <Sprout className="text-green-600 w-8 h-8" />
          <h1 className="text-2xl font-bold text-green-700">KrishiMitra</h1>
        </div>
        <div className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <a href="#features" className="hover:text-green-600">Features</a>
          <a href="#about" className="hover:text-green-600">About</a>
          <a href="#contact" className="hover:text-green-600">Contact</a>
        </div>
      </nav>

   </>
  )
}

export default Navbar