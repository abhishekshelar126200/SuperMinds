import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function About() {
  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="row align-items-center">
          {/* Image Section */}
          <div className="col-12 col-lg-6 mb-4 mb-lg-0">
            <div className="position-relative">
              <img
                src="https://static.vecteezy.com/system/resources/thumbnails/049/858/303/small_2x/in-this-serene-landscape-a-solitary-tree-stands-tall-against-a-vibrant-sunset-of-golden-hues-evoking-calmness-in-the-tranquil-rural-setting-that-embraces-natures-exquisite-beauty-photo.jpg"
                alt="About Us"
                className="img-fluid rounded shadow"
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="col-12 col-lg-6">
            <h5 className="text-uppercase text-primary">About Us</h5>
            <h2 className="display-6 fw-bold">Transforming Ideas Into Digital Reality</h2>

            <p className="text-muted mt-3">
              We're a team of passionate innovators dedicated to creating exceptional digital experiences. With years of expertise in cutting-edge technologies, we transform complex challenges into elegant solutions.
            </p>
            <p className="text-muted">
              Our mission is to empower businesses through technology, delivering solutions that drive growth and innovation. We believe in the power of collaboration and the impact of thoughtful design.
            </p>

            {/* Stats Section */}
            <div className="row text-center mt-4">
              <div className="col-4">
                <h3 className="fw-bold">10+</h3>
                <p className="text-muted">Years Experience</p>
              </div>
              <div className="col-4">
                <h3 className="fw-bold">200+</h3>
                <p className="text-muted">Projects Completed</p>
              </div>
              <div className="col-4">
                <h3 className="fw-bold">50+</h3>
                <p className="text-muted">Team Members</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
