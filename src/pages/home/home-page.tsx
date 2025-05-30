import {Button} from "../../components/ui/button.tsx";
import {CirclePlay, Handshake} from "lucide-react";
import {Link} from "react-router";

export default function HomePage() {

    return (
        <div className="flex flex-col justify-center items-center gap-4">
            <h1 className="text-3xl font-bold">Welcome to Wordle!</h1>
            <p className="text-lg">Try to guess the word in 6 attempts.</p>
            <div className="flex justify-between items-center gap-2">
                <Button asChild variant="outline">
                    <Link to={'/game?mode=single'}><CirclePlay/>Start game</Link>
                </Button>
                <Button asChild variant="outline">
                    <Link to={'/game?mode=multi'}><Handshake/>Play with your friends</Link>
                </Button>
            </div>
        </div>
    );
}