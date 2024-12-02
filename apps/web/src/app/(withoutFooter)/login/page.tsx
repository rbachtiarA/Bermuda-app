import LoginForm from "@/components/form/loginForm";
import { getToken } from "@/lib/server";
import { redirect } from "next/navigation";

export default async function LoginPage() {
    const token = await getToken()
    if(token) redirect('/')
    return (
        <LoginForm />
    )
}