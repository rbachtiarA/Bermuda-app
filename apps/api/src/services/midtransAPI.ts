interface parameters {
    transaction_details: {
        order_id: string,
        gross_amount: number
    },
    customer_details: {
        first_name: string
    },
    expiry: {
        start_time: string,
        unit: string,
        duration: number
    }
}
interface resultCreate {
    token: string,
    redirect_url: string,
    error_messages: string[]
}

interface ResponsePostCreateMidtransAPI {
    token: string,
    redirect_url: string
}

interface resultStatus {
    status_code: string, //401,404,201
    status_message: string,
    transaction_status: string,
}

interface ResponseMidtransAPI {
    code: number
    status: string 
    msg: string
    data: string
}

export async function createMidtransTransaction(parameters: parameters): Promise<ResponsePostCreateMidtransAPI> {
    try {
        if(!process.env.SERVER_KEY_MIDTRANS) throw 'Please insert midtrans key'
        const midtransTransaction = await fetch(
            `https://app.sandbox.midtrans.com/snap/v1/transactions`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'Authorization': `Basic ${Buffer.from(process.env.SERVER_KEY_MIDTRANS).toString('base64')}` 
                },
                body: JSON.stringify(parameters)
            }
        )
        const res: resultCreate = await midtransTransaction.json()
                
        if(!midtransTransaction.ok) throw res.error_messages[0]

        return {
            token: res.token,
            redirect_url: res.redirect_url
        }
    } catch (error) {
        throw error
    }
}

export async function getStatusMidtransAPI(order_name: string): Promise<ResponseMidtransAPI> {
    try {
        if(!process.env.SERVER_KEY_MIDTRANS) throw 'Please insert midtrans key'
        const midtransOrder = await fetch(
            `https://api.sandbox.midtrans.com/v2/${order_name}/status`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'Authorization': `Basic ${Buffer.from(process.env.SERVER_KEY_MIDTRANS).toString('base64')}`
                }
            }
        )
        const res: resultStatus = await midtransOrder.json()
        if(res.status_code === '401') throw {code: 401 ,status: 'error', msg:'Midtrans authorization failed'}
        if(res.status_code === '404') throw {code: 404 ,status: 'error', msg:'You need to select your transaction service first'}
        return {code: 201, status: 'ok', msg: 'Transaction found', data: res.transaction_status}
    } catch (error) {
        return error as ResponseMidtransAPI
    }
}

export async function postCancelMidtransAPI(order_name: string): Promise<ResponseMidtransAPI> {
    try {
        if(!process.env.SERVER_KEY_MIDTRANS) throw 'Please insert midtrans key'
        const midtransOrder = await fetch(
            `https://api.sandbox.midtrans.com/v2/${order_name}/cancel`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'Authorization': `Basic ${Buffer.from(process.env.SERVER_KEY_MIDTRANS).toString('base64')}`
                }
            }
        )
        const res: resultStatus = await midtransOrder.json()
        console.log(res);
        
        if(res.status_code === '401') throw {code: 401 ,status: 'error', msg:'Midtrans authorization failed'}
        if(res.status_code === '404') throw {code: 404 ,status: 'error', msg:'Choose midtrans services first'}
        if(res.status_code === '412') throw {code: 412 ,status: 'error', msg:'Transaction already paid. please click \'Check status\' to confirm payment'}
        return {code: 201, status: 'ok', msg: 'Success cancel transaction', data: res.transaction_status}
    } catch (error) {
        return error as ResponseMidtransAPI
    }
}