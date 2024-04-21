// TablePage.js
import React from 'react';
import Table from './Table';

const TablePage = ({ location }) => {
    // Odczytaj dane tabeli z lokalizacji, przekazanej przez router
    const { state } = location;

    // Sprawdź, czy dane tabeli zostały przekazane
    if (!state || !state.tables) {
        return <div>Nie znaleziono tabel. Wróć i wygeneruj schemat bazy danych.</div>;
    }

    return (
        <div>
            <h2>Wygenerowany schemat bazy danych</h2>
            {state.tables.map((table, index) => (
                <div key={index}>
                    <h3>Tabela dla pliku: {table.tableName}</h3>
                    <Table tableName={table.tableName} headers={table.columns} data={table.data} />
                </div>
            ))}
        </div>
    );
};

export default TablePage;
