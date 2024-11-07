import { InfiniteTexts } from "@/components/common/scrolling/InfiniteTexts";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import Hero from "@/sections/home/Hero";
import { FC } from "react";

interface IHomeProps {}

const Home: FC<IHomeProps> = () => {
  const routes = [
    "Dhaka ➜ Narayanganj",
    "Dhaka ➜ Chittagong",
    "Dhaka ➜ Sylhet",
    "Dhaka ➜ Rajshahi",
    "Dhaka ➜ Khulna",
    "Dhaka ➜ Barishal",
    "Dhaka ➜ Rangpur",
    "Dhaka ➜ Mymensingh",
  ];

  return (
    <PageWrapper className="-mt-6">
      <InfiniteTexts speed="slow" items={routes} />
      <Hero />
    </PageWrapper>
  );
};

export default Home;
