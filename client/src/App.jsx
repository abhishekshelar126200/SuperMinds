import { useState } from 'react'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';


import './App.css'
import SocialAnalysis from './components/SocialAnalysis'
import All from './components/All';
import Analytics from './components/Analytics';
import ComparisionAnalytics from './components/ComparisionAnalytics';
import DisplayData from './components/DisplayData';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>

      
      <Router>

        <Routes>

          <Route path="/" element={<All/>} />
          <Route path="/userdata" element={<SocialAnalysis/>} />
          <Route path="/overallAnalytics" element={<Analytics/>} />
          <Route path="/comparisionAnalytics" element={<ComparisionAnalytics/>} />
          <Route path="/viewData/:dataset" element={<DisplayData/>} />

        </Routes>
      </Router>

    </>
  )
}

export default App
