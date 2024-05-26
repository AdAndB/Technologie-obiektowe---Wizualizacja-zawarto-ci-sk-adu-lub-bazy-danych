import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import './App.css'; // Zaimportuj styl CSS dla tabeli

const Table = ({ tableName, headers, data, initialPosition }) => {
    const [position, setPosition] = useState(initialPosition ?? { x: 0, y: 0 });
    const [isExpanded, setIsExpanded] = useState(false);
    const [size, setSize] = useState({ width: 100, height: 60 }); // Początkowy rozmiar tabeli
    const [resizeDirection, setResizeDirection] = useState(null);
    const [columnTypes, setColumnTypes] = useState([]);
    const [primaryKeyIndex, setPrimaryKeyIndex] = useState(-1); // Indeks pierwszego wystąpienia kolumny "ID"
    const [foreignKeysIndexes, setForeignKeysIndexes] = useState([]); // Indeksy kolejnych wystąpień kolumny "ID"
    const ref = useRef(null);
    // Stałe szerokości kolumn i wysokość wierszy
    const columnWidth = 80;
    const rowHeight = 20;

    useEffect(() => {
        const determineColumnTypes = () => {
            const types = headers.map(() => 'unknown');
            data.forEach(row => {
                row.forEach((cell, columnIndex) => {
                    const currentType = types[columnIndex];
                    if (currentType === 'unknown') {
                        if (!isNaN(cell)) {
                            types[columnIndex] = 'number';
                        } else if (!isNaN(Date.parse(cell))) {
                            types[columnIndex] = 'date';
                        } else if (typeof cell === 'boolean' || ['true', 'false'].includes(cell.toLowerCase())) {
                            types[columnIndex] = 'boolean';
                        } else {
                            types[columnIndex] = 'string';
                        }
                    }
                });
            });
            setColumnTypes(types);
        };

        determineColumnTypes();
    }, [headers, data]);

    useEffect(() => {
        // Znajdowanie pierwszego wystąpienia kolumny "ID" i indeksów kolejnych wystąpień
        let primaryFound = false;
        const fkIndexes = [];
        headers.forEach((header, index) => {
            if (header.toLowerCase().includes('id')) {
                if (!primaryFound) {
                    setPrimaryKeyIndex(index);
                    primaryFound = true;
                } else {
                    fkIndexes.push(index);
                }
            }
        });
        setForeignKeysIndexes(fkIndexes);
    }, [headers]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (resizeDirection) {
                const rect = ref.current.getBoundingClientRect();
                let newWidth = size.width;
                let newHeight = size.height;

                if (resizeDirection.includes('right')) {
                    newWidth = e.clientX - rect.left;
                }
                if (resizeDirection.includes('bottom')) {
                    newHeight = e.clientY - rect.top;
                }

                // Ustawianie minimalnego rozmiaru tabeli
                newWidth = Math.max(newWidth, 5); // Minimalna szerokość
                newHeight = Math.max(newHeight, 5); // Minimalna wysokość

                setSize({ width: newWidth, height: newHeight });
            }
        };

        const handleMouseUp = () => {
            setResizeDirection(null);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        if (resizeDirection) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [resizeDirection, size]);

    const handleDrag = (e, ui) => {
        const { x, y } = position;
        setPosition({ x: x + ui.deltaX, y: y + ui.deltaY });
    };

    return (
        <Draggable
            position={position}
            onStop={(e, ui) => setPosition({ x: ui.x, y: ui.y })}
            onDrag={handleDrag}
            cancel=".resize-handle"
        >
            <div
                ref={ref}
                className="table-container"
                style={{
                    left: position?.x,
                    top: position?.y,
                    width: size.width,
                    height: size.height,
                    overflow: 'hidden',
                    minWidth: '50px', // Minimalna szerokość
                    minHeight: '50px' // Minimalna wysokość
                }}
            >
                <div
                    className="resize-handle bottom-right"
                    onMouseDown={() => setResizeDirection('bottom-right')}
                />
                {isExpanded ? (
                    <table className="custom-table">
                        <thead>
                        <tr>
                            <th colSpan={headers.length} style={{ backgroundColor: 'blue', color: 'white', height: rowHeight }}>
                                {tableName}
                                <button
                                    type="button"
                                    className="btn btn-warning"
                                    style={{ marginLeft: '5px', padding: '5px 10px', fontSize: '10px' }}
                                    onClick={() => setIsExpanded(prevState => !prevState)}
                                >
                                    Zwiń
                                </button>
                            </th>
                        </tr>
                        <tr>
                            {headers.map((header, index) => (
                                <th key={index} style={{ height: rowHeight, fontSize: '10px', padding: '0 5px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '14px' }}>
                                                {index === primaryKeyIndex ? 'PK' : (foreignKeysIndexes.includes(index) ? 'FK' : '')}
                                            </span>
                                        <span>{header}</span>
                                        <span style={{ fontSize: '10px' }}>{`(${columnTypes[index]})`}</span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                    <td key={cellIndex} style={{ height: rowHeight, fontSize: '10px', padding: '0 5px', textAlign: 'center' }}>
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <table className="custom-table">
                        <tbody>
                        <tr>
                            <th colSpan={1} style={{ backgroundColor: 'blue', color: 'white', height: rowHeight }}>
                                {tableName}
                                <button
                                    type="button"
                                    className="btn btn-warning"
                                    style={{ marginLeft: '5px', padding: '5px 10px', fontSize: '10px' }}
                                    onClick={() => setIsExpanded(prevState => !prevState)}
                                >
                                    Rozwiń
                                </button>
                            </th>
                        </tr>
                        {headers.map((header, index) => (
                            <tr key={index}>
                                <td style={{ height: rowHeight, fontSize: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 5px' }}>
                                        <span style={{ fontSize: '14px' }}>
                                            {index === primaryKeyIndex ? 'PK   ' : (foreignKeysIndexes.includes(index) ? 'FK   ' : '')}
                                        </span>
                                    <span style={{ margin: '0 auto' }}>{header}</span>
                                    <span style={{ fontSize: '10px' }}>{`(${columnTypes[index]})`}</span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </Draggable>
    );
};

export default Table;
