import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [pages, setPages] = useState([]);
  const [newPageName, setNewPageName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

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
    if (!window.confirm("Delete this page and its notes?")) return;
    try {
      await api.delete(`/pages/${id}`);
      setPages(pages.filter((p) => p._id !== id));
    } catch {
      alert("Failed to delete page");
    }
  };

  const startEdit = (id, currentName) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const saveEdit = async (id) => {
    if (!editingName.trim()) {
      alert("Page name cannot be empty");
      return;
    }
    try {
      await api.patch(`/pages/${id}`, { name: editingName });
      setPages((prev) =>
        prev.map((p) => (p._id === id ? { ...p, name: editingName } : p))
      );
      cancelEdit();
    } catch {
      alert("Failed to update page name");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-4">Your Pages</h1>

      <div className="flex mb-6">
        <input
          type="text"
          placeholder="New Page Name"
          value={newPageName}
          onChange={(e) => setNewPageName(e.target.value)}
          className="flex-grow border p-2 rounded-l"
        />
        <button
          onClick={createPage}
          disabled={loading}
          className="bg-green-600 text-white px-4 rounded-r hover:bg-green-700"
        >
          {loading ? "Creating..." : "Add Page"}
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {pages.length === 0 ? (
        <p>You have no pages yet.</p>
      ) : (
        <ul className="space-y-4">
          {pages.map((page) => (
            <li
              key={page._id}
              className="flex justify-between items-center border p-4 rounded"
            >
              {editingId === page._id ? (
                <>
                  <input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="border p-1 rounded flex-grow mr-2"
                  />
                  <button
                    onClick={() => saveEdit(page._id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded mr-2 hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to={`/pages/${page._id}`}
                    className="text-blue-600 hover:underline font-semibold flex-grow"
                  >
                    {page.name}
                  </Link>
                  <button
                    onClick={() => startEdit(page._id, page.name)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deletePage(page._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;