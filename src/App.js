import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MongoDBScreen from './MongoDBScreen';
import PostgreSQLScreen from './PostgreSQLScreen';
import CSVScreen from './CSVScreen';
import Home from './home';
import './App.css';

const App = () => {
  return (
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mongodb" element={<MongoDBScreen />} />
            <Route path="/postgresql" element={<PostgreSQLScreen />} />
            <Route path="/csv" element={<CSVScreen />} />
          </Routes>
        </div>
      </Router>
  );
};

export default App;
