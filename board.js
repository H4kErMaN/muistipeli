import { createCardElement } from './card.js';

const gameBoard = document.getElementById('game-board');

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchesFound = 0;
let totalPairs = 0;
let attempts = 0;

let flipCallback = null;
let moveCallback = null;
let matchCallback = null;
let completeCallback = null;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export function setupBoard({
    cardCount,
    emojis,
    onFlip,
    onMove,
    onMatch,
    onComplete
}) {
    gameBoard.innerHTML = "";

    firstCard = null;
    secondCard = null;
    lockBoard = false;
    matchesFound = 0;
    attempts = 0;
    totalPairs = cardCount / 2;

    flipCallback = onFlip || null;
    moveCallback = onMove || null;
    matchCallback = onMatch || null;
    completeCallback = onComplete || null;

    const selected = emojis.slice(0, totalPairs);
    const cards = [...selected, ...selected];

    shuffle(cards);

    cards.forEach(emoji => {
        const card = createCardElement(emoji);
        card.addEventListener("click", () => onCardClick(card));
        gameBoard.appendChild(card);
    });
}

function onCardClick(card) {
    if (lockBoard) return;
    if (card === firstCard) return;
    if (card.classList.contains("flipped") || card.classList.contains("matched")) return;

    flip(card);

    if (!firstCard) {
        firstCard = card;
        return;
    }

    secondCard = card;
    attempts++;

    if (moveCallback) moveCallback(attempts);

    checkMatch();
}

function flip(card) {
    card.classList.add("flipped");
    card.textContent = card.dataset.emoji;

    if (flipCallback) flipCallback();
}

function unflip(card) {
    card.classList.remove("flipped");
    card.textContent = "";
}

function checkMatch() {
    const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;
    isMatch ? handleMatch() : handleNoMatch();
}

function handleMatch() {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    matchesFound++;
    if (matchCallback) matchCallback(matchesFound, totalPairs);

    resetPick();

    if (matchesFound === totalPairs && completeCallback) {
        completeCallback({ attempts, pairs: totalPairs });
    }
}

function handleNoMatch() {
    lockBoard = true;

    setTimeout(() => {
        unflip(firstCard);
        unflip(secondCard);
        resetPick();
    }, 1000);
}

function resetPick() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}