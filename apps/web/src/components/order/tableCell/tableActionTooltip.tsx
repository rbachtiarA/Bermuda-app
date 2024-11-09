import ConfirmationModal from "@/components/modal/confirmationModal";
import { Tooltip, useDisclosure } from "@nextui-org/react";

export default function TableActionTooltip({content, children, isDisabled, noModal, onClick}: 
    {content: string, children:React.ReactNode, isDisabled: Boolean, noModal?:Boolean, onClick:() => void}) {
    const {isOpen, onOpen, onOpenChange} = useDisclosure()
    const onPress = () => {
        if(noModal) {
            onClick()
        } else {
            onOpen()
        }
    }
  return (
    <>
        <Tooltip content={content} isDisabled={!isDisabled}>
            <span 
                className={`text-lg text-default-400 
                ${isDisabled? `cursor-pointer active:opacity-50` : ''}`} 
                onClick={isDisabled? onPress : () => null}
            >
                {children}
            </span>
        </Tooltip>

        <ConfirmationModal isOpen={isOpen} onOpenChange={onOpenChange} title="Are you sure?" content={`Do you want to "${content}" this order?`} onConfirm={onClick}/>
    </>
  )
}
