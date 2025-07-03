import { useEffect, useState } from "react";
import axios from "axios";

export default function SummaryDashboard() {
  const [summary, setSummary] = useState({});

  useEffect(() => {
    axios.get("http://localhost:8000/summary")
      .then(res => setSummary(res.data.summary))
      .catch(err => console.error("Failed to fetch summary", err));
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-6 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Expense Summary</h2>
      {Object.keys(summary).length === 0 ? (
        <p>No data yet.</p>
      ) : (
        <ul className="space-y-2">
          {Object.entries(summary).map(([category, total]) => (
            <li key={category} className="flex justify-between">
              <span className="capitalize">{category}</span>
              <span className="font-semibold">₹{total.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
