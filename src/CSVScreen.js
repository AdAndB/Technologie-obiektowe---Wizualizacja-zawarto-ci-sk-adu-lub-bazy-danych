import React, { useState } from 'react';

const CSVScreen = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const fileName = file.name.toLowerCase();
            if (fileName.endsWith('.csv')) {
                setSelectedFile(file);
                setError('');
            } else {
                setSelectedFile(null);
                setError('Wybierz plik o rozszerzeniu .csv');
            }
        }
    };

    return (
        <div>
            <h2 style={{ color: 'white' }}>Pliki CSV Screen</h2>
            <p style={{ color: 'white' }}>Tu znajdziesz treść związana z plikami CSV.</p>

            <input type="file" onChange={handleFileChange} accept=".csv" />

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {selectedFile && (
                <div>
                    <p style={{ color: 'white' }}>Wybrany plik: {selectedFile.name}</p>
                </div>
            )}
        </div>
    );
};

export default CSVScreen;
