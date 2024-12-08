'use client'
import { uploadPaymentProof } from "@/lib/order.handler";
import { IOrder } from "@/type/order";
import { Button } from "@nextui-org/react";
import { Formik, FormikValues, useFormik } from "formik";
import { Dispatch, SetStateAction } from "react";
import * as yup from 'yup'

const FILE_SIZE = 1 * 1024 * 1024 // MB
const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png']
const createSchema = yup.object({
    paymentProof: yup.mixed()
        .required('required')
        .test('fileSize', `File size is too large max. 1MB`, (value: any) => {
            return value && value.size <= FILE_SIZE
        })
        .test('fileFormat', 'Only accept file format with extension JPG, JPEG, and PNG', (value: any) => {
            return value && SUPPORTED_FORMATS.includes(value.type)
        })
})

export default function PaymentUploadProof({data, isLoading, setData,onClickCancelOrder}: {data:IOrder | null,isLoading: boolean, setData:Dispatch<SetStateAction<IOrder | null>>, onClickCancelOrder:() => void}) {
    const onUploadFile = async (file: any, orderId: number) => {
        const { status, msg } = await uploadPaymentProof(file, orderId)
        
        if(status === 'ok') {
            setData({...data!, status:'Waiting', paymentProofUrl: msg})            
        }
    }

    const formik = useFormik<FormikValues>({
        initialValues: {
            paymentProof: null,
        },
        validationSchema: createSchema,
        onSubmit: (values) => {
            onUploadFile(values, data!.id)
        }   
    })

  return (
    <div>
        <form onSubmit={formik.handleSubmit}>
            <div className="flex flex-col gap-2">
                <div>
                    <label htmlFor="paymentProof">Payment Proof (JPG, JPEG, PNG)</label>
                    <input
                        className="bg-foreground-100"
                        id={'paymentProof'}
                        name={'paymentProof'}
                        type="file"
                        onChange={(event) => {
                            const file = event.currentTarget.files ? event.currentTarget.files[0] : null;
                            formik.setFieldValue('paymentProof', file)
                        }}
                    />
                </div>
                {formik.errors.paymentProof && formik.touched.paymentProof ? (
                    <div className="text-sm text-danger">{`${formik.errors.paymentProof}`}</div>
                ): null}
                <Button type="submit" color="primary" isDisabled={isLoading}>Upload Payment Proof</Button>
            </div>
        </form>    
        <Button className='w-full' color="danger" variant="light" onPress={onClickCancelOrder} isDisabled={isLoading}>Cancel Payment</Button> 
    </div>
  )
}
