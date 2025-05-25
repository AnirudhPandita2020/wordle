const winningSound = new Audio('/sounds/wordle_winning_sound.mp3');
const losingSound = new Audio('/sounds/wordle_losing_sound.mp3');

export function playWinningSound() {
    winningSound.play().catch((error) => {
        console.error('Error playing winning sound:', error);
    });
}

export function plateLosingSound() {
    losingSound.play().catch((error) => {
        console.error('Error playing losing sound:', error);
    });
}