import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";

export default function OfferSlider() {
  const { data: singleCms } = useGetSingleCMSQuery({});
  return (
    <Swiper
      spaceBetween={10}
      pagination={{
        clickable: true,
      }}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      speed={1500}
      modules={[Pagination, Autoplay]}
      className="rounded-lg mx-auto"
    >
      <SwiperSlide>
        <img
          src={singleCms?.data?.offeredImageOne}
          alt={`Slider one`}
          className="w-full h-48 lg:h-80 object-cover rounded-lg mx-auto"
        />
      </SwiperSlide>
      <SwiperSlide>
        <img
          src={singleCms?.data?.offeredImageTwo}
          alt={`Slider two`}
          className="w-full h-48 lg:h-80 object-cover rounded-lg mx-auto"
        />
      </SwiperSlide>
      <SwiperSlide>
        <img
          src={singleCms?.data?.offeredImageThree}
          alt={`Slider three`}
          className="w-full h-48 lg:h-80 object-conver rounded-lg mx-auto"
        />
      </SwiperSlide>
    </Swiper>
  );
}
