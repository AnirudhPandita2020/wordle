import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger} from "./ui/dialog.tsx";
import {Button} from "./ui/button.tsx";
import {Info} from "lucide-react";
import type {Status} from "./game/grid.tsx";
import {Box} from "./game/grid.tsx";

type LegendTypes = {
    state: Status;
    message: string;
}

const LEGENDS: LegendTypes[] = [
    {state: 'correct', message: '🎯 Bang on!'},
    {state: 'misplaced', message: '🤔 Right vibe, wrong spot.'},
    {state: 'wrong', message: '🚫 Nada!'},
    {state: 'default', message: '🕵️ Waiting...'}
];

export default function Information() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size='icon' variant="outline">
                    <Info/>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>How to Play</DialogTitle>
                    <DialogDescription>
                        Challenge your friend or test yourself! You have 6 tries to guess the 5-letter word.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <p className="text-sm text-muted-foreground">
                        Each guess must be a valid 5-letter word. The color of each box will tell you how close you are.
                    </p>
                    {LEGENDS.map((legend, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <Box letter={'A'} status={legend.state}/>
                            <span className="text-sm">{legend.message}</span>
                        </div>
                    ))}
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                    🔁 Take turns guessing.
                    👀 Try to outsmart your opponent.
                    🧠 First to guess it right—or get the furthest—wins!
                </div>
            </DialogContent>
        </Dialog>
    );
}