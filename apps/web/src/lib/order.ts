export const getUserAddressess = async (userId: number) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}users/userAddress/${userId}`, {next: {revalidate: 1}})
    const { status, data } = await res.json()

    return data
}

export const postOrder = async (
    userId: number, 
    totalAmount: number, 
    shippingCost: number, 
    addressId: number,
    storeId: number,
    methodPayment: 'Transfer' | 'Gateway') => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}order/neworder`, {
            method:'POST',
            body: JSON.stringify({userId, totalAmount, shippingCost, addressId, methodPayment, storeId}),
            headers: {
                "Content-type":"application/json"
            }
        })
        
        const { status, order, msg } = await res.json()
        console.log({status, msg});
        
        return {status, order, msg }
    }

export const getMidtransToken = async (userId: number, orderId: number) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}order/user/${userId}/order/${orderId}`)
    const { status, msg } = await res.json()
    if(status === 'ok') {
        return msg.Payment.token
    }
    return msg
}

export const getMidtransStatus = async (orderId: number) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}order/gateway/status/${orderId}`, {cache: "no-cache"})
    const { status, midtrans }:{status: 'ok' | 'NOT_FOUND' ,midtrans: 'pending' | 'expire' | 'settlement' | null, error:string} = await res.json()
    
    // status = NOT_FOUND || ok, midtrans = 'pending' | 'expire' | 'settlement' | null    
    return {status , midtrans}
}
export const getOrderPendingPayment = async (userId: number) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}order/pending/${userId}`, { next: { revalidate: 1 } })
    
    const { status, msg, order } = await res.json()
    if(msg === 'FOUND') {
        return order
    } else {
        return false
    }
}

export const getUserOrders = async (userId: number) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}order/user/${userId}`, { next: { revalidate: 1 } })
    const { status, msg, order } = await res.json()
    return { status, msg, order }
}
export const getStoreOrders = async (userId: number) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}order/store/${userId}`, { next: { revalidate: 1 } })
    const { status, msg, order } = await res.json()
    return { status, msg, order }
}
export const cancelOrder = async (orderId: number) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}order/cancel`, {
        method:'PATCH',
        body: JSON.stringify({orderId}),
        headers: {
            "Content-type":"application/json"
        }
    })

    const { status, msg, error } = await res.json()
    
    return { status, msg, error }
}

export const uploadPaymentProof = async (values: any, orderId: number) => {
    const formData = new FormData();
    formData.append('orderId', `${orderId}`)
    formData.append('paymentProof', values.paymentProof)
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}order/paymentProof`, {
        method: 'PATCH',
        body: formData,
    })

    const { status, msg } = await res.json()

    return { status, msg }
}