

import React from "react";

import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import LandingNavbar from "./components/LandingNavbar.jsx";

import LandingPage from "./pages/LandingPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import { useAuthStore } from "./store/useAuthStore.js";


import Navbar from "./components/Navbar.jsx";
import Loader from "./components/Loader.jsx";
import { Toaster } from "react-hot-toast";



const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log("authUser :", authUser);

  if (isCheckingAuth && !authUser) return <Loader />;

  // Define pages where NO navbar should be shown
  const hideNavbarPages = ["/signup", "/login"];

  return (
    <div>
      <Toaster />

      {/* Show LandingNavbar ONLY on /landing */}
      {location.pathname === "/landing" && <LandingNavbar />}

      {/* Show Main Navbar for all other pages EXCEPT signup & login */}
      {!hideNavbarPages.includes(location.pathname) && location.pathname !== "/landing" && <Navbar />}

      <Routes>
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/landing" />} />
        <Route path="/settings" element={authUser ? <SettingsPage /> : <Navigate to="/login" />} />
        <Route path="/search" element={authUser ? <SearchPage /> : <Navigate to="/login" />} />
        <Route path="/chat" element={authUser ? <ChatPage /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
};

export default App;
