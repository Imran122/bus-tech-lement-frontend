import { FC } from "react";
import { Paragraph } from "../common/typography/Paragraph";

const FooterComponent: FC = () => {
  return (
    <div>
      <section className="bg-white">
        <div className="max-w-screen-xl px-4 py-12 mx-auto space-y-8 overflow-hidden sm:px-6 lg:px-8">
           <div className="">
            <Paragraph size={"lg"} className="text-center font-bold text-secondary">We Accept:</Paragraph>
           </div>
           <div className="w-full">
             <img src="https://static-busbd.bdtickets.com/busbdimages/bank_logo.png" alt="cash method"  className="mx-auto"/>
           </div>
          <p className="mt-8 text-base leading-6 text-center text-gray-400">
            © 2024 Iconic Express. All rights reserved.
          </p>
        </div>
      </section>
    </div>
  );
};

export default FooterComponent;
