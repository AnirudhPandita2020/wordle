import {Button} from "../ui/button.tsx";
import {letterStyles} from "../game/grid.tsx";
import {useKeyStroke} from "../../providers/key-stroke-provider.tsx";

const KEYS = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace'],
];

type KeyboardProp = {
    onKeyPress: (key: string) => void;
};

export default function Keyboard({onKeyPress}: KeyboardProp) {
    const {keyStroke} = useKeyStroke();
    return (
        <div className="flex flex-col items-center gap-2 mt-4 w-full overflow-x-auto px-2">
            {KEYS.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-2 w-full">
                    {row.map((key) => {
                        return (
                            <Button
                                key={key}
                                onClick={() => onKeyPress(key)}
                                className={`
                                            flex-1 min-w-[25px] max-w-[50px]
                                            capitalize px-2 py-2 text-sm font-medium rounded transition-all text-center
                                            bg-gray-200 text-black hover:bg-gray-300
                                            ${letterStyles[keyStroke[key.toUpperCase()]] || 'dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'}
                                `}
                            >
                                {key === 'Backspace' ? '←' : key === 'Enter' ? '↵' : key}
                            </Button>
                        );

                    })}
                </div>
            ))}
        </div>
    );
}
