// noinspection TypeScriptValidateTypes

import './App.css'
import {ThemeProvider} from "./providers/theme-provider.tsx";
import {KeyStrokeProvider} from "./providers/key-stroke-provider.tsx";
import {createBrowserRouter, Navigate, RouterProvider} from "react-router";
import RootLayout from "./pages/layout.tsx";
import HomePage from "./pages/home/home-page.tsx";
import {GamePage} from "./pages/game/game-page.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import MultiGamePage from "./pages/game/multi/multi-game-page.tsx";


const router = createBrowserRouter([
    {
        element: <RootLayout/>,
        children: [
            {
                index: true,
                element: <HomePage/>
            },
            {
                path: '/game',
                element: <GamePage/>
            },
            {
                path: '/room/:roomID',
                element: <MultiGamePage/>
            }
        ],
        errorElement: <Navigate to={'/'}/>,
    }
]);


const queryClient = new QueryClient();


function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <KeyStrokeProvider>
                    <RouterProvider router={router}/>
                </KeyStrokeProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export default App;
