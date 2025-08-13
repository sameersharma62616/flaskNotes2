import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";

export default function PhotoManager() {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const { user } = useContext(AuthContext);
  const [photos, setPhotos] = useState([]);
  const [files, setFiles] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState([]); // for multiple delete
  const [previewPhoto, setPreviewPhoto] = useState(null); // for fullscreen view
  const token = localStorage.getItem("token");

  const axiosConfig = {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
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

    const formData = new FormData();
    files.forEach((file) => formData.append("photos", file));

    try {
      await axios.post(`${API_URL}/photos`, formData, {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          "Content-Type": "multipart/form-data",
        },
      });
      setFiles([]);
      fetchPhotos();
    } catch (err) {
      console.error("Error uploading photos", err);
    }
  };

  const deleteSelectedPhotos = async () => {
    if (!token || selectedPhotos.length === 0) return;

    try {
      await Promise.all(
        selectedPhotos.map((id) =>
          axios.delete(`${API_URL}/photos/${id}`, axiosConfig)
        )
      );
      setSelectedPhotos([]);
      fetchPhotos();
    } catch (err) {
      console.error("Error deleting photos", err);
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
    <div style={{ padding: "20px" }}>
      <h2>My Photos</h2>

      <input
        type="file"
        multiple
        onChange={(e) => setFiles([...e.target.files])}
      />
      <button onClick={uploadPhotos} disabled={files.length === 0}>
        Upload
      </button>

      {selectedPhotos.length > 0 && (
        <button
          onClick={deleteSelectedPhotos}
          style={{ marginLeft: "10px", background: "red", color: "white" }}
        >
          Delete Selected ({selectedPhotos.length})
        </button>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "20px" }}>
        {photos.length > 0 ? (
          photos.map((photo) => (
            <div
              key={photo._id}
              style={{
                margin: "10px",
                textAlign: "center",
                position: "relative",
              }}
            >
              <input
                type="checkbox"
                checked={selectedPhotos.includes(photo._id)}
                onChange={() => toggleSelect(photo._id)}
                style={{ position: "absolute", top: "5px", left: "5px" }}
              />
              <img
                src={photo.url}
                alt=""
                style={{
                  width: "150px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
                onClick={() => setPreviewPhoto(photo.url)}
              />
            </div>
          ))
        ) : (
          <p>No photos found.</p>
        )}
      </div>

      {/* Fullscreen Preview Modal */}
      {previewPhoto && (
        <div
          onClick={() => setPreviewPhoto(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <img
            src={previewPhoto}
            alt="Preview"
            style={{ maxWidth: "90%", maxHeight: "90%" }}
          />
        </div>
      )}
    </div>
  );
}