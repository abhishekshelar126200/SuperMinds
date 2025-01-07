import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useParams } from "react-router-dom"; // To get the dynamic dataset from the route
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const DisplayData = () => {
  const { dataset } = useParams(); // Dynamic dataset from the route
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://superminds-1.onrender.com/viewData/${dataset}`);
        if (!response.ok) {
          alert('Something Went Wrong!');
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        alert('Something Went Wrong!');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataset]);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Social Media Posts</h2>

      {loading ? (
        // Skeleton loader when data is being fetched
        <div className="table-responsive">
          <table className="table table-striped">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Post ID</th>
                <th>Post Type</th>
                <th>Post Date</th>
                <th>Likes</th>
                <th>Comments</th>
                <th>Shares</th>
              </tr>
            </thead>
            <tbody>
              {Array(5) // Show 5 skeleton rows
                .fill("")
                .map((_, index) => (
                  <tr key={index}>
                    <td><Skeleton width={30} /></td>
                    <td><Skeleton width={100} /></td>
                    <td><Skeleton width={80} /></td>
                    <td><Skeleton width={100} /></td>
                    <td><Skeleton width={50} /></td>
                    <td><Skeleton width={50} /></td>
                    <td><Skeleton width={50} /></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        // Display the table once the data is loaded
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Post ID</th>
                <th>Post Type</th>
                <th>Post Date</th>
                <th>Likes</th>
                <th>Comments</th>
                <th>Shares</th>
              </tr>
            </thead>
            <tbody>
              {data.map((post, index) => (
                <tr key={post._id}>
                  <td>{index + 1}</td>
                  <td>{post.post_id}</td>
                  <td>{post.post_type}</td>
                  <td>{post.post_Date}</td>
                  <td>{post.likes}</td>
                  <td>{post.comments}</td>
                  <td>{post.shares}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DisplayData;
