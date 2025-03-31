
const LandingHeader = () => {
  return (
    <header className="bg-gradient-to-b from-black to-gray-900 text-white py-20 text-center">
      <h1 className="text-4xl md:text-6xl font-bold">
        AI-Powered Search for Smarter Results
      </h1>
      <p className="mt-4 text-lg text-gray-300">
        Experience a new era of intelligent search.
      </p>
      <div className="mt-6 flex justify-center">
        <input
          type="text"
          placeholder="Search..."
          className="w-2/3 md:w-1/3 px-4 py-3 rounded-l-md bg-gray-800 text-white outline-none"
        />
        <button className="bg-purple-600 px-5 py-3 rounded-r-md hover:bg-purple-700">
          🔍
        </button>
      </div>
    </header>
  );
};

export default LandingHeader;
