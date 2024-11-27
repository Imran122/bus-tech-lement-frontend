import { Heading } from "@/components/common/typography/Heading";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import { useGetAboutUsListQuery } from "@/store/api/aboutUs/aboutUsApi";
import { FC } from "react";
import HomeLoader from "./HomeLoader";

interface IAboutUsProps {}

const AboutUs: FC<IAboutUsProps> = () => {
  const { data: aboutData, isLoading: aboutLoading } = useGetAboutUsListQuery(
    {}
  );

  if (aboutLoading) {
    return <HomeLoader />;
  }

  const sectionTitles = [
    "Our Journey",
    "Commitment to Excellence",
    "Building Connections Nationwide",
  ];

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10 pt-0 lg:pt-10">
          <h1 className="text-4xl font-bold text-secondary">About Us</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-4 mx-5">
            Learn about our journey, values, and commitment to revolutionizing
            bus transportation!
          </p>
        </div>

        {/* About Us Sections */}
        {aboutData?.data?.map((about: any, index: any) => (
          <div
            key={index}
            className={`flex flex-col md:flex-row justify-center items-center gap-10 mb-16 ${
              index % 2 === 0 ? "flex-row-reverse" : ""
            }`}
          >
            {/* Conditional Image Rendering */}
            {about.image && (
              <div className="w-11/12 md:w-1/3">
                <img
                  src={about.image}
                  alt={`About Section ${index + 1}`}
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            )}

            {/* Description */}
            <div
              className={`${
                about.image ? "w-11/12 md:w-1/2" : "w-11/12 md:w-full"
              }`}
            >
              <Heading
                size={"h5"}
                className="text-2xl font-semibold text-gray-800 dark:text-white mb-3"
              >
                {sectionTitles[index] || `More About Us`}
              </Heading>
              <p className="text-gray-600 dark:text-gray-400 leading-7">
                {about.description}
              </p>
            </div>
          </div>
        ))}

        {/* Core Values Section */}
        <div className="mt-16">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white text-center mb-6">
            Our Core Values
          </h3>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="text-center p-5 bg-white dark:bg-[#1f2128] dark:border rounded-lg shadow-md w-64">
              <h4 className="text-lg font-medium dark:text-white text-gray-700">
                Safety First
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                We prioritize the safety of our passengers at every step of
                their journey.
              </p>
            </div>
            <div className="text-center p-5 bg-white dark:bg-[#1f2128] dark:border rounded-lg shadow-md w-64">
              <h4 className="text-lg dark:text-white font-medium text-gray-700">
                Customer Satisfaction
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Delivering exceptional service to make every ride comfortable
                and enjoyable.
              </p>
            </div>
            <div className="text-center p-5 bg-white dark:bg-[#1f2128] dark:border rounded-lg shadow-md w-64">
              <h4 className="text-lg font-medium text-gray-700 dark:text-white">
                Punctuality
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Committed to on-time departures and arrivals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default AboutUs;
