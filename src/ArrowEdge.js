
import React from 'react';

const ArrowEdge = ({ source, target }) => {
    return (
        <div
            style={{
                position: 'absolute',
                width: '2px',
                height: '100px',
                background: 'black',
                transform: `translate(${source.x}px, ${source.y}px) rotate(${Math.atan2(target.y - source.y, target.x - source.x) * 180 / Math.PI}deg)`,
            }}
        />
    );
};

export default ArrowEdge;

