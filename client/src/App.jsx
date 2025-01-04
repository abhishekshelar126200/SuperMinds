

import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [file, setFile] = useState(null);
  const [postType, setPostType] = useState("reel");
  const [data, setResponseData] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [progress, setProgress] = useState(0); // Progress percentage

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handlePostType = (e) => {
    setPostType(e.target.value);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("postType", postType);

    setIsLoading(true); // Start loading
    setProgress(0); // Reset progress

    try {
      // Simulate progress increment
      const progressInterval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 90) {
            clearInterval(progressInterval); // Stop incrementing when reaching 90%
            return prevProgress;
          }
          return prevProgress + 1; // Increment progress
        });
      }, 50); // Adjust interval speed for smoother animation

      const response = await axios.post("https://analyzer-k3bc.onrender.com/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
      });

      setProgress(100); // Set to 100% when the response is received
      const jsonString = response.data[0].trim();
      setResponseData(JSON.parse(jsonString));
      console.log("File uploaded successfully:", JSON.parse(jsonString));
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setTimeout(() => setIsLoading(false), 500); // Add slight delay before hiding
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">File Upload with Insights</h2>

      <form onSubmit={handleFileUpload} className="shadow p-4 rounded bg-light">
        <div className="mb-3">
          <label htmlFor="fileInput" className="form-label">
            Select File
          </label>
          <input
            type="file"
            className="form-control"
            id="fileInput"
            onChange={handleFileChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="postType" className="form-label">
            Select Post Type
          </label>
          <select
            className="form-select"
            id="postType"
            value={postType}
            onChange={handlePostType}
          >
            <option value="static post">Static Post</option>
            <option value="reel">Reel</option>
            <option value="carousel">Carousel</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Upload
        </button>
      </form>

      {/* Loading bar */}
      {isLoading && (
        <div className="progress mt-3">
          <div
            className="progress-bar progress-bar-striped progress-bar-animated"
            role="progressbar"
            style={{ width: `${progress}%`, transition: "width 0.4s ease" }}
          >
            {progress}%
          </div>
        </div>
      )}

      {data && (
        <div className="mt-5">
          <h3>Insights</h3>
          <div className="accordion" id="insightsAccordion">
            {Object.entries(data.insights).map(([key, comparisons], index) => (
              <div className="accordion-item" key={index}>
                <h2 className="accordion-header" id={`heading-${index}`}>
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse-${index}`}
                    aria-expanded="true"
                    aria-controls={`collapse-${index}`}
                  >
                    {key.replace(/_/g, " ").toUpperCase()}
                  </button>
                </h2>
                <div
                  id={`collapse-${index}`}
                  className="accordion-collapse collapse"
                  aria-labelledby={`heading-${index}`}
                  data-bs-parent="#insightsAccordion"
                >
                  <div className="accordion-body">
                    {Object.entries(comparisons).map(
                      ([comparisonKey, comparisonValue], subIndex) => (
                        <p key={subIndex}>
                          <strong>{comparisonKey.replace(/_/g, " ")}:</strong>{" "}
                          {comparisonValue}
                        </p>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

