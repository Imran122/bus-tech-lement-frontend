import { InfiniteTexts } from "@/components/common/scrolling/InfiniteTexts";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import Hero from "@/sections/home/Hero";
import { useGetRoutesQuery } from "@/store/api/vehiclesSchedule/routeApi";
import { FC } from "react";
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
    <PageWrapper className="-mt-2 max-w-[1300px] mx-auto shadow-2xl rounded-bl-xl rounded-br-xl pb-10 md:px-5">
      {allRoutes.length > 0 ? (
        // Render only one InfiniteTexts with combined routes
        <InfiniteTexts speed="slow" items={allRoutes} />
      ) : (
        <div>No routes available</div>
      )}
      <Hero />
    </PageWrapper>
  );
};

export default Home;
