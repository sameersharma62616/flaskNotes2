// import React from "react";

// const Home = () => (
//   <div className="text-center mt-20">
//     <h1 className="text-4xl font-bold">Welcome to NotesApp</h1>
//     <p className="mt-4 text-gray-600">Please login or signup to continue</p>
//   </div>
// );

// export default Home;

import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../contexts/ThemeContext";
import { FiEdit3, FiFolder, FiLock, FiCloud } from "react-icons/fi";

const Home = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={`min-h-[95vh] px-4 py-5 flex flex-col justify-center transition-colors duration-300 font-[Inter] ${
        theme === "light" ? "bg-gray-50 text-gray-900" : "text-gray-100"
      }`}
      style={
        theme !== "light"
          ? { background: "linear-gradient(135deg, #536976, #292E49)" }
          : {}
      }
    >
      {/* ===== Hero Section ===== */}
      <div className="max-w-4xl mx-auto text-center mb-10 animate-fadeIn">
        <h1 className="text-4xl sm:text-5xl font-extrabold font-serif mb-6">
          Welcome to{" "}
          <span
            className={`transition-colors ${
              theme === "light" ? "text-blue-500" : "text-blue-300"
            }`}
          >
            NotesApp
          </span>
        </h1>
        <p
          className={`text-lg sm:text-xl mb-10 leading-relaxed max-w-2xl mx-auto ${
            theme === "light" ? "text-gray-700" : "text-gray-200"
          }`}
        >
          Organize your thoughts, ideas, and to-do lists with a clean, modern,
          and secure note-taking experience — anytime, anywhere.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/signup"
            className="px-6 py-3 text-lg font-medium rounded-lg shadow-md transition-transform transform hover:scale-105 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className={`px-6 py-3 text-lg font-medium rounded-lg shadow-md transition-transform transform hover:scale-105
              ${
                theme === "light"
                  ? "bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
                  : "bg-gray-800 text-white border border-gray-600 hover:bg-gray-700"
              }`}
          >
            Login
          </Link>
        </div>
      </div>

      {/* ===== Features Section ===== */}
      <div className="max-w-6xl mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <FeatureCard
          theme={theme}
          icon={<FiEdit3 />}
          iconColor="text-blue-500"
          title="Create & Edit Notes"
          description="Quickly create and edit notes with our simple yet powerful editor."
        />
        <FeatureCard
          theme={theme}
          icon={<FiFolder />}
          iconColor="text-green-500"
          title="Organize Pages"
          description="Group your notes into pages for easy navigation."
        />
        <FeatureCard
          theme={theme}
          icon={<FiLock />}
          iconColor="text-yellow-500"
          title="Secure & Private"
          description="Your notes are encrypted and accessible only to you."
        />
        <FeatureCard
          theme={theme}
          icon={<FiCloud />}
          iconColor="text-purple-500"
          title="Access Anywhere"
          description="Your notes sync across devices so they’re always with you."
        />
      </div>

      {/* ===== About Section ===== */}
      <div
        className={`max-w-4xl mx-auto text-center mt-10 border-t pt-10 transition-colors ${
          theme === "light" ? "border-gray-300" : "border-gray-500"
        }`}
      >
        <h2 className="text-2xl font-bold mb-4">Why Choose NotesApp?</h2>
        <p
          className={`max-w-3xl mx-auto leading-relaxed ${
            theme === "light" ? "text-gray-700" : "text-gray-200"
          }`}
        >
          NotesApp is designed to blend simplicity with power — making your
          note-taking effortless, organized, and secure. Whether you’re storing
          quick reminders, journaling your day, or managing work tasks, our
          platform adapts to your needs.
        </p>
      </div>
    </div>
  );
};

/* ===== Feature Card Component ===== */
const FeatureCard = ({ icon, iconColor, title, description, theme }) => {
  return (
    <div
      className={`p-6 rounded-xl shadow-md hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex flex-col items-start ${
        theme === "light"
          ? "bg-white border border-gray-200"
          : "bg-gray-800 border border-gray-700"
      }`}
    >
      <div className={`${iconColor} text-4xl mb-4`}>{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p
        className={`text-sm ${
          theme === "light" ? "text-gray-600" : "text-gray-300"
        }`}
      >
        {description}
      </p>
    </div>
  );
};

export default Home;
