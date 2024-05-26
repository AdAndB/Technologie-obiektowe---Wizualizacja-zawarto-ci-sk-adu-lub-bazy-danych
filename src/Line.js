import React from 'react';

const Line = ({ x1, y1, x2, y2 }) => (
    <line x1={x1} y1={y1} x2={x2} y2={y2} style={{ stroke: 'black', strokeWidth: 2 }} />
);

export default Line;