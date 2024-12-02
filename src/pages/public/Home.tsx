import { InfiniteTexts } from "@/components/common/scrolling/InfiniteTexts";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import Hero from "@/sections/home/Hero";
import { useGetRoutesQuery } from "@/store/api/vehiclesSchedule/routeApi";
import { FC } from "react";
import bgimage from "../../assets/new.jpg";
import HomeLoader from "./HomeLoader";
interface IHomeProps {}

const Home: FC<IHomeProps> = () => {
  const {
    data: routesData,
    isLoading: routesLoading,
    error,
  } = useGetRoutesQuery({});

  if (routesLoading) return <HomeLoader />;
  if (error) return <div>Error loading routes</div>;

  const allRoutes =
    routesData?.data?.map((route: any) => route.routeName) ?? [];

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${bgimage})`,
      }}
    >
      <div className="relative z-10 ">
        <PageWrapper className="bg-white -mt-2 max-w-[1300px] mx-auto shadow-2xl rounded-bl-xl rounded-br-xl pb-10 md:px-5">
          {allRoutes.length > 0 ? (
            // Render only one InfiniteTexts with combined routes
            <InfiniteTexts speed="slow" items={allRoutes} />
          ) : (
            <div>No routes available</div>
          )}
          <Hero />
          <HomeLoader />
        </PageWrapper>
      </div>
    </div>
  );
};

export default Home;
