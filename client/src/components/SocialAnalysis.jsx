import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom'
import { Upload, BarChart2, Share2, MessageSquare } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from './Nav';
import axios from 'axios';

const SocialAnalysis = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [postType, setPostType] = useState('');
  const [dataJson, setDataJson] = useState(null);
  const [isAnalyze, setAnalyze] = useState(true);

  

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0]['name'].split('.').slice(0, -1).join('.'));
  };

  const handleSubmit = async () => {
    if (!file) {
      alert('Please upload a file and select a post type');
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post("http://localhost:5000/uploadFile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      
    });

    if(response.data['msg']==1)
    {
      alert('File Upload Sucessfully');
      setAnalyze(false);
    }
    else{
      alert(response.data['msg'])
    }
    
    
  };

  return (
    <>
      <div className="container my-5">
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold">Social Media Engagement Analysis</h1>
          <p className="text-muted">Upload your data and get detailed insights about your social media performance</p>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card mb-4">
              <div className="card-body text-center">
                <div className="mb-3">
                  <Upload size={24} />
                  <input
                    type="file"
                    accept=".json"
                    className="form-control mt-2"
                    onChange={handleFileChange}
                  />
                  <small className="text-muted">Drop your JSON file here or click to browse</small>
                  {file && <p className="text-primary mt-2">File Selected: {file.name}</p>}
                </div>
              </div>
            </div>


            <div className="d-flex gap-2">
              <button
                className="btn btn-secondary w-100"
                onClick={handleSubmit}
              >
                Upload File
              </button>

              {file && (
                <Link to={`/overallAnalytics?dataset=${fileName}`} className={`btn btn-primary w-100 ${isAnalyze ? 'disabled' : ''}`}>
                  
                  Analyze Data
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SocialAnalysis;