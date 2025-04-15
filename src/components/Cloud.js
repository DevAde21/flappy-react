// src/components/Cloud.js
import React from 'react';

function Cloud({ x, y, size }) {
    const cloudStyle = {
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: `${size}px`,
        height: `${size / 1.8}px`,
        // === NOVA COR SÓLIDA ===
        backgroundColor: '#F0F8FF', // AliceBlue (Branco levemente azulado)
        borderRadius: `${size / 2}px`,
        zIndex: 1,   // Mantém acima do fundo, abaixo do resto
        // opacity: 0.85, // Removido para cor sólida
    };

    return <div style={cloudStyle} />;
}

export default Cloud;