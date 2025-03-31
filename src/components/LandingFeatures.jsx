

import React from "react";
import { FaRegStar, FaRegFileAlt, FaGlobe, FaThumbsUp, FaBan, FaComments } from "react-icons/fa"; // Import icons

const features = [
  { title: "AI Summaries", description: "Get instant AI-generated overviews for every search query, saving you time and providing key insights.", icon: <FaRegStar /> },
  { title: "Rich Snippets", description: "View contextual snippets from top results to quickly find exactly what you're looking for.", icon: <FaRegFileAlt /> },
  { title: "Comprehensive Results", description: "Search across the entire web with AI-powered relevance ranking for better results.", icon: <FaGlobe /> },
  { title: "Boost Websites", description: "Prioritize results from your trusted sources to see them ranked higher in future searches.", icon: <FaThumbsUp /> },
  { title: "Block Websites", description: "Filter out unwanted sources or low-quality websites from your search results.", icon: <FaBan /> },
  { title: "AI Chatbot", description: "Ask follow-up questions about your search or dive deeper into topics with our AI assistant.", icon: <FaComments /> }
];

const LandingFeatures = () => {
  return (
    <section className="bg-[#0F172A] text-white py-16 px-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Powerful Search Features</h2>
        <p className="text-gray-400 mt-2">
          Discover a smarter way to search online.
        </p>
      </div>
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="bg-[#1E293B] p-6 rounded-xl shadow-md flex flex-col space-y-3">
            <div className="text-purple-400 text-2xl">{feature.icon}</div>
            <h3 className="text-xl font-semibold">{feature.title}</h3>
            <p className="text-gray-400">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LandingFeatures;

