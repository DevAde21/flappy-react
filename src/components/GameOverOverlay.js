// src/components/GameOverOverlay.js
import React from 'react';

function GameOverOverlay({ score, maxScore, onRestart }) {
    return (
        <div style={styles.overlay}>
            <div style={styles.menuBox}>
                <h1 style={styles.title}>GAME OVER</h1>
                <p style={styles.scoreText}>SCORE: {score}</p>
                <p style={styles.scoreText}>MAX SCORE: {maxScore}</p>
                <button onClick={onRestart} style={styles.button}>RESTART</button>
                <p style={styles.restartHint}>(OR PRESS SPACE TO RESTART)</p>
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20,
    },
    menuBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: '30px 40px',
        borderRadius: '10px',
        textAlign: 'center',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        color: 'white',
        minWidth: '250px',
    },
    title: {
        fontSize: '2.8em',
        margin: '0 0 20px 0',
        fontWeight: 'normal',
        textShadow: 'none',
    },
    scoreText: {
        fontSize: '1.8em',
        margin: '10px 0',
        fontWeight: 'normal',
        textShadow: 'none',
    },
    button: {
        display: 'block',
        margin: '25px auto 15px',
        width: '85%',
    },
    restartHint: {
        fontSize: '1.25em',
        marginTop: '10px',
        color: 'rgba(255, 255, 255, 0.7)',
        textShadow: 'none',
        fontWeight: 'normal',
    }
};

export default GameOverOverlay;