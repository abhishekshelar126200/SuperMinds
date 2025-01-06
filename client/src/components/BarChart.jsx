import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const data = {
  labels: ['Static Post', 'Carousel', 'Reel'],
  datasets: [
    {
      label: 'Average Likes',
      data: [300, 100, 200],
      backgroundColor: '#8884d8',
    },
    {
      label: 'Average Shares',
      data: [300, 100, 200],
      backgroundColor: '#82ca9d',
    },
    {
      label: 'Average Comments',
      data: [300, 100, 200],
      backgroundColor: '#ffc658',
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      enabled: true,
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Post Type',
      },
    },
    y: {
      title: {
        display: true,
        text: 'Average Value',
      },
      beginAtZero: true,
    },
  },
};

const BarChart = () => (
  <div className="container mt-4">
    <div className="row justify-content-center">
      <div className="col-12 col-md-8">
        <div style={{ height: '500px' }}>
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  </div>
);

export default BarChart;
