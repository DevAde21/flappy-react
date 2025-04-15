// src/components/PauseMenu.js
import React from 'react';

// Remove 'onBackToStart' das props recebidas
function PauseMenu({ onResume, onRestart }) {
    return (
        <div style={styles.overlay}>
            <div style={styles.menuBox}>
                <h2 style={styles.title}>PAUSED</h2>
                <button onClick={onResume} style={styles.button}>RESUME</button>
                <button onClick={onRestart} style={styles.button}>RESTART</button>
                {/* Botão "BACK TO START" removido daqui */}
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
    },
    title: {
        fontSize: '2.8em',
        margin: '0 0 25px 0',
        fontWeight: 'normal',
        textShadow: 'none',
    },
     button: { // Estilo global já aplicado
        display: 'block',
        width: '85%',
     }
};

export default PauseMenu;