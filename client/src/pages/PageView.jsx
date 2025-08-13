// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import api from "../api/axios";
// import dayjs from "dayjs";

// const PageView = () => {
//   const { pageId } = useParams();
//   const [notes, setNotes] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Form state for new note
//   const [formData, setFormData] = useState({
//     sno: "",
//     title: "",
//     description: "",
//     date: "",
//     image: null,
//   });
//   const [submitting, setSubmitting] = useState(false);

//   // Edit mode state
//   const [editingNoteId, setEditingNoteId] = useState(null);
//   const [editFormData, setEditFormData] = useState({
//     sno: "",
//     title: "",
//     description: "",
//     date: "",
//     image: null,
//   });

//   const fetchNotes = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await api.get(`/pages/${pageId}/notes`);
//       setNotes(res.data);
//     } catch {
//       setError("Failed to load notes");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchNotes();
//   }, [pageId]);

//   const handleChange = (e) => {
//     if (e.target.name === "image") {
//       setFormData({ ...formData, image: e.target.files[0] });
//     } else {
//       setFormData({ ...formData, [e.target.name]: e.target.value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     setError(null);

//     try {
//       const data = new FormData();
//       data.append("sno", formData.sno);
//       data.append("title", formData.title);
//       data.append("description", formData.description);
//       data.append("date", formData.date);
//       if (formData.image) {
//         data.append("image", formData.image);
//       }

//       const res = await api.post(`/pages/${pageId}/notes`, data, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       setNotes((prev) => [...prev, res.data]);
//       setFormData({
//         sno: "",
//         title: "",
//         description: "",
//         date: "",
//         image: null,
//       });
//     } catch {
//       setError("Failed to add note");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const deleteNote = async (id) => {
//     if (!window.confirm("Delete this note?")) return;
//     try {
//       await api.delete(`/notes/${id}`);
//       setNotes(notes.filter((n) => n._id !== id));
//     } catch {
//       alert("Failed to delete note");
//     }
//   };

//   // Edit handlers
//   const startEdit = (note) => {
//     setEditingNoteId(note._id);
//     setEditFormData({
//       sno: note.sno,
//       title: note.title,
//       description: note.description,
//       date: note.date ? dayjs(note.date).format("YYYY-MM-DD") : "",
//       image: null, // reset image file input
//     });
//   };

//   const handleEditChange = (e) => {
//     if (e.target.name === "image") {
//       setEditFormData({ ...editFormData, image: e.target.files[0] });
//     } else {
//       setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
//     }
//   };

//   const cancelEdit = () => {
//     setEditingNoteId(null);
//     setEditFormData({
//       sno: "",
//       title: "",
//       description: "",
//       date: "",
//       image: null,
//     });
//   };

//   const saveEdit = async () => {
//     setSubmitting(true);
//     setError(null);
//     try {
//       const data = new FormData();
//       data.append("sno", editFormData.sno);
//       data.append("title", editFormData.title);
//       data.append("description", editFormData.description);
//       data.append("date", editFormData.date);
//       if (editFormData.image) {
//         data.append("image", editFormData.image);
//       }

//       const res = await api.patch(
//         `/pages/${pageId}/notes/${editingNoteId}`,
//         data,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );

//       setNotes((prev) =>
//         prev.map((n) => (n._id === editingNoteId ? res.data : n))
//       );
//       cancelEdit();
//     } catch {
//       setError("Failed to update note");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto mt-10 p-4">
//       <h1 className="text-3xl font-bold mb-6">Notes</h1>

//       {error && <p className="text-red-600 mb-4">{error}</p>}

//       {/* Notes list */}
//       {notes.length === 0 ? (
//         <p>No notes yet. Add one below!</p>
//       ) : (
//         <ul className="space-y-4 mb-6">
//           {notes.map((note) =>
//             editingNoteId === note._id ? (
//               <li
//                 key={note._id}
//                 className="border p-4 rounded space-y-2 bg-yellow-50"
//               >
//                 <div className="flex space-x-2">
//                   <input
//                     type="number"
//                     name="sno"
//                     placeholder="S.No."
//                     value={editFormData.sno}
//                     onChange={handleEditChange}
//                     className="w-20 p-2 border rounded"
//                   />
//                   <input
//                     type="text"
//                     name="title"
//                     placeholder="Title"
//                     value={editFormData.title}
//                     onChange={handleEditChange}
//                     className="flex-grow p-2 border rounded"
//                   />
//                 </div>
//                 <textarea
//                   name="description"
//                   placeholder="Description"
//                   value={editFormData.description}
//                   onChange={handleEditChange}
//                   className="w-full p-2 border rounded"
//                   rows={3}
//                 />
//                 <input
//                   type="date"
//                   name="date"
//                   value={editFormData.date}
//                   onChange={handleEditChange}
//                   className="p-2 border rounded"
//                 />
//                 <input
//                   type="file"
//                   name="image"
//                   accept="image/*"
//                   onChange={handleEditChange}
//                   className="p-2"
//                 />
//                 <div className="flex space-x-2">
//                   <button
//                     onClick={saveEdit}
//                     disabled={submitting}
//                     className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
//                   >
//                     Save
//                   </button>
//                   <button
//                     onClick={cancelEdit}
//                     disabled={submitting}
//                     className="bg-gray-400 hover:bg-gray-500 text-white py-1 px-3 rounded"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </li>
//             ) : (
//               <li
//                 key={note._id}
//                 className="border p-4 rounded flex justify-between items-start"
//               >
//                 <div>
//                   <h3 className="font-semibold text-lg">
//                     {note.sno}. {note.title}
//                   </h3>
//                   <p>{note.description}</p>
//                   <p className="text-sm text-gray-500">
//                     Date:{" "}
//                     {note.date ? dayjs(note.date).format("DD MMM YYYY") : "N/A"}
//                   </p>
//                   {note.image && (
//                     <img
//                       src={note.image}
//                       alt={note.title}
//                       className="mt-2 max-w-xs rounded"
//                     />
//                   )}
//                 </div>
//                 <div className="flex flex-col space-y-2">
//                   <button
//                     onClick={() => startEdit(note)}
//                     className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => deleteNote(note._id)}
//                     className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </li>
//             )
//           )}
//         </ul>
//       )}

//       {/* Add note form */}
//       <form onSubmit={handleSubmit} className="border p-4 rounded space-y-4">
//         <div className="flex space-x-2">
//           <input
//             type="number"
//             name="sno"
//             placeholder="S.No."
//             required
//             value={formData.sno}
//             onChange={handleChange}
//             className="w-20 p-2 border rounded"
//           />
//           <input
//             type="text"
//             name="title"
//             placeholder="Title"
//             required
//             value={formData.title}
//             onChange={handleChange}
//             className="flex-grow p-2 border rounded"
//           />
//         </div>
//         <textarea
//           name="description"
//           placeholder="Description"
//           required
//           value={formData.description}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           rows={4}
//         />
//         <input
//           type="date"
//           name="date"
//           value={formData.date}
//           onChange={handleChange}
//           className="p-2 border rounded"
//         />
//         <input
//           type="file"
//           name="image"
//           accept="image/*"
//           onChange={handleChange}
//           className="p-2"
//         />
//         <button
//           type="submit"
//           disabled={submitting}
//           className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
//         >
//           {submitting ? "Adding Note..." : "Add Note"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default PageView;

import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import dayjs from "dayjs";

import { ThemeContext } from "../contexts/ThemeContext";
import { FiEdit2, FiTrash2, FiSave, FiX, FiPlus } from "react-icons/fi";
import Swal from "sweetalert2";

const PageView = () => {
  const { pageId } = useParams();
  const { theme } = useContext(ThemeContext);

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [viewImageSrc, setViewImageSrc] = useState(null);

  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({
    sno: "",
    title: "",
    description: "",
    date: "",
    image: null,
  });

  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    sno: "",
    title: "",
    description: "",
    date: "",
    image: null,
  });

  useEffect(() => {
    fetchNotes();
  }, [pageId]);

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

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleEditChange = (e) => {
    if (e.target.name === "image") {
      setEditFormData({ ...editFormData, image: e.target.files[0] });
    } else {
      setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => v && data.append(k, v));

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
      setShowAddForm(false);
    } catch {
      setError("Failed to add note");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteNote = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This note will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      background: theme === "light" ? "#ffffff" : "#1f2937",
      color: theme === "light" ? "#000000" : "#ffffff",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/notes/${id}`);
      setNotes((notes) => notes.filter((n) => n._id !== id));

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "The note has been deleted successfully.",
        timer: 1500,
        showConfirmButton: false,
        background: theme === "light" ? "#ffffff" : "#1f2937",
        color: theme === "light" ? "#000000" : "#ffffff",
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to delete note",
        background: theme === "light" ? "#ffffff" : "#1f2937",
        color: theme === "light" ? "#000000" : "#ffffff",
      });
    }
  };

  const startEdit = (note) => {
    setEditingNoteId(note._id);
    setEditFormData({
      sno: note.sno,
      title: note.title,
      description: note.description,
      date: note.date ? dayjs(note.date).format("YYYY-MM-DD") : "",
      image: null,
    });
  };

  const saveEdit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const data = new FormData();
      Object.entries(editFormData).forEach(([k, v]) => v && data.append(k, v));

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
      setEditingNoteId(null);
    } catch {
      setError("Failed to update note");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`min-h-[95vh] px-4 py-4 transition-all duration-300 ${
        theme === "light" ? "bg-gray-100 text-gray-900" : "text-gray-100"
      }`}
      style={
        theme !== "light"
          ? { background: "linear-gradient(135deg, #536976, #292E49)" }
          : {}
      }
    >
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold font-serif mb-4">Notes</h1>
        {error && <p className="text-red-500 mb-6">{error}</p>}

        {/* Notes Cards */}
        {loading ? (
          <p>Loading...</p>
        ) : notes.length === 0 ? (
          <p className="text-gray-500">No notes yet. Click + to add one!</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-16">
            {notes.map((note) => (
              <div
                key={note._id}
                className={`p-5 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 relative ${
                  theme === "light"
                    ? "bg-white border border-gray-200"
                    : "bg-gray-800 border border-gray-700"
                }`}
              >
                {editingNoteId === note._id ? (
                  // EDIT MODE
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        name="sno"
                        value={editFormData.sno}
                        onChange={handleEditChange}
                        className="w-20 p-2 border rounded"
                      />
                      <input
                        type="text"
                        name="title"
                        value={editFormData.title}
                        onChange={handleEditChange}
                        placeholder="Title"
                        className="flex-1 p-2 border rounded"
                      />
                    </div>
                    <textarea
                      name="description"
                      value={editFormData.description}
                      onChange={handleEditChange}
                      rows={3}
                      placeholder="Description"
                      className="w-full p-2 border rounded"
                    />
                    <input
                      type="date"
                      name="date"
                      value={editFormData.date}
                      onChange={handleEditChange}
                      className="p-2 border rounded w-full"
                    />
                    <input
                      type="file"
                      name="image"
                      onChange={handleEditChange}
                      className="p-2 border rounded w-full"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={saveEdit}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded flex items-center justify-center gap-1"
                      >
                        <FiSave /> Save
                      </button>
                      <button
                        onClick={() => setEditingNoteId(null)}
                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded flex items-center justify-center gap-1"
                      >
                        <FiX /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // NORMAL MODE
                  <>
                    {/* Small Icon Buttons - Top Right */}
                    <div className="absolute top-4 right-3 flex flex-col gap-2">
                      <button
                        onClick={() => startEdit(note)}
                        className="p-2 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white shadow-md"
                        title="Edit Note"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => deleteNote(note._id)}
                        className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-md"
                        title="Delete Note"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>

                    {/* Note Content */}
                    <div>
                      <h3 className="text-lg font-semibold">
                        {note.sno}. {note.title}
                      </h3>
                      <p className="text-sm mb-2">{note.description}</p>
                      <p className="text-xs text-gray-500">
                        {note.date
                          ? dayjs(note.date).format("DD MMM YYYY")
                          : "N/A"}
                      </p>
                      {note.image && (
                        <>
                          {/* <img
                        src={note.image}
                        alt={note.title}
                        className="mt-3 w-full h-40 object-cover rounded"
                      /> */}
                          <button
                            onClick={() => setViewImageSrc(note.image)}
                            className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                          >
                            View Image
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Floating Add Button */}
        <button
          onClick={() => setShowAddForm(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all"
          title="Add New Note"
        >
          <FiPlus size={24} />
        </button>

        {/* Modal for Image View */}
        {viewImageSrc && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="relative max-w-full max-h-full rounded-lg overflow-auto">
              <button
                onClick={() => setViewImageSrc(null)}
                className="absolute top-2 right-2 p-2 bg-gray-700 bg-opacity-70 hover:bg-opacity-90 rounded-full text-white"
                aria-label="Close Image"
              >
                <FiX size={24} />
              </button>
              <img
                src={viewImageSrc}
                alt="Note full"
                className="max-w-full max-h-[80vh] rounded"
              />
            </div>
          </div>
        )}

        {/* Modal for Add Note */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div
              className={`w-full max-w-lg p-6 rounded-xl shadow-lg border relative ${
                theme === "light"
                  ? "bg-white border-gray-200"
                  : "bg-gray-800 border-gray-700"
              }`}
            >
              <button
                onClick={() => setShowAddForm(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
              >
                <FiX size={20} />
              </button>
              <h2 className="text-xl font-semibold mb-4">Add New Note</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="sno"
                    value={formData.sno}
                    onChange={handleChange}
                    placeholder="S.No."
                    className="w-20 p-2 border rounded"
                    required
                  />
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Title"
                    className="flex-grow p-2 border rounded"
                    required
                  />
                </div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Description"
                  className="w-full p-2 border rounded"
                  required
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
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                >
                  {submitting ? "Adding..." : "Add Note"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageView;
