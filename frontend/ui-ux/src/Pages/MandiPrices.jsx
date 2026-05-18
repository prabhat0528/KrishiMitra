import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

// Icons
import {
  FaSeedling,
  FaSun,
  FaSearch,
  FaBalanceScale,
  FaChartLine,
  FaChartArea,
  FaCalendarAlt,
} from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const INDIAN_STATES_UT = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];


const backgroundStyle = {
  backgroundImage: `
    linear-gradient(
      rgba(6, 78, 59, 0.65),
      rgba(20, 83, 45, 0.75)
    ),
    url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2940&auto=format&fit=crop')
  `,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundAttachment: "fixed",
};

const MandiPrices = () => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);

  const [stateName, setStateName] = useState("Maharashtra");
  const [commodity, setCommodity] = useState("Onion");

  const fetchPrices = async () => {
    if (!commodity.trim() || !stateName.trim()) return;

    setPrices([]);
    try {
      setLoading(true);

      const res = await axios.get(
        "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070",
        {
          params: {
            "api-key":
              "579b464db66ec23bdd000001bb7342119bdb4b1e46e10e057cef4795",
            format: "json",
            limit: 9,
            "filters[state]": stateName,
            "filters[commodity]": commodity,
          },
        }
      );

      setPrices(res.data.records || []);
    } catch (err) {
      console.error("Failed to fetch mandi prices", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, [stateName, commodity]);

  return (
    <section
      style={backgroundStyle}
      className="min-h-screen py-16 px-4 sm:px-6 lg:px-8"
    >
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-extrabold text-center text-white mb-16 tracking-tight flex items-center justify-center gap-4 drop-shadow-xl"
      >
        <FaSeedling className="text-green-300 text-5xl" />
        Mandi Price Explorer
        <FaSun className="text-yellow-300 text-4xl" />
      </motion.h2>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/40 mb-16"
      >
        <h3 className="text-xl font-semibold text-gray-700 mb-6 border-b pb-3">
          Select Filters
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          {/* State */}
          <div className="relative">
            <select
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
              className="w-full border-2 border-green-400 bg-green-50 rounded-xl px-4 py-3 focus:ring-4 focus:ring-yellow-400 outline-none"
            >
              {INDIAN_STATES_UT.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            <FaChartArea className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600" />
          </div>

          {/* Commodity */}
          <div className="relative">
            <input
              type="text"
              value={commodity}
              onChange={(e) => setCommodity(e.target.value)}
              placeholder="Enter commodity (e.g. Wheat, Onion)"
              className="w-full border-2 border-green-400 bg-green-50 rounded-xl px-4 py-3 focus:ring-4 focus:ring-yellow-400 outline-none pr-12"
            />
            <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600" />
          </div>
        </div>
      </motion.div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center">
          <div className="flex items-center gap-3 bg-black/40 backdrop-blur-lg px-8 py-4 rounded-full shadow-xl text-white text-lg font-semibold">
            <AiOutlineLoading3Quarters className="animate-spin text-2xl" />
            Fetching latest prices...
          </div>
        </div>
      )}

      {/* No Data */}
      {!loading && prices.length === 0 && (
        <div className="text-center text-white bg-black/40 backdrop-blur-xl p-10 rounded-2xl max-w-xl mx-auto shadow-2xl">
          <p className="text-xl font-semibold mb-2">No data found</p>
          <p>Try a different commodity or state</p>
        </div>
      )}

      {/* Results */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {prices.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -8 }}
            className="bg-white/85 backdrop-blur-lg p-6 rounded-2xl shadow-xl border-t-8 border-amber-500"
          >
            <h4 className="text-2xl font-bold text-green-800 flex items-center gap-2 border-b pb-2 mb-3">
              <FaChartLine className="text-yellow-600" />
              {item.market}
            </h4>

            <p className="text-sm text-gray-600 mb-4">
              {item.state} | {item.district}
            </p>

            <div className="space-y-3">
              <p className="flex justify-between bg-green-50 p-2 rounded-lg">
                <span>Min Price</span>
                <span className="font-semibold">₹{item.min_price}</span>
              </p>

              <p className="flex justify-between bg-green-50 p-2 rounded-lg">
                <span>Max Price</span>
                <span className="font-semibold">₹{item.max_price}</span>
              </p>

              <p className="flex justify-between bg-amber-100 p-3 rounded-lg border-l-4 border-amber-500 font-bold">
                <span className="flex items-center gap-2">
                  <FaBalanceScale />
                  Modal Price
                </span>
                <span className="text-xl">₹{item.modal_price}</span>
              </p>
            </div>

            <p className="text-xs text-gray-500 mt-4 flex items-center gap-2 border-t pt-3">
              <FaCalendarAlt />
              Arrival Date: {item.arrival_date}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default MandiPrices;
