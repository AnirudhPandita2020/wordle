import {Grid} from "./grid.tsx";
import {useCallback, useEffect, useRef, useState} from "react";
import {Button} from "../ui/button.tsx";
import {RefreshCcw} from "lucide-react";
import useMobile from "../../hooks/use-mobile.tsx";
import Keyboard from "../keyboard/keyboard.tsx";


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
    currentLineIndex: 0,
};

const POINTS_TABLE = [10, 8, 6, 4, 2, 1];

const FALLBACK_WORDS = ['HELLO', 'WORLD', 'REACT', 'HOOKS', 'GAMES', 'WORDS'];

export function GameBoard() {
    const [words, setWords] = useState<string[]>(FALLBACK_WORDS);
    const [word, setWord] = useState('');
    const [gameState, setGameState] = useState(initialGameState);
    const [turn, setTurn] = useState<'Player 1' | 'Player 2'>('Player 1');
    const [scores, setScores] = useState(new Map([['Player 1', 0], ['Player 2', 0]]));
    const wordRef = useRef(word);
    const gameStateRef = useRef(gameState);
    const mobile = useMobile();

    useEffect(() => {
        wordRef.current = word;
        gameStateRef.current = gameState;
    }, [word,gameState]);

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
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (gameState.state === 'finished') {
            if (gameState.gameWon) {
                setScores(prev => {
                    const updated = new Map(prev);
                    updated.set(turn, (updated.get(turn) || 0) + POINTS_TABLE[gameState.currentLineIndex - 1]);
                    return updated;
                });
            }
            setTurn(prev => prev === 'Player 1' ? 'Player 2' : 'Player 1');
        }
    }, [gameState.state]);

    const handleKeyDown = (event: KeyboardEvent) => {
        const word = wordRef.current;
        const gameState = gameStateRef.current;
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

    const resetGame = useCallback(() => {
        setGameState(initialGameState);
        setWord(words[Math.floor(Math.random() * words.length)]);
    }, [words]);

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


    return (
        <main className="flex flex-1 flex-col justify-center items-center p-4 gap-2">
            <div className="flex gap-2 mb-10">
                <Button className="p-6" variant="outline">Player 1: {scores.get('Player 1')}</Button>
                <Button className="p-6" variant="outline">Player 2: {scores.get('Player 2')}</Button>
            </div>
            <Grid lines={gameState.lines} correctWord={word} currentLineIndex={gameState.currentLineIndex}/>
            {gameState.gameWon && (
                <>
                    <div className="text-lg">You guessed it! Wanna try {turn}???</div>
                    <Button onClick={resetGame}>
                        <RefreshCcw/>New game
                    </Button>
                </>
            )}
            {mobile && <Keyboard onKeyPress={(key) => handleKeyDown({key: key} as KeyboardEvent)}/>}
        </main>
    )
}