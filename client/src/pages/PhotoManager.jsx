// //here only uplod photo not camera code
// import { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import { AuthContext } from "../contexts/AuthContext";

// export default function PhotoManager() {
//   const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
//   const { user } = useContext(AuthContext);
//   const [photos, setPhotos] = useState([]);
//   const [files, setFiles] = useState([]);
//   const [selectedPhotos, setSelectedPhotos] = useState([]); // for multiple delete
//   const [previewPhoto, setPreviewPhoto] = useState(null); // for fullscreen view
//   const token = localStorage.getItem("token");
  
//   const axiosConfig = {
//     withCredentials: true,
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };

//   const fetchPhotos = async () => {
//     if (!token) return;
//     try {
//       const res = await axios.get(`${API_URL}/photos`, axiosConfig);
//       setPhotos(Array.isArray(res.data) ? res.data : []);
//     } catch (err) {
//       console.error("Error fetching photos", err);
//       setPhotos([]);
//     }
//   };

//   const uploadPhotos = async () => {
//     if (!token || files.length === 0) return;

//     const formData = new FormData();
//     files.forEach((file) => formData.append("photos", file));

//     try {
//       await axios.post(`${API_URL}/photos`, formData, {
//         ...axiosConfig,
//         headers: {
//           ...axiosConfig.headers,
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       setFiles([]);
//       fetchPhotos();
//     } catch (err) {
//       console.error("Error uploading photos", err);
//     }
//   };

//   const deleteSelectedPhotos = async () => {
//     if (!token || selectedPhotos.length === 0) return;

//     try {
//       await Promise.all(
//         selectedPhotos.map((id) =>
//           axios.delete(`${API_URL}/photos/${id}`, axiosConfig)
//         )
//       );
//       setSelectedPhotos([]);
//       fetchPhotos();
//     } catch (err) {
//       console.error("Error deleting photos", err);
//     }
//   };

//   const toggleSelect = (id) => {
//     setSelectedPhotos((prev) =>
//       prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
//     );
//   };

//   useEffect(() => {
//     fetchPhotos();
//   }, []);

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>My Photos</h2>

//       <input
//         type="file"
//         multiple
//         onChange={(e) => setFiles([...e.target.files])}
//       />
//       <button onClick={uploadPhotos} disabled={files.length === 0}>
//         Upload
//       </button>

//       {selectedPhotos.length > 0 && (
//         <button
//           onClick={deleteSelectedPhotos}
//           style={{ marginLeft: "10px", background: "red", color: "white" }}
//         >
//           Delete Selected ({selectedPhotos.length})
//         </button>
//       )}

//       <div style={{ display: "flex", flexWrap: "wrap", marginTop: "20px" }}>
//         {photos.length > 0 ? (
//           photos.map((photo) => (
//             <div
//               key={photo._id}
//               style={{
//                 margin: "10px",
//                 textAlign: "center",
//                 position: "relative",
//               }}
//             >
//               <input
//                 type="checkbox"
//                 checked={selectedPhotos.includes(photo._id)}
//                 onChange={() => toggleSelect(photo._id)}
//                 style={{ position: "absolute", top: "5px", left: "5px" }}
//               />
//               <img
//                 src={photo.url}
//                 alt=""
//                 style={{
//                   width: "150px",
//                   borderRadius: "8px",
//                   cursor: "pointer",
//                 }}
//                 onClick={() => setPreviewPhoto(photo.url)}
//               />
//             </div>
//           ))
//         ) : (
//           <p>No photos found.</p>
//         )}
//       </div>

//       {/* Fullscreen Preview Modal */}
//       {previewPhoto && (
//         <div
//           onClick={() => setPreviewPhoto(null)}
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100vw",
//             height: "100vh",
//             background: "rgba(0,0,0,0.8)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 9999,
//           }}
//         >
//           <img
//             src={previewPhoto}
//             alt="Preview"
//             style={{ maxWidth: "90%", maxHeight: "90%" }}
//           />
//         </div>
//       )}
//     </div>
//   );
// }


import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { FiTrash2, FiCheckSquare, FiXCircle, FiUpload, FiImage } from "react-icons/fi";

// Simple Spinner CSS
const spinnerCSS = `
@keyframes spin {
  to { transform: rotate(360deg); }
}
.photo-spinner {
  border: 4px solid rgba(255,255,255,0.3);
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  animation: spin 1s linear infinite;
}
`;

export default function PhotoManager() {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  const [photos, setPhotos] = useState([]);
  const [files, setFiles] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [uploading, setUploading] = useState(false); // spinner state

  const token = localStorage.getItem("token");

  const axiosConfig = {
    withCredentials: true,
    headers: { Authorization: `Bearer ${token}` },
  };

  const fetchPhotos = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_URL}/photos`, axiosConfig);
      setPhotos(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching photos", err);
      setPhotos([]);
    }
  };

  const uploadPhotos = async () => {
    if (!token || files.length === 0) return;
    setUploading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append("photos", file));

    try {
      await axios.post(`${API_URL}/photos`, formData, {
        ...axiosConfig,
        headers: { ...axiosConfig.headers, "Content-Type": "multipart/form-data" },
      });
      setFiles([]);
      fetchPhotos();
    } catch (err) {
      console.error("Error uploading photos", err);
    } finally {
      setUploading(false);
    }
  };

  const deleteSelectedPhotos = async () => {
    if (!token || selectedPhotos.length === 0) return;
    setUploading(true);
    try {
      await Promise.all(selectedPhotos.map((id) =>
        axios.delete(`${API_URL}/photos/${id}`, axiosConfig)
      ));
      setSelectedPhotos([]);
      setMultiSelectMode(false);
      fetchPhotos();
    } catch (err) {
      console.error("Error deleting photos", err);
    }
    finally {
      setUploading(false);
    }
  };

  const toggleSelect = (id) => {
    setSelectedPhotos((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  return (
    <div
      className={`min-h-screen px-4 py-8 transition-colors duration-300 ${
        theme === "light" ? "text-gray-900" : "text-gray-100"
      }`}
      style={
        theme !== "light"
          ? { background: "linear-gradient(135deg, #536976, #292E49)" }
          : { backgroundColor: "#f9fafb" }
      }
    >
      <style>{spinnerCSS}</style>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
          {/* Title + Counter */}
          <div className="flex items-center gap-2">
            <FiImage size={24} />
            <h2 className="text-2xl font-bold">My Photos</h2>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                theme === "light"
                  ? "bg-gray-300 text-gray-800"
                  : "bg-gray-700 text-gray-100"
              }`}
            >
              Total: {photos.length}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            {/* Upload Input */}
            <label
              className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition ${
                theme === "light"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              <FiUpload />
              Select Photos
              <input
                type="file"
                multiple
                onChange={(e) => setFiles([...e.target.files])}
                className="hidden"
              />
            </label>

            {/* Save Button */}
            <button
              onClick={uploadPhotos}
              disabled={files.length === 0 || uploading}
              className={`px-4 py-2 rounded-lg transition ${
                files.length === 0 || uploading
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : theme === "light"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              {uploading ? "Uploading..." : "Uplod"}
            </button>

            {/* Multi-select */}
            <button
              onClick={() => {
                setMultiSelectMode((prev) => !prev);
                setSelectedPhotos([]);
              }}
              className={`px-3 py-2 rounded-lg flex items-center gap-1 transition ${
                multiSelectMode
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-yellow-500 hover:bg-yellow-600 text-white"
              }`}
            >
              {multiSelectMode ? <FiXCircle /> : <FiCheckSquare />}
              <span className="hidden sm:inline">
                {multiSelectMode ? "" : ""}
              </span>
            </button>

             {/* Select All / Unselect All */}
  {multiSelectMode && photos.length > 0 && (
    <button
      onClick={() => {
        if (selectedPhotos.length === photos.length) {
          setSelectedPhotos([]);
        } else {
          setSelectedPhotos(photos.map(photo => photo._id));
        }
      }}
      className={`px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-1`}
    >
      <FiCheckSquare />
      <span>
        {selectedPhotos.length === photos.length
          ? "Unselect All"
          : "Select All"}
      </span>
    </button>
  )}

            {/* Delete */}
            {multiSelectMode && selectedPhotos.length > 0 && (
              <button
                onClick={deleteSelectedPhotos}
                className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center gap-1"
              >
                <FiTrash2 /> Delete ({selectedPhotos.length})
              </button>
            )}
          </div>
        </div>

        {/* Upload overlay + spinner */}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg z-30">
            <div className="photo-spinner"></div>
          </div>
        )}

        {/* Photos Grid */}
        <div
          className={`grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 ${
            uploading ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          {photos.length > 0 ? (
            photos.map((photo) => (
              <div
                key={photo._id}
                className={`relative border rounded-lg overflow-hidden shadow hover:shadow-lg transition transform hover:-translate-y-1 ${
                  theme === "light"
                    ? "border-gray-300 bg-white"
                    : "border-gray-700 bg-gray-800"
                }`}
              >
                {multiSelectMode && (
                  <input
                    type="checkbox"
                    checked={selectedPhotos.includes(photo._id)}
                    onChange={() => toggleSelect(photo._id)}
                    className="absolute top-2 left-2 w-5 h-5"
                  />
                )}
                <img
                  src={photo.url}
                  alt=""
                  className="w-full h-40 object-cover cursor-pointer"
                  onClick={() => !multiSelectMode && setPreviewPhoto(photo.url)}
                />
              </div>
            ))
          ) : (
            <p className="col-span-full text-gray-500 text-center">
              No photos found.
            </p>
          )}
        </div>
      </div>

      {/* Full-screen Preview */}
      {previewPhoto && (
        <div
          onClick={() => setPreviewPhoto(null)}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        >
          <img
            src={previewPhoto}
            alt="Preview"
            className="max-w-full max-h-[90vh] rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
}
