import { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function ForecastChart({ user_id }) {
  const [forecastData, setForecastData] = useState(null);

  useEffect(() => {
    if (!user_id) return;

    axios
      .get(`http://localhost:8000/forecast?user_id=${user_id}&months_ahead=6`)
      .then((res) => setForecastData(res.data))
      .catch((err) => console.error("Failed to fetch forecast", err));
  }, [user_id]);

  if (!forecastData)
    return <p className="text-center text-gray-500 mt-4">Loading forecast...</p>;

  const { actuals, forecast } = forecastData;

  // Combine actuals and forecast into one timeline for x-axis
  const allMonths = [
    ...actuals.map((a) => a.month),
    ...forecast.map((f) => f.month),
  ];

  const actualData = [
    ...actuals.map((a) => a.actual_total),
    ...Array(forecast.length).fill(null), // Fill future points with null for actual line
  ];

  const forecastDataPoints = [
    ...Array(actuals.length).fill(null), // Fill past points with null for forecast line
    ...forecast.map((f) => f.predicted_total),
  ];

  const data = {
    labels: allMonths,
    datasets: [
      {
        label: "Actual Expenses (₹)",
        data: actualData,
        borderColor: "rgba(59, 130, 246, 1)", // Blue
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "rgba(59, 130, 246, 1)",
        spanGaps: true,
      },
      {
        label: "Forecasted Expenses (₹)",
        data: forecastDataPoints,
        borderColor: "rgba(34, 197, 94, 1)", // Green
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        borderDash: [5, 5], // Dashed line for forecast
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "rgba(34, 197, 94, 1)",
        spanGaps: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `₹${context.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value) => `₹${value}`,
        },
        grid: {
          color: "rgba(0,0,0,0.05)",
        },
      },
      x: {
        grid: {
          color: "rgba(0,0,0,0.05)",
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md mt-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">Expense Forecast</h3>
      <Line data={data} options={options} />
    </div>
  );
}
