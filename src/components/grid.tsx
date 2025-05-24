export type Status = 'correct' | 'misplaced' | 'wrong' | 'default';

function Box({letter, status}: { letter: string, status: Status }) {
    const letterStyles = {
        correct: 'bg-green-500 text-white',
        misplaced: 'bg-yellow-500 text-white',
        wrong: 'bg-gray-300 text-black',
        default: ''
    };
    return (
        <div
            className={`flex justify-center items-center w-14 h-14 p-1 border dark:border-white border-black rounded ${letterStyles[status]}`}>
            <span className="capitalize">{letter}</span>
        </div>
    )
}

function Line({letters, correctWord, submitted}: { letters: string[], correctWord: string, submitted: boolean }) {
    const getStatus = (letter: string, index: number): Status => {
        if (!submitted || letter === '') return 'default';
        if (letter === correctWord[index]) return 'correct';
        if (correctWord.includes(letter)) return 'misplaced';
        return 'wrong';
    };

    return (
        <div className="flex justify-center items-center gap-2 mb-2">
            {letters.map((letter, index) => (
                <Box key={index} letter={letter} correctCharacter={correctWord[index]}
                     status={getStatus(letter, index)}/>
            ))}
        </div>
    )
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
    )
}

export {Box, Line, Grid};

