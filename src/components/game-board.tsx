import {Grid} from "./grid.tsx";
import {useEffect, useState} from "react";
import {Button} from "./ui/button.tsx";
import {RefreshCcw} from "lucide-react";

type GameState = {
    state: "in-progress" | "finished";
    lines: string[][];
    gameWon: boolean;
    currentLineIndex: number;
}

const initialGameState: GameState = {
    state: "in-progress",
    lines: new Array(6).fill(null).map(() => new Array(5).fill('')),
    gameWon: false,
    currentLineIndex: 0
}

const FALLBACK_WORDS = ['HELLO', 'WORLD', 'REACT', 'HOOKS', 'GAMES', 'WORDS'];

export function GameBoard() {
    const [words, setWords] = useState<string[]>(FALLBACK_WORDS);
    const [word, setWord] = useState('');
    const [gameState, setGameState] = useState(initialGameState);
    const resetGame = () => {
        setGameState(initialGameState);
        setWord(words[Math.floor(Math.random() * words.length)]);
    };

    useEffect(() => {
        fetch('/words.json')
            .then(response => response.json())
            .then(data => {
                setWords(data);
                setWord(data[Math.floor(Math.random() * data.length)]);
            })
            .catch(_error => setWords(FALLBACK_WORDS));
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (word === '') return;

            const key = event.key;
            const currentLine = [...gameState.lines[gameState.currentLineIndex]];

            if (/^[a-zA-Z]$/.test(key)) {
                const emptyIndex = currentLine.findIndex(c => c === '');
                if (emptyIndex !== -1) {
                    currentLine[emptyIndex] = key.toUpperCase();
                    const newLines = [...gameState.lines];
                    newLines[gameState.currentLineIndex] = currentLine;
                    setGameState(prev => ({...prev, lines: newLines}));
                }
            } else if (key === 'Backspace') {
                const lastFilledIndex = currentLine.map(c => c !== '').lastIndexOf(true);
                if (lastFilledIndex !== -1) {
                    currentLine[lastFilledIndex] = '';
                    const newLines = [...gameState.lines];
                    newLines[gameState.currentLineIndex] = currentLine;
                    setGameState(prev => ({...prev, lines: newLines}));
                }
            } else if (key === 'Enter') {
                if (currentLine.every(letter => letter !== '')) {
                    const nextLineIndex = gameState.currentLineIndex + 1;
                    const isLastLine = nextLineIndex >= gameState.lines.length
                    const isGameWon = word === currentLine.join('');
                    setGameState(prev => ({
                        ...prev,
                        currentLineIndex: nextLineIndex,
                        state: isGameWon ? 'finished' : (isLastLine ? 'finished' : 'in-progress'),
                        gameWon: isGameWon
                    }));
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameState, word]);

    if (gameState.state === 'finished' && !gameState.gameWon) {
        return (
            <main className="flex flex-1 flex-col justify-center items-center p-4 gap-2">
                <div className="text-lg">You lost! The word was: {word}</div>
                <Button onClick={resetGame}>
                    <RefreshCcw/>New game
                </Button>
            </main>
        );
    }

    if (gameState.gameWon) {
        return (
            <main className="flex flex-1 flex-col justify-center items-center p-4 gap-2">
                <div className="text-lg">You guessed it! Wanna try again?</div>
                <Button onClick={resetGame}>
                    <RefreshCcw/>New game
                </Button>
            </main>
        );
    }

    return (
        <main className="flex flex-1 flex-col justify-center items-center p-4 gap-2">
            <Grid lines={gameState.lines} correctWord={word} currentLineIndex={gameState.currentLineIndex}/>
        </main>
    )
}