import React from "react";
import { Bar } from "react-chartjs-2";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const OverallLineChart = ({ data }) => {
  
  
  // Prepare data for chart.js
  const labels = data.map((post) => post.post_id);
  const likes = data.map((post) => post.likes);
  const shares = data.map((post) => post.shares);
  const comments = data.map((post) => post.comments);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Likes",
        data: likes,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Shares",
        data: shares,
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
      {
        label: "Comments",
        data: comments,
        backgroundColor: "rgba(255, 159, 64, 0.6)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Post IDs",
        },
      },
      y: {
        title: {
          display: true,
          text: "Counts",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Overall Data Graph</h2>
      <div className="card p-3 shadow-lg">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default OverallLineChart;
