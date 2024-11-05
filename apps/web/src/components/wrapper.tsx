import { ReactNode } from "react";

export default function Wrapper({ children}: { children: ReactNode}) {
    return (
        <div className="flex flex-wrap justify-center items-center container mx-4">
            {children}
        </div>
    )
}