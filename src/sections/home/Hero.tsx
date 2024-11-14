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

interface IHeroProps {}

const Hero: FC<IHeroProps> = () => {
  const { translate } = useCustomTranslator();
  const { locale } = useLocaleContext();
  const [bookingState, setBookingState] = useState<IBookingStateProps>({
    calenderOpen: false,
    fromCounterId: null,
    destinationCounterId: null,
    returnCalenderOpen: false,
    coachType: "",
    date: null,
    returnDate: null,
    bookingCoachesList: [],

    roundTripGobookingCoachesList: [],
    roundTripReturnBookingCoachesList: [],
  });
  return (
    <SectionWrapper className="px-4">
      {/* Container for left and right sides */}
      <div className="w-full flex flex-col lg:flex-row items-start gap-6">
        {/* Left side: Heading and Booking Form */}
        <div className="w-full px-2 ">
          <Heading
            className={cn(locale !== "bn" && "font-lora font-semibold")}
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
            <br />
            {translate("যাত্রা করুন", "with Confidence")}
          </Heading>
          {/* Booking form */}
          <div className="">
            <Booking
              bookingState={bookingState}
              setBookingState={setBookingState}
            />
          </div>
        </div>

        {/* Right side: Thumbnail */}
        <div className=" w-full flex justify-center lg:justify-end ">
          <HeroTiltCard className="lg:w-[500px] w-8/12 lg:h-[450px] h-[400px] border-8 border-secondary/10 overflow-visible rounded-3xl">
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
  );
};

export default Hero;
