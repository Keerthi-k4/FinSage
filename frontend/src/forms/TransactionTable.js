import { useState, useEffect } from "react";
import axios from "axios";

export default function TransactionTable() {
  const [transactions, setTransactions] = useState([]);
  const [idToCategorize, setIdToCategorize] = useState("");

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("http://localhost:8000/transactions");
      setTransactions(res.data);
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    }
  };

  const handleCategorize = async () => {
    try {
      await axios.post("http://localhost:8000/categorize", {
        transaction_id: parseInt(idToCategorize),
      });
      setIdToCategorize("");
      fetchTransactions(); // Refresh after update
    } catch (err) {
      console.error("Categorization failed", err);
      alert("Error categorizing transaction.");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-6 bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">📊 All Transactions</h2>

      <table className="w-full table-auto text-left mb-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">User ID</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Description</th>
            <th className="p-2">Date</th>
            <th className="p-2">Category</th>
            <th className="p-2">Method</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="border-t">
              <td className="p-2">{tx.id}</td>
              <td className="p-2">{tx.user_id}</td>
              <td className="p-2">₹{tx.amount}</td>
              <td className="p-2">{tx.description}</td>
              <td className="p-2">{tx.date}</td>
              <td className="p-2">{tx.category || "—"}</td>
              <td className="p-2">{tx.method}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex gap-2">
        <input
          type="number"
          value={idToCategorize}
          onChange={(e) => setIdToCategorize(e.target.value)}
          placeholder="Enter Transaction ID"
          className="border p-2 rounded w-48"
        />
        <button
          onClick={handleCategorize}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Categorize
        </button>
      </div>
    </div>
  );
}
