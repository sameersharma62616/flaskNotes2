// import React, { useEffect, useState } from "react";
// import api from "../api/axios";
// import { Link } from "react-router-dom";

// const Dashboard = () => {
//   const [pages, setPages] = useState([]);
//   const [newPageName, setNewPageName] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editingName, setEditingName] = useState("");

//   const fetchPages = async () => {
//     try {
//       const res = await api.get("/pages");
//       setPages(res.data);
//     } catch {
//       setError("Failed to load pages");
//     }
//   };

//   useEffect(() => {
//     fetchPages();
//   }, []);

//   const createPage = async () => {
//     if (!newPageName.trim()) return;
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await api.post("/pages", { name: newPageName });
//       setPages([res.data, ...pages]);
//       setNewPageName("");
//     } catch {
//       setError("Failed to create page");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deletePage = async (id) => {
//     if (!window.confirm("Delete this page and its notes?")) return;
//     try {
//       await api.delete(`/pages/${id}`);
//       setPages(pages.filter((p) => p._id !== id));
//     } catch {
//       alert("Failed to delete page");
//     }
//   };

//   const startEdit = (id, currentName) => {
//     setEditingId(id);
//     setEditingName(currentName);
//   };

//   const cancelEdit = () => {
//     setEditingId(null);
//     setEditingName("");
//   };

//   const saveEdit = async (id) => {
//     if (!editingName.trim()) {
//       alert("Page name cannot be empty");
//       return;
//     }
//     try {
//       await api.patch(`/pages/${id}`, { name: editingName });
//       setPages((prev) =>
//         prev.map((p) => (p._id === id ? { ...p, name: editingName } : p))
//       );
//       cancelEdit();
//     } catch {
//       alert("Failed to update page name");
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto mt-10 p-4">
//       <h1 className="text-3xl font-bold mb-4">Your Pages</h1>

//       <div className="flex mb-6">
//         <input
//           type="text"
//           placeholder="New Page Name"
//           value={newPageName}
//           onChange={(e) => setNewPageName(e.target.value)}
//           className="flex-grow border p-2 rounded-l"
//         />
//         <button
//           onClick={createPage}
//           disabled={loading}
//           className="bg-green-600 text-white px-4 rounded-r hover:bg-green-700"
//         >
//           {loading ? "Creating..." : "Add Page"}
//         </button>
//       </div>

//       {error && <p className="text-red-600 mb-4">{error}</p>}

//       {pages.length === 0 ? (
//         <p>You have no pages yet.</p>
//       ) : (
//         <ul className="space-y-4">
//           {pages.map((page) => (
//             <li
//               key={page._id}
//               className="flex justify-between items-center border p-4 rounded"
//             >
//               {editingId === page._id ? (
//                 <>
//                   <input
//                     value={editingName}
//                     onChange={(e) => setEditingName(e.target.value)}
//                     className="border p-1 rounded flex-grow mr-2"
//                   />
//                   <button
//                     onClick={() => saveEdit(page._id)}
//                     className="bg-blue-600 text-white px-3 py-1 rounded mr-2 hover:bg-blue-700"
//                   >
//                     Save
//                   </button>
//                   <button
//                     onClick={cancelEdit}
//                     className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
//                   >
//                     Cancel
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <Link
//                     to={`/pages/${page._id}`}
//                     className="text-blue-600 hover:underline font-semibold flex-grow"
//                   >
//                     {page.name}
//                   </Link>
//                   <button
//                     onClick={() => startEdit(page._id, page.name)}
//                     className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => deletePage(page._id)}
//                     className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//                   >
//                     Delete
//                   </button>
//                 </>
//               )}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default Dashboard;

import React, { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { ThemeContext } from "../contexts/ThemeContext";
import Swal from "sweetalert2";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const Dashboard = () => {
  const [pages, setPages] = useState([]);
  const [newPageName, setNewPageName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const { theme } = useContext(ThemeContext);

  const fetchPages = async () => {
    try {
      const res = await api.get("/pages");
      setPages(res.data);
    } catch {
      setError("Failed to load pages");
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const createPage = async () => {
    if (!newPageName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/pages", { name: newPageName });
      setPages([res.data, ...pages]);
      setNewPageName("");
    } catch {
      setError("Failed to create page");
    } finally {
      setLoading(false);
    }
  };

  const deletePage = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the page and all its notes!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      background: theme === "light" ? "#fff" : "#1f2937",
      color: theme === "light" ? "#000" : "#fff",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/pages/${id}`);
      setPages(pages.filter((p) => p._id !== id));
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Page removed successfully.",
        timer: 1500,
        showConfirmButton: false,
        background: theme === "light" ? "#fff" : "#1f2937",
        color: theme === "light" ? "#000" : "#fff",
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to delete page",
        background: theme === "light" ? "#fff" : "#1f2937",
        color: theme === "light" ? "#000" : "#fff",
      });
    }
  };

  const startEdit = (id, currentName) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  const saveEdit = async (id) => {
    if (!editingName.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Page name cannot be empty",
        background: theme === "light" ? "#fff" : "#1f2937",
        color: theme === "light" ? "#000" : "#fff",
      });
    }

    try {
      await api.patch(`/pages/${id}`, { name: editingName });
      setPages((prev) =>
        prev.map((p) => (p._id === id ? { ...p, name: editingName } : p))
      );
      setEditingId(null);
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Page name updated successfully.",
        timer: 1500,
        showConfirmButton: false,
        background: theme === "light" ? "#fff" : "#1f2937",
        color: theme === "light" ? "#000" : "#fff",
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Failed to update page name",
        background: theme === "light" ? "#fff" : "#1f2937",
        color: theme === "light" ? "#000" : "#fff",
      });
    }
  };

  return (
    <div
      className={`min-h-screen transition-all duration-300 px-4 py-4 ${
        theme === "light" ? "bg-gray-100 text-gray-900" : "text-gray-100"
      }`}
      style={
        theme !== "light"
          ? { background: "linear-gradient(135deg, #536976, #292E49)" }
          : {}
      }
    >
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 font-serif">Your Pages</h1>

        {/* Add Page Input */}
        <div className="flex mb-6 shadow-lg rounded-lg overflow-hidden">
          <input
            type="text"
            placeholder="New Page Name"
            value={newPageName}
            onChange={(e) => setNewPageName(e.target.value)}
            className={`flex-grow px-4 py-3 outline-none 
              ${
                theme === "light"
                  ? "bg-white border border-gray-300 focus:border-blue-500"
                  : "bg-gray-800 border border-gray-700 focus:border-blue-400"
              }`}
          />
          <button
            onClick={createPage}
            disabled={loading}
            className={`px-6 py-3 font-medium transition-all duration-300
              ${
                theme === "light"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
          >
            {loading ? "Creating..." : "Add"}
          </button>
        </div>

        {error && <p className="text-red-500 font-medium mb-6">{error}</p>}

        {/* Pages as Cards */}
        {pages.length === 0 ? (
          <p className="text-gray-500">You have no pages yet.</p>
        ) : (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {pages.map((page) => (
              <div
                key={page._id}
                className={`
                  aspect-square rounded-xl shadow-md hover:shadow-lg
                  transform transition-all duration-300 hover:-translate-y-1
                  p-4 relative flex flex-col
                  ${theme === "light" ? "bg-white" : "bg-gray-800"}
                `}
                style={{
                  backgroundImage:
                    theme === "light"
                      ? "linear-gradient(145deg, #ffffff, #f3f4f6)"
                      : "linear-gradient(145deg, #1f2937, #111827)",
                }}
              >
                {editingId === page._id ? (
                  // EDIT MODE
                  <>
                    <input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border outline-none mb-4 text-sm sm:text-base
                        ${
                          theme === "light"
                            ? "bg-white border-gray-300"
                            : "bg-gray-700 border-gray-600 text-white"
                        }`}
                    />
                    <div className="flex flex-col gap-2 mt-auto">
                      <button
                        onClick={() => saveEdit(page._id)}
                        className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white w-full"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => deletePage(page._id)}
                        className="px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white w-full"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-2 rounded-lg bg-gray-400 hover:bg-gray-500 text-white w-full"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  // NORMAL MODE
                  <>
                    {/* Edit Icon - Top Right */}
                    <button
                      onClick={() => startEdit(page._id, page.name)}
                      className="absolute top-2 right-2 text-gray-500 hover:text-yellow-500 transition p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                      title="Edit Page"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    {/* Centered Page Name */}
                    <Link
                      to={`/pages/${page._id}`}
                      className={`flex-1 flex items-center justify-center text-center text-base sm:text-lg font-semibold break-words px-2
                        ${
                          theme === "light" ? "text-blue-600" : "text-blue-400"
                        }`}
                    >
                      {page.name}
                    </Link>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
