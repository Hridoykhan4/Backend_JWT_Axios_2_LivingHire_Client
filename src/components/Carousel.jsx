// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Slide from "./Slide";

import bgimg1 from "../assets/carousel1.jpg";
import bgimg2 from "../assets/carousel2.jpg";
import bgimg3 from "../assets/carousel3.jpg";

export default function Carousel() {
  return (
    <div className="w-full">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="rounded-lg overflow-hidden shadow-xl"
      >
        <SwiperSlide>
          <Slide
            image={bgimg1}
            text="Get Your Web Development Projects Done in Minutes"
          />
        </SwiperSlide>
        <SwiperSlide>
          <Slide
            image={bgimg2}
            text="Hire Top Graphics Designers for Stunning Visuals"
          />
        </SwiperSlide>
        <SwiperSlide>
          <Slide
            image={bgimg3}
            text="Launch Your Digital Marketing Campaigns Instantly"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
