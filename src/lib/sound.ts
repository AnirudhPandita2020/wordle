type SoundType = 'winning' | 'losing';

const sounds: Record<SoundType, HTMLAudioElement> = {
    'winning': new Audio('/sounds/wordle_winning_sound.mp3'),
    'losing': new Audio('/sounds/wordle_losing_sound.mp3')
};

export default function playSound(type: SoundType) {
    const sound = sounds[type];
    sound?.play().catch((error) => {
        console.error(`Error playing ${type} sound:`, error);
    });
}