import './App.css'
import Header from "./components/header.tsx";
import {ThemeProvider} from "./providers/theme-provider.tsx";
import {GameBoard} from "./components/game/game-board.tsx";
import {KeyStrokeProvider} from "./providers/key-stroke-provider.tsx";

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <KeyStrokeProvider>
                <div className="flex flex-col h-screen">
                    <Header/>
                    <GameBoard/>
                </div>
            </KeyStrokeProvider>
        </ThemeProvider>
    );
}

export default App
