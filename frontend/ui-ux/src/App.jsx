import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import Predict from "./Pages/Predict"; 
import Navbar from "./Pages/Navbar";
import KnowMore from "./Pages/KnowMore";
import Chatbot from "./Pages/Chatbot";


function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/predict" element={<Predict />} />
        <Route path = "/know-more" element = {<KnowMore/>}/>
        <Route path = "/chatbot" element= {<Chatbot/>}/>
      </Routes>
    </Router>
  );
}

export default App;
