import { FC } from "react";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import { MdOutlineMailOutline, MdOutlinePhoneForwarded } from "react-icons/md";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";
import HomeLoader from "./HomeLoader";

interface IContactProps {}

const Contact: FC<IContactProps> = () => {
  const { data: singleCms, isLoading } = useGetSingleCMSQuery({});

  if (isLoading) return <HomeLoader />;

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto px-4 py-5 lg:py-12">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-secondary">Contact Us</h1>
          <p className="text-gray-600 mt-4">
            We're here to help! Feel free to reach out to us.
          </p>
        </div>

        {/* Contact Details Section */}
        <div className="bg-white dark:bg-[#1f2128] rounded-lg shadow-lg p-4 dark:border lg:p-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
            Get in Touch
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-7 text-center">
            Whether you have questions, feedback, or need assistance, our team
            is just a message or call away. We value your inquiries and will
            respond promptly!
          </p>

          <div className="space-y-6">
            {/* Email Section */}
            <div className="flex items-center gap-4">
              <span className="bg-secondary text-white p-3 rounded-full">
                <MdOutlineMailOutline size={24} />
              </span>
              <p className="text-gray-800 dark:text-white text-lg  font-medium">
                Email:{" "}
                <a
                  href={`mailto:${singleCms?.data?.email}`}
                  className="text-secondary dark:text-white"
                >
                  {singleCms?.data?.email || "Not Available"}
                </a>
              </p>
            </div>

            {/* Phone Section */}
            <div className="flex items-center gap-4">
              <span className="bg-secondary text-white p-3 rounded-full">
                <MdOutlinePhoneForwarded size={24} />
              </span>
              <p className="text-gray-800 dark:text-white text-lg font-medium">
                Phone:{" "}
                <a
                  href={`tel:${singleCms?.data?.supportNumber1}`}
                  className="text-secondary dark:text-white"
                >
                  {singleCms?.data?.supportNumber1 || "Not Available"}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Contact;
