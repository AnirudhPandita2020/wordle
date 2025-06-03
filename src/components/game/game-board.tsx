import {Grid} from "./grid.tsx";
import {useCallback, useEffect, useRef, useState} from "react";
import {Button} from "../ui/button.tsx";
import {RefreshCcw} from "lucide-react";
import Keyboard from "../keyboard/keyboard.tsx";
import {useKeyStroke} from "../../providers/key-stroke-provider.tsx";
import {plateLosingSound, playWinningSound} from "../../lib/sound.ts";

type GameState = {
    state: "in-progress" | "finished";
    lines: string[][];
    gameWon: boolean;
    currentLineIndex: number;
};

type ScoreState = {
    score: number;
    scoreType: "lost" | "score-added" | "in-progress"
};

const FALLBACK_WORDS = ['HELLO', 'WORLD', 'REACT', 'HOOKS', 'GAMES', 'WORDS'];
const MAX_GUESSES = 6;
const WORD_LENGTH = 5;

const initialGameState: GameState = {
    state: "in-progress",
    lines: new Array(MAX_GUESSES).fill(null).map(() => new Array(WORD_LENGTH).fill('')),
    gameWon: false,
    currentLineIndex: 0,
};

const initialScoreState: ScoreState = {
    scoreType: "in-progress",
    score: 0
};

const SCORES = [10, 8, 6, 4, 2, 1];

export function GameBoard({isMulti, onRoundCompleted = (_score: number,_word: string) => {}}: { isMulti: boolean, onRoundCompleted?: (score: number,word: string) => void }) {
    const [words, setWords] = useState<string[]>(FALLBACK_WORDS);
    const [word, setWord] = useState('');
    const [gameState, setGameState] = useState(initialGameState);
    const [score, setScore] = useState<ScoreState>(initialScoreState);
    const wordRef = useRef(word);
    const gameStateRef = useRef(gameState);
    const {resetKeyStroke} = useKeyStroke();

    useEffect(() => {
        wordRef.current = word;
        gameStateRef.current = gameState;
    }, [word, gameState]);

    useEffect(() => {
        fetch('/words.json')
            .then(response => response.json())
            .then(data => {
                setWords(data);
                setWord(data[Math.floor(Math.random() * data.length)]);
            })
            .catch(_error => {
                setWords(FALLBACK_WORDS);
                setWord(FALLBACK_WORDS[Math.floor(Math.random() * FALLBACK_WORDS.length)]);
            });
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (gameState.state === 'finished'){
            setScore(prev => {
            if(gameState.gameWon) {
                return {...prev, scoreType: 'score-added', score: SCORES[gameState.currentLineIndex - 1]};
            }
            return {...prev,scoreType: 'lost'};
           }
         );
            gameState.gameWon ? playWinningSound() : plateLosingSound();
            if (!isMulti) {
                return;
            }
            const timer = setTimeout(resetGame, 3000);
            return () => clearTimeout(timer);
        }
    }, [gameState]);

    useEffect(() => {
        if(score.scoreType === 'in-progress') return;
        onRoundCompleted(score,word);
    }, [score]);

    const handleKeyDown = (event: KeyboardEvent) => {
        const word = wordRef.current;
        const gameState = gameStateRef.current;

        if (gameState.state === 'finished') return;
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
        setScore(initialScoreState);
        resetKeyStroke();
    }, [words, resetKeyStroke]);

    return (
        <>
            <Grid lines={gameState.lines} correctWord={word} currentLineIndex={gameState.currentLineIndex}/>
            {gameState.gameWon && (
                <>
                    {!isMulti && <>
                        <div className="text-lg">You guessed it! Wanna try again???</div>
                        <Button onClick={resetGame}>
                            <RefreshCcw/>New Game
                        </Button>
                    </>}
                </>
            )}
            {!isMulti && gameState.state === 'finished' && !gameState.gameWon && (
                <>
                    <div className="text-lg">You lost! The word was: {word}</div>
                    <Button onClick={resetGame}>
                        <RefreshCcw/>New game
                    </Button>
                </>
            )}
            <Keyboard onKeyPress={(key) => handleKeyDown({key: key} as KeyboardEvent)}/>
        </>
    );
}