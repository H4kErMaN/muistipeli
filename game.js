import { setupBoard } from './board.js';

const cardCountSelect = document.getElementById('card-count-select');
const themeSelect = document.getElementById('theme-select');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');

const movesEl = document.getElementById('moves');
const timeEl = document.getElementById('time');
const scoreEl = document.getElementById('score');
const msgEl = document.getElementById('message');

const flipSound = document.getElementById('flip-sound');
const matchSound = document.getElementById('match-sound');

let timer = null;
let startTime = null;

// nuo eri teemat on tossa noi alhalla.
const THEMES = {
    fruits: {
        bodyClass: 'theme-fruits',
        emojis: [
            '🍎', '🍐', '🍒', '🍉', '🍇', '🍓', '🍌', '🍍',
            '🥝', '🥥', '🍑', '🍈', '🍋', '🍊', '🍏', '🍅'
        ]
    },
    animals: {
        bodyClass: 'theme-animals',
        emojis: [
            '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
            '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🦄'
        ]
    }
};

function applyTheme(themeKey) {
    const theme = THEMES[themeKey];
    if (!theme) return;

    document.body.classList.remove('theme-fruits', 'theme-animals');
    document.body.classList.add(theme.bodyClass);
}

function startTimer() {
    stopTimer();
    startTime = Date.now();
    timer = setInterval(updateTime, 1000);
    updateTime();
}

function stopTimer() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
}

function updateTime() {
    const sec = Math.floor((Date.now() - startTime) / 1000);
    const min = Math.floor(sec / 60);
    const s = sec % 60;
    timeEl.textContent = `${min}:${s.toString().padStart(2, '0')}`;
}

function calcScore(attempts, seconds, pairs) {
    return Math.max(0, pairs * 200 - attempts * 10 - seconds * 2);
}

function resetStats() {
    movesEl.textContent = "0";
    timeEl.textContent = "0:00";
    scoreEl.textContent = "0";
    msgEl.textContent = "";
}

function play(sound) {
    if (!sound) return;
    sound.currentTime = 0;
    sound.play().catch(() => {});
}

function startGame() {
    const cardCount = parseInt(cardCountSelect.value, 10);
    const themeKey = themeSelect.value;
    const theme = THEMES[themeKey];

    if (!theme) {
        alert("Tuntematon teema.");
        return;
    }

    if (isNaN(cardCount) || cardCount % 2 !== 0 || cardCount <= 0) {
        alert("Korttien määrän täytyy olla positiivinen parillinen luku.");
        return;
    }

    applyTheme(themeKey);
    resetStats();
    startTimer();

    setupBoard({
        cardCount,
        emojis: theme.emojis,
        onFlip: () => play(flipSound),
        onMove: attempts => {
            movesEl.textContent = attempts;
        },
        onMatch: () => {
            play(matchSound);
        },
        onComplete: ({ attempts, pairs }) => {
            stopTimer();
            const sec = Math.floor((Date.now() - startTime) / 1000);
            const score = calcScore(attempts, sec, pairs);
            scoreEl.textContent = score;

            play(winSound);

            msgEl.textContent =
                `Onneksi olkoon! Löysit kaikki ${pairs} paria ` +
                `${attempts} yrityksellä ajassa ${timeEl.textContent}. ` +
                `Pisteet: ${score}.`;
        }
    });

    restartButton.disabled = false;
}

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);