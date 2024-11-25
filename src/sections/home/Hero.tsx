import HeroTiltCard from "@/components/common/effect/HeroTiltCard";
import PageTransition from "@/components/common/effect/PageTransition";
import { FlipWords } from "@/components/common/typography/FlipWords";
import { Heading } from "@/components/common/typography/Heading";
import SectionWrapper from "@/components/common/wrapper/SectionWrapper";
import { cn } from "@/lib/utils";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { useLocaleContext } from "@/utils/hooks/useLocaleContext";
import { FC, useState } from "react";
import Booking, { IBookingStateProps } from "./Booking";
import SearchResult from "./SearchResult";
import OfferSlider from "./OfferSlider";
import ClientNote from "./ClientNote";

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
    <section>
      <SectionWrapper className="px-4 mt-10 lg:mt-16 mb-0 mx-auto">
        {/* Left side: Heading and Booking Form */}
        <div className="w-full flex flex-col-reverse lg:flex-row items-center justify-center px-2">
          <Heading
            className={cn(
              locale !== "bn" && "font-lora font-semibold",
              "text-center pb-10 text-[clamp(1.5rem,4vw,2.5rem)]",
              "sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
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
        <div className="w-full flex flex-col lg:flex-row justify-center items-start gap-6">
          {/* Booking form */}
          <div className="w-11/12 lg:w-full mx-auto">
            <Booking
              bookingState={bookingState}
              setBookingState={setBookingState}
            />
          </div>

          {/* Right side: Thumbnail */}
          <div className=" w-full flex justify-center lg:justify-end pt-0 lg:pt-10">
            <HeroTiltCard className="lg:w-[500px] w-11/12 lg:h-[300px] h-[300px] border-8 border-secondary/10 overflow-visible rounded-3xl">
              <PageTransition>
                <img
                  className="w-[450px]"
                  src="/iconic_car.svg"
                  alt="Iconic Car"
                />
                <h2 className="text-center text-xl font-lora font-extralight">
                  <strong className="font-extrabold text-secondary">
                    Iconic
                  </strong>{" "}
                  Express
                </h2>
              </PageTransition>
            </HeroTiltCard>
          </div>
        </div>

        {/* search result */}
        <div className="w-full py-10">
          <SearchResult
            bookingState={bookingState}
            setBookingState={setBookingState}
          />
        </div>
      </SectionWrapper>
      <div className="max-w-[1300px]  mx-auto px-5">
        <div className="w-11/12 lg:w-full">
          <OfferSlider />
        </div>
        <div className="mt-16 w-11/12 lg:w-full mx-auto">
          <ClientNote />
        </div>
      </div>
    </section>
  );
};

export default Hero;
