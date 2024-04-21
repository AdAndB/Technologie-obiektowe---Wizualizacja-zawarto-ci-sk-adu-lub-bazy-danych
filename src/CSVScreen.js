import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from './Table';

const CSVScreen = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [error, setError] = useState('');
    const [csvData, setCSVData] = useState([]);
    const [showTables, setShowTables] = useState(false); // Dodajemy stan informujący, czy pokazać tabele

    const handleFileChange = (event) => {
        const files = event.target.files;
        const newFiles = Array.from(files);

        const allowedFiles = newFiles.filter(file => file.name.toLowerCase().endsWith('.csv'));

        if (allowedFiles.length > 0) {
            setError('');
            setSelectedFiles([...selectedFiles, ...allowedFiles]);
            parseCSV(allowedFiles);
        } else {
            setError('Wybierz co najmniej jeden plik o rozszerzeniu .csv');
        }
    };

    const parseCSV = (files) => {
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target.result;
                const rows = text.split('\n');
                const columns = rows[0].split(',');
                const tableName = file.name.replace('.csv', '');
                setCSVData(prevData => [...prevData, { tableName, columns, data: rows.slice(1).map(row => row.split(',')) }]);
            };
            reader.readAsText(file);
        });
    };

    const handleGenerateSchema = () => {
        setShowTables(true); // Ustawiamy stan, aby pokazać tabele po kliknięciu
    };

    return (
        <div>
            <h2 style={{ color: 'white' }}>Pliki CSV Screen</h2>
            <p style={{ color: 'white' }}>Tu znajdziesz treść związana z plikami CSV.</p>

            <input type="file" onChange={handleFileChange} accept=".csv" multiple className="btn btn-outline-success" />

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div style={{ color: 'white' }}>
                {showTables &&  // Renderujemy tabele tylko gdy showTables jest true
                    csvData.map((data, index) => (
                        <div key={index}>
                            <h3>Tabela dla pliku: {data.tableName}</h3>
                            <Table tableName={data.tableName} headers={data.columns} data={data.data} />
                        </div>
                    ))
                }
            </div>

            <button onClick={handleGenerateSchema} className="btn btn-outline-primary" style={{ position: 'absolute', top: 50, right: 50 }}>Generuj schemat bazy danych</button>
        </div>
    );
};

export default CSVScreen;
