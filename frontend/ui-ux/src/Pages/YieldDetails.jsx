import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const YieldDetails = () => {
  const [predictionData, setPredictionData] = useState(null);
  const [moreInfo, setMoreInfo] = useState(null);

  useEffect(() => {
    const savedPrediction = localStorage.getItem("km_prediction");
    const savedMoreInfo = localStorage.getItem("km_more_info");

    if (savedPrediction) {
      setPredictionData(JSON.parse(savedPrediction));
    }
    if (savedMoreInfo) {
      setMoreInfo(JSON.parse(savedMoreInfo));
    }
  }, []);

  if (!predictionData || !moreInfo) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl font-semibold">
        Loading details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 p-6 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-lg p-10 rounded-2xl max-w-4xl w-full"
      >
        <h1 className="text-3xl font-bold text-green-700 mb-4">🌾 Yield Insights</h1>

        <p className="text-lg">
          <strong>Predicted Yield:</strong>{" "}
          <span className="text-green-800 font-bold">
            {predictionData.predicted_yield}
          </span>
        </p>

        <hr className="my-6 border-green-300" />

        <h2 className="text-2xl font-semibold text-green-700">📘 Additional Insights</h2>

        <div className="mt-4 text-gray-700 leading-relaxed space-y-3">
          <p><strong>Crop:</strong> {predictionData.formData.Crop}</p>
          <p><strong>State:</strong> {predictionData.formData.State}</p>

          {/* Dynamic info from backend */}
          {Object.keys(moreInfo).map((key) => (
            <p key={key}>
              <strong>{key.replace("_", " ")}:</strong> {moreInfo[key]}
            </p>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default YieldDetails;
