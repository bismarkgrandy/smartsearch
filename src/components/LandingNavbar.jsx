

import { Link } from "react-router-dom";

const LandingNavbar = () => {
  return (
    <nav className="bg-[#0d0d1a] text-[#b0b0b0] px-4 sm:px-6 md:px-12 py-3 flex items-center justify-between">
      {/* Left Side - Logo */}
      <div className="flex items-center">
        <span className="font-bold flex items-center text-lg md:text-xl">
          🔍 <span className="text-[#a48df0] ml-1 sm:ml-2">SmartSearch</span>
        </span>
      </div>

      {/* Right Side - Log In & Get Started  */}
      <div className="flex flex-nowrap items-center gap-2">
        <Link
          to="/login"
          className="px-3 py-1 min-w-[80px] text-xs sm:text-sm md:text-base bg-[#16162a] text-[#d0d0d0] rounded-md hover:bg-[#1e1e36] transition text-center"
        >
          Log In
        </Link>
        <Link
          to="/signup"
          className="px-3 py-1 min-w-[80px] text-xs sm:text-sm md:text-base bg-[#a48df0] text-white rounded-md hover:bg-[#8b72e8] transition text-center"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
};

export default LandingNavbar;

