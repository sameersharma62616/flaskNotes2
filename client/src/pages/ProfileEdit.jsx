import React, { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../contexts/AuthContext";

const ProfileEdit = () => {
  const { user, setUser } = useContext(AuthContext); // assume you have this context
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    profile_pic: null,
  });
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
    }
  }, [user]);

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
  setSuccessMsg(null);

  try {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("mobile", formData.mobile);
    if (formData.password) data.append("password", formData.password);
    if (formData.profile_pic) data.append("profile_pic", formData.profile_pic);

    const res = await api.patch("/auth/profile", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setUser(res.data); // Update React state
    localStorage.setItem("user", JSON.stringify(res.data)); // Update localStorage

    setSuccessMsg("Profile updated successfully!");
    setFormData((prev) => ({ ...prev, password: "" })); // clear password field
  } catch (err) {
    setError(err.response?.data?.msg || "Update failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
      {successMsg && <p className="text-green-600 mb-4">{successMsg}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="mobile"
          placeholder="Mobile"
          value={formData.mobile}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="New Password (leave blank if no change)"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="file"
          name="profile_pic"
          accept="image/*"
          onChange={handleChange}
          className="w-full p-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default ProfileEdit;