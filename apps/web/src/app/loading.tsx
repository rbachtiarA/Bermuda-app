import { Spinner } from "@nextui-org/react";

export default function LoadingSpinner() {
    return (
        <div className="w-full h-[500px] max-h-screen flex items-center justify-center">
            <Spinner />
        </div>
    )
}