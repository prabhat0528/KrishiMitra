import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sprout, BookOpen, Info, Leaf, MapPin } from "lucide-react";


const formatImprovementTips = (input) => {
  if (!input) return [];

  
  if (Array.isArray(input)) {
    return input
      .map((it) => (typeof it === "string" ? it.replace(/\*\*/g, "").trim() : String(it)))
      .filter(Boolean);
  }

  
  if (typeof input === "object") {
    const joined = Object.values(input).join("\n\n");
    return joined
      .replace(/\*\*/g, "")
      .split(/\n{1,}/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  
  let text = String(input);

  text = text.replace(/\*\*/g, "");

  const splitted = text.split(/(?=[A-Z][a-z]+\s?[A-Za-z\-]+\:)/g).map((s) => s.trim());

  if (splitted.length === 1) {
    return splitted[0]
      .split(/(?:\.\s+)|(?:\n+)/g)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  return splitted.filter(Boolean);
};

const YieldDetails = () => {
  const [predictionData, setPredictionData] = useState(null);
  const [moreInfo, setMoreInfo] = useState(null);

  useEffect(() => {
    const savedPrediction = localStorage.getItem("km_prediction");
    const savedMoreInfo = localStorage.getItem("km_more_info");

    if (savedPrediction) setPredictionData(JSON.parse(savedPrediction));
    if (savedMoreInfo) setMoreInfo(JSON.parse(savedMoreInfo));
  }, []);

  if (!predictionData || !moreInfo) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl font-semibold">
        Loading details...
      </div>
    );
  }

  const form = predictionData.formData || {};
  const predictedYield = predictionData.predicted_yield ?? "N/A";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-200 p-6 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-xl p-10 rounded-3xl max-w-5xl w-full border border-green-100"
      >
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-4">
          <Sprout className="text-green-700 w-10 h-10" />
          <h1 className="text-4xl font-extrabold text-green-800">Yield Insights</h1>
        </div>

        {/* PREDICTION BOX */}
        <div className="bg-green-50 border border-green-200 shadow-md p-6 rounded-2xl mb-10">
          <p className="text-xl font-semibold text-green-800 flex items-center gap-2">
            <Leaf className="w-6 h-6 text-green-600" />
            Predicted Yield:
          </p>

          <p className="text-4xl font-extrabold text-green-900 mt-2 drop-shadow-sm">
            {predictedYield} {typeof predictedYield === "number" ? "tons per hectare" : ""}
          </p>
        </div>

        {/* SECTION HEADER */}
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="text-green-700 w-7 h-7" />
          <h2 className="text-3xl font-bold text-green-700">Additional Insights</h2>
        </div>

        {/* BASIC DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-5 rounded-xl border shadow">
            <p className="text-gray-700 text-lg">
              <strong className="text-green-800">🌱 Crop:</strong>{" "}
              {form.Crop || "N/A"}
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border shadow">
            <p className="flex items-center gap-2 text-lg text-gray-700">
              <MapPin className="w-5 h-5 text-green-700" />
              <strong className="text-green-800">State:</strong>{" "}
              {form.State || "N/A"}
            </p>
          </div>
        </div>

        {/* DETAILED INSIGHTS */}
        <div className="space-y-6">
          {Object.keys(moreInfo).map((key) => {
            const title = key
              .replace(/_/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase());
            const value = moreInfo[key];

            const isImprovementTips = key.toLowerCase().includes("improvement");
            const isRecommendedCrops =
              key.toLowerCase().includes("recommended") ||
              key.toLowerCase().includes("recommended_crops");

            return (
              <div
                key={key}
                className="bg-gradient-to-br from-emerald-50 to-green-100 border border-emerald-300 p-6 rounded-2xl shadow-lg"
              >
                <h3 className="text-2xl font-semibold text-emerald-800 mb-2 flex items-center gap-2">
                  <Info className="w-5 h-5 text-emerald-700" />
                  {title}
                </h3>

                {isImprovementTips ? (
                  <ul className="space-y-3 text-gray-800">
                    {formatImprovementTips(value).map((tip, idx) => (
                      <li
                        key={idx}
                        className="bg-white p-3 rounded-xl border border-green-200 shadow-sm flex gap-3"
                      >
                        <span className="text-green-700 text-xl mt-0.5">•</span>
                        <span className="whitespace-pre-line">{tip}</span>
                      </li>
                    ))}
                  </ul>
                ) : isRecommendedCrops && Array.isArray(value) ? (
                  <div className="flex flex-wrap gap-2">
                    {value.map((c, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-green-100 text-green-800 border border-green-200"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                    {typeof value === "object" ? JSON.stringify(value, null, 2) : value}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default YieldDetails;
