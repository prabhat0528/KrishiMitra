import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function KnowMore() {
  const location = useLocation();
  const navigate = useNavigate();
  const crop = location.state?.predictedCrop;

  const [data, setData] = useState(null);
  const [translatedData, setTranslatedData] = useState(null);
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [translating, setTranslating] = useState(false);
  const [similarCrops, setSimilarCrops] = useState([]);
  const [findingSimilar, setFindingSimilar] = useState(false);

  useEffect(() => {
    if (!crop) return;

    const fetchCropInfo = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          "http://127.0.0.1:8080/suggest-crop",
          { crop },
          { withCredentials: true }
        );
        setData(response.data);
        setTranslatedData(response.data);
      } catch (err) {
        setError(
          err.response?.data?.error ||
            "Something went wrong while fetching crop data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCropInfo();
  }, [crop]);

  const handleTranslate = async () => {
    if (!data) return;

    setTranslating(true);
    try {
      const response = await axios.post("http://127.0.0.1:8080/translate", {
        text: data,
        target_lang: language,
      });
      setTranslatedData(response.data);
    } catch {
      alert("Translation failed. Try again.");
    } finally {
      setTranslating(false);
    }
  };

  // 🪴 Find similar crops
  const handleFindSimilar = async () => {
    if (!data) return;

    setFindingSimilar(true);
    try {
      const response = await axios.post("http://127.0.0.1:8080/similar-crops", {
        crop,
        ideal_conditions: data.ideal_conditions,
      });
      setSimilarCrops(response.data.similar_crops || []);
    } catch {
      alert("Couldn't fetch similar crops. Try again later.");
    } finally {
      setFindingSimilar(false);
    }
  };

  const renderIdealConditions = (conditions) => {
    if (typeof conditions === "string")
      return <p className="text-gray-700">{conditions}</p>;

    if (typeof conditions === "object") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          {Object.entries(conditions).map(([key, value]) => (
            <div
              key={key}
              className="bg-green-50 border border-green-200 rounded-lg p-3"
            >
              <p className="text-sm text-gray-600 font-medium capitalize">
                {key}
              </p>
              <p className="text-gray-800 font-semibold">{String(value)}</p>
            </div>
          ))}
        </div>
      );
    }
    return <p>No ideal conditions available.</p>;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">
      <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-3xl w-full border border-green-100">
        <h1 className="text-4xl font-bold text-green-700 text-center mb-6">
          🌾 {crop ? `${crop} - Crop Details` : "Crop Details"}
        </h1>

        {loading && (
          <p className="text-lg text-gray-600 text-center animate-pulse">
            Fetching crop details...
          </p>
        )}

        {error && (
          <p className="text-red-600 text-center text-lg font-medium">
            {error}
          </p>
        )}

        {data && (
          <>
            {/* 🌍 Translator */}
            <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="border border-green-300 rounded-full px-4 py-2 bg-green-50 text-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="ta">Tamil</option>
                <option value="bn">Bengali</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>

              <button
                onClick={handleTranslate}
                disabled={translating}
                className={`px-5 py-2 rounded-full font-semibold text-white shadow-md transition duration-300 ${
                  translating
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {translating ? "Translating..." : "Translate Page"}
              </button>

              <button
                onClick={handleFindSimilar}
                disabled={findingSimilar}
                className={`px-5 py-2 rounded-full font-semibold text-white shadow-md transition duration-300 ${
                  findingSimilar
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {findingSimilar ? "Finding..." : "Find Similar Crops"}
              </button>
            </div>

            {/* 🌱 Crop Info */}
            <div className="space-y-8 mt-4">
              <section>
                <h2 className="text-2xl font-semibold text-green-700 mb-2 border-b border-green-200 pb-2">
                  🌱 Description
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {translatedData.description}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-green-700 mb-2 border-b border-green-200 pb-2">
                  🌤️ Ideal Conditions
                </h2>
                {renderIdealConditions(translatedData.ideal_conditions)}
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-green-700 mb-2 border-b border-green-200 pb-2">
                  🌾 Fertilizer Recommendations
                </h2>
                {typeof translatedData.fertilizer === "object" ? (
                  <ul className="list-disc pl-5 text-gray-700">
                    {Object.entries(translatedData.fertilizer).map(
                      ([key, val]) => (
                        <li key={key}>
                          <strong className="capitalize">{key}:</strong> {val}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p className="text-gray-700 leading-relaxed">
                    {translatedData.fertilizer}
                  </p>
                )}
              </section>

              {/* 🌿 Similar Crops */}
              {similarCrops.length > 0 && (
                <section>
                  <h2 className="text-2xl font-semibold text-blue-700 mb-2 border-b border-blue-200 pb-2">
                    🌿 Similar Crops You Can Grow
                  </h2>
                  <div className="flex flex-wrap gap-3 mt-3">
                    {similarCrops.map((scrop, i) => (
                      <span
                        key={i}
                        className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium shadow-sm hover:bg-blue-200 transition"
                      >
                        {scrop}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </>
        )}

        <div className="mt-10 flex justify-center">
          <button
            onClick={() => navigate("/")}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full shadow-md transition duration-300"
          >
            ⬅ Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default KnowMore;
