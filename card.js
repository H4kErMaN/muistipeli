export function createCardElement(emoji) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.dataset.emoji = emoji;
    cardElement.textContent = "";
    return cardElement;
}