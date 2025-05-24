import {Info, PenLine} from "lucide-react";
import {ModeToggle} from "./mode-toggle.tsx";
import {Button} from "./ui/button.tsx";
import Information from "./information.tsx";

export default function Header() {
    return (
        <header className="flex justify-between items-center p-7 border-b">
            <div className="flex justify-center items-center p-1 gap-3">
                <PenLine/>
                <span className="font-bold text-xl">Wordle</span>
            </div>
            <div className="flex gap-3 justify-center items-center">
                <Information/>
                <ModeToggle/>
            </div>
        </header>
    );
}