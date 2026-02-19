import { useState } from "react";
import api from "../../api";

export default function UploadProof({ donationId, onUploaded }) {
  const [file, setFile] = useState(null);

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("image", file);

    await api.post(`/donations/${donationId}/upload-proof`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    onUploaded();
    alert("Image uploaded successfully");
  };

  return (
    <div className="mt-2">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="text-sm"
      />
      <button
        onClick={uploadImage}
        className="mt-1 bg-blue-600 text-white px-2 py-1 rounded text-sm"
      >
        Upload Proof
      </button>
    </div>
  );
}
