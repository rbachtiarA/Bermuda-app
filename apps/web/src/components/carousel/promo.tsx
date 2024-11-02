'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import SwiperCore from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

export default function PromoCarousel() {
  return (
    <Swiper
    modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={20}
      slidesPerView={2}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000 }}
      className="w-full h-32 md:h-48 lg:h-64"
    >
      <SwiperSlide className="flex items-center justify-center bg-blue-500 text-white font-bold text-xl rounded-xl">
        Slide 1
      </SwiperSlide>
      <SwiperSlide className="flex items-center justify-center bg-blue-500 text-white font-bold text-xl rounded-xl">
        Slide 2
      </SwiperSlide>
      <SwiperSlide className="flex items-center justify-center bg-blue-500 text-white font-bold text-xl rounded-xl">
        Slide 3
      </SwiperSlide>
      <SwiperSlide className="flex items-center justify-center bg-blue-500 text-white font-bold text-xl rounded-xl">
        Slide 4
      </SwiperSlide>
      <SwiperSlide className="flex items-center justify-center bg-blue-500 text-white font-bold text-xl rounded-xl">
        Slide 5
      </SwiperSlide>
      <SwiperSlide className="flex items-center justify-center bg-blue-500 text-white font-bold text-xl rounded-xl">
        Slide 6
      </SwiperSlide>
      <SwiperSlide className="flex items-center justify-center bg-blue-500 text-white font-bold text-xl rounded-xl">
        Slide 7
      </SwiperSlide>
    </Swiper>
  );
}
