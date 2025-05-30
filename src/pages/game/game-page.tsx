import {Navigate, useSearchParams} from "react-router";
import {GameBoard} from "../../components/game/game-board.tsx";
import JoinOrCreateGameCard from "./multi/join-create-page.tsx";

export function GamePage() {
    const [params] = useSearchParams();
    if (params.get('mode') === 'single') {
        return <GameBoard isMulti={false}/>;
    } else if (params.get('mode') === 'multi') {
        return <JoinOrCreateGameCard/>;
    } else {
        return <Navigate to={'/'}/>
    }
}