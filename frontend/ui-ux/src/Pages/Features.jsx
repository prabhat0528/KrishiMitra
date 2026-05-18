import React from "react";
import { motion } from "framer-motion";
import {
  FaSeedling,
  FaChartLine,
  FaBrain,
  FaLeaf,
  FaRupeeSign,
} from "react-icons/fa";

const features = [
  {
    title: "AI Production Prediction",
    description:
      "Leverage advanced machine learning models to predict crop yield and production insights based on weather patterns, historical data, and soil conditions.",
    icon: <FaBrain />,
    gradient: "from-green-400 to-emerald-600",
  },
  {
    title: "Smart Crop Recommendation",
    description:
      "Get intelligent crop suggestions tailored to your soil nutrients, pH value, climate, and seasonal factors for maximum productivity.",
    icon: <FaSeedling />,
    gradient: "from-lime-400 to-green-600",
  },
  {
    title: "Daily Mandi Prices",
    description:
      "Access real-time mandi prices across Indian states to make informed selling decisions and maximize farmer profits.",
    icon: <FaRupeeSign />,
    gradient: "from-amber-400 to-orange-600",
  },
];

const backgroundStyle = {
  backgroundImage: `
    linear-gradient(
      rgba(4, 46, 28, 0.75),
      rgba(16, 83, 45, 0.85)
    ),
    url('https://images.unsplash.com/photo-1598282216521-4f1e095b3d63?q=80&w=2940&auto=format&fit=crop')
  `,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundAttachment: "fixed",
};

const Features = () => {
  return (
    <motion.section
      id="features"
      style={backgroundStyle}
      className="min-h-screen px-6 py-20 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-20"
      >
        <h1 className="text-5xl font-extrabold mb-6 flex justify-center items-center gap-4">
          <FaLeaf className="text-green-300" />
          KrishiMitra Features
        </h1>
        <p className="max-w-3xl mx-auto text-lg text-green-100">
          Empowering farmers with AI-driven insights, smart recommendations,
          and real-time market intelligence for sustainable agriculture.
        </p>
      </motion.div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            className="relative group"
          >
            {/* Glow */}
            <div
              className={`absolute -inset-1 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition bg-gradient-to-r ${feature.gradient}`}
            />

            {/* Card */}
            <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl text-gray-800">
              <div
                className={`w-16 h-16 flex items-center justify-center rounded-2xl text-white text-3xl mb-6 bg-gradient-to-r ${feature.gradient}`}
              >
                {feature.icon}
              </div>

              <h3 className="text-2xl font-bold mb-4 text-green-800">
                {feature.title}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mt-24 text-center"
      >
        <div className="inline-flex items-center gap-3 bg-black/40 backdrop-blur-xl px-10 py-5 rounded-full shadow-2xl">
          <FaChartLine className="text-yellow-400 text-2xl" />
          <span className="text-lg font-semibold">
            Smart Farming. Better Yield. Higher Profit.
          </span>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default Features;
