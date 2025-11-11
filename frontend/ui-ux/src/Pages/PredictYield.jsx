import React, { useState } from "react";
import { motion } from "framer-motion";

const PredictYield = () => {
  const [formData, setFormData] = useState({
    Crop: "",
    Season: "",
    State: "",
    Area: "",
    Annual_Rainfall: "",
    Fertilizer: "",
    Pesticide: "",
  });

  const [predictedYield, setPredictedYield] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPredictedYield(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict_yield", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setPredictedYield(data.predicted_yield || data.message || "Prediction failed");
    } catch (error) {
      console.error("Error fetching prediction:", error);
      setPredictedYield("Error fetching prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-200 flex flex-col justify-center items-center p-6">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-6xl"
      >
        <h1 className="text-3xl font-bold text-green-700 text-center mb-10">
          🌾 Predict Crop Yield
        </h1>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Crop */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Crop Name</label>
            <input
              type="text"
              name="Crop"
              placeholder="Name of crop cultivated"
              value={formData.Crop}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>

          {/* Season */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Season</label>
            <select
              name="Season"
              value={formData.Season}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 outline-none"
            >
              <option value="">Select Season</option>
              <option value="Rabi">Rabi</option>
              <option value="Kharif">Kharif</option>
              <option value="WholeYear">Whole Year</option>
            </select>
          </div>

          {/* State */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">State</label>
            <input
              type="text"
              name="State"
              placeholder="Your State"
              value={formData.State}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>

          {/* Area */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Area (in hectares)
            </label>
            <input
              type="number"
              name="Area"
              placeholder="Total Land Area in hectares"
              value={formData.Area}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>

          {/* Annual Rainfall */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Annual Rainfall (mm)
            </label>
            <input
              type="number"
              name="Annual_Rainfall"
              placeholder="Avg. Annual rainfall in mm"
              value={formData.Annual_Rainfall}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>

          {/* Fertilizer */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Fertilizer Used (kg)
            </label>
            <input
              type="number"
              name="Fertilizer"
              placeholder="Amount of Fertilizer used (kg)"
              value={formData.Fertilizer}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>

          {/* Pesticide */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Pesticide Used (kg)
            </label>
            <input
              type="number"
              name="Pesticide"
              placeholder="Total amount of Pesticide (kg)"
              value={formData.Pesticide}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>

          {/* Submit Button */}
          <div className="md:col-span-3 flex justify-center mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white font-semibold py-3 px-10 rounded-lg shadow-md hover:bg-green-700 transition"
            >
              {loading ? "Predicting..." : "🌱 Predict Yield"}
            </motion.button>
          </div>
        </form>

        {/* Predicted Yield Output */}
        {predictedYield && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 p-5 bg-green-100 border border-green-300 rounded-lg text-center"
          >
            <h2 className="text-lg font-semibold text-green-700">
              Predicted Yield:
            </h2>
            <p className="text-xl font-bold text-green-800 mt-1">
              {predictedYield}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default PredictYield;
