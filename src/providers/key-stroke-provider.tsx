import type {Status} from "../components/game/grid.tsx";
import type {ReactNode} from "react";
import {createContext, useContext, useState} from "react";

type KeyStrokeProviderProps = {
    children: ReactNode;
}

type KeyStrokeProviderState = {
    keyStroke: Record<string, Status>;
    setKeyStatus: (key: string, status: Status) => void;
}

const initialState: KeyStrokeProviderState = {
    keyStroke: {},
    setKeyStatus: () => null
}

const KeyStrokeProviderContext = createContext<KeyStrokeProviderState>(initialState);

export function KeyStrokeProvider({children}: KeyStrokeProviderProps) {
    const [keyStroke, setKeyStroke] = useState<Record<string, Status>>({});
    const setKeyStatus = (key: string, status: Status) => {
        setKeyStroke(prev => ({...prev, [key]: status}));
    };
    const value = {keyStroke, setKeyStatus};
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
