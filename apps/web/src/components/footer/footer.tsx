import Image from "next/image";
import FooterItem from "./footerItem";
import FooterList from "./footerList";
import FooterCopyright from "./footerCopyright";

export default function Footer() {
  return (
    <footer className="pt-10 pb-6 flex flex-col lg:flex-row container">
      <div className="container mx-auto px-4 gap-4 ">
        <FooterList title="Layanan Pelanggan">
          <FooterItem href="#">Pertanyaan Umum</FooterItem>
          <FooterItem href="#">Cara Belanja</FooterItem>
          <FooterItem href="#">A-Poin</FooterItem>
          <FooterItem href="#">Gratis Ongkir</FooterItem>
        </FooterList>
      </div>
      <div className="container mx-auto px-4 gap-4 ">
        <FooterList title="Jelajahi Grocery Store">
          <FooterItem href="#">Tentang Grocery Store</FooterItem>
          <FooterItem href="#">Syarat & Ketentuan</FooterItem>
          <FooterItem href="#">Kebijakan Priavsi</FooterItem>
          <FooterItem href="#">Karir</FooterItem>
          <FooterItem href="#">Blog</FooterItem>
        </FooterList>
      </div>
      <div className="container mx-auto px-4 gap-4 ">
        <FooterList title="Metode Pembayaran" className={"flex"}>
          <Image src='/Ic_COD.png' alt="COD" height={45} width={45} className="pr-3 my-1.5" />
          <Image src='/Ic_BCA.png' alt="BCA" height={45} width={45} className="pr-3 my-1.5" />
          <Image src='/Mandiri.png' alt="Mandiri" height={45} width={45} className="pr-3 my-1.5" />
          <Image src='/Ic_Credit_Card.png' alt="Credit_Card" height={45} width={45} className="pr-3 my-1.5" />
        </FooterList>
        <FooterList title="Layanan Pengiriman">
          <Image src='/IcDelivery-Colored.webp' alt="Pengiriman" height={45} width={45} className="pr-3 my-1.5" />
        </FooterList>
      </div>
      <div className="container mx-auto px-4 gap-4">
        <FooterList title="Ikuti Kami" className={"flex "}>
          <Image src='/Ic Social Media Facebook round.png' alt="Facebook" height={45} width={45} className="pr-3 my-1.5" />
          <Image src='/Ic Social Media Instagram Circle.png' alt="Instagram" height={45} width={45} className="pr-3 my-1.5" />
          <Image src='/Ic Twitter.png' alt="twitter" height={45} width={45} className="pr-3 my-1.5" />
        </FooterList>
        
      </div>
      <div className="container mx-auto px-4 gap-4">
        <FooterList>
          <FooterCopyright />
        </FooterList>
      </div>

    </footer>
  )
}