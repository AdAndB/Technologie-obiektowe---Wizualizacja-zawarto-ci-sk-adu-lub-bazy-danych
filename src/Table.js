import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import './App.css'; // Zaimportuj styl CSS dla tabeli

const Table = ({ tableName, headers, data, initialPosition }) => {
    const [position, setPosition] = useState(initialPosition ?? { x: 0, y: 0 }); // Domyślna pozycja { x: 0, y: 0 }
    const [isExpanded, setIsExpanded] = useState(false); // Stan dla śledzenia, czy tabela jest rozwinięta
    const [size, setSize] = useState({ width: 200, height: 100 }); // Początkowy rozmiar tabeli
    const [resizeDirection, setResizeDirection] = useState(null); // Kierunek rozciągania tabeli
    const ref = useRef(null);

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

    // Stałe szerokości kolumn i wysokość wierszy
    const columnWidth = 80;
    const rowHeight = 20;

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
                style={{ left: position?.x, top: position?.y }}
            >
                <div
                    className="resize-handle bottom-right"
                    onMouseDown={() => setResizeDirection('bottom-right')}
                />
                <table
                    className="custom-table"
                    style={{ width: size.width, height: size.height }}
                >
                    <colgroup>
                        {headers.map((header, index) => (
                            <col key={index} style={{ width: columnWidth }} />
                        ))}
                    </colgroup>
                    <tbody>
                    <tr>
                        <th colSpan={headers.length} style={{ backgroundColor: 'blue', color: 'white', height: rowHeight }}>
                            {tableName}
                            <button
                                type="button"
                                className="btn btn-warning"
                                style={{ marginLeft: '5px', padding: '5px 10px', fontSize: '10px' }}
                                onClick={() => setIsExpanded(prevState => !prevState)}
                            >
                                {isExpanded ? 'Zwiń' : 'Rozwiń'}
                            </button>
                        </th>
                    </tr>
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index} style={{ backgroundColor: 'green', width: columnWidth, height: rowHeight, fontSize: '10px' }}>{header}</th>
                        ))}
                    </tr>
                    {isExpanded &&
                        data.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                    <td key={cellIndex} style={{ width: columnWidth, height: rowHeight, fontSize: '10px' }}>{cell}</td>
                                ))}
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
            </div>
        </Draggable>
    );
};

export default Table;
