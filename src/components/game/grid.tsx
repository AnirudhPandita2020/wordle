import {useKeyStroke} from "../../providers/key-stroke-provider.tsx";
import {useEffect} from "react";

type Status = 'correct' | 'misplaced' | 'wrong' | 'default';

export const letterStyles = {
    correct: 'bg-green-500 text-white',
    misplaced: 'bg-yellow-500 text-white',
    wrong: 'bg-gray-800 text-white',
    default: ''
};

const getStatus = (letter: string, index: number, submitted: boolean, correctWord: string): Status => {
    if (!submitted || letter === '') return 'default';
    if (letter === correctWord[index]) return 'correct';
    if (correctWord.includes(letter)) return 'misplaced';
    return 'wrong';
}

function Box({letter, status}: { letter: string, status: Status }) {
    const {setKeyStatus} = useKeyStroke();
    useEffect(() => {
        if (status !== 'default' && letter !== '') {
            setKeyStatus(letter, status);
        }
    }, [letter, status]);
    return (
        <div className={`flex justify-center items-center w-14 h-14 p-1 border dark:border-white border-black rounded ${letterStyles[status]}`}>
            <span className="capitalize">{letter}</span>
        </div>
    );
}

function Line({letters, correctWord, submitted}: { letters: string[], correctWord: string, submitted: boolean }) {
    return (
        <div className="flex justify-center items-center gap-2 mb-2">
            {letters.map((letter, index) => (
                <Box key={index} letter={letter} correctCharacter={correctWord[index]}
                     status={getStatus(letter, index, submitted, correctWord)}/>
            ))}
        </div>
    );
}

function Grid({lines, correctWord, currentLineIndex}: {
    lines: string[][],
    correctWord: string,
    currentLineIndex: number
}) {
    return (
        <div className="flex flex-col justify-center items-center">
            {lines.map((letters, index) => (
                <Line key={index} letters={letters} correctWord={correctWord} submitted={index < currentLineIndex}/>
            ))}
        </div>
    );
}

export {Box, Line, Grid, Status};

