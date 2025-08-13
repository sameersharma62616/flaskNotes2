// import React, { useState, useContext } from "react";
// import api from "../api/axios";
// import { AuthContext } from "../contexts/AuthContext";

// const Signup = () => {
//   const { login } = useContext(AuthContext);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     mobile: "",
//     password: "",
//     profile_pic: null,
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleChange = (e) => {
//     if (e.target.name === "profile_pic") {
//       setFormData({ ...formData, profile_pic: e.target.files[0] });
//     } else {
//       setFormData({ ...formData, [e.target.name]: e.target.value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       const data = new FormData();
//       data.append("name", formData.name);
//       data.append("email", formData.email);
//       data.append("mobile", formData.mobile);
//       data.append("password", formData.password);
//       if (formData.profile_pic) {
//         data.append("profile_pic", formData.profile_pic);
//       }

//       const res = await api.post("/auth/signup", data, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       login(res.data.token, res.data.user);
//     } catch (err) {
//       setError(err.response?.data?.msg || "Signup failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
//       <h2 className="text-2xl font-bold mb-4">Signup</h2>
//       {error && <p className="text-red-600 mb-4">{error}</p>}
//       <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
//         <input
//           type="text"
//           name="name"
//           placeholder="Full Name"
//           required
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           required
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="text"
//           name="mobile"
//           placeholder="Mobile Number"
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
//         <input
//           type="file"
//           name="profile_pic"
//           accept="image/*"
//           onChange={handleChange}
//           className="w-full"
//         />
//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full"
//         >
//           {loading ? "Signing up..." : "Signup"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Signup;

import React, { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../contexts/AuthContext";
import { ThemeContext } from "../contexts/ThemeContext";

const Signup = () => {
  const { login } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    profile_pic: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    if (e.target.name === "profile_pic") {
      setFormData({ ...formData, profile_pic: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("mobile", formData.mobile);
      data.append("password", formData.password);
      if (formData.profile_pic) {
        data.append("profile_pic", formData.profile_pic);
      }

      const res = await api.post("/auth/signup", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      login(res.data.token, res.data.user);
    } catch (err) {
      setError(err.response?.data?.msg || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-[94vh] flex items-center justify-center px-4 transition-all duration-300 ${
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
        className={`w-[380px] p-8 rounded-2xl shadow-2xl border backdrop-blur-md bg-opacity-70 transition-colors duration-300
          ${
            theme === "light"
              ? "bg-white/60 border-gray-200 text-gray-800"
              : "bg-gray-800/60 border-gray-700 text-gray-100"
          }`}
      >
        <h2 className="text-3xl font-sans font-extrabold text-center mb-6">
          Create Your Account
        </h2>

        {error && (
          <div className="mb-5 p-3 text-sm font-medium text-center rounded-lg border bg-red-100 text-red-700 border-red-300">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
          encType="multipart/form-data"
        >
          <div>
            <label htmlFor="name" className="block mb-1 font-medium">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Your full name"
              required
              onChange={handleChange}
              className={`w-full p-3 rounded-lg border outline-none transition-all
                ${
                  theme === "light"
                    ? "border-gray-300 bg-white/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    : "border-gray-600 bg-gray-700/80 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-500"
                }`}
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-1 font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Your email address"
              required
              onChange={handleChange}
              className={`w-full p-3 rounded-lg border outline-none transition-all
                ${
                  theme === "light"
                    ? "border-gray-300 bg-white/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    : "border-gray-600 bg-gray-700/80 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-500"
                }`}
            />
          </div>

          <div>
            <label htmlFor="mobile" className="block mb-1 font-medium">
              Mobile Number
            </label>
            <input
              type="text"
              name="mobile"
              placeholder="Your mobile number (optional)"
              onChange={handleChange}
              className={`w-full p-3 rounded-lg border outline-none transition-all
                ${
                  theme === "light"
                    ? "border-gray-300 bg-white/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    : "border-gray-600 bg-gray-700/80 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-500"
                }`}
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Choose a password"
              required
              onChange={handleChange}
              className={`w-full p-3 rounded-lg border outline-none transition-all
                ${
                  theme === "light"
                    ? "border-gray-300 bg-white/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    : "border-gray-600 bg-gray-700/80 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-500"
                }`}
            />
          </div>

          <div>
            <label htmlFor="profile_pic" className="block mb-2 font-medium">
              Profile Picture (optional)
            </label>
            <input
              type="file"
              name="profile_pic"
              accept="image/*"
              onChange={handleChange}
              className={`w-full rounded-lg cursor-pointer
                ${
                  theme === "light"
                    ? "bg-white/90 border border-gray-300"
                    : "bg-gray-700/90 border border-gray-600 text-white"
                }`}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold shadow-md transition-all
              ${
                theme === "light"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
          >
            {loading ? "Signing up..." : "Signup"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
