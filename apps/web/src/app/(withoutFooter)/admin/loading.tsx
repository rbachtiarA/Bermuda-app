import { Spinner } from "@nextui-org/react";

export default function LoadingAdminDashboard() {
    return (
        <div className="w-full h-[500px] max-h-screen my-auto flex justify-center items-center">
            <Spinner size="lg"/>
        </div>
    )
}