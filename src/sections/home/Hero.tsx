import { FlipWords } from "@/components/common/typography/FlipWords";
import { Heading } from "@/components/common/typography/Heading";
import SectionWrapper from "@/components/common/wrapper/SectionWrapper";
import { cn } from "@/lib/utils";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { useLocaleContext } from "@/utils/hooks/useLocaleContext";
import { FC, useState } from "react";
import Booking, { IBookingStateProps } from "./Booking";
import BusAnimation from "./BusAnimation";
import ClientNote from "./ClientNote";
import OfferSlider from "./OfferSlider";
import SearchResult from "./SearchResult";

interface IHeroProps {}

const Hero: FC<IHeroProps> = () => {
  const { translate } = useCustomTranslator();
  const { locale } = useLocaleContext();
  const [bookingState, setBookingState] = useState<IBookingStateProps>({
    calenderOpen: false,
    fromCounterId: null,
    destinationCounterId: null,
    returnCalenderOpen: false,
    coachType: "AC",
    date: new Date(),
    returnDate: null,
    bookingCoachesList: [],

    roundTripGobookingCoachesList: [],
    roundTripReturnBookingCoachesList: [],
  });

  // const { data: singleCms } = useGetSingleCMSQuery(
  //   {}
  // );

  // if (singleCmsLoading) {
  //   return <Loader />;
  // }

  return (
    <>
      <section className="shadow-2xl pb-10 rounded-md ">
        <SectionWrapper className=" mt-5 mb-0 ">
          {/* Left side: Heading and Booking Form */}
          <div className="w-full  flex flex-col-reverse lg:flex-row items-center justify-center ">
            <Heading
              className={cn(
                locale !== "bn" && "font-lora font-semibold",
                "text-center pb-10 text-[clamp(1.5rem,4vw,2.5rem)]",
                "text-lg md:text-xl lg:text-2xl xl:text-3xl"
              )}
              size="h2"
            >
              {translate("বিশ্বাসের সাথে", "Travel")}
              <FlipWords
                className="text-primary dark:text-primary font-extrabold tracking-tighter font-lora"
                words={[
                  "Safely",
                  "Cozily",
                  "Quickly",
                  "Easily",
                  "Happily",
                  "Gently",
                  "Quietly",
                  "Boldly",
                  "Freely",
                  "Neatly",
                  "Calmly",
                  "Softly",
                  "Bravely",
                ]}
              />
              {translate("যাত্রা করুন", "with Confidence")}
            </Heading>

            {/* <div className="w-72 h-20 border-2 border-secondary rounded-lg bg-gray-300 flex flex-col justify-center items-start p-3">
            <Paragraph size="sm">
              <span className="font-bold text-secondary">For call:</span>{" "}
              {singleCms?.data?.supportNumber1},{" "}
              {singleCms?.data?.supportNumber2}
            </Paragraph>
            <Paragraph size="sm" className="flex items-center gap-1">
              <span className="font-bold text-secondary">Email: </span>{" "}
              {singleCms?.data?.email}
            </Paragraph>
          </div> */}
          </div>
          {/* Container for left and right sides */}
          <div className="w-full  flex lg:flex-row justify-center items-start gap-x-5">
            {/* Booking form */}
            <div className="w-full mt-1">
              <Booking
                bookingState={bookingState}
                setBookingState={setBookingState}
              />
            </div>

            {/* Right side: Thumbnail */}
            <div className="w-full  lg:block hidden ">
              <BusAnimation />
            </div>
          </div>

          {/* search result */}
          <div className="w-full py-3">
            <SearchResult
              bookingState={bookingState}
              setBookingState={setBookingState}
            />
          </div>
          <div className="w-full lg:hidden block  px-5">
            <BusAnimation />
          </div>
        </SectionWrapper>
        <div className="mx-auto px-10 ">
          <div className="w-full mx-auto">
            <OfferSlider />
          </div>
        </div>
      </section>
      <section className="shadow-2xl rounded-md  px-3 mt-14 ">
        <div className=" w-full mx-auto">
          <ClientNote />
        </div>
      </section>
    </>
  );
};

export default Hero;
