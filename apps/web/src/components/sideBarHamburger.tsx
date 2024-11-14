'use client'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image, Link } from "@nextui-org/react";

export default function SideBarHamburger() {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
            isIconOnly
          variant="bordered" 
        >
          <Image src="/icon-hamburger.svg" alt="hamburger sidebar" width={24} height={24} />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions" >
        <DropdownItem key="store_management" textValue="Store Management">
            <Link color="foreground" href="/admin/storeAdmin">Store Admin Management</Link>
        </DropdownItem>
        <DropdownItem key="user_management" textValue="User Management">
            <Link color="foreground" href="/admin/user">User Management</Link>
        </DropdownItem>
        <DropdownItem key="Store_Management" textValue="Store Management">
            <Link color="foreground" href="/admin/store">Store Management</Link>
        </DropdownItem>
        <DropdownItem key="product_management" textValue="Product Management">
            <Link color="foreground" href="/admin/product">Product Management</Link>
        </DropdownItem>
        <DropdownItem key="discount_management" textValue="Discount Management">
            <Link color="foreground" href="/admin/discount">Discount Management</Link>
        </DropdownItem>
        <DropdownItem key="order_management" textValue="Order Management">
            <Link color="foreground" href="/admin/order">Order Management</Link>
        </DropdownItem>
        <DropdownItem key="report_analyst" textValue="Record & Analyst">
            <Link color="foreground" href="/admin/analyst">Record & Analyst</Link>
        </DropdownItem>
        
      </DropdownMenu>
    </Dropdown>
  )
}
