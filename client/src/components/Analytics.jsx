import React, { useEffect, useState } from "react";
import OverallLineChart from "./OverallLineChart";
import AEMLineChart from "./AEMLineChart";
import { useLocation } from "react-router-dom";
import axios from "axios";

function Analytics() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const dataset = queryParams.get("dataset");
  const [postData, setPostData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [totalData, setTotalData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `https://superminds-1.onrender.com/engagementData/${dataset}`
      );
      const result = await response.data;
      setTotalData(result["totalData"]);
      setPostData(result["actualData"]);
      setChartData(result["metricsData"]);
    };
    fetchData();
  }, []);

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
  

  return (
    <div className="container my-4">
      <h2 className="mb-4 text-center">Overall Analysis Result</h2>
      {totalData ? (
        <div className="mb-2">
          <div className="row g-4 mt-4">
            <div className="col-lg-4 col-md-6">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <h5 className="card-title m-0">Carousel</h5>
                  </div>
                  <p>Total Likes For Carousel={totalData["Carousel"]["likes"]}</p>
                  <p>Total Shares For Carousel={totalData["Carousel"]["shares"]}</p>
                  <p>Total Comments For Carousel={totalData["Carousel"]["comments"]}</p>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <h5 className="card-title m-0">Reel</h5>
                  </div>
                  <p>Total Likes For Reel={totalData["Reel"]["likes"]}</p>
                  <p>Total Shares For Reel={totalData["Reel"]["shares"]}</p>
                  <p>Total Comments For Reel={totalData["Reel"]["comments"]}</p>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <h5 className="card-title m-0">Static Post</h5>
                  </div>
                  <p>Total Likes For Static Post={totalData["Static Post"]["likes"]}</p>
                  <p>Total Shares For Static Post={totalData["Static Post"]["shares"]}</p>
                  <p>Total Comments For Static Post={totalData["Static Post"]["comments"]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        renderSkeleton()
      )}
      <div className="row">
        <div className="col-12 mb-4">
          <div
            className="border p-3"
            style={{
              backgroundColor: "#f8f9fa",
            }}
          >
            <div className="container my-4">
              <div className="row">
                <div className="col-12">
                  {postData ? <OverallLineChart data={postData} /> : <div className="placeholder-glow"><span className="placeholder col-12" style={{ height: "200px" }}></span></div>}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 mb-4">
          <div
            className="border p-3"
            style={{
              backgroundColor: "#f8f9fa",
            }}
          >
            <div className="container my-4">
              <h2 className="mb-4">Average Engagement Metrics</h2>
              <div className="row">
                <div className="col-12">
                  {chartData ? (
                    <AEMLineChart data={chartData} />
                  ) : (
                    <div className="placeholder-glow">
                      <span
                        className="placeholder col-12"
                        style={{ height: "200px" }}
                      ></span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
