import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Check if the user has already visited
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedUpload');
    if (!hasVisited) {
      setShowTooltip(true); // Show the tooltip
    }
  }, []);

  // Handle button click
  const handleUploadClick = () => {
    localStorage.setItem('hasVisitedUpload', 'true'); // Mark as visited
    setShowTooltip(false); // Remove the tooltip
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light fixed-top shadow-sm"
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
    >
      <div className="container">
        {/* Logo/Site Name */}
        <a className="navbar-brand fw-bold fs-3 text-primary" href="#">
          SocialLens
        </a>

        {/* Toggle Button for Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-controls="navbarNav"
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Menu */}
        <div
          className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}
          id="navbarNav"
        >
          <ul className="navbar-nav ms-auto align-items-center position-relative">
            <li className="nav-item">
              <a className="nav-link text-dark fw-semibold" href="#home">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-dark fw-semibold" href="#about">
                About
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-dark fw-semibold" href="#services">
                Services
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-dark fw-semibold" href="#contact">
                Contact
              </a>
            </li>
            <li className="nav-item position-relative">
              {/* Upload Button */}
              <Link
                to="/userdata"
                className="btn btn-outline-primary ms-3 fw-semibold"
                onClick={handleUploadClick}
              >
                Upload Dataset
              </Link>

              {/* Tooltip */}
              {showTooltip && (
                <div
                  className="tooltip-box position-absolute"
                  style={{
                    top: '60px', // Position the box below the button
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#fff',
                    color: '#333',
                    padding: '10px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    zIndex: 1000,
                    fontSize: '0.9rem',
                    width:"200px"
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '-10px', // Position the triangle above the box
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '0',
                      height: '0',
                      borderLeft: '10px solid transparent',
                      borderRight: '10px solid transparent',
                      borderBottom: '10px solid #fff',
                    }}
                  ></div>
                  Click here to upload your dataset!
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
