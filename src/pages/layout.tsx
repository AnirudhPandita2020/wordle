import Header from "../components/header.tsx";
import {Outlet} from "react-router";
import {Toaster} from "../components/ui/sonner.tsx";
import useMobile from "../hooks/use-mobile.tsx";

export default function RootLayout() {
    const mobile = useMobile();
    return (
        <div className="flex flex-col h-screen">
            <Header/>
            <main className="flex flex-1 flex-col justify-center items-center p-4 gap-2">
                <Outlet/>
            </main>
            <Toaster position={mobile ? 'top-center' : 'bottom-right'}/>
        </div>
    );
}