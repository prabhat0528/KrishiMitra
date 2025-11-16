import { Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import Predict from "./Pages/Predict";
import Navbar from "./Pages/Navbar";
import KnowMore from "./Pages/KnowMore";
import Chatbot from "./Pages/Chatbot";
import PredictYield from "./Pages/PredictYield";
import AuthPage from "./Pages/AuthPage";
import YieldDetails from "./Pages/YieldDetails";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/predict" element={<Predict />} />
        <Route path="/know-more" element={<KnowMore />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/predict-yield" element={<PredictYield />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path = "/yield_details" element={<YieldDetails/>}/>
      </Routes>
    </>
  );
}

export default App;
