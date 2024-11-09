export const denyPaymentOrder = async (orderId: number, userId: number) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}admin/denypayment`, {
        method:'PATCH',
        body: JSON.stringify({orderId, userId}),
        headers: {
            "Content-type":"application/json"
        }
    })

    const { status, msg } = await res.json()
    
    return { status, msg }
}

export const acceptPaymentOrder = async (orderId: number, userId: number) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}admin/acceptpayment`, {
        method:'PATCH',
        body: JSON.stringify({orderId, userId}),
        headers: {
            "Content-type":"application/json"
        }
    })

    const { status, msg } = await res.json()
    
    return { status, msg }
}

export const canceledOrder = async (orderId: number, userId: number) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}admin/cancelorder`, {
        method:'PATCH',
        body: JSON.stringify({orderId, userId}),
        headers: {
            "Content-type":"application/json"
        }
    })

    const { status, msg } = await res.json()
    
    return { status, msg }
}
export const shippedOrder = async (orderId: number, userId: number) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}admin/shiporder`, {
        method:'PATCH',
        body: JSON.stringify({orderId, userId}),
        headers: {
            "Content-type":"application/json"
        }
    })

    const { status, msg } = await res.json()
    
    return { status, msg }
}