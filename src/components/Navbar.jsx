import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { useAuthStore } from "../store/useAuthStore.js"; // Import useAuthStore

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuthStore(); // Retrieve logout function directly

  return (
    <nav className="bg-[#0d0d1a] text-[#b0b0b0] px-4 sm:px-6 md:px-12 py-3 flex items-center justify-between">
      {/* Left Side - Logo */}
      <div className="flex items-center">
        <span className="font-bold flex items-center text-lg md:text-xl">
          🔍 <span className="text-[#a48df0] ml-1 sm:ml-2">SmartSearch</span>
        </span>
      </div>

      {/* Hamburger Menu Button (Mobile) */}
      <button
        className="md:hidden text-[#b0b0b0] focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Right Side - Navigation Links */}
      <div className={`md:flex items-center gap-4 ${isOpen ? "flex flex-col absolute top-16 right-4 bg-[#0d0d1a] p-4 rounded-md shadow-lg" : "hidden md:flex"}`}>
        <Link to="/" className="hover:text-white transition">Home</Link>
        <Link to="/chat" className="hover:text-white transition">AI Chat</Link>
        <Link to="/settings" className="hover:text-white transition">Settings</Link>
        <button
          onClick={logout} // Directly call logout from useAuthStore
          className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
