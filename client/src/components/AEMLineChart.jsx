import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Original hierarchical postData


// Function to format data for a specific post type
const formatDataForChart = (data) => {
  return Object.keys(data).map((date) => ({
    date,
    likes: data[date].averageLikes,
    shares: data[date].averageShares,
    comments: data[date].averageComments,
  }));
};

// Component to render a single line chart
const LineChartComponent = ({ data, title }) => (
  <div className="mb-5">
    <h4 className="text-center">{title}</h4>
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="likes" stroke="#FF6347" name="Likes" />
        <Line type="monotone" dataKey="shares" stroke="#20B2AA" name="Shares" />
        <Line type="monotone" dataKey="comments" stroke="#4682B4" name="Comments" />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const AEMLineChart = ({data}) => {
  // Format data for each post type
  const carouselData = formatDataForChart(data.Carousel);
  const reelData = formatDataForChart(data.Reel);
  const staticPostData = formatDataForChart(data["Static Post"]);

  return (
    <div className="container mt-5">

      {/* Carousel Chart */}
      <LineChartComponent data={carouselData} title="Carousel Posts" />

      {/* Reel Chart */}
      <LineChartComponent data={reelData} title="Reel Posts" />

      {/* Static Post Chart */}
      <LineChartComponent data={staticPostData} title="Static Posts" />
    </div>
  );
};

export default AEMLineChart;
