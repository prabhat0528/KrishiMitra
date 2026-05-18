import React from "react";
import { motion } from "framer-motion";
import {
  FaLeaf,
  FaBrain,
  FaSeedling,
  FaGlobe,
  FaChartLine,
  FaCloudSun,
  FaUsers,
  FaRocket,
} from "react-icons/fa";

const backgroundStyle = {
  backgroundImage: `
    linear-gradient(
      rgba(2, 44, 26, 0.8),
      rgba(16, 83, 45, 0.85)
    ),
    url('https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=2940&auto=format&fit=crop')
  `,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundAttachment: "fixed",
};

const futureFeatures = [
  {
    icon: <FaCloudSun />,
    title: "Weather-Aware Crop Advisory",
    desc: "Hyper-local weather forecasting integrated with AI to suggest irrigation schedules, pest control alerts, and crop safety measures.",
  },
  {
    icon: <FaChartLine />,
    title: "Yield & Profit Forecasting",
    desc: "Predict expected yield and farmer profit margins before sowing using AI-based economic and climatic analysis.",
  },
//   {
//     icon: <FaUsers />,
//     title: "Farmer Community & Knowledge Hub",
//     desc: "A collaborative platform where farmers can share experiences, best practices, and AI-curated farming guides.",
//   },
//   {
//     icon: <FaGlobe />,
//     title: "Regional Language Support",
//     desc: "Multi-language support to ensure accessibility for farmers across different Indian states and regions.",
//   },
];

const About = () => {
  return (
    <motion.section
      style={backgroundStyle}
      className="min-h-screen px-6 py-20 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Heading */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-24"
      >
        <h1 className="text-5xl font-extrabold mb-6 flex justify-center items-center gap-4">
          <FaLeaf className="text-green-300" />
          About KrishiMitra
        </h1>
        <p className="max-w-3xl mx-auto text-lg text-green-100">
          An AI-powered agricultural intelligence platform designed to empower
          farmers with data-driven decisions, sustainable practices, and better
          economic outcomes.
        </p>
      </motion.div>

      {/* Vision & Mission */}
      <div className="grid md:grid-cols-2 gap-12 max-w-7xl mx-auto mb-32">
        {/* Vision */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl text-gray-800"
        >
          <FaRocket className="text-4xl text-green-600 mb-4" />
          <h2 className="text-3xl font-bold mb-4 text-green-800">Our Vision</h2>
          <p className="text-gray-600 leading-relaxed">
            To revolutionize agriculture by bridging the gap between traditional
            farming and modern AI technology—making intelligent farming
            accessible, affordable, and impactful for every farmer.
          </p>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl text-gray-800"
        >
          <FaSeedling className="text-4xl text-emerald-600 mb-4" />
          <h2 className="text-3xl font-bold mb-4 text-green-800">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            To provide farmers with AI-driven crop recommendations, production
            predictions, and real-time market insights that enhance productivity,
            reduce risk, and increase profitability.
          </p>
        </motion.div>
      </div>

      {/* Why KrishiMitra */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto text-center mb-32"
      >
        <FaBrain className="text-5xl text-yellow-300 mx-auto mb-6" />
        <h2 className="text-4xl font-extrabold mb-6">
          Why KrishiMitra?
        </h2>
        <p className="text-lg text-green-100 leading-relaxed">
          Farmers often rely on intuition, outdated practices, or limited
          information. KrishiMitra integrates machine learning, weather data,
          soil analysis, and market intelligence into a single platform—
          enabling smarter, faster, and more confident farming decisions.
        </p>
      </motion.div>

      {/* Future Roadmap */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="max-w-7xl mx-auto"
      >
        <h2 className="text-4xl font-extrabold text-center mb-16">
          Future Roadmap
        </h2>

        <div className="grid md:grid-cols-2 gap-10">
          {futureFeatures.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl text-gray-800"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="text-3xl text-green-600">{item.icon}</div>
                <h3 className="text-2xl font-bold text-green-800">
                  {item.title}
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Closing Statement */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mt-32 text-center"
      >
        <div className="inline-flex items-center gap-3 bg-black/40 backdrop-blur-xl px-12 py-6 rounded-full shadow-2xl">
          <FaLeaf className="text-green-400 text-2xl" />
          <span className="text-lg font-semibold">
            KrishiMitra — Where AI Meets Agriculture 🌾
          </span>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default About;
