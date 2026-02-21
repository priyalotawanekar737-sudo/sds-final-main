import React, { useState } from 'react';
import axios from 'axios';

const UploadImage = ({ donationId, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    
    // Validate file type
    if (selectedFile && !selectedFile.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setFile(selectedFile);
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file first');
      return;
    }

    if (!donationId) {
      setError('Donation ID is required');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('donationId', donationId);

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/donations/upload-proof/${donationId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setSuccess(true);
      setFile(null);
      setPreview(null);
      
      // Call success callback if provided
      if (onUploadSuccess) {
        onUploadSuccess(response.data);
      }

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Failed to upload image. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setError(null);
    setSuccess(false);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload Proof Image</h2>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
          Image uploaded successfully!
        </div>
      )}

      <form onSubmit={handleUpload}>
        {/* File Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Select Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <p className="text-sm text-gray-500 mt-1">
            Allowed: PNG, JPG, GIF (Max 5MB)
          </p>
        </div>

        {/* Image Preview */}
        {preview && (
          <div className="mb-4">
            <p className="text-gray-700 font-medium mb-2">Preview:</p>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-md border border-gray-300"
            />
          </div>
        )}

        {/* File Name Display */}
        {file && (
          <div className="mb-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-gray-700">
              <span className="font-medium">File:</span> {file.name}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Size:</span> {(file.size / 1024).toFixed(2)} KB
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || !file}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            {loading ? 'Uploading...' : 'Upload Image'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-200"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadImage;
