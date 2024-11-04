'use client'
import { handleGoogleCallback } from "@/lib/auth.handler";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function GoogleCallback() {
 const router = useRouter();
 const searchParams = useSearchParams()

 useEffect(() => {
    const code = searchParams.get('code')

    if (code) {
        handleGoogleCallback(code)
        .then((data) => {
            console.log('Callback Response:', data);
            if (data.ok) {
                router.push('/')
            } else {
                console.error(data.message)
            }
        })
        .catch((error) => {
            console.error('Error during Google OAuth Callback:', error)
        })
    }
 }, [searchParams, router])

 return (
    <div>
        <h1>Logging in with Google...</h1>
    </div>
 )
}