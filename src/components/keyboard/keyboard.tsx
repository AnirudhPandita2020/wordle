import {Button} from "../ui/button.tsx";

const KEYS = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace'],
];

export default function Keyboard({ onKeyPress }: { onKeyPress: (key: string) => void }) {
    return (
        <div className="flex flex-col items-center gap-2 mt-4 w-full overflow-x-auto px-2">
            {KEYS.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-2 w-full">
                    {row.map((key) => (
                        <Button
                            key={key}
                            variant="outline"
                            onClick={() => onKeyPress(key)}
                            className="flex-1 min-w-[25px] max-w-[50px] capitalize px-2 py-2 text-sm font-medium rounded bg-gray-300 hover:bg-gray-400 active:bg-gray-500 transition-all text-center">
                            {key === 'Backspace' ? '←' : key === 'Enter' ? '↵' : key}
                        </Button>
                    ))}
                </div>
            ))}
        </div>
    );
}
