import { useEffect, useState } from "react";
import axios from "axios";

export default function TransactionTimeline() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/transactions") // Create this endpoint if missing
      .then(res => setTransactions(res.data.transactions))
      .catch(err => console.error("Timeline fetch error", err));
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-6 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Transaction Timeline</h2>
      <ul className="border-l-2 border-blue-500 pl-4 space-y-4">
        {transactions.sort((a, b) => new Date(b.date) - new Date(a.date)).map(tx => (
          <li key={tx.id} className="relative">
            <div className="absolute -left-2.5 top-1 w-4 h-4 bg-blue-500 rounded-full"></div>
            <div>
              <p className="text-sm text-gray-600">{new Date(tx.date).toDateString()}</p>
              <p className="font-semibold">{tx.description} – ₹{tx.amount}</p>
              <p className="text-sm text-gray-500">{tx.category} via {tx.method}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
