import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import BunchofBox from "@/components/test";

export default function Home() {
  
  return (
  <>
    <div>
      <h1 className="text-9xl font-bold underline text-gray-200 text-center">
      Landing Page
    </h1>
      <BunchofBox />
    </div>
    <Footer />
  </>
  )
}