import React, { useState } from "react";
import { useNavigate,useLocation } from "react-router-dom";

const Predict = () => {
  const [formData, setFormData] = useState({
    N: "",
    P: "",
    K: "",
    humidity: "",
    ph: "",
    rainfall: "",
    temperature: "",
  });

  const [predictedCrop, setPredictedCrop] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setPredictedCrop(data.predicted_crop);
    } catch (error) {
      console.error("Error:", error);
      setPredictedCrop("Error fetching prediction. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-100 px-6 py-10">
      <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-green-700 text-center mb-8">
          🌾 KrishiMitra Crop Predictor
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.keys(formData).map((field, index) => (
            <div key={index} className="flex flex-col">
              <label className="text-gray-700 capitalize font-medium mb-2">
                {field}
              </label>
              <input
                type="number"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={`Enter ${field}`}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                required
              />
            </div>
          ))}

          <div className="md:col-span-2 flex justify-center mt-4">
            <button
              type="submit"
              className="w-1/2 bg-green-600 text-white py-3 rounded-full font-semibold shadow-md hover:bg-green-700 transition duration-200"
            >
              Predict Crop
            </button>
          </div>
        </form>

        {predictedCrop && (
          <div className="mt-8 bg-green-100 text-green-800 border border-green-300 rounded-lg p-5 text-center font-semibold shadow-inner">
            🌱 Predicted Crop:{" "}
            <span className="text-green-700">{predictedCrop}</span>
          </div>
        )}

        {/* Bottom Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-10">
          <button
            onClick={() => navigate("/")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-full font-semibold transition"
          >
            🏠 Home
          </button>
          <button
            onClick={() => navigate("/know-more",{state: {predictedCrop}})}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-semibold transition"
          >
            🌿 Know More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Predict;
