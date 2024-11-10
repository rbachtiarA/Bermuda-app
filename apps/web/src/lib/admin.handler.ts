import { getToken } from "./server"

export const denyPaymentOrder = async (orderId: number) => {
    const token = await getToken()
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}admin/denypayment`, {
        method:'PATCH',
        body: JSON.stringify({orderId}),
        headers: {
            "Content-type":"application/json",
            'Authorization': `Bearer ${token}`
        }
    })

    const { status, msg } = await res.json()
    
    return { status, msg }
}

export const acceptPaymentOrder = async (orderId: number) => {
    const token = await getToken()
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}admin/acceptpayment`, {
        method:'PATCH',
        body: JSON.stringify({orderId}),
        headers: {
            "Content-type":"application/json",
            'Authorization': `Bearer ${token}`
        }
    })

    const { status, msg } = await res.json()
    
    return { status, msg }
}

export const canceledOrder = async (orderId: number) => {
    const token = await getToken()
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}admin/cancelorder`, {
        method:'PATCH',
        body: JSON.stringify({orderId}),
        headers: {
            "Content-type":"application/json",
            'Authorization': `Bearer ${token}`
        }
    })

    const { status, msg } = await res.json()
    
    return { status, msg }
}
export const shippedOrder = async (orderId: number) => {
    const token = await getToken()
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}admin/shiporder`, {
        method:'PATCH',
        body: JSON.stringify({orderId}),
        headers: {
            "Content-type":"application/json",
            'Authorization': `Bearer ${token}`
        }
    })

    const { status, msg } = await res.json()
    
    return { status, msg }
}