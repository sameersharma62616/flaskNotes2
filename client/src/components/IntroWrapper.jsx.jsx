import React, { useState, useEffect } from "react";
import { FiEdit3, FiFolder, FiLock, FiCloud } from "react-icons/fi";

export default function IntroWrapper({ children }) {
  const [showIntro, setShowIntro] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  const IntroScreen = ({ onFinish }) => {
    useEffect(() => {
      // Start fade+zoom at 2.5s
      const fadeTimer = setTimeout(() => setFadeOut(true), 3000);
      // Hide completely at 3s
      const hideTimer = setTimeout(onFinish, 3000);
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    }, [onFinish]);

    return (
      <div
        className={`fixed inset-0 flex flex-col items-center justify-center text-white transition-all duration-500 ${
          fadeOut ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
        style={{
          background: "linear-gradient(135deg, #536976, #292E49)",
          fontFamily: "'Merriweather', serif",
          zIndex: 20,
          padding: "1rem",
          textShadow: "0 3px 6px rgba(0, 0, 0, 0.7)",
        }}
      >
        {/* Title */}
        <h1
          className="text-4xl sm:text-5xl font-extrabold mb-5 opacity-0"
          style={{
            animation: "fadeInUp 0.5s ease forwards",
            animationDelay: "0.1s",
          }}
        >
          NotesApp
        </h1>

        {/* Icons */}
        <div className="flex space-x-8 text-3xl sm:text-4xl">
          <FiEdit3
            style={{
              opacity: 0,
              animation: "fadeInUp 0.4s ease forwards",
              animationDelay: "0.6s",
            }}
          />
          <FiFolder
            style={{
              opacity: 0,
              animation: "fadeInUp 0.4s ease forwards",
              animationDelay: "0.9s",
            }}
          />
          <FiLock
            style={{
              opacity: 0,
              animation: "fadeInUp 0.4s ease forwards",
              animationDelay: "1.2s",
            }}
          />
          <FiCloud
            style={{
              opacity: 0,
              animation: "fadeInUp 0.4s ease forwards",
              animationDelay: "1.5s",
            }}
          />
        </div>

        {/* Subtitle */}
        <p
          className="mt-5 max-w-md text-center text-base sm:text-lg italic opacity-0"
          style={{
            animation: "fadeInUp 0.5s ease forwards",
            animationDelay: "1.9s",
            color: "#ccd6f6",
          }}
        >
          Simple. Secure. Classic note-taking.
        </p>

        {/* Animations */}
        <style>
          {`
            @keyframes fadeInUp {
              0% { opacity: 0; transform: translateY(15px); }
              100% { opacity: 1; transform: translateY(0); }
            }
          `}
        </style>
      </div>
    );
  };

  return (
    <>
      {showIntro ? (
        <IntroScreen onFinish={() => setShowIntro(false)} />
      ) : (
        children
      )}
    </>
  );
}
