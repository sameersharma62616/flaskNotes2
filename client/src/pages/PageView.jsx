import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import dayjs from "dayjs";

const PageView = () => {
  const { pageId } = useParams();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form state for new note
  const [formData, setFormData] = useState({
    sno: "",
    title: "",
    description: "",
    date: "",
    image: null,
  });
  const [submitting, setSubmitting] = useState(false);

  // Edit mode state
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    sno: "",
    title: "",
    description: "",
    date: "",
    image: null,
  });

  const fetchNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/pages/${pageId}/notes`);
      setNotes(res.data);
    } catch {
      setError("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [pageId]);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const data = new FormData();
      data.append("sno", formData.sno);
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("date", formData.date);
      if (formData.image) {
        data.append("image", formData.image);
      }

      const res = await api.post(`/pages/${pageId}/notes`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setNotes((prev) => [...prev, res.data]);
      setFormData({
        sno: "",
        title: "",
        description: "",
        date: "",
        image: null,
      });
    } catch {
      setError("Failed to add note");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteNote = async (id) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      await api.delete(`/notes/${id}`);
      setNotes(notes.filter((n) => n._id !== id));
    } catch {
      alert("Failed to delete note");
    }
  };

  // Edit handlers
  const startEdit = (note) => {
    setEditingNoteId(note._id);
    setEditFormData({
      sno: note.sno,
      title: note.title,
      description: note.description,
      date: note.date ? dayjs(note.date).format("YYYY-MM-DD") : "",
      image: null, // reset image file input
    });
  };

  const handleEditChange = (e) => {
    if (e.target.name === "image") {
      setEditFormData({ ...editFormData, image: e.target.files[0] });
    } else {
      setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    }
  };

  const cancelEdit = () => {
    setEditingNoteId(null);
    setEditFormData({
      sno: "",
      title: "",
      description: "",
      date: "",
      image: null,
    });
  };

  const saveEdit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const data = new FormData();
      data.append("sno", editFormData.sno);
      data.append("title", editFormData.title);
      data.append("description", editFormData.description);
      data.append("date", editFormData.date);
      if (editFormData.image) {
        data.append("image", editFormData.image);
      }

      const res = await api.patch(
        `/pages/${pageId}/notes/${editingNoteId}`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setNotes((prev) =>
        prev.map((n) => (n._id === editingNoteId ? res.data : n))
      );
      cancelEdit();
    } catch {
      setError("Failed to update note");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-6">Notes</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Notes list */}
      {notes.length === 0 ? (
        <p>No notes yet. Add one below!</p>
      ) : (
        <ul className="space-y-4 mb-6">
          {notes.map((note) =>
            editingNoteId === note._id ? (
              <li
                key={note._id}
                className="border p-4 rounded space-y-2 bg-yellow-50"
              >
                <div className="flex space-x-2">
                  <input
                    type="number"
                    name="sno"
                    placeholder="S.No."
                    value={editFormData.sno}
                    onChange={handleEditChange}
                    className="w-20 p-2 border rounded"
                  />
                  <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={editFormData.title}
                    onChange={handleEditChange}
                    className="flex-grow p-2 border rounded"
                  />
                </div>
                <textarea
                  name="description"
                  placeholder="Description"
                  value={editFormData.description}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded"
                  rows={3}
                />
                <input
                  type="date"
                  name="date"
                  value={editFormData.date}
                  onChange={handleEditChange}
                  className="p-2 border rounded"
                />
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleEditChange}
                  className="p-2"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={saveEdit}
                    disabled={submitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    disabled={submitting}
                    className="bg-gray-400 hover:bg-gray-500 text-white py-1 px-3 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </li>
            ) : (
              <li
                key={note._id}
                className="border p-4 rounded flex justify-between items-start"
              >
                <div>
                  <h3 className="font-semibold text-lg">
                    {note.sno}. {note.title}
                  </h3>
                  <p>{note.description}</p>
                  <p className="text-sm text-gray-500">
                    Date:{" "}
                    {note.date ? dayjs(note.date).format("DD MMM YYYY") : "N/A"}
                  </p>
                  {note.image && (
                    <img
                      src={note.image}
                      alt={note.title}
                      className="mt-2 max-w-xs rounded"
                    />
                  )}
                </div>
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => startEdit(note)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteNote(note._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            )
          )}
        </ul>
      )}

      {/* Add note form */}
      <form onSubmit={handleSubmit} className="border p-4 rounded space-y-4">
        <div className="flex space-x-2">
          <input
            type="number"
            name="sno"
            placeholder="S.No."
            required
            value={formData.sno}
            onChange={handleChange}
            className="w-20 p-2 border rounded"
          />
          <input
            type="text"
            name="title"
            placeholder="Title"
            required
            value={formData.title}
            onChange={handleChange}
            className="flex-grow p-2 border rounded"
          />
        </div>
        <textarea
          name="description"
          placeholder="Description"
          required
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows={4}
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="p-2"
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          {submitting ? "Adding Note..." : "Add Note"}
        </button>
      </form>
    </div>
  );
};

export default PageView;
