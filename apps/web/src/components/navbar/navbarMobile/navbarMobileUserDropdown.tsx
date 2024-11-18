'use client'
import ChevronDownIcon from "@/components/icon/chevronDownIcon";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function NavbarMobileUserDropdown({title}: {title: string}) {
    const router = useRouter()
    const titleBreadcrumb = () => {
        switch (title) {
            case 'order':
                return 'My Orders'
            
            case 'payment':
                return 'Active Payment'
            default:
                return `${title}`;
        }
    }
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
            className="font-bold px-1"
            endContent={<ChevronDownIcon />}
            size="md"
            variant="light"
            disableRipple
        >
          {titleBreadcrumb()}
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions" >
        <DropdownItem key="My_Orders" textValue="My Orders">
            <span className="hover:cursor-pointer" onClick={() => router.push('/account/order')}>My Order</span>
        </DropdownItem>
        <DropdownItem key="My_Active_Payment" textValue="My Active Payment">
            <span className="hover:cursor-pointer" onClick={() => router.push("/account/payment")}>My Active Payment</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
