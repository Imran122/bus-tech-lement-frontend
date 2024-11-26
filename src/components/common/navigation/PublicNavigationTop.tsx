import { LiaFacebook } from "react-icons/lia";
import { FiInstagram } from "react-icons/fi";
import { FiTwitter } from "react-icons/fi";
import { CiLinkedin } from "react-icons/ci";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";
import { Paragraph } from "../typography/Paragraph";

const PublicNavigationTop = () => {
  const { data: singleCms } = useGetSingleCMSQuery({});

  return (
    <header className="sticky z-40 top-0 bg-secondary">
      <section className="max-w-7xl mx-auto px-5 lg:px-0 flex items-center justify-between py-1">
        <Paragraph className="w-3/12 text-sm font-semibold hidden text-white lg:block">
          <a href="">Email: {singleCms?.data?.email}</a>
        </Paragraph>

        <div className="nav font-semibold text-lg text-white">
          <ul className="flex items-center">
            <li className="text-sm font-semibold">Support:</li>
            <li className=" text-sm font-semibold mx-2">
              <a href="#">{singleCms?.data?.supportNumber1}</a>
            </li>
          </ul>
        </div>

        <div className="w-3/12 flex justify-end text-white">
          <ul className="flex gap-3 items-center">
            <li className="p-">
              <a href={singleCms?.data?.facebook}>
                <LiaFacebook className="text-2xl" />
              </a>
            </li>
            <li className="">
              <a href={singleCms?.data?.instagram}>
                <FiInstagram className="text-xl" />
              </a>
            </li>
            <li className="">
              <a href={singleCms?.data?.twitter}>
                <FiTwitter className="text-xl" />
              </a>
            </li>
            <li className="">
              <a href={singleCms?.data?.linkedin}>
                <CiLinkedin className="text-2xl" />
              </a>
            </li>
          </ul>
        </div>
      </section>
    </header>
  );
};

export default PublicNavigationTop;
