
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="home-container">
            <h1 style={{ color: 'white' }}>Witaj w aplikacji!</h1>
            <p style={{ color: 'white' }}>Wybierz jedną z opcji:</p>
            <ul className="nav-list">
                <li>
                    <Link to="/mongodb" className="nav-link">
                        MongoDB
                    </Link>
                </li>
                <li>
                    <Link to="/postgresql" className="nav-link">
                        PostgreSQL
                    </Link>
                </li>
                <li>
                    <Link to="/csv" className="nav-link">
                        Pliki CSV
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Home;
