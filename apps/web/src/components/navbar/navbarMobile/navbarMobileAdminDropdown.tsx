'use client'
import ChevronDownIcon from "@/components/icon/chevronDownIcon";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image, Link } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function NavbarMobileAdminDropdown({title}: {title: string}) {
    const router = useRouter()
    const titleBreadcrumb = () => {
        switch (title) {
            case 'order':
                return 'Order Management'
            
            case 'storeAdmin':
                return 'Store Admin Management'
            
            case 'user':
                return 'User Management'
            
            case 'store':
                return 'Store Management'
            
            case 'product':
                return 'Product Management'
            
            case 'discount':
                return 'Discount Management'
            
            case 'analyst':
                return 'Record & Analyst'
            
            default:
                return 'Admin';
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
        <DropdownItem key="store_management" textValue="Store Management">
            <span className="hover:cursor-pointer" onClick={() => router.push('/admin/storeAdmin')}>Store Admin Management</span>
        </DropdownItem>
        <DropdownItem key="user_management" textValue="User Management">
            <span className="hover:cursor-pointer" onClick={() => router.push("/admin/user")}>User Management</span>
        </DropdownItem>
        <DropdownItem key="Store_Management" textValue="Store Management">
            <span className="hover:cursor-pointer" onClick={() => router.push("/admin/store")}>Store Management</span>
        </DropdownItem>
        <DropdownItem key="product_management" textValue="Product Management">
            <span className="hover:cursor-pointer" onClick={() => router.push("/admin/product")}>Product Management</span>
        </DropdownItem>
        <DropdownItem key="discount_management" textValue="Discount Management">
            <span className="hover:cursor-pointer" onClick={() => router.push("/admin/discount")}>Discount Management</span>
        </DropdownItem>
        <DropdownItem key="order_management" textValue="Order Management">
            <span className="hover:cursor-pointer" onClick={() => router.push("/admin/order")}>Order Management</span>
        </DropdownItem>
        <DropdownItem key="report_analyst" textValue="Record & Analyst">
            <span className="hover:cursor-pointer" onClick={() => router.push("/admin/analyst")}>Record & Analyst</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
