import React from 'react';

function StartScreen({ onStart, maxScore, isGameOver, currentScore }) {
    return (
        <div style={styles.container}>
            {isGameOver ? (
                <>
                    <h1 style={styles.title}>GAME OVER</h1>
                    <p style={styles.scoreText}>SCORE: {currentScore}</p>
                    <p style={styles.scoreText}>MAX SCORE: {maxScore}</p>
                    <button onClick={onStart} style={styles.button}>RESTART</button>
                </>
            ) : (
                <>
                    <h1 style={styles.title}>FLAPPY BIRD</h1>
                    <p style={styles.scoreText}>MAX SCORE: {maxScore}</p>
                    <button onClick={onStart} style={styles.button}>START</button>
                </>
            )}
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        textAlign: 'center',
         color: 'white', // Garante texto branco
         textShadow: '2px 2px 4px rgba(0,0,0,0.5)', // Sombra para legibilidade
    },
    title: {
        fontSize: '3.5em', // Tamanho grande para o título
        margin: '0 0 20px 0',
    },
    scoreText: {
        fontSize: '1.8em', // Tamanho para scores
        margin: '5px 0',
    },
     button: { // Estilo já definido globalmente, mas pode sobrescrever/adicionar aqui
        marginTop: '30px',
     }
};

export default StartScreen;