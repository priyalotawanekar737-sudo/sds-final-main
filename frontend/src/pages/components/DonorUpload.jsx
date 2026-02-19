import { useState } from "react";
import api from "../../api";

export default function DonorUpload({ onSuccess }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    state: "",
    city: "",
    pincode: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/donations", form);
      alert("Donation uploaded successfully");
      onSuccess(res.data); // update dashboard list
      setForm({
        title: "",
        description: "",
        state: "",
        city: "",
        pincode: "",
      });
    } catch {
      alert("Failed to upload donation");
    }
  };

  return (
    <form
      onSubmit={submit}
      className="bg-white p-6 rounded shadow max-w-xl"
    >
      <h3 className="text-lg font-semibold mb-4">
        Upload Donation
      </h3>

      <input
        name="title"
        placeholder="Donation Title"
        className="border p-2 w-full mb-2"
        onChange={handleChange}
        value={form.title}
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        className="border p-2 w-full mb-2"
        onChange={handleChange}
        value={form.description}
        required
      />

      <input
        name="state"
        placeholder="State"
        className="border p-2 w-full mb-2"
        onChange={handleChange}
        value={form.state}
        required
      />

      <input
        name="city"
        placeholder="City"
        className="border p-2 w-full mb-2"
        onChange={handleChange}
        value={form.city}
        required
      />

      <input
        name="pincode"
        placeholder="Pincode"
        className="border p-2 w-full mb-4"
        onChange={handleChange}
        value={form.pincode}
        required
      />

      <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
        Upload Donation
      </button>
    </form>
  );
}
