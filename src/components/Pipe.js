// src/components/Pipe.js
import React from 'react';

// Cores Verdes
const PIPE_COLOR = '#78BE20';
const PIPE_BORDER_COLOR = '#5A9318';
const PIPE_CAP_HEIGHT = 25;

function Pipe({ x, gapY, pipeWidth, pipeGap, gameHeight }) {
    const topPipeHeight = gapY - pipeGap / 2;
    const bottomPipeY = gapY + pipeGap / 2;

    const pipeBaseStyle = {
        position: 'absolute',
        left: `${x}px`,
        width: `${pipeWidth}px`,
        backgroundColor: PIPE_COLOR,
        borderLeft: `3px solid ${PIPE_BORDER_COLOR}`,
        borderRight: `3px solid ${PIPE_BORDER_COLOR}`,
        boxSizing: 'border-box',
        boxShadow: 'inset 3px 0px 5px rgba(0,0,0,0.1), inset -3px 0px 5px rgba(0,0,0,0.1)',
        // === Z-INDEX ADICIONADO ===
        zIndex: 2, // Acima das nuvens (z:1)
    };

    const pipeCapStyle = {
        position: 'absolute',
        left: `${x - 4}px`,
        width: `${pipeWidth + 8}px`,
        height: `${PIPE_CAP_HEIGHT}px`,
        backgroundColor: PIPE_COLOR,
        border: `3px solid ${PIPE_BORDER_COLOR}`,
        borderRadius: '5px',
        boxSizing: 'border-box',
        // === Z-INDEX ADICIONADO (Maior que o corpo se houver sobreposição) ===
        zIndex: 3, // Acima do corpo do cano e das nuvens
        boxShadow: '0 2px 3px rgba(0,0,0,0.2)',
    };

    return (
        <>
            {/* Top Pipe Body */}
            <div style={{ ...pipeBaseStyle, top: 0, height: `${topPipeHeight}px`, borderTop: 'none' }} />
            {/* Top Pipe Cap */}
             <div style={{ ...pipeCapStyle, top: `${topPipeHeight - PIPE_CAP_HEIGHT}px` }} />
            {/* Bottom Pipe Body */}
            <div style={{ ...pipeBaseStyle, top: `${bottomPipeY}px`, height: `${gameHeight - bottomPipeY}px`, borderBottom: 'none' }} />
             {/* Bottom Pipe Cap */}
             <div style={{ ...pipeCapStyle, top: `${bottomPipeY}px` }} />
        </>
    );
}

export default Pipe;