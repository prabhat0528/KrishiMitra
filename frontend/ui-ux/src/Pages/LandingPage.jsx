import React, { useContext } from "react";
import { motion } from "framer-motion";
import { Leaf, MessageCircle, Sprout, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  return (
    <>
      {/* ================= NOTICE BAR ================= */}
      {!user && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 px-6 py-3 text-center font-medium shadow-sm"
        >
          🔔 To continue, please click on get started to login/signup
        </motion.div>
      )}

      {/* ================= MAIN LANDING PAGE ================= */}
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-100 via-green-50 to-white text-gray-800 font-sans">

        {/* ================= HERO SECTION ================= */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-20 mt-10 gap-10"
        >
          {/* TEXT */}
          <div className="max-w-xl text-center md:text-left space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-700 leading-tight">
              Empowering Farmers with Smart Agriculture 🌾
            </h2>

            <p className="text-gray-600 text-base sm:text-lg">
              KrishiMitra helps you predict the best crops for your land, chat
              with an AI assistant, and make data-driven farming decisions for a
              sustainable future.
            </p>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center md:items-start justify-center md:justify-start space-y-3 sm:space-y-0 sm:space-x-4">
              {!user ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-green-700 transition w-full sm:w-auto"
                  onClick={() => navigate("/auth")}
                >
                  🚀 Get Started
                </motion.button>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-green-700 transition w-full sm:w-auto"
                    onClick={() => navigate("/predict")}
                  >
                    🌱 Predict Crop
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="bg-yellow-500 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-yellow-600 transition w-full sm:w-auto"
                    onClick={() => navigate("/predict-yield")}
                  >
                    🌾 Predict Yield and More
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="bg-white border-2 border-green-600 text-green-700 px-6 py-3 rounded-full font-semibold shadow-md hover:bg-green-50 transition flex items-center space-x-2 w-full sm:w-auto"
                    onClick={() => navigate("/chatbot")}
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Chatbot</span>
                  </motion.button>
                </>
              )}
            </div>
          </div>

          {/* LOTTIE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="w-full max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-xl mx-auto"
          >
            <DotLottieReact
              src="https://lottie.host/b1b3fcd0-d6eb-485b-a167-3290998eafe0/2b04iwmsNM.lottie"
              loop
              autoplay
              style={{ width: "100%", height: "100%" }}
            />
          </motion.div>
        </motion.section>

        {/* ================= FEATURES ================= */}
        <section
          id="features"
          className="py-16 px-8 md:px-20 bg-green-50 mt-12 text-center"
        >
          <h3 className="text-3xl font-bold text-green-700 mb-10">
            Why Choose KrishiMitra?
          </h3>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
              <Leaf className="w-10 h-10 text-green-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">AI Crop Prediction</h4>
              <p className="text-gray-600">
                Get intelligent recommendations on which crops to grow based on
                soil and weather data.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
              <MessageCircle className="w-10 h-10 text-green-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">Smart Chatbot</h4>
              <p className="text-gray-600">
                Chat with our AI-powered Krishi assistant for instant help and
                agricultural guidance.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
              <Sprout className="w-10 h-10 text-green-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">Sustainable Insights</h4>
              <p className="text-gray-600">
                Learn eco-friendly and data-backed farming practices for a
                greener tomorrow.
              </p>
            </div>
          </div>
        </section>

        {/* ================= MANDI PRICE CTA ================= */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="py-14 px-8 md:px-20 bg-white text-center"
        >
          <div className="max-w-3xl mx-auto bg-green-600 text-white rounded-3xl p-10 shadow-xl">
            <BarChart3 className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-3xl font-bold mb-4">
              Check Today’s Mandi Prices
            </h3>
            <p className="text-green-100 mb-6">
              Get real-time mandi prices of agricultural commodities across
              India, filtered by state, district, and market.
            </p>

            <motion.button
              whileHover={{ scale: 1.08 }}
              className="bg-white text-green-700 px-8 py-3 rounded-full font-semibold shadow-md hover:bg-green-100 transition"
              onClick={() => navigate("/mandiprice")}
            >
              📊 View Mandi Prices
            </motion.button>
          </div>
        </motion.section>

        {/* ================= FOOTER ================= */}
        <footer className="mt-auto bg-green-700 text-white py-6 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} KrishiMitra — Smart Farming for a Smarter
            Future 🌱
          </p>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;
