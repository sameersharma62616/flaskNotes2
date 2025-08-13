import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import PageView from "./pages/PageView";
import ProfileEdit from "./pages/ProfileEdit";
import ScrollToTop from "./components/ScrollToTop";
import PhotoManager from "./pages/PhotoManager"; // ✅ Import PhotoManager

function App() {
  return (
    <>
      <Navbar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pages/:pageId"
          element={
            <ProtectedRoute>
              <PageView />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfileEdit />
            </ProtectedRoute>
          }
        />

        {/* ✅ New Route for PhotoManager */}
        <Route
          path="/photo-manager"
          element={
            <ProtectedRoute>
              <PhotoManager />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;