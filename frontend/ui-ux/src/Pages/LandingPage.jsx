import React from "react";
import { motion } from "framer-motion";
import { Leaf, MessageCircle, Sprout } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-100 via-green-50 to-white text-gray-800 font-sans">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col-reverse md:flex-row items-center justify-between px-8 md:px-20 mt-12"
      >
        {/* Text Content */}
        <div className="max-w-xl text-center md:text-left space-y-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-green-700 leading-tight">
            Empowering Farmers with Smart Agriculture 🌾
          </h2>
          <p className="text-gray-600 text-lg">
            KrishiMitra helps you predict the best crops for your land, chat with an AI assistant,
            and make data-driven farming decisions for a sustainable future.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-3 sm:space-y-0 sm:space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-green-700 transition"
              onClick={() => navigate("/predict")}
            >
              🌱 Predict Crop
            </motion.button>


            {/* Predict Yield Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-yellow-500 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-yellow-600 transition"
              onClick={() => navigate("/predict-yield")}
            >
              🌾 Predict Yield and More
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-white border-2 border-green-600 text-green-700 px-6 py-3 rounded-full font-semibold shadow-md hover:bg-green-50 transition flex items-center space-x-2"
              onClick={() => navigate("/chatbot")}
            >
              <MessageCircle className="w-5 h-5" />
              <span>Chatbot</span>
            </motion.button>
          </div>
        </div>

        {/* Hero Illustration */}
        <motion.img
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          src="https://cdn-icons-png.flaticon.com/512/7667/7667241.png"
          alt="Farmer illustration"
          className="w-72 md:w-96 mb-8 md:mb-0"
        />
      </motion.section>

      {/* Features Section */}
      <section id="features" className="py-16 px-8 md:px-20 bg-green-50 mt-12 text-center">
        <h3 className="text-3xl font-bold text-green-700 mb-10">Why Choose KrishiMitra?</h3>
        <div className="grid md:grid-cols-3 gap-10">
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <Leaf className="w-10 h-10 text-green-600 mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-2">AI Crop Prediction</h4>
            <p className="text-gray-600">
              Get intelligent recommendations on which crops to grow based on soil and weather data.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <MessageCircle className="w-10 h-10 text-green-600 mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-2">Smart Chatbot</h4>
            <p className="text-gray-600">
              Chat with our AI-powered Krishi assistant for instant help and agricultural guidance.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <Sprout className="w-10 h-10 text-green-600 mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-2">Sustainable Insights</h4>
            <p className="text-gray-600">
              Learn eco-friendly and data-backed farming practices for a greener tomorrow.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-green-700 text-white py-6 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} KrishiMitra — Smart Farming for a Smarter Future 🌱
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
