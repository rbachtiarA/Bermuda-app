import { IRegEmail } from "@/type/user";
const base_url = "http://localhost:8000/api"

export const  regUser = async (data: IRegEmail) => {
    const res = await fetch(`${base_url}/users/register`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    })
    const result = await res.json()
    return { result, ok: res.ok }
}

export const verifyUser = async (data: { token: string; password: string; name: string } ) => {
    const res = await fetch(`${base_url}/users/data-register`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    })
    const result = await res.json()
    return { result, ok: res.ok }
}

export const loginUser = async (data: { email: string; password: string}) => {
    console.log('Data yang dikirim ke API:', data);
    const res = await fetch(`${base_url}/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    const result = await res.json();
    console.log('Response dari API:', result);
    return { result, ok: res.ok}
}


