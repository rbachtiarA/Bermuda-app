'use client'
import ChevronDownIcon from "@/components/icon/chevronDownIcon";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image, Link } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function NavbarMobileAdminDropdown({title}: {title: string}) {
    const router = useRouter()
    const titleBreadcrumb = () => {
        switch (title) {
            case 'order-management':
                return 'Order Management'
            
            case 'store-admin-management':
                return 'Store Admin Management'
            
            case 'product-category-management':
                return 'Product Category Management'
            
            case 'product-management':
                return 'Product Management'
            
            case 'report-analysis':
                return 'Report & Analyst'
            
            case 'stock-management':
                return 'Stock Management'
            
            case 'store-management':
                return 'Store Management'

            case 'user-management':
                return 'User Management'
            
            case 'discount-management':
                return 'Discount Management'
            
            default:
                return title[0].toUpperCase()+title.slice(1);
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
        <DropdownItem key="user_management" textValue="User Management">
            <span className="hover:cursor-pointer" onClick={() => router.push("/admin/user-management")}>User Management</span>
        </DropdownItem>
        <DropdownItem key="store_management" textValue="Store Management">
            <span className="hover:cursor-pointer" onClick={() => router.push("/admin/store-management")}>Store Management</span>
        </DropdownItem>
        <DropdownItem key="store_admin_management" textValue="Store Admin Management">
            <span className="hover:cursor-pointer" onClick={() => router.push('/admin/store-admin-management')}>Store Admin Management</span>
        </DropdownItem>
        <DropdownItem key="product_category_management" textValue="Product Category Management">
            <span className="hover:cursor-pointer" onClick={() => router.push("/admin/product-category-management")}>Product Category Management</span>
        </DropdownItem>
        <DropdownItem key="product_management" textValue="Product Management">
            <span className="hover:cursor-pointer" onClick={() => router.push("/admin/product-management")}>Product Management</span>
        </DropdownItem>
        <DropdownItem key="stock_management" textValue="Stock Management">
            <span className="hover:cursor-pointer" onClick={() => router.push("/admin/stock-management")}>Stock Management</span>
        </DropdownItem>
        <DropdownItem key="discount_management" textValue="Discount Management">
            <span className="hover:cursor-pointer" onClick={() => router.push("/admin/discount-management")}>Discount Management</span>
        </DropdownItem>
        <DropdownItem key="order_management" textValue="Order Management">
            <span className="hover:cursor-pointer" onClick={() => router.push("/admin/order-management")}>Order Management</span>
        </DropdownItem>
        <DropdownItem key="report_analysis" textValue="Record & Analyst">
            <span className="hover:cursor-pointer" onClick={() => router.push("/admin/report-analysis")}>Record & Analyst</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
