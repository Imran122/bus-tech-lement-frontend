import HeroTiltCard from "@/components/common/effect/HeroTiltCard";
import PageTransition from "@/components/common/effect/PageTransition";

export default function BusAnimation() {
  return (
    <div className=" mt-0">
      <HeroTiltCard className=" lg:h-[290px] h-[300px] border-8 border-secondary/10 overflow-visible rounded-xl">
        <PageTransition>
          <img className="w-full" src="/iconic_car.svg" alt="Iconic Car" />
          <h2 className="text-center text-xl font-lora font-extralight">
            <strong className="font-extrabold text-secondary">Iconic</strong>{" "}
            Express
          </h2>
        </PageTransition>
      </HeroTiltCard>
    </div>
  );
}
