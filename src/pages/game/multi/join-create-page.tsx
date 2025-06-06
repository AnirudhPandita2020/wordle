// noinspection TypeScriptValidateTypes

import {Input} from "../../../components/ui/input";
import {Button} from "../../../components/ui/button";
import {ArrowRight, Plus} from "lucide-react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "../../../components/ui/card";
import {Separator} from "../../../components/ui/separator";
import useMobile from "../../../hooks/use-mobile";
import {useMutation} from "@tanstack/react-query";
import {useEffect, useState} from "react";
import {toast} from "sonner";
import {Loader} from "../../../components/ui/loader.tsx";
import {useNavigate} from "react-router";
import {useKeyStroke} from "../../../providers/key-stroke-provider.tsx";

const BASE_URL = import.meta.env.VITE_WORDLE_BE_BASE_URL as string;

export default function JoinOrCreateGameCard() {
    const {resetKeyStroke} = useKeyStroke();
    const mobile = useMobile();
    const [maxRounds, setMaxRounds] = useState(4);
    const [maxPlayers, setMaxPlayers] = useState(2);
    const [playerName, setPlayerName] = useState('');
    const [gameCode, setGameCode] = useState('');
    const navigate = useNavigate();
    const {mutateAsync: roomMutation, isPending} = useMutation({
        mutationFn: async (roomDetails) => {
            const response = await fetch(`${BASE_URL}/api/v1/room?maxRounds=${roomDetails['maxRounds']}&maxPlayers=${roomDetails['maxPlayers']}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return await response.json();
        },
    });

    //If players navigate or leave the game, reset the keys selected
    useEffect(resetKeyStroke, []);

    const handleRoomCreation = () => {
        if (maxPlayers < 2 || maxRounds < 4) {
            toast.error('A minimum of 2 players or minimum of 4 rounds is required');
            return;
        }
        toast.promise(
            roomMutation({
                maxRounds: maxRounds,
                maxPlayers: maxPlayers
            }), {
                loading: 'Creating room...',
                success: (data) => {
                    navigate(`/room/${data['roomID']}?playerName=${playerName}`);
                    return `Created Room: ${data['roomID']}`;
                },
                error: () => `Something went wrong while creating room!!!`,
                closeButton: true
            });
    };

    const handleJoinRoom = () => {
        if (!gameCode || !playerName) {
            toast.error('Please enter a valid game code and player name');
            return;
        }
        if (gameCode.trim().length < 6) {
            toast.error('Game code must be at least 6 characters long');
            return;
        }
        if (playerName.trim().length < 4) {
            toast.error('Player name must be at least 4 characters long');
            return;
        }
        navigate(`/room/${gameCode}?playerName=${playerName}`);
    };

    return (
        <div className={`flex gap-4 ${mobile ? "flex-col items-center" : "flex-row"}`}>
            <Card className="w-[350px] bg-muted">
                <CardHeader>
                    <CardTitle>Join a Room</CardTitle>
                    <CardDescription>
                        Have a code? Enter it below to join your friends!
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-3">
                        <Input placeholder="Player name..." value={playerName}
                               onChange={(event) => setPlayerName(event.target.value)}/>
                        <Input placeholder="Enter game code" value={gameCode}
                               onChange={(event) => setGameCode(event.target.value)}/>
                        <Button disabled={!playerName || !gameCode} onClick={handleJoinRoom}>
                            <ArrowRight className="mr-2 h-4 w-4"/>
                            Join Room
                        </Button>
                    </div>
                </CardContent>
            </Card>


            {!mobile ? (
                <Separator orientation="vertical" className="h-auto bg-border mx-2"/>
            ) : <Separator orientation="horizontal" className="h-auto bg-border mx-2"/>}

            <Card className="w-[350px] bg-muted">
                <CardHeader>
                    <CardTitle>Create a Room</CardTitle>
                    <CardDescription>
                        Start a game and invite your friends with the room code.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-3">
                        <Input placeholder="Player name..." value={playerName}
                               onChange={(event) => setPlayerName(event.target.value)}/>
                        <Input min={2} max={6} type="number"
                               onChange={(event) => setMaxPlayers(event.target.valueAsNumber)}
                               placeholder="Max players (e.g. 4)"/>
                        <Input min={4} max={10} type="number"
                               onChange={(event) => setMaxRounds(event.target.valueAsNumber)}
                               placeholder="Max rounds (e.g. 5)"/>
                        <Button onClick={handleRoomCreation}
                                disabled={(!playerName || !maxRounds || !maxPlayers) || isPending}>
                            {!isPending ? <Plus className="mr-2 h-4 w-4"/> : <Loader/>}
                            Create Room
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
