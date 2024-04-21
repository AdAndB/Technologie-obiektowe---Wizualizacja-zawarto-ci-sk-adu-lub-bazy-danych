import React, { useState, useRef } from 'react';
import './App.css'; // Zaimportuj styl CSS dla tabeli

const Table = ({ tableName, headers, data, initialPosition }) => {
    const [position, setPosition] = useState(initialPosition ?? { x: 0, y: 0 }); // Domyślna pozycja { x: 0, y: 0 }
    const [isExpanded, setIsExpanded] = useState(false); // Stan dla śledzenia, czy tabela jest rozwinięta
    const ref = useRef(null);

    console.log('Position:', position);

    return (
        <div
            ref={ref}
            className="table-container"
            style={{ left: position?.x, top: position?.y }}
        >
            <table className="custom-table">
                <tbody>
                <tr>
                    <th colSpan={headers.length} style={{ backgroundColor: 'blue', color: 'white' }}>
                        {tableName}
                        <button
                            type="button"
                            className="btn btn-warning"
                            style={{ marginLeft: '10px' }}
                            onClick={() => setIsExpanded(prevState => !prevState)}
                        >
                            {isExpanded ? 'Zwiń' : 'Rozwiń'}
                        </button>
                    </th>
                </tr>
                <tr>
                    {headers.map((header, index) => (
                        <th key={index} style={{ backgroundColor: 'green' }} >{header}</th>
                    ))}
                </tr>
                {isExpanded &&
                    data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex}>{cell}</td>
                            ))}
                        </tr>
                    ))
                }
                </tbody>
            </table>
        </div>
    );
};
export default Table;
