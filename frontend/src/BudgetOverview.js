import { useEffect, useState } from "react";
import axios from "axios";

export default function BudgetOverview() {
  const [budgets, setBudgets] = useState([]);
  const [summary, setSummary] = useState({});

  useEffect(() => {
    axios.get("http://localhost:8000/summary").then(res => setSummary(res.data.summary));
    axios.get("http://localhost:8000/budgets").then(res => setBudgets(res.data.budgets));
  }, []);

  const getRemaining = (category) => {
    const spent = summary[category] || 0;
    const limit = budgets.find(b => b.category === category)?.limit || 0;
    return { spent, limit };
  };

  return (
    <div className="max-w-xl mx-auto mt-6 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Budget Overview</h2>
      {budgets.map(b => {
        const { spent, limit } = getRemaining(b.category);
        const percent = Math.min((spent / limit) * 100, 100);
        return (
          <div key={b.category} className="mb-4">
            <div className="flex justify-between mb-1">
              <span>{b.category}</span>
              <span>{spent.toFixed(2)} / {limit}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${percent > 90 ? "bg-red-600" : percent > 75 ? "bg-yellow-500" : "bg-green-500"}`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
