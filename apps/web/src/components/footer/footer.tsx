import Image from 'next/image';
import FooterItem from './footerItem';
import FooterList from './footerList';
import FooterCopyright from './footerCopyright';

export default function Footer() {
  return (
    <footer className="pt-10 pb-6 bg-gray-200">
      <div className="container mx-auto px-4 lg:px-8 flex flex-col lg:flex-row justify-between">
        <div className="flex flex-col mb-6 lg:mb-0">
          <FooterList title="Layanan Pelanggan">
            <FooterItem href="#">Pertanyaan Umum</FooterItem>
            <FooterItem href="#">Cara Belanja</FooterItem>
            <FooterItem href="#">Gratis Ongkir</FooterItem>
          </FooterList>
        </div>

        <div className="flex flex-col mb-6 lg:mb-0">
          <FooterList title="Jelajahi Bermuda Store">
            <FooterItem href="#">Tentang Bermuda Store</FooterItem>
            <FooterItem href="#">Syarat & Ketentuan</FooterItem>
            <FooterItem href="#">Kebijakan Privasi</FooterItem>
          </FooterList>
        </div>

        <div className="flex flex-col mb-6 lg:mb-0">
          <FooterList title="Metode Pembayaran">
            <div className="flex items-center">
              <Image
                src="/Ic_COD.png"
                alt="COD"
                height={45}
                width={45}
                className="pr-3 my-1.5"
              />
              <Image
                src="/Ic_BCA.png"
                alt="BCA"
                height={45}
                width={45}
                className="pr-3 my-1.5"
              />
              <Image
                src="/Mandiri.png"
                alt="Mandiri"
                height={45}
                width={45}
                className="pr-3 my-1.5"
              />
              <Image
                src="/Ic_Credit_Card.png"
                alt="Credit Card"
                height={45}
                width={45}
                className="pr-3 my-1.5"
              />
            </div>
          </FooterList>

          <FooterList title="Layanan Pengiriman">
            <Image
              src="/IcDelivery-Colored.webp"
              alt="Pengiriman"
              height={45}
              width={45}
              className="pr-3 my-1.5"
            />
          </FooterList>
        </div>

        <div className="flex flex-col mb-6 lg:mb-0">
          <FooterList title="Ikuti Kami">
            <div className="flex items-center">
              <Image
                src="/iconImage/Ic Social Media Facebook round.png"
                alt="Facebook"
                height={45}
                width={45}
                className="pr-3 my-1.5"
              />
              <Image
                src="/iconImage/Ic Social Media Instagram Circle.png"
                alt="Instagram"
                height={45}
                width={45}
                className="pr-3 my-1.5"
              />
              <Image
                src="/iconImage/Ic Twitter.png"
                alt="Twitter"
                height={45}
                width={45}
                className="pr-3 my-1.5"
              />
            </div>
          </FooterList>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 mt-6">
        <FooterList>
          <FooterCopyright />
        </FooterList>
      </div>
    </footer>
  );
}
