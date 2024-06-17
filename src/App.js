import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Importuj Link
import MongoDBScreen from './MongoDBScreen';
import PostgreSQLScreen from './PostgreSQLScreen';
import CSVScreen from './CSVScreen';
import Home from './home';
import TablePage from './TablePage';
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
                    <Route path="/table" element={<TablePage />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
