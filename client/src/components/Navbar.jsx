// import React, { useContext } from "react";
// import { Link } from "react-router-dom";
// import { AuthContext } from "../contexts/AuthContext";

// const Navbar = () => {
//   const { user, logout } = useContext(AuthContext);

//   return (
//     <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
//       <Link to="/" className="font-bold text-xl">
//         NotesApp
//       </Link>
//       <div className="space-x-4 flex items-center">
//         {user ? (
//           <>
//             <span className="mr-4">Hi, {user.name}</span>
//             <Link to="/dashboard" className="hover:underline">
//               Dashboard
//             </Link>
//             <Link
//               to="/profile"
//               className="ml-4 hover:underline"
//               title="Edit Profile"
//             >
//               Profile
//             </Link>
//             <button
//               onClick={logout}
//               className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded ml-4"
//             >
//               Logout
//             </button>
//           </>
//         ) : (
//           <>
//             <Link to="/login" className="hover:underline">
//               Login
//             </Link>
//             <Link to="/signup" className="ml-4 hover:underline">
//               Signup
//             </Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;








import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { ThemeContext } from "../contexts/ThemeContext";
import {
  FiSun,
  FiMoon,
  FiMenu,
  FiX,
  FiUser,
  FiGrid,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className={`sticky top-0 z-50 border-b backdrop-blur-md transition-all duration-300 shadow-sm
        ${
          theme === "light"
            ? "bg-white/90 border-gray-200 text-gray-800"
            : "bg-gray-900/80 border-gray-700 text-gray-100"
        }`}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="max-w-9xl mx-auto flex justify-between items-center px-5 py-3">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl text-blue-400 hover:text-blue-700 font-bold tracking-wide transition-transform hover:scale-105"
        >
          NotesApp
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 text-base font-medium">
          {user ? (
            <>
              {/* Dashboard Link */}
              <Link
                to="/dashboard"
                className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
                title="Dashboard"
              >
                <FiGrid size={18} />
                <span>Dashboard</span>
              </Link>

               <Link
                to="/photo-manager"
                className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
                title="Photo Manager"
              >
                <FiGrid size={18} />
                <span>Photo manager</span>
              </Link>
              

              {/* Profile Link */}
              <Link
                to="/profile"
                className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
                title="Profile"
              >
                <FiSettings size={18} />
                <span>Profile</span>
              </Link>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle Theme"
                className={`ml-0 mr-2 p-2 rounded-full flex items-center justify-center transition-all duration-300
                  ${
                    theme === "light"
                      ? "bg-gray-100 hover:bg-gray-200"
                      : "bg-gray-800 hover:bg-gray-700"
                  }
                `}
                title="Toggle Theme"
              >
                {theme === "light" ? <FiMoon size={18} /> : <FiSun size={18} />}
              </button>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 px-4 py-1.5 rounded-full text-white transition-colors flex items-center space-x-1 shadow-sm ml-3"
                title="Logout"
              >
                <FiLogOut size={18} />
                <span>Logout</span>
              </button>

              {/* User Name + Profile Photo */}
              <div className="flex items-center space-x-2 px-2 border-l border-r border-gray-300 dark:border-gray-600">
                <span className="opacity-80">{user.name}</span>
                <img
                  src={user.profile_url || "https://via.placeholder.com/40"}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                />
              </div>
            </>
          ) : (
            <>
              <NavLink to="/login" icon={<FiUser />} />
              <NavLink to="/signup" icon={<FiUser />} />
              <button
                onClick={toggleTheme}
                aria-label="Toggle Theme"
                className={`ml-3 p-2 rounded-full flex items-center justify-center transition-all duration-300
                  ${
                    theme === "light"
                      ? "bg-gray-100 hover:bg-gray-200"
                      : "bg-gray-800 hover:bg-gray-700"
                  }
                `}
                title="Toggle Theme"
              >
                {theme === "light" ? <FiMoon size={18} /> : <FiSun size={18} />}
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`md:hidden p-2 rounded-md transition-colors ${
            theme === "light" ? "hover:bg-gray-100" : "hover:bg-gray-800/50"
          }`}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div
          className={`md:hidden border-t px-5 py-4 space-y-4 transition-all duration-300 ${
            theme === "light"
              ? "bg-white/95 border-gray-200"
              : "border-gray-700 bg-gray-900"
          }`}
        >
          {user ? (
            <>
              {/* Mobile profile info */}
              <div className="flex items-center space-x-2">
                <img
                  src={user.profile_url || "https://via.placeholder.com/40"}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                />
                <FiUser className="text-gray-500 dark:text-gray-400" />
                <span className="opacity-80">{user.name}</span>
              </div>

              <MobileNavLink
                to="/dashboard"
                icon={<FiGrid />}
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </MobileNavLink>

              <Link
                to="/photo-manager"
                className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
                title="Photo Manager"
              >
                <FiGrid size={18} />
                <span>Photo manager</span>
              </Link>

              <MobileNavLink
                to="/profile"
                icon={<FiSettings />}
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </MobileNavLink>

              <button
                onClick={() => {
                  toggleTheme();
                  setMenuOpen(false);
                }}
                className={`mt-2 p-2 rounded-full border transition-all duration-300 flex items-center justify-center ${
                  theme === "light"
                    ? "bg-gray-100 border-gray-300 hover:bg-gray-200"
                    : "bg-gray-800/80 border-gray-600 hover:bg-gray-700"
                }`}
                title="Toggle Theme"
              >
                {theme === "light" ? <FiMoon size={18} /> : <FiSun size={18} />}
              </button>

              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-1.5 rounded-full transition flex items-center justify-center space-x-1"
              >
                <FiLogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <MobileNavLink
                to="/login"
                icon={<FiUser />}
                onClick={() => setMenuOpen(false)}
              >
                Login
              </MobileNavLink>
              <MobileNavLink
                to="/signup"
                icon={<FiUser />}
                onClick={() => setMenuOpen(false)}
              >
                Signup
              </MobileNavLink>
              <button
                onClick={() => {
                  toggleTheme();
                  setMenuOpen(false);
                }}
                className={`mt-2 p-2 rounded-full border transition-all duration-300 flex items-center justify-center ${
                  theme === "light"
                    ? "bg-gray-100 border-gray-300 hover:bg-gray-200"
                    : "bg-gray-800/80 border-gray-600 hover:bg-gray-700"
                }`}
                title="Toggle Theme"
              >
                {theme === "light" ? <FiMoon size={18} /> : <FiSun size={18} />}
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

// Desktop NavLink with icon and text
const NavLink = ({ to, children, icon }) => (
  <Link
    to={to}
    className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
    title={children}
  >
    {icon && <span>{icon}</span>}
    <span>{children}</span>
  </Link>
);

// Mobile NavLink with icon and text
const MobileNavLink = ({ to, children, icon, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center space-x-2 hover:text-blue-500 transition-colors"
  >
    {icon && <span>{icon}</span>}
    <span>{children}</span>
  </Link>
);

export default Navbar;
