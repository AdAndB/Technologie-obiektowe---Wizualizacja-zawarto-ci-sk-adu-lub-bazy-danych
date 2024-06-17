import React, { useState, useEffect, useRef, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import domtoimage from 'dom-to-image';
import Table from './Table';

const CSVScreen = ({ callback, deps }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [error, setError] = useState('');
    const [csvData, setCSVData] = useState([]);
    const [duplicateTables, setDuplicateTables] = useState([]);
    const [tablePositions, setTablePositions] = useState({});
    const [canvasVisible, setCanvasVisible] = useState(false);
    const canvasRef = useRef(null);
    const [separator, setSeparator] = useState(',');

    const calculateInitialTablePositions = useCallback(() => {
        const initialPositions = {};
        const tableSpacingX = 0;
        const tableSpacingY = 0;
        const startX = 0;
        const startY = 60;

        csvData.forEach((data, index) => {
            const x = startX + index * tableSpacingX;
            const y = startY;
            initialPositions[data.tableName] = { x, y, width: 0, height: 0 };
        });

        return initialPositions;
    }, [csvData]);

    const calculateCenterPoint = useCallback((position, size) => {
        const centerX = position.x + size.width / 2;
        const centerY = position.y + size.height / 2;
        return { x: centerX, y: centerY };
    }, []);

    const findDuplicateIdColumns = (tableData) => {
        const duplicateColumns = [];
        const tableNames = Object.keys(tableData);

        for (let i = 0; i < tableNames.length; i++) {
            for (let j = i + 1; j < tableNames.length; j++) {
                const table1 = tableData[tableNames[i]];
                const table2 = tableData[tableNames[j]];

                const duplicates = table1.columns.filter(column => table2.columns.includes(column) && column.toLowerCase().includes('id'));
                if (duplicates.length > 0) {
                    duplicateColumns.push({ table1: tableNames[i], table2: tableNames[j], columns: duplicates });
                }
            }
        }

        return duplicateColumns;
    };

    useEffect(() => {
        if (csvData.length > 0) {
            const initialPositions = calculateInitialTablePositions();
            setTablePositions(initialPositions);

            const duplicates = findDuplicateIdColumns(csvData.reduce((acc, data) => {
                acc[data.tableName] = data;
                return acc;
            }, {}));
            setDuplicateTables(duplicates);
        }
    }, [csvData, calculateInitialTablePositions]);

    const drawLines = useCallback(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            duplicateTables.forEach(({ table1, table2 }) => {
                const pos1 = tablePositions[table1]?.center;
                const pos2 = tablePositions[table2]?.center;

                if (pos1 && pos2) {
                    ctx.beginPath();
                    ctx.moveTo(pos1.x, pos1.y);
                    ctx.lineTo(pos2.x, pos2.y);
                    ctx.strokeStyle = 'red';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
            });
        }
    }, [canvasRef, tablePositions, duplicateTables]);

    const handleFileChange = (event) => {
        const files = event.target.files;
        const newFiles = Array.from(files);

        const allowedFiles = newFiles.filter(file => file.name.toLowerCase().endsWith('.csv'));
        setCanvasVisible(true);

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
                    const columns = rows[0].split(separator);
                    const tableName = file.name.replace('.csv', '');
                    const tableData = { tableName, columns, data: rows.slice(1).map(row => row.split(separator)) };
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

    const handleTablePositionChange = (tableName, newPosition, tablePosition, size, zIndex) => {
        setTablePositions(prevPositions => ({
            ...prevPositions,
            [tableName]: { position: newPosition, center: tablePosition, size: size }
        }));
    };

    const handleGenerateSchema = () => {
        drawLines();
    };

    const handleSeparatorChange = (event) => {
        setSeparator(event.target.value);
    };

    return (
        <div>
            <h2 style={{ color: 'white' }}>Pliki CSV Screen</h2>
            <p style={{ color: 'white' }}>Tu znajdziesz treść związana z plikami CSV.</p>

            <input type="file" onChange={handleFileChange} accept=".csv" multiple className="btn btn-outline-success" />

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div id="tables-container" style={{ color: 'white', position: 'relative' }}>
                {csvData.map((data, index) => (
                    <div key={index} style={{ position: 'absolute', top: tablePositions[data.tableName]?.y, left: tablePositions[data.tableName]?.x }}>
                        <Table
                            tableName={data.tableName}
                            headers={data.columns}
                            data={data.data}
                            onPositionChange={handleTablePositionChange}
                            calculateCenterPoint={calculateCenterPoint}
                            zIndex={index}
                        />
                    </div>
                ))}
                {canvasVisible && (
                    <canvas ref={canvasRef} width={1000} height={600} style={{ position: 'absolute', top: 0, left: 0,pointerEvents: 'none', zIndex: -1 }} />
                )}
            </div>



            <button onClick={handleGenerateSchema} className="btn btn-outline-primary" style={{ position: 'absolute', top: 50, right: 50 }}>Generuj schemat bazy danych</button>
            <button onClick={handleSaveAsPNG} className="btn btn-outline-secondary" style={{ position: 'absolute', top: 100, right: 50 }}>Zapisz jako PNG</button>

            <div  style={{color:'white', position: 'absolute', top: 150, right: 50 }}>
                <label style={{ marginRight: '10px' }}>Separator:</label>
                <select value={separator} onChange={handleSeparatorChange} className="form-select form-select-sm" style={{ width: '100px' }}>
                    <option value=",">,</option>
                    <option value=":">:</option>
                    <option value=";">;</option>
                    <option value="/">/</option>
                </select>
            </div>

            <button onClick={handleGenerateSchema} className="btn btn-outline-primary" style={{ position: 'absolute', top: 50, right: 50 }}>Generuj schemat bazy danych</button>
            <button onClick={handleSaveAsPNG} className="btn btn-outline-secondary" style={{ position: 'absolute', top: 100, right: 50 }}>Zapisz jako PNG</button>
        </div>
    );
};

export default CSVScreen;
