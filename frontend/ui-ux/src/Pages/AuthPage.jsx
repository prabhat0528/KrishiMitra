import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
    const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const { login, signup, loading } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("Farmer");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setMessage("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await login(username, password);
    setMessage(res.message);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const res = await signup(name, username, role, password);
    setMessage(res.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300 p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {message && (
          <p className="text-center mb-4 text-green-700 font-semibold">{message}</p>
        )}

        {!isLogin && (
          <form className="space-y-4" onSubmit={handleSignup}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-400"
              placeholder="Enter your name"
              required
            />

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-400"
              placeholder="Enter username"
              required
            />

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-400"
            >
              <option value="Farmer">Farmer</option>
              <option value="Expert">Expert</option>
            </select>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-400"
              placeholder="Enter password"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-green-600 text-white py-2 rounded-xl transition font-semibold flex justify-center ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:bg-green-700"
              }`}
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>
        )}

        {isLogin && (
          <form className="space-y-4" onSubmit={handleLogin}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-400"
              placeholder="Enter username"
              required
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-400"
              placeholder="Enter password"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-green-600 text-white py-2 rounded-xl transition font-semibold flex justify-center ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:bg-green-700"
              }`}
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Login"
              )}
            </button>
          </form>
        )}

        <p className="text-center text-gray-600 mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span
            onClick={toggleForm}
            className="text-green-700 font-semibold cursor-pointer ml-1 hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}
