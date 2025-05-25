// noinspection TypeScriptValidateTypes

import type {Status} from "../components/game/grid.tsx";
import type {ReactNode} from "react";
import {createContext, useContext, useState} from "react";

type KeyStrokeProviderProps = {
    children: ReactNode;
}

type KeyStrokeProviderState = {
    keyStroke: { [p: string]: Status };
    setKeyStatus: (key: string, status: Status) => void;
    resetKeyStroke: () => void;
}

const initialState: KeyStrokeProviderState = {
    keyStroke: {},
    setKeyStatus: () => null,
    resetKeyStroke: () => null
}

const KeyStrokeProviderContext = createContext<KeyStrokeProviderState>(initialState);

export function KeyStrokeProvider({children}: KeyStrokeProviderProps) {
    const [keyStroke, setKeyStroke] = useState<{ [p: string]: Status }>({});

    const setKeyStatus = (key: string, status: Status) => {
        setKeyStroke((prev) => {
            if (prev[key] === 'correct') return prev;
            return {...prev, [key]: status};
        });
    };

    const resetKeyStroke = () => setKeyStroke({});

    const value = {keyStroke, setKeyStatus, resetKeyStroke};
    return (
        <KeyStrokeProviderContext.Provider value={value}>
            {children}
        </KeyStrokeProviderContext.Provider>
    );
}

export const useKeyStroke = () => {
    const context = useContext(KeyStrokeProviderContext);
    if (!context) {
        throw new Error("useKeyStroke must be used within a KeyStrokeProvider");
    }
    return context;
}
