import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger} from "./ui/dialog.tsx";
import {Button} from "./ui/button.tsx";
import {Info} from "lucide-react";
import type {Status} from "./grid.tsx";
import {Box} from "./grid.tsx";

type LegendTypes = {
    state: Status;
    message: string;
}

const LEGENDS: LegendTypes[] = [
    {state: 'correct', message: 'The letter is in the correct position.'},
    {state: 'misplaced', message: 'The letter is in the word but in the wrong position.'},
    {state: 'wrong', message: 'The letter is not in the word.'},
    {state: 'default', message: 'This letter has not been guessed yet.'}
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
                    <DialogTitle>How to play???</DialogTitle>
                    <DialogDescription>
                        You have 6 guesses to determine the correct word. Each guess must be a valid 5-letter word.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {LEGENDS.map((legend, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <Box letter={'A'} status={legend.state}/>
                            <span className="text-sm">{legend.message}</span>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}