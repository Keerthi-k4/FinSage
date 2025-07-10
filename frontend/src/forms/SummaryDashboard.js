import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import { Doughnut } from "react-chartjs-2";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

export default function SummaryDashboard() {
  const [summary, setSummary] = useState({});
  const [forecast, setForecast] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user?.user_id) return;

    // Fetch summary
    axios
      .get(`http://localhost:8000/summary?user_id=${user.user_id}`)
      .then((res) => setSummary(res.data.summary))
      .catch((err) => console.error("Failed to fetch summary", err));

    // Fetch forecast
    axios
      .get(`http://localhost:8000/forecast?user_id=${user.user_id}&months_ahead=3`)
      .then((res) => setForecast(res.data.forecast))
      .catch((err) => console.error("Failed to fetch forecast", err));
  }, [user]);

  if (!user) {
    return (
      <div className="text-center text-gray-600 mt-6">
        Please log in to view your summary.
      </div>
    );
  }

  const colors = [
    "#f87171", // red
    "#60a5fa", // blue
    "#34d399", // green
    "#fbbf24", // yellow
    "#a78bfa", // purple
    "#fb923c", // orange
  ];

  const categories = Object.keys(summary);
  const totals = Object.values(summary);

  const chartData = {
    labels: categories,
    datasets: [
      {
        data: totals,
        backgroundColor: colors.slice(0, categories.length),
        hoverOffset: 10,
      },
    ],
  };

  const forecastData = {
    labels: forecast.map((f) => `Month ${f.month_num + 1}`),
    datasets: [
      {
        label: "Predicted Expenses (₹)",
        data: forecast.map((f) => f.predicted_total),
        fill: true,
        backgroundColor: "rgba(34,197,94,0.2)",
        borderColor: "rgba(34,197,94,1)",
        tension: 0.4,
      },
    ],
  };

  const forecastOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 rounded-2xl shadow-2xl">
      <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
        💸 Expense Summary
      </h2>

      {categories.length === 0 ? (
        <p className="text-center text-gray-600">No data yet.</p>
      ) : (
        <>
          <div className="flex justify-center mb-8">
            <div className="w-60 h-60">
              <Doughnut data={chartData} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {categories.map((category, idx) => (
              <motion.div
                key={category}
                className="p-4 bg-white rounded-xl shadow hover:shadow-lg transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold capitalize">
                    {category}
                  </span>
                  <span
                    className="px-3 py-1 rounded-full text-white text-sm font-bold"
                    style={{
                      backgroundColor: colors[idx % colors.length],
                    }}
                  >
                    ₹{summary[category].toFixed(2)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ✅ Forecast Line Chart */}
          {forecast.length > 0 && (
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-center text-gray-700">📈 Expense Forecast</h3>
              <Line data={forecastData} options={forecastOptions} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
