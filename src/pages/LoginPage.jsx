

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuthStore } from "../store/useAuthStore.js";

const LoginPage = () => {
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [validationError, setValidationError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setValidationError(""); // Clear error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await login(form);
    if (response) {
      navigate("/");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        
        {/* Logo - Centered Above the Form */}
        <img 
          src="/images/blackLogo.png" 
          alt="Brand Logo" 
          className="w-40 sm:w-40 mx-auto mb-6"
        />

        <h2 className="text-2xl font-bold mb-4">Log In</h2>

        {validationError && <p className="text-red-500">{validationError}</p>}
        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none"
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-[#a48df0] text-white py-3 rounded hover:bg-[#8b72e8] transition"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-gray-400 mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#a48df0] hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

