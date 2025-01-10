import { useState } from 'react'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';


import './App.css'
import SocialAnalysis from './components/SocialAnalysis'
import All from './components/All';
import Analytics from './components/Analytics';
import ComparisionAnalytics from './components/ComparisionAnalytics';
import DisplayData from './components/DisplayData';
function App() {
  const [selectedDataset, setSelectedDataset] = useState(localStorage.getItem('dataset') || "socialmediadata");

  return (
    <>

      
      <Router>

        <Routes>

          <Route path="/" element={<All setSelectedDataset={setSelectedDataset}/>} />
          <Route path="/userdata" element={<SocialAnalysis setSelectedDataset={setSelectedDataset}/>} />
          <Route path="/overallAnalytics" element={<Analytics selectedDataset={selectedDataset}/>} />
          <Route path="/comparisionAnalytics" element={<ComparisionAnalytics selectedDataset={selectedDataset}/>} />
          <Route path="/viewData/:dataset" element={<DisplayData/>} />

        </Routes>
      </Router>

    </>
  )
}

export default App
