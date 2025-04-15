// src/utils/SoundPlayer.js
const sounds = {
    button: new Audio('/sounds/button.wav'),
    jump: new Audio('/sounds/jump.wav'),
    score: new Audio('/sounds/score.wav'),
    pause: new Audio('/sounds/pause.wav'),
    death: new Audio('/sounds/death.wav'),
};

// Variável para controlar se os sons podem ser tocados
let soundsEnabled = false;

// Função para habilitar sons (deve ser chamada após interação do usuário)
export const enableSounds = () => {
    soundsEnabled = true;
    // Toca e pausa imediatamente para "destravar" o áudio
    sounds.button.volume = 0;
    sounds.button.play().then(() => {
        sounds.button.pause();
        sounds.button.currentTime = 0;
        sounds.button.volume = 0.7;
    }).catch(e => console.log("Audio unlock failed:", e));
};

// Configura volume padrão
Object.values(sounds).forEach(sound => {
    sound.volume = 0.7;
});

export const playSound = (soundName) => {
    if (!soundsEnabled) return;
    
    const sound = sounds[soundName];
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(error => {
            console.warn(`Sound ${soundName} playback failed:`, error);
        });
    } else {
        console.warn(`Sound ${soundName} not found.`);
    }
};