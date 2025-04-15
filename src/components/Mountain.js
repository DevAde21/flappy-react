// src/components/Mountain.js
import React from 'react';

function Mountain({ x, y, size, color }) {
    const mountainStyle = {
        position: 'absolute',
        left: `${x}px`,
        bottom: `${y}px`,
        width: `${size}px`,
        height: `${size * 0.6}px`,
        zIndex: 0, // Atrás das nuvens (zIndex: 1) e do resto
    };

    return (
        <div style={mountainStyle}>
            <svg width={size} height={size * 0.6} viewBox={`0 0 ${size} ${size * 0.6}`}>
                <polygon 
                    points={`0,${size * 0.6} ${size / 2},0 ${size},${size * 0.6}`} 
                    fill={color} 
                />
            </svg>
        </div>
    );
}

export default Mountain;