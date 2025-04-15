import React, { useState, useEffect, useRef, useCallback } from 'react';
import GameArea from './components/GameArea';
import PauseMenu from './components/PauseMenu';
import GameOverOverlay from './components/GameOverOverlay';
import Ground, { GROUND_HEIGHT } from './components/Ground';
import Cloud from './components/Cloud';
import Mountain from './components/Mountain';
import { playSound, enableSounds } from './utils/SoundPlayer';

// --- Constantes ---
const GAME_WIDTH = 500;
const GAME_HEIGHT = 600;
const EFFECTIVE_GAME_HEIGHT = GAME_HEIGHT - GROUND_HEIGHT;
const BIRD_SIZE = 35;
const BIRD_START_Y = EFFECTIVE_GAME_HEIGHT / 2 - BIRD_SIZE / 2;
const BIRD_START_X = 100;
const GRAVITY = 0.55;
const JUMP_FORCE = -9;
const PIPE_WIDTH = 80;
const PIPE_GAP = 160;
const PIPE_SPEED = 2.5;
const GROUND_SCROLL_SPEED = PIPE_SPEED;
const PIPE_DISTANCE = PIPE_SPEED * (2200 / (1000/60));

// Constantes Pássaro Hover (Ready State)
const HOVER_AMPLITUDE = 8;
const HOVER_SPEED = 0.04;

// Constantes Nuvens
const CLOUD_MIN_Y = 30;
const CLOUD_MAX_Y = 200;
const CLOUD_MIN_SIZE = 70;
const CLOUD_MAX_SIZE = 120;
const CLOUD_MIN_SPEED = 0.3;
const CLOUD_MAX_SPEED = 0.7;
const CLOUD_DISTANCE = 450;

// Constantes Montanhas
const MOUNTAIN_MIN_Y = 440;
const MOUNTAIN_MAX_Y = 440;
const MOUNTAIN_MIN_SIZE = 100;
const MOUNTAIN_MAX_SIZE = 200;
const MOUNTAIN_MIN_SPEED = 0.1;
const MOUNTAIN_MAX_SPEED = 0.3;
const MOUNTAIN_DISTANCE = 600; 
const MOUNTAIN_COLORS = ['#8FBC8F'];

// Constantes para o efeito de shake
const SHAKE_DURATION = 600;
const SHAKE_INTENSITY = 20;
const SHAKE_FREQUENCY = 0.1;

// --- Estados do Jogo ---
const GAME_STATES = { 
  READY: 'READY', 
  PLAYING: 'PLAYING', 
  DYING: 'DYING', 
  PAUSED: 'PAUSED', 
  GAME_OVER: 'GAME_OVER'
};

// --- Helper de Colisão ---
const checkCollision = (rect1, rect2) => {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
};

function App() {
  // --- Estados ---
  const [gameState, setGameState] = useState(GAME_STATES.READY);
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [birdY, setBirdY] = useState(BIRD_START_Y);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState([]);
  const [groundOffsetX, setGroundOffsetX] = useState(0);
  const [clouds, setClouds] = useState([]);
  const [mountains, setMountains] = useState([]);
  const [shakeOffset, setShakeOffset] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [gameOverTime, setGameOverTime] = useState(0);

  // --- Refs ---
  const gameLoopRequestRef = useRef(null);
  const birdYRef = useRef(birdY);
  const birdVelocityRef = useRef(birdVelocity);
  const pipesRef = useRef(pipes);
  const scoreRef = useRef(score);
  const gameStateRef = useRef(gameState);
  const groundOffsetXRef = useRef(groundOffsetX);
  const gameContainerRef = useRef(null);
  const hoverTimeRef = useRef(0);
  const cloudsRef = useRef(clouds);
  const mountainsRef = useRef(mountains);
  const shakeTimeoutRef = useRef(null);
  const shakeIntervalRef = useRef(null);

  // --- Atualiza Refs ---
  useEffect(() => { birdYRef.current = birdY; }, [birdY]);
  useEffect(() => { birdVelocityRef.current = birdVelocity; }, [birdVelocity]);
  useEffect(() => { pipesRef.current = pipes; }, [pipes]);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);
  useEffect(() => { groundOffsetXRef.current = groundOffsetX; }, [groundOffsetX]);
  useEffect(() => { cloudsRef.current = clouds; }, [clouds]);
  useEffect(() => { mountainsRef.current = mountains; }, [mountains]);

  // --- Habilita sons após interação ---
  useEffect(() => {
    const handleFirstInteraction = () => {
      enableSounds();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  // --- Garante foco no container ---
  useEffect(() => {
    if ([GAME_STATES.READY, GAME_STATES.PLAYING, GAME_STATES.GAME_OVER].includes(gameState)) {
      gameContainerRef.current?.focus();
    }
  }, [gameState]);

  // --- Efeito de Shake com som de morte ---
  const triggerShake = useCallback(() => {
    if (isShaking) return;
    
    setIsShaking(true);
    playSound('death');
    
    if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
    if (shakeIntervalRef.current) clearInterval(shakeIntervalRef.current);
    
    const startTime = Date.now();
    
    shakeIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= SHAKE_DURATION) {
        clearInterval(shakeIntervalRef.current);
        setIsShaking(false);
        setShakeOffset(0);
        return;
      }
      
      const progress = elapsed / SHAKE_DURATION;
      const currentIntensity = SHAKE_INTENSITY * (1 - progress * progress);
      const offset = Math.sin(elapsed * SHAKE_FREQUENCY) * currentIntensity;
      setShakeOffset(offset);
    }, 16);
    
    shakeTimeoutRef.current = setTimeout(() => {
      clearInterval(shakeIntervalRef.current);
      setIsShaking(false);
      setShakeOffset(0);
    }, SHAKE_DURATION);
  }, [isShaking]);

  const stopShakeImmediately = useCallback(() => {
    if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
    if (shakeIntervalRef.current) clearInterval(shakeIntervalRef.current);
    setIsShaking(false);
    setShakeOffset(0);
  }, []);

  // --- Criação de Nuvens ---
  const _createAndAddCloud = useCallback((initialX = GAME_WIDTH) => {
    const size = Math.random() * (CLOUD_MAX_SIZE - CLOUD_MIN_SIZE) + CLOUD_MIN_SIZE;
    const y = Math.random() * (CLOUD_MAX_Y - CLOUD_MIN_Y) + CLOUD_MIN_Y;
    const speed = Math.random() * (CLOUD_MAX_SPEED - CLOUD_MIN_SPEED) + CLOUD_MIN_SPEED;
    const newCloud = { id: Date.now() + Math.random(), x: initialX, y, size, speed };
    setClouds(currentClouds => [...currentClouds, newCloud]);
  }, []);

  // --- Criação de Montanhas ---
  const _createAndAddMountain = useCallback((initialX = GAME_WIDTH) => {
    const size = Math.random() * (MOUNTAIN_MAX_SIZE - MOUNTAIN_MIN_SIZE) + MOUNTAIN_MIN_SIZE;
    const y = Math.random() * (MOUNTAIN_MAX_Y - MOUNTAIN_MIN_Y) + MOUNTAIN_MIN_Y;
    const speed = Math.random() * (MOUNTAIN_MAX_SPEED - MOUNTAIN_MIN_SPEED) + MOUNTAIN_MIN_SPEED;
    const color = MOUNTAIN_COLORS[Math.floor(Math.random() * MOUNTAIN_COLORS.length)];
    const newMountain = { 
      id: Date.now() + Math.random(), 
      x: initialX, 
      y: EFFECTIVE_GAME_HEIGHT - y,
      size, 
      speed, 
      color 
    };
    setMountains(currentMountains => [...currentMountains, newMountain]);
  }, []);

  // --- Inicialização ---
  useEffect(() => {
    const storedMaxScore = localStorage.getItem('flappyBirdMaxScore');
    if (storedMaxScore) { setMaxScore(parseInt(storedMaxScore, 10)); }
    if (gameState === GAME_STATES.READY || gameState === GAME_STATES.GAME_OVER) { 
      gameContainerRef.current?.focus(); 
    }
    if (gameState === GAME_STATES.READY && clouds.length === 0 && mountains.length === 0) {
      _createAndAddCloud(GAME_WIDTH * 0.2);
      _createAndAddCloud(GAME_WIDTH * 0.7);
      _createAndAddMountain(GAME_WIDTH * 0.1);
      _createAndAddMountain(GAME_WIDTH * 0.5);
    }
  }, [gameState, clouds.length, mountains.length, _createAndAddCloud, _createAndAddMountain]);

  // --- Funções de Controle ---
  const pauseGame = useCallback((fromVisibilityChange = false) => {
    if (gameStateRef.current === GAME_STATES.PLAYING) { 
      setGameState(GAME_STATES.PAUSED); 
      if (!fromVisibilityChange) {
        playSound('pause'); 
      }
    }
  }, []);

  const resumeGame = useCallback(() => {
    if (gameStateRef.current === GAME_STATES.PAUSED) { 
      gameContainerRef.current?.focus(); 
      setGameState(GAME_STATES.PLAYING); 
      playSound('button'); 
    }
  }, []);

  const triggerGameOverSequence = useCallback(() => {
    if (gameStateRef.current === GAME_STATES.PLAYING) { 
      setGameState(GAME_STATES.DYING); 
      triggerShake();
    }
  }, [triggerShake]);

  const finalizeGameOver = useCallback(() => {
    setGameState(GAME_STATES.GAME_OVER); 
    setGameOverTime(Date.now());
    if (scoreRef.current > maxScore) { 
      setMaxScore(scoreRef.current); 
      localStorage.setItem('flappyBirdMaxScore', scoreRef.current.toString()); 
    } 
    gameContainerRef.current?.focus();
  }, [maxScore]);

  // --- Auto-Pause ---
  useEffect(() => {
    const handleVisibilityChange = () => { 
      if (document.hidden && gameStateRef.current === GAME_STATES.PLAYING) { 
        pauseGame(true); // Pausa silenciosa
      } 
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => { document.removeEventListener('visibilitychange', handleVisibilityChange); };
  }, [pauseGame]);

  // --- Criação de Canos ---
  const _createAndAddPipe = useCallback(() => {
    const minGapY = PIPE_GAP / 2 + 70;
    const maxGapY = EFFECTIVE_GAME_HEIGHT - PIPE_GAP / 2 - 70;
    const gapY = Math.floor(Math.random() * (maxGapY - minGapY + 1)) + minGapY;
    const newPipe = { id: Date.now() + Math.random(), x: GAME_WIDTH, gapY: gapY, scored: false };
    setPipes(currentPipes => [...currentPipes, newPipe]);
  }, []);

  // --- Game Loop Principal ---
  const gameLoop = useCallback((timestamp) => {
    const currentState = gameStateRef.current;
    let nextFrameNeeded = false;

    // Movimento (Chão, Nuvens e Montanhas)
    if (currentState === GAME_STATES.READY || currentState === GAME_STATES.PLAYING) {
      setGroundOffsetX(offset => offset - GROUND_SCROLL_SPEED);
      
      // Movimento Nuvens
      setClouds(currentClouds =>
        currentClouds
          .map(cloud => ({ ...cloud, x: cloud.x - cloud.speed }))
          .filter(cloud => cloud.x > -cloud.size * 1.5)
      );
      
      // Movimento Montanhas
      setMountains(currentMountains =>
        currentMountains
          .map(mountain => ({ ...mountain, x: mountain.x - mountain.speed }))
          .filter(mountain => mountain.x > -mountain.size * 1.5)
      );
      
      // Criação de Nuvens
      const currentClouds = cloudsRef.current;
      const lastCloud = currentClouds.length > 0 ? currentClouds[currentClouds.length - 1] : null;
      if (currentState !== GAME_STATES.PAUSED && (!lastCloud || lastCloud.x <= GAME_WIDTH - CLOUD_DISTANCE)) {
        _createAndAddCloud();
      }

      // Criação de Montanhas
      const currentMountains = mountainsRef.current;
      const lastMountain = currentMountains.length > 0 ? currentMountains[currentMountains.length - 1] : null;
      if (currentState !== GAME_STATES.PAUSED && (!lastMountain || lastMountain.x <= GAME_WIDTH - MOUNTAIN_DISTANCE)) {
        _createAndAddMountain();
      }

      nextFrameNeeded = true;
    }

    // Animação Hover do Pássaro
    if (currentState === GAME_STATES.READY) {
      hoverTimeRef.current += HOVER_SPEED;
      const hoverOffsetY = Math.sin(hoverTimeRef.current) * HOVER_AMPLITUDE;
      setBirdY(BIRD_START_Y + hoverOffsetY);
    }

    // Lógica PLAYING
    if (currentState === GAME_STATES.PLAYING) {
      let collisionDetected = false;
      const currentVelocity = birdVelocityRef.current + GRAVITY;
      const nextY = birdYRef.current + currentVelocity;
      const birdWidth = BIRD_SIZE * (4/3);
      const birdHeight = BIRD_SIZE;
      const nextBirdRect = { x: BIRD_START_X, y: nextY, width: birdWidth, height: birdHeight };
      
      if (nextY < 0) { 
        collisionDetected = true; 
        setBirdY(0); 
        setBirdVelocity(0); 
      } else if (nextY + birdHeight > EFFECTIVE_GAME_HEIGHT) { 
        collisionDetected = true; 
        setBirdY(EFFECTIVE_GAME_HEIGHT - birdHeight); 
        setBirdVelocity(0); 
      } else {
        pipesRef.current.forEach(pipe => {
          const topPipeRect = { 
            x: pipe.x, 
            y: 0, 
            width: PIPE_WIDTH, 
            height: pipe.gapY - PIPE_GAP / 2 
          };
          const bottomPipeRect = { 
            x: pipe.x, 
            y: pipe.gapY + PIPE_GAP / 2, 
            width: PIPE_WIDTH, 
            height: GAME_HEIGHT - (pipe.gapY + PIPE_GAP / 2) 
          };
          if (checkCollision(nextBirdRect, topPipeRect) || checkCollision(nextBirdRect, bottomPipeRect)) { 
            collisionDetected = true; 
            setBirdVelocity(0); 
            return; 
          }
          if (!pipe.scored && pipe.x + PIPE_WIDTH < BIRD_START_X) { 
            setPipes(currentPipes => currentPipes.map(p => p.id === pipe.id ? { ...p, scored: true } : p)); 
            setScore(s => s + 1); 
            playSound('score'); 
          }
        });
      }

      if (collisionDetected) { 
        triggerGameOverSequence(); 
      } else {
        setBirdY(nextY); 
        setBirdVelocity(currentVelocity);
        setPipes(currentPipes => 
          currentPipes
            .map(pipe => ({ ...pipe, x: pipe.x - PIPE_SPEED }))
            .filter(pipe => pipe.x > -PIPE_WIDTH)
        );
        const currentPipes = pipesRef.current;
        const lastPipe = currentPipes.length > 0 ? currentPipes[currentPipes.length - 1] : null;
        if (!lastPipe || lastPipe.x <= GAME_WIDTH - PIPE_DISTANCE) { 
          _createAndAddPipe(); 
        }
      }
    }
    // Lógica DYING
    else if (currentState === GAME_STATES.DYING) {
      const currentVelocity = birdVelocityRef.current + GRAVITY * 1.5; 
      let nextY = birdYRef.current + currentVelocity;
      const birdHeight = BIRD_SIZE;
      if (nextY + birdHeight > EFFECTIVE_GAME_HEIGHT) { 
        nextY = EFFECTIVE_GAME_HEIGHT - birdHeight; 
        setBirdY(nextY); 
        setBirdVelocity(0); 
        finalizeGameOver(); 
      } else { 
        setBirdY(nextY); 
        setBirdVelocity(currentVelocity); 
        nextFrameNeeded = true; 
      }
    }

    if (nextFrameNeeded) { 
      gameLoopRequestRef.current = requestAnimationFrame(gameLoop); 
    } else { 
      gameLoopRequestRef.current = null; 
    }
  }, [triggerGameOverSequence, finalizeGameOver, _createAndAddPipe, _createAndAddCloud, _createAndAddMountain]);

  // --- Controle do Game Loop ---
  useEffect(() => {
    const startLoop = [GAME_STATES.READY, GAME_STATES.PLAYING, GAME_STATES.DYING].includes(gameState);
    if (gameLoopRequestRef.current) { 
      cancelAnimationFrame(gameLoopRequestRef.current); 
      gameLoopRequestRef.current = null; 
    }
    if (startLoop) { 
      gameLoopRequestRef.current = requestAnimationFrame(gameLoop); 
    }
    return () => { 
      if (gameLoopRequestRef.current) cancelAnimationFrame(gameLoopRequestRef.current); 
    };
  }, [gameState, gameLoop]);

  // --- Funções de Controle ---
  const startGame = useCallback(() => {
    if (gameStateRef.current === GAME_STATES.READY) {
      hoverTimeRef.current = 0;
      setBirdY(BIRD_START_Y);
      setBirdVelocity(JUMP_FORCE);
      setPipes([]);
      setScore(0);
      setGameState(GAME_STATES.PLAYING);
      _createAndAddPipe();
      playSound('jump');
    }
  }, [_createAndAddPipe]);

  const resetGameToReady = useCallback(() => {
    setGameState(GAME_STATES.READY);
    setBirdVelocity(0);
    setPipes([]);
    setScore(0);
    setClouds([]);
    setMountains([]);
    hoverTimeRef.current = 0;
    gameContainerRef.current?.focus();
  }, []);

  const restartGame = useCallback(() => {
    if (gameState === GAME_STATES.GAME_OVER && Date.now() - gameOverTime < 250) {
      return;
    }
    playSound('button');
    stopShakeImmediately();
    resetGameToReady();
  }, [gameOverTime, gameState, resetGameToReady, stopShakeImmediately]);

  // --- Handlers de Input ---
  const handleKeyDown = useCallback((e) => {
    const currentGameState = gameStateRef.current;
    
    // Espaço ou seta para cima
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      e.preventDefault();
      
      if (currentGameState === GAME_STATES.READY) {
        startGame();
      } 
      else if (currentGameState === GAME_STATES.PLAYING) {
        setBirdVelocity(JUMP_FORCE);
        playSound('jump');
      }
      else if (currentGameState === GAME_STATES.GAME_OVER) {
        restartGame();
      }
    }
    // Tecla P ou ESC para pausar/despausar
    else if (e.code === 'KeyP' || e.code === 'Escape') {
      e.preventDefault();
      if (currentGameState === GAME_STATES.PLAYING) {
        pauseGame(); // Pausa com som
      } else if (currentGameState === GAME_STATES.PAUSED) {
        resumeGame();
      }
    }
  }, [startGame, pauseGame, resumeGame, restartGame]);

  // --- Renderização ---
  return (
    <div className="app-wrapper">
      <h1 className="game-title">FLAPPY REACT</h1>
      <div
        id="game-container"
        ref={gameContainerRef}
        style={{
          ...styles.appContainer,
          transform: isShaking ? `translateX(${shakeOffset}px)` : 'none',
          transition: isShaking ? 'transform 0.05s linear' : 'transform 0.2s ease-out',
          cursor: 'default'
        }}
        onKeyDown={handleKeyDown}
        tabIndex="0"
      >
        {mountains.map(mountain => (
          <Mountain 
            key={mountain.id} 
            x={mountain.x} 
            y={mountain.y} 
            size={mountain.size} 
            color={mountain.color} 
          />
        ))}
        {clouds.map(cloud => (
          <Cloud key={cloud.id} x={cloud.x} y={cloud.y} size={cloud.size} />
        ))}
        <GameArea 
          birdY={birdY} 
          birdVelocity={birdVelocity} 
          pipes={pipes} 
          score={score} 
          gameHeight={GAME_HEIGHT} 
          gameWidth={GAME_WIDTH} 
          birdSize={BIRD_SIZE} 
          birdX={BIRD_START_X} 
          pipeWidth={PIPE_WIDTH} 
          pipeGap={PIPE_GAP}
        />
        <Ground offsetX={groundOffsetX} gameWidth={GAME_WIDTH} />
        {gameState === GAME_STATES.READY && (
          <div style={styles.readyOverlay}>
            <p style={styles.readyScore}>MAX SCORE: {maxScore}</p>
            <p style={styles.readyStart}>PRESS SPACE TO START</p>
          </div>
        )}
        {gameState === GAME_STATES.PAUSED && (
          <PauseMenu onResume={resumeGame} onRestart={restartGame} />
        )}
        {gameState === GAME_STATES.GAME_OVER && (
          <GameOverOverlay score={score} maxScore={maxScore} onRestart={restartGame} />
        )}
      </div>
    </div>
  );
}

// --- Estilos ---
const styles = {
  appContainer: {
    width: `${GAME_WIDTH}px`,
    height: `${GAME_HEIGHT}px`,
    background: 'linear-gradient(to bottom,rgb(107, 174, 215), #B0E0E6)',
    overflow: 'hidden',
    position: 'relative',
    border: '3px solid rgb(15, 15, 28)',
    outline: 'none',
    userSelect: 'none', 
    WebkitUserSelect: 'none', 
    MozUserSelect: 'none', 
    msUserSelect: 'none',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
  },
  readyOverlay: { 
    position: 'absolute', 
    top: '60%', 
    left: '50%', 
    transform: 'translate(-50%, -50%)', 
    color: 'white', 
    textAlign: 'center', 
    zIndex: 15, 
    textShadow: '1px 1px 2px rgba(0,0,0,0.3)', 
    width: '80%', 
  },
  readyScore: { 
    fontSize: '2em', 
    margin: '0 0 15px 0', 
    fontWeight: 'normal', 
  },
  readyStart: { 
    fontSize: '1.5em', 
    fontWeight: 'normal', 
  }
};

export default App;