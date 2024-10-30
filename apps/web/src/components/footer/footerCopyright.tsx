import Image from "next/image";
import Link from "next/link"

export default function FooterCopyright() {
  return (
    <div>
      <div className="flex space-x-4 mt-4">
      <Link href="https://play.google.com/" target="_blank" rel="noopener noreferrer">
        <Image src="/play-store-btn.png" alt="Get it on Google Play" width={150} height={50} />
      </Link>
      <Link href="https://apps.apple.com/" target="_blank" rel="noopener noreferrer">
        <Image src="/app-store-btn.png" alt="Download on the App Store" width={150} height={50} />
      </Link>
    </div>
      <div className="mt-8 text-gray-400 text-sm">
        © {new Date().getFullYear()} Grocery Store. All rights reserved
      </div>
    </div>
  );
}
