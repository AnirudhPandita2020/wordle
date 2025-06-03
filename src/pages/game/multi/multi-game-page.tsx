import useWebSocket from "react-use-websocket";
import {useEffect, useState} from "react";
import {toast} from "sonner";
import {Navigate, useNavigate, useParams, useSearchParams} from "react-router";
import {GameBoard,ScoreState} from "../../../components/game/game-board.tsx";
import {Copy} from "lucide-react";
import {Button} from "../../../components/ui/button.tsx";
import {Loader} from "../../../components/ui/loader.tsx";

type Player = {
    id: string;
    name: string;
    score: number;
    currentRound: number;
};

type Game = {
    maxRounds: number;
    maxPlayers: number;
    players: { [sessionId: string]: Player };
    completedPlayers: Player[]
};

type WaitingRoomProps = {
    players: { [id: string]: Player };
    maxPlayers: number;
    roomID: string;
};

const SOCKET_URL = import.meta.env.VITE_WORDLE_SOCKET_BASE_URL as string;

function WaitingRoom({players, maxPlayers, roomID}: WaitingRoomProps) {
    const joinedPlayers = Object.values(players);
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(roomID);
            toast.success("Room ID copied!");
        } catch {
            toast.error("Failed to copy Room ID");
        }
    };

    return (
        <div className="shadow-lg rounded-lg p-6 text-center w-full border border-gray-200 p-4">
            <h2 className="text-xl font-bold dark:text-white text-gray-800 mb-2">
                🕺 Waiting for the squad to join...
            </h2>
            <div className="mb-6 flex justify-center items-center gap-2">
                <span
                    className="font-mono font-semibold bg-gray-100 px-4 py-2 rounded text-sm text-gray-800 border border-gray-300">
                    Room ID: {roomID}
                </span>
                <Button onClick={handleCopy} variant={'outline'} size={'icon'} title="Copy Room ID">
                    <Copy className="h-4 w-4 text-gray-600"/>
                </Button>
            </div>
            <p className="text-gray-600 mb-4 text-sm">
                🎮 {joinedPlayers.length} / {maxPlayers} players in the groove
            </p>
            <ul className="grid grid-cols-1 gap-2">
                {joinedPlayers.map((player) => (
                    <li
                        key={player.id}
                        className="bg-blue-50 text-blue-800 font-medium py-2 px-4 rounded border border-blue-200 shadow-sm"
                    >
                        {player.name}
                    </li>
                ))}
            </ul>

            <div className="mt-6 text-sm text-gray-500">
                Spinning the vinyl... waiting for others to boogie in 🪩
            </div>
        </div>
    );
}

function Leaderboard({players}: { players: Player[] }) {
    const navigate = useNavigate();
    const sorted = players.sort((a, b) => b.score - a.score);

    const getMedal = (rank: number) => {
        if (rank === 0) return "🥇";
        if (rank === 1) return "🥈";
        if (rank === 2) return "🥉";
        return `${rank + 1}.`;
    };

    return (
        <div className="w-full max-w-xl mx-auto p-6 border border-gray-200 rounded-xl shadow-sm mt-12">
            <h2 className="text-2xl font-semibold text-center mb-6">
                Leaderboard
            </h2>
            <ul className="space-y-2">
                {sorted.map((player, index) => (
                    <li
                        key={player.id}
                        className={`flex justify-between items-center px-4 py-3 rounded-lg border ${
                            index === 0
                                ? "border-gray-300"
                                : "border-gray-200"
                        }`}
                    >
                        <div className="flex items-center gap-3 text-gray-800 text-sm">
                            <span className="text-lg">{getMedal(index)}</span>
                            <span className="dark:text-white">{player.name}</span>
                        </div>
                        <span className="dark:text-white text-sm font-mono">
                            {player.score} pts
                        </span>
                    </li>
                ))}
            </ul>

            <div className="flex justify-center mt-8">
                <Button
                    onClick={() => navigate("/game?mode=multi")}
                    className="text-sm px-5 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50 transition"
                >
                    ← Back to Game Lobby
                </Button>
            </div>
        </div>
    );
}


export default function MultiGamePage() {
    const {roomID} = useParams();
    const [params] = useSearchParams();
    const [sessionID, setSessionID] = useState('');
    const [leaderboard, setLeaderboard] = useState(false);
    const [game, setGame] = useState<Game | null>(null);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState(false);
    const [startGame, setStartGame] = useState(false);
    const playerName = params.get("playerName");
    const [countdown, setCountdown] = useState(5);
    const navigate = useNavigate();
    const {sendMessage, lastJsonMessage} = useWebSocket(
        roomID && playerName
            ? `${SOCKET_URL}/wordle?roomID=${roomID}&playerName=${encodeURIComponent(playerName)}`
            : null,
        {
            onOpen: () => setConnected(true),
            onClose: () => setConnected(false),
            onError: () => {
                toast.error("Network error. Redirecting...");
                setError(true);
            },
            shouldReconnect: () => true,
        }
    );

    useEffect(() => {
        if (game && Object.keys(game.players).length === game.maxPlayers && !startGame) {
            setCountdown(5);
            const countdownInterval = setInterval(() => {
                setCountdown(prev => {
                    if (prev === 1) {
                        clearInterval(countdownInterval);
                        setStartGame(true);
                        sendMessage(
                            JSON.stringify({
                                type: "START_GAME",
                            })
                        );
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(countdownInterval);
        }
    }, [game, startGame]);


    useEffect(() => {
        if (!lastJsonMessage) return;

        const {playerID, type, name, game: gameData} = lastJsonMessage;
        switch (type) {
            case "PLAYER_SET":
                setGame(gameData);
                setSessionID(playerID);
                break;
            case "PLAYER_JOINED":
                setGame(gameData);
                toast(`🎉 ${name} just slid into the game!`);
                break;

            case "PLAYER_MOVED_FORWARD":
                toast(`🚀 ${name} is zooming to the next round!`);
                break;

            case "SCORE_UPDATED":
                toast.success("💃 Woohoo! You're groovin' into the next round!");
                const isPlayerCompleted = gameData?.completedPlayers?.findIndex(player => player.id === sessionID);
                if (isPlayerCompleted !== -1) {
                    setLeaderboard(true);
                }
                setGame(gameData);
                break;
            case "PLAYER_LEFT":
                toast(`👋 ${name} moon-walked out of the game.`);
                setGame(gameData);
                break;
            case "GAME_COMPLETED":
                toast("🎊 Game over! Time to count those funky points!");
                setGame(gameData);
                setLeaderboard(true);
                break;

            case "ERROR":
                toast.error("😵 Oops! Couldn't join this jam session. Try a different room?");
                setError(true);
                break;

            case "GAME_IN_PROGRESS":
                toast.error("🚫 Game’s already rollin’ — no late entries! Catch the next round 😎");
                navigate("/game?mode=multi");
                break;

            case "GAME_OVER":
                toast.error("🎮 Game over, man! This room’s seen its final word. Time to start fresh!");
                navigate("/game?mode=multi");
                break;

            default:
                console.warn("Unhandled WebSocket message type:", type);
        }
    }, [lastJsonMessage]);

    if (error) {
        return <Navigate to={"/game?mode=multi"}/>;
    }

    return (
        <>
            {!connected ? (
                <div className="flex justify-center items-center gap-2">
                    <Loader/>
                </div>
            ) : game ? (
                leaderboard ? (
                    <Leaderboard players={game.completedPlayers}/>
                ) : Object.keys(game.players).length < game.maxPlayers ? (
                    <div className="flex justify-center items-center">
                        <WaitingRoom
                            players={game.players}
                            maxPlayers={game.maxPlayers}
                            roomID={roomID}
                        />
                    </div>
                ) : !startGame ? (
                    <div className="text-center mt-10">
                        <p className="text-lg font-bold mb-2">🎬 Get ready to boogie!</p>
                        <p className="text-3xl font-mono text-blue-600">{countdown}</p>
                    </div>
                ) : (
                    <GameBoard
                        isMulti={true}
                        onRoundCompleted={(scoreState: ScoreState, word: string) => {
                            if (scoreState.scoreType === 'lost') {
                                toast.error(`🎉 Oops! Guess was: ${word} Zero points... better luck next round! 😅`);
                                return;
                            }
                            sendMessage(
                                JSON.stringify({
                                    type: "INCREMENT_SCORE",
                                    roomID,
                                    playerName,
                                    score: scoreState.score
                                })
                            );
                        }
                    />
                )
            ) : (
                <p>Waiting for game state...</p>
            )}

        </>
    );

}
