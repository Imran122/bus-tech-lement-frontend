import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function OfferSlider() {
  const { data: singleCms } = useGetSingleCMSQuery({});

  return (
    <Swiper
      spaceBetween={10} // Space between slides
      pagination={{
        clickable: true,
      }}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      speed={1500}
      modules={[Pagination, Autoplay]}
      breakpoints={{
        // Large devices (desktop)
        1024: {
          slidesPerView: 2, // Show 2 slides fully
          spaceBetween: 20, // Space between slides
        },
        // Medium devices (tablet)
        768: {
          slidesPerView: 1.5, // Show 1 full slide + 50% of next slide
          spaceBetween: 15,
        },
        // Small devices (mobile)
        0: {
          slidesPerView: 1.2, // Show 1 full slide + 20% of next slide
          spaceBetween: 10,
        },
      }}
      className="rounded-lg mx-auto"
    >
      {singleCms?.data?.offeredImageOne && (
        <SwiperSlide>
          <img
            src={singleCms?.data?.offeredImageOne}
            alt="Slider one"
            className="w-full h-48 lg:h-80 object-cover rounded-lg mx-auto"
          />
        </SwiperSlide>
      )}
      {singleCms?.data?.offeredImageTwo && (
        <SwiperSlide>
          <img
            src={singleCms?.data?.offeredImageTwo}
            alt="Slider two"
            className="w-full h-48 lg:h-80 object-cover rounded-lg mx-auto"
          />
        </SwiperSlide>
      )}
      {singleCms?.data?.offeredImageThree && (
        <SwiperSlide>
          <img
            src={singleCms?.data?.offeredImageThree}
            alt="Slider three"
            className="w-full h-48 lg:h-80 object-cover rounded-lg mx-auto"
          />
        </SwiperSlide>
      )}
    </Swiper>
  );
}
