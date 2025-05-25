import './App.css'
import Header from "./components/header.tsx";
import {ThemeProvider} from "./providers/theme-provider.tsx";
import {GameBoard} from "./components/game/game-board.tsx";

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <div className="flex flex-col h-screen">
                <Header/>
                <GameBoard/>
            </div>
        </ThemeProvider>
    );
}

export default App
