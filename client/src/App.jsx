import { useState } from 'react'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';


import './App.css'
import Nav from './components/Nav'
import HomePage from './components/HomePage'
import About from './components/About'
import Services from './components/Services'
import Footer from './components/Footer'
import SocialAnalysis from './components/SocialAnalysis'
import All from './components/All';
import Analytics from './components/Analytics';
import ComparisionAnalytics from './components/ComparisionAnalytics';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <Nav/>
      <HomePage/>
      <About/>
      <Services/>
      <Footer/> */}
      {/* <SocialAnalysis/> */}

      
      <Router>

        <Routes>

          <Route path="/" element={<All/>} />
          <Route path="/userdata" element={<SocialAnalysis/>} />
          <Route path="/overallAnalytics" element={<Analytics/>} />
          <Route path="/comparisionAnalytics" element={<ComparisionAnalytics/>} />

        </Routes>
      </Router>

    </>
  )
}

export default App
