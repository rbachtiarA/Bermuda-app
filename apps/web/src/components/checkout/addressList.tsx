'use client'
import { getUserAddressess } from "@/lib/address"
import { useAppSelector } from "@/redux/hook"
import { IAddress } from "@/type/address"
import { Button, Card, CardBody, CardFooter, CardHeader, useDisclosure } from "@nextui-org/react"
import { useEffect, useState } from "react"
import AddressCheckoutSelectorModal from "../modal/addressCheckoutSelectorModal"
import { NewAddressModal } from "../modal/newAddressModal"

export default function AddressessList({ selectedAddress, updateSelectedAddress }: 
    { selectedAddress:IAddress | null, updateSelectedAddress:(address: IAddress | undefined) => void  }) {
    const user = useAppSelector(state => state.user)
    const [addressess, setAddressess] = useState<IAddress[]>([])
    const changeAddressModal = useDisclosure()
    const newAddressModal = useDisclosure()
    //get address user from database
    const getData = async () => {
        const data: IAddress[] = await getUserAddressess(user.id)        
        setAddressess([...data])
        
        //select the primary address
        if(!user.selectedAddress) updateSelectedAddress(data.find((item) => item.isPrimary))
    }

    //load data when rendered
    useEffect(() => {
        getData()           
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if(user.selectedAddress !== undefined) {
            updateSelectedAddress(user.selectedAddress as IAddress)
        }
    }, [user.selectedAddress])
    return (
        <>
            <Card className="flex flex-col p-2">
                <CardHeader>
                    <h2 className="text-lg font-semibold">Shipping Address</h2>
                </CardHeader>
                <CardBody>
                    {
                        !selectedAddress && 
                        <p className="text-danger">Address not found, Create address details for us to deliver goods</p>
                    }
                    {
                        selectedAddress &&
                        <>
                            <p className="font-semibold">{selectedAddress.label}</p>
                            <p>{selectedAddress?.addressLine}</p>
                        </>
                    }
                </CardBody>
                <CardFooter className="flex justify-end w-full">
                    <Button onPress={newAddressModal.onOpen} color="secondary" size="sm" variant="light">Create new address</Button>
                    <Button onPress={changeAddressModal.onOpen} color="secondary" size="sm" variant="light">Change address</Button>
                </CardFooter>
            </Card>
            <AddressCheckoutSelectorModal addressess={addressess} isOpen={changeAddressModal.isOpen} onOpenChange={changeAddressModal.onOpenChange} onConfirm={updateSelectedAddress}/>
            <NewAddressModal 
            isOpen={newAddressModal.isOpen} 
            onOpenChange={(isOpen) => {
                    if(!isOpen) {
                        getData()
                    }
                    newAddressModal.onOpenChange()
                }
            }/>
        </>
    )
}