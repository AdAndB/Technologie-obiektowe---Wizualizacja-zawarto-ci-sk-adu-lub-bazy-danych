import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import domtoimage from 'dom-to-image';
import Table from './Table';

const CSVScreen = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [error, setError] = useState('');
    const [csvData, setCSVData] = useState([]);
    const [showTables, setShowTables] = useState(false);
    const [duplicateTables, setDuplicateTables] = useState([]);

    useEffect(() => {
        if (csvData.length > 0) {
            checkDuplicateColumns();
        }
    }, [csvData]);

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
        const promises = files.map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const text = event.target.result;
                    const rows = text.split('\n');
                    const columns = rows[0].split(',');
                    const tableName = file.name.replace('.csv', '');
                    const tableData = { tableName, columns, data: rows.slice(1).map(row => row.split(',')) };
                    resolve(tableData);
                };
                reader.onerror = (error) => reject(error);
                reader.readAsText(file);
            });
        });

        Promise.all(promises)
            .then(parsedData => {
                setCSVData(prevData => [...prevData, ...parsedData]);
            })
            .catch(error => console.error('Error parsing CSV:', error));
    };

    const checkDuplicateColumns = () => {
        const columnNamesMap = new Map();

        csvData.forEach(data => {
            const tableName = data.tableName.toLowerCase();
            const tableColumns = data.columns.map(column => column.toLowerCase());

            if (!columnNamesMap.has(tableName)) {
                columnNamesMap.set(tableName, new Set());
            }

            const columnSet = columnNamesMap.get(tableName);
            tableColumns.forEach(column => columnSet.add(column));
        });

        const duplicateTablesSet = new Set();
        columnNamesMap.forEach((columnSet, tableName) => {
            columnSet.forEach(columnName => {
                if (columnName.includes('id')) {
                    columnNamesMap.forEach((otherColumnSet, otherTableName) => {
                        if (tableName !== otherTableName && otherColumnSet.has(columnName)) {
                            duplicateTablesSet.add(tableName);
                            duplicateTablesSet.add(otherTableName);
                        }
                    });
                }
            });
        });

        setDuplicateTables(Array.from(duplicateTablesSet));
    };

    const handleGenerateSchema = () => {
        setShowTables(true);
    };

    const handleSaveAsPNG = () => {
        window.scrollTo(0, 0);
        const container = document.getElementById('tables-container');

        domtoimage.toPng(container, { quality: 1 })
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.download = 'screenshot.png';
                link.href = dataUrl;
                link.click();
            })
            .catch((error) => {
                console.error('Error saving as PNG:', error);
            });
    };

    return (
        <div>
            <h2 style={{ color: 'white' }}>Pliki CSV Screen</h2>
            <p style={{ color: 'white' }}>Tu znajdziesz treść związana z plikami CSV.</p>

            <input type="file" onChange={handleFileChange} accept=".csv" multiple className="btn btn-outline-success" />

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div id="tables-container" style={{ color: 'white', overflow: 'auto' }}>
                {showTables &&
                    csvData.map((data, index) => (
                        <div key={index}>
                            <Table tableName={data.tableName} headers={data.columns} data={data.data} />
                        </div>
                    ))
                }
            </div>

            {duplicateTables.length > 0 && (
                <div style={{ color: 'white', marginTop: '20px' }}>
                    <h4>Znalezione duplikaty nazw kolumn w tabelach:</h4>
                    <ul>
                        {duplicateTables.map((tableName, index) => (
                            <li key={index}>{tableName}</li>
                        ))}
                    </ul>
                </div>
            )}

            <button onClick={handleGenerateSchema} className="btn btn-outline-primary" style={{ position: 'absolute', top: 50, right: 50 }}>Generuj schemat bazy danych</button>
            <button onClick={handleSaveAsPNG} className="btn btn-outline-secondary" style={{ position: 'absolute', top: 100, right: 50 }}>Zapisz jako PNG</button>
        </div>
    );
};

export default CSVScreen;
