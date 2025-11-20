import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Create axios client
const api = axios.create({
  baseURL: "http://localhost:3000/auth",
  withCredentials: true,
}); 



export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

 
  useEffect(() => {
    const savedUser = localStorage.getItem("km_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // ---------------- LOGIN FUNCTION ----------------
  const login = async (username, password) => {
    try {
      setLoading(true);

      const res = await api.post("/login", {
        user_name: username,
        password,
      });

      const userData = res.data.user_data;
      setUser(userData);
      localStorage.setItem("km_user", JSON.stringify(userData));

      return { success: true, message: res.data.message };
     
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    } finally {
      setLoading(false);
       navigate("/");
    }
  };

  // ---------------- SIGNUP FUNCTION ----------------
  const signup = async (name, username, role, password) => {
    try {
      setLoading(true);

      const res = await api.post("/signup", {
        name,
        user_name: username,
        role,
        password,
      });

      const newUser = res.data.user;
      setUser(newUser);
      localStorage.setItem("km_user", JSON.stringify(newUser));

      return { success: true, message: res.data.message };

    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Signup failed",
      };
    } finally {
      setLoading(false);
      navigate('/')
    }
  };

  // ---------------- LOGOUT FUNCTION ----------------
  const logout = () => {
    setUser(null);
    localStorage.removeItem("km_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
