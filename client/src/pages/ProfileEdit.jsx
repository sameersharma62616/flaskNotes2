// import React, { useEffect, useState, useContext } from "react";
// import api from "../api/axios";
// import { AuthContext } from "../contexts/AuthContext";

// const ProfileEdit = () => {
//   const { user, setUser } = useContext(AuthContext); // assume you have this context
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     mobile: "",
//     password: "",
//     profile_pic: null,
//   });
//   const [loading, setLoading] = useState(false);
//   const [successMsg, setSuccessMsg] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (user) {
//       setFormData({
//         name: user.name || "",
//         email: user.email || "",
//         mobile: user.mobile || "",
//         password: "",
//         profile_pic: null,
//       });
//     }
//   }, [user]);

//   const handleChange = (e) => {
//     if (e.target.name === "profile_pic") {
//       setFormData({ ...formData, profile_pic: e.target.files[0] });
//     } else {
//       setFormData({ ...formData, [e.target.name]: e.target.value });
//     }
//   };

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);
//   setError(null);
//   setSuccessMsg(null);

//   try {
//     const data = new FormData();
//     data.append("name", formData.name);
//     data.append("email", formData.email);
//     data.append("mobile", formData.mobile);
//     if (formData.password) data.append("password", formData.password);
//     if (formData.profile_pic) data.append("profile_pic", formData.profile_pic);

//     const res = await api.patch("/auth/profile", data, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });

//     setUser(res.data); // Update React state
//     localStorage.setItem("user", JSON.stringify(res.data)); // Update localStorage

//     setSuccessMsg("Profile updated successfully!");
//     setFormData((prev) => ({ ...prev, password: "" })); // clear password field
//   } catch (err) {
//     setError(err.response?.data?.msg || "Update failed");
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
//       <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
//       {successMsg && <p className="text-green-600 mb-4">{successMsg}</p>}
//       {error && <p className="text-red-600 mb-4">{error}</p>}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="text"
//           name="name"
//           placeholder="Name"
//           required
//           value={formData.name}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           required
//           value={formData.email}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="text"
//           name="mobile"
//           placeholder="Mobile"
//           value={formData.mobile}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="New Password (leave blank if no change)"
//           value={formData.password}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="file"
//           name="profile_pic"
//           accept="image/*"
//           onChange={handleChange}
//           className="w-full p-2"
//         />
//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full"
//         >
//           {loading ? "Updating..." : "Update Profile"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ProfileEdit;

import React, { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../contexts/AuthContext";
import { ThemeContext } from "../contexts/ThemeContext";

const ProfileEdit = () => {
  const { user, setUser } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    profile_pic: null,
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        mobile: user.mobile || "",
        password: "",
        profile_pic: null,
      });
      setPreviewUrl(user.profile_url || null); // ✅ Cloudinary ya server se image
    }
  }, [user]);

  const handleChange = (e) => {
    if (e.target.name === "profile_pic") {
      const file = e.target.files[0];
      setFormData({ ...formData, profile_pic: file });
      if (file) {
        setPreviewUrl(URL.createObjectURL(file)); // ✅ new preview
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("mobile", formData.mobile);
      if (formData.password) data.append("password", formData.password);
      if (formData.profile_pic)
        data.append("profile_pic", formData.profile_pic);

      const res = await api.patch("/auth/profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      setSuccessMsg("Profile updated successfully!");
      setFormData((prev) => ({ ...prev, password: "" }));
      setPreviewUrl(res.data.profile_url || previewUrl);
    } catch (err) {
      setError(err.response?.data?.msg || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-[95vh] flex items-center justify-center px-4 py-8 transition-colors duration-300 ${
        theme === "light" ? "bg-gray-50 text-gray-900" : "text-gray-100"
      }`}
      style={
        theme !== "light"
          ? { background: "linear-gradient(135deg, #536976, #292E49)" }
          : {}
      }
    >
      <div
        className={`w-full max-w-md p-8 rounded-2xl shadow-2xl border backdrop-blur-md bg-opacity-70 transition-colors duration-300 ${
          theme === "light"
            ? "bg-white/70 border-gray-200 text-gray-900"
            : "bg-gray-800/70 border-gray-700 text-white"
        }`}
      >
        <h2 className="text-3xl font-serif font-bold mb-8 text-center">
          Edit Profile
        </h2>

        {previewUrl && (
          <div className="flex justify-center mb-4">
            <img
              src={previewUrl}
              alt="Profile Preview"
              className="w-24 h-24 rounded-full object-cover border"
            />
          </div>
        )}

        {successMsg && (
          <p className="mb-6 text-center text-green-600 font-medium">
            {successMsg}
          </p>
        )}
        {error && (
          <p className="mb-6 text-center text-red-600 font-medium">{error}</p>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          encType="multipart/form-data"
        >
          {/* Name */}
          <div>
            <label htmlFor="name" className="block mb-1 font-medium">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              required
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg border outline-none text-lg transition-all duration-200 ${
                theme === "light"
                  ? "bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900"
                  : "bg-gray-700 border-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-500 text-white"
              }`}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block mb-1 font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg border outline-none text-lg transition-all duration-200 ${
                theme === "light"
                  ? "bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900"
                  : "bg-gray-700 border-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-500 text-white"
              }`}
            />
          </div>

          {/* Mobile */}
          <div>
            <label htmlFor="mobile" className="block mb-1 font-medium">
              Mobile
            </label>
            <input
              type="text"
              name="mobile"
              placeholder="Mobile"
              value={formData.mobile}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg border outline-none text-lg transition-all duration-200 ${
                theme === "light"
                  ? "bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900"
                  : "bg-gray-700 border-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-500 text-white"
              }`}
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block mb-1 font-medium">
              New Password (leave blank if no change)
            </label>
            <input
              type="password"
              name="password"
              placeholder="New Password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg border outline-none text-lg transition-all duration-200 ${
                theme === "light"
                  ? "bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900"
                  : "bg-gray-700 border-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-500 text-white"
              }`}
            />
          </div>

          {/* Profile Picture */}
          <div>
            <label htmlFor="profile_pic" className="block mb-1 font-medium">
              Profile Picture (optional)
            </label>
            <input
              type="file"
              name="profile_pic"
              accept="image/*"
              onChange={handleChange}
              className={`w-full cursor-pointer rounded-lg border p-2 transition-colors duration-200 ${
                theme === "light"
                  ? "bg-white border-gray-300 text-gray-900"
                  : "bg-gray-700 border-gray-600 text-white"
              }`}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 shadow-md text-lg ${
              theme === "light"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileEdit;
