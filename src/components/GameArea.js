// src/components/GameArea.js
import React from 'react';
import Bird from './Bird';
import Pipe from './Pipe';

function GameArea({
    birdY,
    birdVelocity,
    pipes,
    score,
    gameHeight,
    gameWidth,
    birdSize,
    birdX,
    pipeWidth,
    pipeGap
}) {
    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
            {/* Score Display */}
            <div style={styles.scoreDisplay}>
                {score}
            </div>

            {/* Bird */}
            <Bird y={birdY} size={birdSize} x={birdX} velocity={birdVelocity} />

            {/* Pipes */}
            {pipes.map(pipe => (
                <Pipe
                    key={pipe.id}
                    x={pipe.x}
                    gapY={pipe.gapY}
                    pipeWidth={pipeWidth}
                    pipeGap={pipeGap}
                    gameHeight={gameHeight}
                />
            ))}
        </div>
    );
}

const styles = {
    scoreDisplay: {
        position: 'absolute',
        top: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '4.5em',
        fontWeight: 'normal',
        color: 'white',
        zIndex: 10, // Acima de nuvens, canos, pássaro, chão
        // === SHADOW READICIONADA ===
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)', // Sombra escura para contraste
    }
}

export default GameArea;