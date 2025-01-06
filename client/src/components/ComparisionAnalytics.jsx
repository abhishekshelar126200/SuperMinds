import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Pie,Bar } from "react-chartjs-2";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
// Register Chart.js components
ChartJS.register(
  LineElement,
  PointElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const Charts = () => {
  // State for date picker
  const [selectedDate, setSelectedDate] = useState("2024-10-01");
  const [loading,setIsLoading]=useState(true);
  // State for post type selector
  const [postType, setPostType] = useState(localStorage.getItem('postType') || "Reel");
  const [responseData,setResponseData]=useState(null)
  const [insightData,setInsightData]=useState(null)

  const renderSkeleton = () => (
    <div className="row g-5 mt-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div className="col-lg-4 col-md-6" key={index}>
          <div className="card h-100" style={{ height: '350px' }}> {/* Increased height of card */}
            <div className="card-body">
              <div className="placeholder-glow">
                <span className="placeholder col-6 mb-2" style={{ height: '20px' }}></span> {/* Increased height */}
                <span className="placeholder col-4 mb-2" style={{ height: '20px' }}></span> {/* Increased height */}
                <span className="placeholder col-5 mb-2" style={{ height: '25px' }}></span> {/* Increased height */}
                <span className="placeholder col-7" style={{ height: '35px' }}></span> {/* Increased height */}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
  
  
  useEffect(()=>{
    

    const fetchData=async ()=>{
      const formData = new FormData();
      formData.append("postType", postType);
      formData.append("date",selectedDate);

      setIsLoading(true); // Start loading

      try {
      

          const response = await axios.post("http://localhost:5000/upload", formData, {
          headers: {
              "Content-Type": "multipart/form-data",
          },
          
          });
          const result = await response.data;
          const insights=JSON.parse(result['comparision'].trim());
          const filterData=result['filterData'];
          setInsightData(insights);
          
          setResponseData(filterData);

          
          
      } catch (error) {
          console.error("Error uploading file:", error);
      } 
      // finally {
      //     setTimeout(() => setIsLoading(false), 500); // Add slight delay before hiding
      // }
  }
  fetchData()
  },[postType]);
  const postData = {
    comments: responseData ? responseData[0]["comments"]:"",
    likes: responseData ? responseData[0]["likes"] :"",
    shares: responseData ? responseData[0]["shares"]:"",
  };

  // Bar Chart Configuration
  const barChartData = {
    labels: ["Comments", "Likes", "Shares"],
    datasets: [
      {
        label: "Post Engagement",
        data: [postData.comments, postData.likes, postData.shares],
        backgroundColor: ["#3498db", "#2ecc71", "#e74c3c"],
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: "#eaeaea",
        },
        ticks: {
          stepSize: 50,
        },
      },
    },
  };

  // Pie Chart Configuration
  const pieChartData = {
    labels: ["Comments", "Likes", "Shares"],
    datasets: [
      {
        data: [postData.comments, postData.likes, postData.shares],
        backgroundColor: ["#3498db", "#2ecc71", "#e74c3c"],
        hoverBackgroundColor: ["#2980b9", "#27ae60", "#c0392b"],
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  const handlePostChange=(e)=>{
    setPostType(e.target.value)
    localStorage.setItem('postType',e.target.value);
    setInsightData(null);
    setResponseData(null);
  }

  return (
    <div className="container mt-5">
  <h2 className="text-center mb-5 fw-bold">📊 Social Media Engagement Insights</h2>

  {/* Date Picker and Post Type Selector */}
  <div className="row g-3 mb-5">
    {/* Date Picker */}
    <div className="col-lg-6 col-md-6 col-sm-12">
      <div className="d-flex flex-column">
        <label htmlFor="datePicker" className="form-label fw-semibold">Select Date</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="form-control"
          id="datePicker"
          min="2024-10-01" 
          max="2025-10-31"
        />
      </div>
    </div>

    {/* Post Type Selector */}
    <div className="col-lg-6 col-md-6 col-sm-12">
      <div className="d-flex flex-column">
        <label htmlFor="postType" className="form-label fw-semibold">Select Post Type</label>
        <select
          id="postType"
          className="form-select"
          value={postType}
          onChange={handlePostChange}
        >
          <option value="Reel">Reel</option>
          <option value="Static Post">Static Post</option>
          <option value="Carousel">Carousel</option>
        </select>
      </div>
    </div>
  </div>

  {/* Insights Cards */}
  {
    insightData ?
    <div className="row g-4 mb-5">
    {/* Reel vs Static Post */}
    <div className="col-lg-4 col-md-6 col-sm-12">
      <div className="card shadow-sm border-0 h-100">
        <div className="card-body">
          <h5 className="card-title fw-bold mb-3 text-center">{Object.keys(insightData['insights'])[0]}</h5>
          <ul className="list-unstyled">
            <li className="mb-2"><strong>Likes Difference:</strong> {insightData['insights'][Object.keys(insightData['insights'])[0]]['likes_difference']}</li>
            <li className="mb-2"><strong>Shares Difference:</strong> {insightData['insights'][Object.keys(insightData['insights'])[0]]['shares_difference']}</li>
            <li><strong>Comments Difference:</strong> {insightData['insights'][Object.keys(insightData['insights'])[0]]['comments_difference']}</li>
          </ul>
        </div>
      </div>
    </div>

    {/* Reel vs Carousel */}
    <div className="col-lg-4 col-md-6 col-sm-12">
      <div className="card shadow-sm border-0 h-100">
        <div className="card-body">
          <h5 className="card-title fw-bold mb-3 text-center">{Object.keys(insightData['insights'])[1]}</h5>
          <ul className="list-unstyled">
            <li className="mb-2"><strong>Likes Difference:</strong>  {insightData['insights'][Object.keys(insightData['insights'])[1]]['likes_difference']}</li>
            <li className="mb-2"><strong>Shares Difference:</strong> {insightData['insights'][Object.keys(insightData['insights'])[1]]['shares_difference']}</li>
            <li><strong>Comments Difference:</strong> {insightData['insights'][Object.keys(insightData['insights'])[1]]['comments_difference']}</li>
          </ul>
        </div>
      </div>
    </div>

    {/* Overall Engagement */}
    <div className="col-lg-4 col-md-12 col-sm-12">
      <div className="card shadow-sm border-0 h-100">
        <div className="card-body">
          <h5 className="card-title fw-bold mb-3 text-center">Overall Engagement</h5>
          <ul className="list-unstyled">
            <li className="mb-2"><strong>{Object.keys(insightData['overall_engagement'])[0]}:</strong> {insightData['overall_engagement'][Object.keys(insightData['overall_engagement'])[0]]}</li>
            <li><strong>{Object.keys(insightData['overall_engagement'])[1]}:</strong> {insightData['overall_engagement'][Object.keys(insightData['overall_engagement'])[1]]}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  :(
    renderSkeleton()
  )
  }
  

  {/* Charts */}
  {/* <div className="row g-4"> */}
    {/* Line Chart */}
    {/* <div className="col-lg-6 col-md-12">
      <div className="card shadow-sm border-0 h-100">
        <div className="card-body">
          <h5 className="card-title text-center mb-4 fw-bold">Reel Comparisons (Line Chart)</h5>
          <div style={{ height: "300px" }}>
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div> */}

    {/* Pie Chart */}
    {/* <div className="col-lg-6 col-md-12">
      <div className="card shadow-sm border-0 h-100">
        <div className="card-body">
          <h5 className="card-title text-center mb-4 fw-bold">Engagement Breakdown (Pie Chart)</h5>
          <div style={{ height: "300px" }}>
            <Pie data={pieChartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  </div> */}
  {responseData ? <div className="container mt-5">
      <div className="row">
        {/* Bar Chart */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-lg">
            <div className="card-header text-center bg-primary text-white">
              <h5>Bar Chart: Post Engagement</h5>
            </div>
            <div className="card-body">
              <div style={{ height: "300px" }}>
                <Bar data={barChartData} options={barChartOptions} />
              </div>
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-lg">
            <div className="card-header text-center bg-success text-white">
              <h5>Pie Chart: Engagement Distribution</h5>
            </div>
            <div className="card-body">
              <div style={{ height: "300px" }}>
                <Pie data={pieChartData} options={pieChartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>:(
        <div className="placeholder-glow">
          <span
            className="placeholder col-12"
            style={{ height: "200px" }}
          ></span>
        </div>
      )}
</div>

  );
};

export default Charts;
