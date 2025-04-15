// src/components/Ground.js
import React from 'react';

const GROUND_HEIGHT = 80;
const EARTH_HEIGHT = 60;
const GRASS_HEIGHT = GROUND_HEIGHT - EARTH_HEIGHT;
// === NOVAS CORES CHÃO ===
const EARTH_COLOR = '#8e4723';
const GRASS_COLOR_LIGHT = '#9ACD32'; // YellowGreen
const GRASS_COLOR_DARK = '#6B8E23'; // OliveDrab
const STRIPE_WIDTH = 15;

function Ground({ offsetX, gameWidth }) {
    const bgOffset = offsetX % (STRIPE_WIDTH * 2);
    const backgroundPositionX = `${bgOffset >= 0 ? bgOffset : bgOffset + (STRIPE_WIDTH * 2)}px`;

    const groundStyle = {
        position: 'absolute', bottom: 0, left: 0,
        width: `${gameWidth}px`, height: `${GROUND_HEIGHT}px`,
        zIndex: 8,
    };

    const earthStyle = {
        position: 'absolute', bottom: 0, left: 0,
        width: '100%', height: `${EARTH_HEIGHT}px`,
        backgroundColor: EARTH_COLOR,
        backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0.15))',
    };

    const grassStyle = {
        position: 'absolute', bottom: `${EARTH_HEIGHT}px`, left: `-${STRIPE_WIDTH * 2}px`,
        width: `calc(100% + ${STRIPE_WIDTH * 4}px)`, height: `${GRASS_HEIGHT}px`,
        backgroundImage: `repeating-linear-gradient(
            90deg,
            ${GRASS_COLOR_DARK},
            ${GRASS_COLOR_DARK} ${STRIPE_WIDTH}px,
            ${GRASS_COLOR_LIGHT} ${STRIPE_WIDTH}px,
            ${GRASS_COLOR_LIGHT} ${STRIPE_WIDTH * 2}px
        )`,
        backgroundSize: `${STRIPE_WIDTH * 2}px ${GRASS_HEIGHT}px`,
        backgroundPositionX: backgroundPositionX,
        borderTop: `3px solid #5A9318`, borderBottom: `3px solid rgb(126, 63, 31)`
    };

    return (
        <div style={groundStyle}>
            <div style={earthStyle} />
            <div style={grassStyle} />
        </div>
    );
}

export default Ground;
export { GROUND_HEIGHT };