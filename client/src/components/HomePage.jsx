import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function HomePage() {
  const [selectedDataset, setSelectedDataset] = useState(localStorage.getItem('dataset') || 'Our Data');
  const [datasets,setDatasets]=useState(JSON.parse(localStorage.getItem('datasets')) || ['Our Data']);
  const [fileNames,setFileNames]=useState(null)
  const handleDatasetChange = (e) => {
    localStorage.setItem('dataset',e.target.value)
    
    setSelectedDataset(e.target.value);
  };

  useEffect(()=>{
    const fetchFileNames=async ()=>{
      const response=await axios.get('http://localhost:5000/fileNames')
      const result=await response.data;
      setFileNames(result);
    }
    fetchFileNames();
  },[])
 

  return (
    <div className="container-fluid bg-light vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center px-4">
        {/* Subtitle */}
        <h5 className="text-uppercase text-secondary mb-2">Welcome to the Future</h5>

        {/* Title */}
        <h1 className="display-4 fw-bold my-3">
          Get Insight In <span className='text-primary'>One Click</span>
        </h1>

        {/* Description */}
        <p className="lead text-muted">
          Transform your data into actionable insights instantly. Our powerful analytics platform helps you make smarter decisions faster than ever before.
        </p>

        {/* Dataset Selection Dropdown */}
        <div className="mt-4 d-flex flex-column align-items-center">
          <label htmlFor="dataset" className="form-label fw-semibold mb-2">
            Select Dataset
          </label>
          <select
            id="dataset"
            className="form-select w-50"
            value={selectedDataset}
            onChange={handleDatasetChange}
          >
            <option value="">
              Choose a dataset
            </option>
            <option value="Our Data">Our Dataset</option>
            {fileNames ? fileNames.map((set,index)=>(
              <option key={index} value={`${set}`}>{set}</option>
            )):""}
            
          </select>
        </div>

        {/* Buttons */}
        <div className="mt-4">
          <Link
            to={`/comparisionAnalytics?dataset=${selectedDataset}`}
           
            className={`btn btn-primary btn-lg m-2${!selectedDataset && 'disabled'}`}
          >
            View Comparison Analytics
            
          </Link>
          <Link
             to={`/overallAnalytics?dataset=${selectedDataset}`}
            className={`btn btn-outline-secondary btn-lg m-2 ${!selectedDataset && 'disabled'}`}
          >
            View Overall Analytics
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
