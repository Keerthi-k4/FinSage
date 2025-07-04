import { useState } from "react";
import axios from "axios";

export default function TransactionForm({ user_id }) {
  const [form, setForm] = useState({
    user_id: user_id || 1, // fallback to 1
    amount: "",
    description: "",
    date: "",
    method: "cash",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/transactions", form);
      alert("Transaction added!");
      setForm({ ...form, amount: "", description: "", date: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to submit transaction.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-8 p-6 bg-white shadow rounded-lg"
    >
      <h2 className="text-2xl font-bold mb-4">Add Transaction</h2>

      <label className="block mb-2 font-semibold">Amount (₹)</label>
      <input
        type="number"
        name="amount"
        value={form.amount}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded"
        required
      />

      <label className="block mb-2 font-semibold">Description</label>
      <input
        type="text"
        name="description"
        value={form.description}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded"
        required
      />

      <label className="block mb-2 font-semibold">Date</label>
      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded"
        required
      />

      <label className="block mb-2 font-semibold">Method</label>
      <select
        name="method"
        value={form.method}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded"
      >
        <option value="cash">Cash</option>
        <option value="card">Card</option>
        <option value="upi">UPI</option>
      </select>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Add Transaction
      </button>
    </form>
  );
}
