const base_url = "http://localhost:8000/api"

export const handleGoogleCallback = async (code: string) => {
    try {
        console.log('Sending code to backend:', code); // debugging
      const res = await fetch(`${base_url}/auth/google/callback`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ code }),
    })
    const data = await res.json();
    console.log('Response from backend:', data); //debugging
    if (!res.ok) {
        throw new Error(data.message || 'Failed to login with google')
    }
    return data  
    } catch (err) {
        console.error('Error during Google OAuth callback:', err)
        throw err
    }
    
}