import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from './Table';

const CSVScreen = () => {
    const [selectedFiles, setSelectedFiles] = useState([]); // Stan przechowujący wybrane pliki
    const [error, setError] = useState(''); // Stan przechowujący komunikat o błędzie
    const [csvData, setCSVData] = useState([]); // Stan przechowujący dane z plików CSV
    const [showTables, setShowTables] = useState(false); // Stan informujący, czy pokazać tabele
    const [duplicateTables, setDuplicateTables] = useState([]); // Stan przechowujący tabele z duplikatami

    useEffect(() => {
        // Efekt uruchamiany po zmianie danych CSV
        if (csvData.length > 0) {
            checkDuplicateColumns(); // Sprawdzanie duplikatów po zmianie danych CSV
        }
    }, [csvData]); // Efekt zależny od zmian w danych CSV

    const handleFileChange = (event) => {
        // Obsługa zmiany plików
        const files = event.target.files;
        const newFiles = Array.from(files);

        const allowedFiles = newFiles.filter(file => file.name.toLowerCase().endsWith('.csv'));

        if (allowedFiles.length > 0) {
            setError(''); // Czyszczenie komunikatu o błędzie
            setSelectedFiles([...selectedFiles, ...allowedFiles]); // Dodawanie wybranych plików do stanu
            parseCSV(allowedFiles); // Parsowanie plików CSV
        } else {
            setError('Wybierz co najmniej jeden plik o rozszerzeniu .csv'); // Ustawianie komunikatu o błędzie
        }
    };

    const parseCSV = (files) => {
        // Funkcja parsująca pliki CSV
        const promises = files.map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const text = event.target.result;
                    const rows = text.split('\n');
                    const columns = rows[0].split(',');
                    const tableName = file.name.replace('.csv', ''); // Ustalanie nazwy tabeli na podstawie nazwy pliku
                    const tableData = { tableName, columns, data: rows.slice(1).map(row => row.split(',')) }; // Tworzenie danych tabeli
                    resolve(tableData);
                };
                reader.onerror = (error) => reject(error);
                reader.readAsText(file);
            });
        });

        Promise.all(promises)
            .then(parsedData => {
                setCSVData(prevData => [...prevData, ...parsedData]); // Aktualizacja danych CSV
            })
            .catch(error => console.error('Error parsing CSV:', error));
    };

    const checkDuplicateColumns = () => {
        // Funkcja sprawdzająca duplikaty kolumn
        const columnNamesMap = new Map(); // Mapa przechowująca nazwy kolumn w każdej tabeli

        // Przechodzimy przez każdą tabelę i zbieramy nazwy kolumn
        csvData.forEach(data => {
            const tableName = data.tableName.toLowerCase();
            const tableColumns = data.columns.map(column => column.toLowerCase());

            if (!columnNamesMap.has(tableName)) {
                columnNamesMap.set(tableName, new Set());
            }

            const columnSet = columnNamesMap.get(tableName);
            tableColumns.forEach(column => columnSet.add(column));
        });

        // Sprawdzamy, czy pomiędzy tabelami istnieją duplikaty nazw kolumn zawierających "ID"
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

        setDuplicateTables(Array.from(duplicateTablesSet)); // Aktualizacja stanu z tabelami zawierającymi duplikaty
    };

    const handleGenerateSchema = () => {
        setShowTables(true); // Ustawienie stanu, aby pokazać tabele
    };

    return (
        <div>
            <h2 style={{ color: 'white' }}>Pliki CSV Screen</h2>
            <p style={{ color: 'white' }}>Tu znajdziesz treść związana z plikami CSV.</p>

            <input type="file" onChange={handleFileChange} accept=".csv" multiple className="btn btn-outline-success" />

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div style={{ color: 'white' }}>
                {showTables &&
                    csvData.map((data, index) => (
                        <div key={index}>
                            <h3> </h3>
                            <Table tableName={data.tableName} headers={data.columns} data={data.data} /> {/* Renderowanie tabeli */}
                        </div>
                    ))
                }
            </div>

            {duplicateTables.length > 0 && (
                <div style={{ color: 'white', marginTop: '20px' }}>
                    <h4>Znalezione duplikaty nazw kolumn w tabelach:</h4>
                    <ul>
                        {duplicateTables.map((tableName, index) => (
                            <li key={index}>{tableName}</li> /* Wyświetlanie tabel zawierających duplikaty */
                        ))}
                    </ul>
                </div>
            )}

            <button onClick={handleGenerateSchema} className="btn btn-outline-primary" style={{ position: 'absolute', top: 50, right: 50 }}>Generuj schemat bazy danych</button>
        </div>
    );
};

export default CSVScreen;
