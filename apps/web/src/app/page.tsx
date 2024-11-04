import PromoCarousel from "@/components/carousel/promo";

export default function Home() {
  
  return (
    <div>
      <div className="container">
        <PromoCarousel />
      </div>
      <div className="h-screen flex container justify-center items-center">
      <h1 className="text-9xl font-bold underline text-gray-200 text-center">
      Landing Page
    </h1>
    </div>
    </div>
    
  )
}