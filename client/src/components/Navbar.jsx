import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-xl">
        NotesApp
      </Link>
      <div className="space-x-4 flex items-center">
        {user ? (
          <>
            <span className="mr-4">Hi, {user.name}</span>
            <Link to="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <Link
              to="/profile"
              className="ml-4 hover:underline"
              title="Edit Profile"
            >
              Profile
            </Link>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded ml-4"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/signup" className="ml-4 hover:underline">
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;