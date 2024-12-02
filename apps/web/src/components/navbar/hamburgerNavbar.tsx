import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

export default function HamburgerNavbar({setDropdownHamburger}: {setDropdownHamburger:Dispatch<SetStateAction<boolean>>}) {
  return (
    <div>
        <span onClick={() => setDropdownHamburger((dropdownHamburger) => !dropdownHamburger)}>
            <Image src={'/icon-hamburger.svg'} alt='hamburger menu' width={24} height={24} />
        </span>
    </div>
  )
}
