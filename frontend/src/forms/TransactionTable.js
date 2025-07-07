import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";

export default function TransactionTable() {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [idToCategorize, setIdToCategorize] = useState("");

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("http://localhost:8000/transactions");
      // ✅ Correctly use user.user_id
      const userTx = res.data.filter((tx) => tx.user_id === user?.user_id);
      setTransactions(userTx);
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
      fetchTransactions();
    } catch (err) {
      console.error("Categorization failed", err);
      alert("Error categorizing transaction.");
    }
  };

  useEffect(() => {
    if (user?.user_id) {
      fetchTransactions();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="text-center mt-6 text-gray-600">
        Please log in to view your transactions.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-6 bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">📊 Your Transactions</h2>

      <table className="w-full table-auto text-left mb-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">ID</th>
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
              <td className="p-2">₹{tx.amount}</td>
              <td className="p-2">{tx.description}</td>
              <td className="p-2">{new Date(tx.date).toLocaleDateString()}</td>
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
