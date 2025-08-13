// import React, { useState, useContext } from "react";
// import api from "../api/axios";
// import { AuthContext } from "../contexts/AuthContext";

// const Login = () => {
//   const { login } = useContext(AuthContext);

//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleChange = (e) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await api.post("/auth/login", formData);
//       login(res.data.token, res.data.user);
//     } catch (err) {
//       setError(err.response?.data?.msg || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
//       <h2 className="text-2xl font-bold mb-4">Login</h2>
//       {error && <p className="text-red-600 mb-4">{error}</p>}
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           required
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           required
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full"
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;

import React, { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../contexts/AuthContext";
import { ThemeContext } from "../contexts/ThemeContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/auth/login", formData);
      login(res.data.token, res.data.user);
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-[94vh] flex items-center justify-center px-4 transition-all duration-500 ${
        theme === "light"
          ? "bg-gradient-to-br from-blue-100 via-white to-purple-100 text-gray-900"
          : "text-gray-100"
      }`}
      style={
        theme !== "light"
          ? { background: "linear-gradient(135deg, #536976, #292E49)" }
          : {}
      }
    >
      {/* Glass Card */}
      <div
        className={`w-[380px] p-8 rounded-2xl shadow-2xl border backdrop-blur-lg bg-opacity-80 transform transition-all duration-500 hover:scale-[1.02] animate-fadeIn
          ${
            theme === "light"
              ? "bg-white/70 border-gray-200 text-gray-800"
              : "bg-gray-800/70 border-gray-700 text-gray-100"
          }`}
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <h2 className="text-4xl font-extrabold text-center mb-6 tracking-tight">
          Welcome Back 👋
        </h2>

        {error && (
          <div className="mb-5 p-3 text-sm font-medium text-center rounded-lg border animate-slideDown bg-red-100 text-red-700 border-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block mb-1 font-semibold">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              onChange={handleChange}
              className={`w-full p-3 rounded-lg border outline-none transition-all focus:scale-[1.01]
                ${
                  theme === "light"
                    ? "border-gray-300 bg-white/90 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    : "border-gray-600 bg-gray-700/90 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-500"
                }`}
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block mb-1 font-semibold">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              required
              onChange={handleChange}
              className={`w-full p-3 rounded-lg border outline-none transition-all focus:scale-[1.01]
                ${
                  theme === "light"
                    ? "border-gray-300 bg-white/90 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    : "border-gray-600 bg-gray-700/90 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-500"
                }`}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold shadow-md transition-all duration-300 transform hover:scale-[1.02]
              ${
                theme === "light"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
