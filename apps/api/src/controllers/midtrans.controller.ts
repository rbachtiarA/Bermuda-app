import cancelOrder from "@/helpers/cancelOrder";
import { Request, Response } from "express";
import confirmedOrder from "@/helpers/confirmedOrder";
import { getStatusMidtransAPI } from "@/services/midtransAPI";
export class MidtransController {
    // get midtrans transaction status, from 'orderId', 
    //      if order is expired, update order status with 'cancelled', and return all order items quantity to store quantity
    //      if status "settlement" update order status with 'Proccessed' and update payment isConfirmed to true & confirmedAt to date.now()
    async getMidtransStatusAPI(req:Request, res: Response) {
        try {
            const { orderId } = req.params
            const order_name = `${process.env.PREFIX_ORDERNAME_MIDTRANS}${orderId}`
            const response = await getStatusMidtransAPI(order_name) 
            if(response.code !== 201) {
                return res.status(response.code).send({
                    status: response.code === 404? 'NOT_FOUND': 'error', 
                    msg: response.msg
                })
            }
            
            if(response.data === 'settlement') {
                await confirmedOrder(Number(orderId))
            }

            if(response.data === 'expire') {
                await cancelOrder(Number(orderId))
            }

            return res.status(201).send({
                status: 'ok',
                msg: response.msg,
                data: response.data
            })
            
                        
        } catch (error) {
            return res.status(400).send({
                status: 'error',
                msg: error
            })
        }
        

    }
}