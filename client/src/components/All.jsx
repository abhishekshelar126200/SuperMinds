import React from 'react';

import Nav from './Nav';
import HomePage from './HomePage';
import About from './About';
import Services from './Services';
import Footer from './Footer';

function All() {
  return (
    <div>
      <Nav />
      <div id="home">
        <HomePage />
      </div>
      <div id="about">
        <About />
      </div>
      <div id="services">
        <Services />
      </div>
      <div id="contact">
        <Footer />
      </div>
      
    </div>
  );
}

export default All;
