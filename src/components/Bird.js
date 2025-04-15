// src/components/Bird.js
import React from 'react';

const MAX_ROTATION = 25;
const MIN_VELOCITY_FOR_ROTATION = -5;
const MAX_VELOCITY_FOR_ROTATION = 10;

// Cores atualizadas
const BIRD_BODY_COLOR = '#f1c40f'; // Amarelo principal
const BIRD_BORDER_COLOR = '#f39c12'; // Laranja (contorno)
const BIRD_BEAK_COLOR = '#e67e22'; // Laranja mais escuro
const BIRD_EYE_COLOR = '#2c3e50'; // Azul escuro/pretro
const BIRD_WING_COLOR = '#f39c12'; // Laranja

function Bird({ y, size, x, velocity }) {
    let rotation = 0;
    if (velocity < MIN_VELOCITY_FOR_ROTATION) {
        rotation = -MAX_ROTATION;
    } else if (velocity > 0) {
        rotation = Math.min(MAX_ROTATION, (velocity / MAX_VELOCITY_FOR_ROTATION) * MAX_ROTATION * 1.5);
    }

    const birdHeight = size;
    const birdWidth = size * (4 / 3);
    const borderRadius = size * 0.1; // Bordas proporcionalmente arredondadas

    const containerStyle = {
        position: 'absolute',
        top: `${y}px`,
        left: `${x}px`,
        width: `${birdWidth}px`,
        height: `${birdHeight}px`,
        transform: `rotate(${rotation}deg)`,
        transition: 'transform 0.1s linear',
        zIndex: 5,
    };

    const bodyStyle = {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: BIRD_BODY_COLOR,
        borderRadius: `${borderRadius}px`,
        border: `2px solid ${BIRD_BORDER_COLOR}`,
        boxSizing: 'border-box',
    };

    const beakStyle = {
        position: 'absolute',
        right: `-${size * 0.15}px`,
        top: '50%',
        transform: 'translateY(-50%)',
        width: `${size * 0.3}px`,
        height: `${size * 0.15}px`,
        backgroundColor: BIRD_BEAK_COLOR,
        borderRadius: `0 ${borderRadius}px ${borderRadius}px 0`,
        border: `1px solid ${BIRD_BORDER_COLOR}`,
    };

    const eyeStyle = {
        position: 'absolute',
        right: `${size * 0.2}px`,
        top: `${size * 0.2}px`,
        width: `${size * 0.15}px`,
        height: `${size * 0.15}px`,
        backgroundColor: BIRD_EYE_COLOR,
        borderRadius: '50%',
        border: `1px solid ${BIRD_BORDER_COLOR}`,
    };

    const wingStyle = {
        position: 'absolute',
        left: `${size * 0.1}px`,
        top: `${size * 0.3}px`,
        width: `${size * 0.5}px`,
        height: `${size * 0.3}px`,
        backgroundColor: BIRD_WING_COLOR,
        borderRadius: `${borderRadius}px`,
        border: `1px solid ${BIRD_BORDER_COLOR}`,
        transform: 'rotate(-10deg)',
    };

    return (
        <div style={containerStyle}>
            <div style={bodyStyle}>
                <div style={wingStyle} />
                <div style={eyeStyle} />
                <div style={beakStyle} />
            </div>
        </div>
    );
}

export default Bird;